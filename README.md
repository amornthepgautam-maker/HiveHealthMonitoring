# 🐝 Hive Health Monitoring

ระบบติดตามสุขภาพรังผึ้งอัจฉริยะ (Smart Hive Health Monitoring System) ช่วยให้เกษตรกรสามารถติดตามสถานะของรังผึ้งได้แบบ Real-time ผ่าน Mobile App และ Web Dashboard

## 📂 โครงสร้างโปรเจกต์

- **ESP32/**: โค้ดสำหรับบอร์ด ESP32 เพื่ออ่านค่าจากเซ็นเซอร์และส่งขึ้น Firebase
- **mobile_app/**: แอปพลิเคชันมือถือ (React Native / Expo) สำหรับดูข้อมูล
- **public/**: Web Dashboard สำหรับดูข้อมูลผ่านเบราว์เซอร์

## 🚀 การติดตั้งและใช้งาน

### 1. Hardware (ESP32)
1. ติดตั้ง [Arduino IDE](https://www.arduino.cc/en/software)
2. ติดตั้ง Libraries ที่จำเป็น:
   - `DHT sensor library` by Adafruit
   - `Firebase ESP32 Client` by Mobizt
3. เปิดไฟล์ `ESP32/ESP32.ino`
4. แก้ไขค่า Config:
   - `WIFI_SSID`, `WIFI_PASSWORD`: ชื่อและรหัส WiFi
   - `FIREBASE_HOST`, `FIREBASE_AUTH`: ข้อมูลจาก Firebase Realtime Database
   - `LINE_TOKEN`: Token สำหรับแจ้งเตือนผ่าน LINE Notify
5. Upload โค้ดลงบอร์ด ESP32

### 2. Mobile App
1. ติดตั้ง Node.js และ npm
2. เข้าไปที่โฟลเดอร์ `mobile_app`:
   ```bash
   cd mobile_app
   npm install
   ```
3. แก้ไข `firebaseConfig.js` ใส่ค่า Config ของโปรเจกต์คุณ
4. รันแอป:
   ```bash
   npx expo start
   ```

### 3. Web Dashboard
1. เข้าไปที่โฟลเดอร์ `public`
2. แก้ไข `index.html` ใส่ค่า Config ของ Firebase
3. เปิดไฟล์ `index.html` ในเบราว์เซอร์ หรือ deploy ขึ้น Firebase Hosting:
   ```bash
   firebase deploy
   ```

## ✨ ฟีเจอร์หลัก
- 🌡️ วัดอุณหภูมิและความชื้นในรัง
- ⚖️ ชั่งน้ำหนักรังผึ้ง (บอกปริมาณน้ำผึ้ง)
- 🔊 ตรวจจับเสียง (แจ้งเตือนเมื่อมีการรบกวน)
- 📱 แจ้งเตือนผ่าน LINE เมื่อค่าผิดปกติ
