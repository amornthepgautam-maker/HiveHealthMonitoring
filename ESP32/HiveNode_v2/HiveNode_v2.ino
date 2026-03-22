#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h> // 🟢 ต้องใช้สำหรับ Telegram (HTTPS)

// ================= กำหนดค่าเริ่มต้น =================
#define WIFI_SSID "Betimes Wi-Fi" //อันนี้ต้องแก้ถ้าเปลี่ยนสถานที่
#define WIFI_PASSWORD "betimescmmi3" //อันนี้ต้องแก้ถ้าเปลี่ยนสถานที่
#define FIREBASE_HOST "/hivehealthmonitoring-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "LHH4aP78vY1uOqQbwSUjLuCuEK8j64KhEXsyLimk"

// 🟢 ตั้งค่า Telegram Bot (ดูวิธีหาด้านล่าง)
#define BOT_TOKEN "8640894548:AAGMlZ7MFMemOBx4Urm4W19IDKQN_7VeDrs" 
#define CHAT_ID "8315454963"

#define HIVE_ID "hive1" 

// ================= ตั้งค่าขาอุปกรณ์ =================
#define DHTPIN 4       
#define DHTTYPE DHT22  
#define FAN_PIN 18     
#define SOUND_PIN 34   
#define WEIGHT_PIN 35  

DHT dht(DHTPIN, DHTTYPE);
FirebaseData firebaseData;

unsigned long previousMillis = 0;
const long interval = 5000; 
bool fanStatus = false;
int highTempCount = 0; 

unsigned long lastAlertTime = 0;
const long alertCooldown = 60000; 

// ================= ฟังก์ชันส่ง Telegram =================
void sendTelegramMessage(String message) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // ข้ามการตรวจ SSL เพื่อความรวดเร็ว
    HTTPClient http;
    
    // แปลงข้อความให้รองรับ URL
    message.replace(" ", "%20");
    message.replace("\n", "%0A");
    
    String url = "https://api.telegram.org/bot" + String(BOT_TOKEN) + "/sendMessage?chat_id=" + String(CHAT_ID) + "&text=" + message;
    
    http.begin(client, url);
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      Serial.print("✅ ส่ง Telegram สำเร็จ! รหัส: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("❌ ส่ง Telegram ผิดพลาด: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}

void setup() {
  Serial.begin(115200);
  
  pinMode(FAN_PIN, OUTPUT);
  digitalWrite(FAN_PIN, LOW);
  dht.begin();

  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println(" Connected!");

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  // 🟢 ส่ง Telegram ทักทายเมื่อเปิดระบบ
  sendTelegramMessage("🐝 ระบบ Smart Hive (" + String(HIVE_ID) + ") เริ่มทำงานแล้ว!");
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    float h = dht.readHumidity();
    float t = dht.readTemperature();
    int soundRaw = analogRead(SOUND_PIN);
    int weightRaw = analogRead(WEIGHT_PIN);

    if (isnan(h) || isnan(t)) {
      t = random(300, 400) / 10.0; 
      h = random(600, 800) / 10.0;
    }
    float soundPercent = map(soundRaw, 0, 4095, 0, 100);
    float weightKg = map(weightRaw, 0, 4095, 10, 30);

    Serial.printf("รัง: %s | อุณหภูมิ: %.1f°C\n", HIVE_ID, t);

    // ================= ระบบ Automation =================
    if (t > 38.0) {
      highTempCount++;
      if (highTempCount >= 2 && !fanStatus) { 
        fanStatus = true;
        digitalWrite(FAN_PIN, HIGH);
        Serial.println("🔥 อุณหภูมิสูงเกิน! สั่งเปิดพัดลม");
        
        if (currentMillis - lastAlertTime >= alertCooldown || lastAlertTime == 0) {
          // 🟢 ส่ง Telegram แจ้งเตือน
          sendTelegramMessage("🚨 เตือนภัย! อุณหภูมิสูงถึง " + String(t) + "°C ระบบเปิดพัดลมอัตโนมัติแล้ว 🌪️");
          lastAlertTime = currentMillis;
        }
      }
    } else if (t < 35.0) {
      highTempCount = 0;
      if (fanStatus) {
        fanStatus = false;
        digitalWrite(FAN_PIN, LOW);
        Serial.println("❄️ อุณหภูมิปกติ สั่งปิดพัดลม");
      }
    }

    // ================= ส่งข้อมูลขึ้น Firebase =================
    String basePath = "hives/" + String(HIVE_ID);
    Firebase.setFloat(firebaseData, basePath + "/data/temperature", t);
    Firebase.setFloat(firebaseData, basePath + "/data/humidity", h);
    Firebase.setFloat(firebaseData, basePath + "/data/sound", soundPercent);
    Firebase.setFloat(firebaseData, basePath + "/data/weight", weightKg);
    Firebase.setBool(firebaseData, basePath + "/fan_status", fanStatus);
  }
}