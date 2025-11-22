#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <DHT.h>
#include <FirebaseESP32.h>

// 🔧 Config
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
#define FIREBASE_HOST "YOUR_PROJECT_ID.firebaseio.com"
#define FIREBASE_AUTH "YOUR_DATABASE_SECRET"
#define LINE_TOKEN "YOUR_LINE_NOTIFY_TOKEN"

#define DHTPIN 4
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);
FirebaseData fbData;

void sendLineNotify(String message) {
  WiFiClientSecure client;
  client.setInsecure();
  if (!client.connect("notify-api.line.me", 443)) {
    Serial.println("Connection to LINE failed");
    return;
  }

  String payload = "message=" + message;
  String request = String("POST /api/notify HTTP/1.1\r\n") +
                   "Host: notify-api.line.me\r\n" +
                   "Authorization: Bearer " + String(LINE_TOKEN) + "\r\n" +
                   "Content-Type: application/x-www-form-urlencoded\r\n" +
                   "Content-Length: " + payload.length() + "\r\n\r\n" +
                   payload;

  client.print(request);
  delay(500);
  Serial.println("Sent LINE Notify: " + message);
}

void setup() {
  Serial.begin(115200);
  
  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  // Initialize Sensors
  dht.begin();
  
  // Initialize Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  // ⚖️ Simulate Weight Sensor (Load Cell)
  float weight = 15.0 + random(-5, 5) / 10.0;

  // 🎤 Simulate Sound Sensor (Analog Mic)
  int sound = 40 + random(-10, 10);

  if (isnan(temp) || isnan(hum)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // 📥 Read Settings from Firebase (Sync with App)
  // Default values
  float maxTemp = 37.0;
  float minHum = 40.0;
  float minWeight = 5.0;
  float maxSound = 60.0;

  if (Firebase.getFloat(fbData, "/hive1/settings/temperature/max")) maxTemp = fbData.floatData();
  if (Firebase.getFloat(fbData, "/hive1/settings/humidity/min")) minHum = fbData.floatData();
  if (Firebase.getFloat(fbData, "/hive1/settings/weight/min")) minWeight = fbData.floatData();
  if (Firebase.getFloat(fbData, "/hive1/settings/sound/max")) maxSound = fbData.floatData();

  // 📤 Send data to Firebase
  Firebase.setFloat(fbData, "/hive1/data/temperature", temp);
  Firebase.setFloat(fbData, "/hive1/data/humidity", hum);
  Firebase.setFloat(fbData, "/hive1/data/weight", weight);
  Firebase.setInt(fbData, "/hive1/data/sound", sound);

  // แจ้งเตือนถ้าค่าผิดปกติ (ใช้ค่าจาก Settings)
  if (temp > maxTemp) {
    sendLineNotify("🔥 อุณหภูมิสูงเกินปกติ (" + String(maxTemp) + "): " + String(temp) + " °C");
  } else if (hum < minHum) {
    sendLineNotify("💧 ความชื้นต่ำเกินปกติ (" + String(minHum) + "): " + String(hum) + " %");
  } else if (weight < minWeight) {
    sendLineNotify("⚠️ น้ำหนักรังผึ้งต่ำผิดปกติ (" + String(minWeight) + "): " + String(weight) + " kg");
  } else if (sound > maxSound) {
    sendLineNotify("🔊 เสียงดังผิดปกติ (" + String(maxSound) + "): " + String(sound) + " dB");
  }

  delay(10000);
}
