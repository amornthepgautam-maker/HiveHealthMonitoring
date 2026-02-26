🐝 Smart Hive Health Monitoring System (Multi-Hive Edition)

ระบบติดตามสุขภาพรังผึ้ง/ชันโรงอัจฉริยะแบบหลายรัง (Scalable Smart Hive System) ช่วยให้เกษตรกรบริหารจัดการฟาร์มผึ้งขนาดใหญ่ได้อย่างมีประสิทธิภาพผ่าน Dashboard เดียว พร้อมระบบ Automation ตัดสินใจอัตโนมัติตามหลักวิชาการ

✨ ฟีเจอร์เด่น (Key Features)

🏢 Multi-Hive Management: รองรับการมอนิเตอร์รังผึ้งหลายรังพร้อมกันใน Dashboard เดียว (Scalable System)

🤖 Smart Automation: ระบบตัดสินใจอัตโนมัติ (เช่น อุณหภูมิสูงเกิน 38°C ต่อเนื่อง 10 นาที ระบบจะสั่งเปิดพัดลมระบายอากาศจนกว่าอุณหภูมิจะลดลงสู่เกณฑ์ปกติ)

📊 Data Logging & Export: บันทึกข้อมูลและสามารถ Export เป็นไฟล์ .csv (Excel) เพื่อนำไปวิเคราะห์ผลทางสถิติหรือวิจัยต่อได้

📱 Cross-Platform UI: สวยงาม ใช้งานง่าย ทั้งบน Web Dashboard และ Mobile Application (React Native)

🚨 Real-time Alerts: แจ้งเตือนความผิดปกติผ่าน LINE Notify ทันที (เช่น รังโดนบุกรุก เสียงดังผิดปกติ หรือน้ำหนักลดลงกะทันหัน)

📂 โครงสร้างโปรเจกต์ (Project Architecture)

โปรเจกต์นี้ถูกแบ่งออกเป็น 3 ส่วนหลัก (Monorepo) เพื่อให้ง่ายต่อการพัฒนาและนำไปใช้งานต่อ:

hive-health-monitoring/
│
├── ESP32_Nodes/          # ⚙️ โค้ดภาษา C/C++ สำหรับบอร์ด ESP32 (Sensor Node)
│   └── HiveNode_v2.ino   # โค้ดหลักที่รองรับ Multi-Hive และระบบ Automation
│
├── Web_Dashboard/        # 💻 โค้ด Web App (HTML/Tailwind/JS) สำหรับดูภาพรวมฟาร์ม
│   ├── index.html        # หน้าหลัก (Overview ทุกรัง)
│   └── detail.html       # หน้าเจาะลึกข้อมูลกราฟของแต่ละรัง
│
└── Mobile_App/           # 📱 โค้ดแอปพลิเคชันมือถือ (React Native / Expo)
    ├── App.js            # Entry point ของแอป
    ├── firebaseConfig.js # ตั้งค่าการเชื่อมต่อฐานข้อมูล
    └── components/       # UI Components ต่างๆ


🚀 คู่มือการติดตั้งสำหรับนักพัฒนา (Developer Setup Guide)

หากคุณต้องการนำโปรเจกต์นี้ไปพัฒนาต่อ (Fork/Clone) กรุณาทำตามขั้นตอนต่อไปนี้อย่างละเอียด

📥 1. การดึงโปรเจกต์จาก GitHub (Clone Project)

เปิด Terminal / Command Prompt แล้วพิมพ์คำสั่ง:

# 1. โคลนโปรเจกต์ลงมาที่เครื่อง
git clone [https://github.com/USERNAME/hive-health-monitoring.git](https://github.com/USERNAME/hive-health-monitoring.git)

# 2. เข้าไปในโฟลเดอร์โปรเจกต์
cd hive-health-monitoring


(หมายเหตุ: เปลี่ยน USERNAME เป็นชื่อ GitHub ของคุณ)

⚙️ 2. การตั้งค่าฝั่งฮาร์ดแวร์ (ESP32 Node)

บอร์ด ESP32 1 ตัว จะทำหน้าที่เป็น 1 รัง (Node) หากมี 10 รัง ก็อัปโหลดโค้ดนี้ใส่ ESP32 ทั้ง 10 ตัว โดยเปลี่ยนแค่ HIVE_ID

เปิดไฟล์ ESP32_Nodes/HiveNode_v2.ino ด้วยโปรแกรม Arduino IDE

ติดตั้ง Libraries ที่จำเป็นผ่าน Library Manager (Ctrl + Shift + I):

Firebase ESP32 Client (by Mobizt)

DHT sensor library (by Adafruit)

DallasTemperature และ OneWire

HX711 Arduino Library (by Bogdan Necula)

แก้ไขการตั้งค่า (Configuration) ในโค้ด:

#define WIFI_SSID "ชื่อไวไฟ"
#define WIFI_PASSWORD "รหัสไวไฟ"

#define FIREBASE_HOST "URL_จาก_Firebase"
#define FIREBASE_AUTH "Database_Secret"

// ⚠️ สำคัญมาก: เปลี่ยนชื่อ ID ให้ไม่ซ้ำกันสำหรับแต่ละรัง
#define HIVE_ID "hive_001" // ตัวที่ 2 ก็เปลี่ยนเป็น hive_002


เลือก Board (ESP32 Dev Module) และ Port ให้ถูกต้อง แล้วกด Upload

💻 3. การตั้งค่า Web Dashboard

เข้าไปที่โฟลเดอร์ Web_Dashboard/

เปิดไฟล์ index.html และ detail.html ด้วย Text Editor (เช่น VS Code)

ค้นหาส่วน <script type="module"> และแก้ไข firebaseConfig:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  databaseURL: "https://YOUR_PROJECT.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  // ... ใส่ค่าให้ครบ
};


รันเว็บผ่าน Live Server หรืออัปโหลดขึ้น Firebase Hosting (firebase deploy)

📱 4. การตั้งค่า Mobile Application (React Native)

ตรวจสอบให้แน่ใจว่าติดตั้ง Node.js (v18 หรือสูงกว่า) เรียบร้อยแล้ว

เปิด Terminal เข้าไปที่โฟลเดอร์ Mobile App และติดตั้ง Packages:

cd Mobile_App

# หากเคยมี node_modules เดิม แนะนำให้ลบทิ้งก่อน
# rmdir /s /q node_modules (Windows) หรือ rm -rf node_modules (Mac/Linux)

npm install


แก้ไขไฟล์ firebaseConfig.js ให้ตรงกับ Project ของคุณ

รันแอปพลิเคชัน:

npx expo start -c


กด w เพื่อเปิดบนเว็บเบราว์เซอร์ หรือสแกน QR Code เพื่อพรีวิวบนมือถือ

🧠 หลักวิชาการที่ใช้ในการวิเคราะห์ (Scientific Reference)

ระบบ Automation ของเราอ้างอิงจากเกณฑ์มาตรฐานในการเลี้ยงผึ้ง/ชันโรง ดังนี้:

อุณหภูมิ (Temperature): ช่วงที่เหมาะสมคือ 32-35°C หากอุณหภูมิสูงกว่า 38°C จะทำให้ไข่ผึ้งตายและน้ำหวานละลาย ระบบจึงตั้งค่าให้เปิดพัดลมระบายอากาศอัตโนมัติหากร้อนเกิน 10 นาที

ความชื้น (Humidity): ควรอยู่ระหว่าง 60-80% หากสูงเกิน 85% จะมีความเสี่ยงต่อการเกิดเชื้อรา

น้ำหนัก (Weight): ใช้ประเมินปริมาณน้ำผึ้ง และเป็นตัวชี้วัดการรอดชีวิต (หากน้ำหนักลดลงฮวบฮาบ อาจเกิดจากการทิ้งรังหรือโดนขโมย)

เสียง (Acoustic): ระดับเสียงที่ดังผิดปกติ มักเกิดจากสภาวะไร้นางพญา (Queenless) หรือมีศัตรูทางธรรมชาติบุกรุก

🤝 การมีส่วนร่วมพัฒนา (Contributing)

หากพบปัญหา (Bug) หรือต้องการเสนอแนะฟีเจอร์ใหม่ สามารถเปิด [Issues] หรือส่ง [Pull Request] เข้ามาได้เลยครับ ยินดีต้อนรับนักพัฒนาทุกท่าน!

Developed as a Final Project - 2026
