#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "HX711.h"

// --- 1. กำหนดขา (Pin Mapping) ตามที่คุยกัน ---
#define DHTPIN 15     // ขา DHT22
#define DHTTYPE DHT22

#define ONE_WIRE_BUS 4 // ขา DS18B20 (กันน้ำ)

#define LDR_PIN 34    // ขาเซนเซอร์แสง (Analog)
#define SOUND_PIN 35  // ขาเซนเซอร์เสียง (Analog)

#define LOADCELL_DOUT_PIN 21 // ขา Load Cell DT
#define LOADCELL_SCK_PIN 22  // ขา Load Cell SCK

// --- 2. สร้าง Object อุปกรณ์ ---
DHT dht(DHTPIN, DHTTYPE);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
HX711 scale;

void setup() {
  Serial.begin(115200);
  Serial.println("--- เริ่มต้นตรวจสอบระบบ Hive Health Monitoring ---");

  // เริ่มต้น DHT
  dht.begin();
  
  // เริ่มต้น DS18B20
  sensors.begin();

  // เริ่มต้น Load Cell
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(); // ใช้ค่าเริ่มต้นไปก่อน (ยังไม่ต้องคาริเบรทเป๊ะๆ)
  scale.tare();      // เซ็ตศูนย์ (สมมติว่ายังไม่วางอะไร)

  Serial.println("System Ready! กำลังอ่านค่า...");
  delay(2000);
}

void loop() {
  Serial.println("---------------------------------------------");
  
  // 1. อ่านค่า DHT22 (อากาศ)
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  Serial.print("Air Temp: ");
  if (isnan(t)) Serial.print("Error!"); else Serial.print(t);
  Serial.print(" °C | Humidity: ");
  if (isnan(h)) Serial.print("Error!"); else Serial.print(h);
  Serial.println(" %");

  // 2. อ่านค่า DS18B20 (ในรัง)
  sensors.requestTemperatures(); 
  float tempHive = sensors.getTempCByIndex(0);
  Serial.print("Hive Temp (DS18B20): ");
  if (tempHive == -127.00) Serial.print("Error! (Check Pull-up Resistor)"); else Serial.print(tempHive);
  Serial.println(" °C");

  // 3. อ่านค่าแสง (LDR)
  int lightValue = analogRead(LDR_PIN);
  Serial.print("Light Intensity (0-4095): ");
  Serial.println(lightValue);

  // 4. อ่านค่าเสียง (Sound)
  int soundValue = analogRead(SOUND_PIN);
  Serial.print("Sound Level (0-4095): ");
  Serial.println(soundValue);

  // 5. อ่านค่าน้ำหนัก (Load Cell)
  if (scale.is_ready()) {
    long reading = scale.get_units(5); // อ่านเฉลี่ย 5 ครั้ง
    Serial.print("Weight (Raw Value): ");
    Serial.println(reading);
  } else {
    Serial.println("Load Cell not found.");
  }

  delay(2000); // รอ 2 วินาทีก่อนวัดใหม่
}