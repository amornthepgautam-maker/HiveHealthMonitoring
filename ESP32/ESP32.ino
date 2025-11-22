#include <WiFiClientSecure.h>

const char* LINE_TOKEN = "YOUR_LINE_NOTIFY_TOKEN";

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
                   "Authorization: Bearer " + LINE_TOKEN + "\r\n" +
                   "Content-Type: application/x-www-form-urlencoded\r\n" +
                   "Content-Length: " + payload.length() + "\r\n\r\n" +
                   payload;

  client.print(request);
  delay(500);
  Serial.println("Sent LINE Notify: " + message);
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  // ⚖️ Simulate Weight Sensor (Load Cell)
  // In real hardware: float weight = scale.get_units();
  float weight = 15.0 + random(-5, 5) / 10.0; // Random 14.5 - 15.5 kg

  // 🎤 Simulate Sound Sensor (Analog Mic)
  // In real hardware: int sound = analogRead(MIC_PIN);
  int sound = 40 + random(-10, 10); // Random 30 - 50 dB

  if (isnan(temp) || isnan(hum)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // 📤 Send data to Firebase (Matches App structure: /hive1/data)
  Firebase.setFloat(fbData, "/hive1/data/temperature", temp);
  Firebase.setFloat(fbData, "/hive1/data/humidity", hum);
  Firebase.setFloat(fbData, "/hive1/data/weight", weight);
  Firebase.setInt(fbData, "/hive1/data/sound", sound);

  // แจ้งเตือนถ้าค่าผิดปกติ
  if (temp > 38) {
    sendLineNotify("🔥 อุณหภูมิสูงเกินปกติ: " + String(temp) + " °C");
  } else if (hum < 40) {
    sendLineNotify("💧 ความชื้นต่ำเกินปกติ: " + String(hum) + " %");
  } else if (weight < 10) {
    sendLineNotify("⚠️ น้ำหนักรังผึ้งต่ำผิดปกติ: " + String(weight) + " kg");
  } else if (sound > 60) {
    sendLineNotify("🔊 เสียงดังผิดปกติ (อาจมีการบุกรุก): " + String(sound) + " dB");
  }

  delay(10000);
}
