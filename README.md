🐝 Smart Hive Health Monitoring System (Multi-Hive Edition)

ระบบติดตามสุขภาพรังผึ้ง/ชันโรงอัจฉริยะแบบหลายรัง (Scalable Smart Hive System) ช่วยให้เกษตรกรบริหารจัดการฟาร์มผึ้งขนาดใหญ่ได้อย่างมีประสิทธิภาพผ่าน Dashboard เดียว พร้อมระบบ Automation ตัดสินใจอัตโนมัติตามหลักวิชาการ

✨ ฟีเจอร์เด่น (Key Features)

🏢 Multi-Hive Management: รองรับการมอนิเตอร์รังผึ้งหลายรังพร้อมกันใน Dashboard เดียว (Scalable System)

🤖 Smart Automation: ระบบตัดสินใจอัตโนมัติ (เช่น อุณหภูมิสูงเกิน 38°C ต่อเนื่อง 10 นาที ระบบจะสั่งเปิดพัดลมระบายอากาศจนกว่าอุณหภูมิจะลดลงสู่เกณฑ์ปกติ)

📊 Data Logging & Export: บันทึกข้อมูลและสามารถ Export เป็นไฟล์ .csv (Excel) เพื่อนำไปวิเคราะห์ผลทางสถิติหรือวิจัยต่อได้

📱 Cross-Platform UI: สวยงาม ใช้งานง่าย ทั้งบน Web Dashboard และ Mobile Application (React Native) มีระบบคำนวณ Health Score

🚨 Real-time Alerts: แจ้งเตือนความผิดปกติผ่าน LINE Notify ทันที (เช่น รังโดนบุกรุก เสียงดังผิดปกติ หรือน้ำหนักลดลงกะทันหัน)

📂 โครงสร้างโปรเจกต์ (Project Architecture)

โปรเจกต์นี้ถูกแบ่งออกเป็น 3 ส่วนหลัก (Monorepo) เพื่อให้ง่ายต่อการพัฒนาและนำไปใช้งานต่อ:

HIVEHEALTHMONITORING/
│
├── ESP32/                # ⚙️ โค้ดภาษา C/C++ สำหรับบอร์ด ESP32 (Sensor Node)
│   └── HiveNode_v2.ino   # โค้ดหลักที่รองรับ Multi-Hive และระบบ Automation
│
├── web_dashboard/        # 💻 โค้ด Web App (HTML/Tailwind/JS) สำหรับดูภาพรวมฟาร์ม
│   └── index.html        # หน้าหลัก (Overview ทุกรัง)
│
└── mobile_app/           # 📱 โค้ดแอปพลิเคชันมือถือ (React Native / Expo)
    ├── App.js            # Entry point ของแอป
    ├── firebaseConfig.js # ตั้งค่าการเชื่อมต่อฐานข้อมูล
    └── HiveDashboard.js  # หน้าจอหลักของแอป


🚀 คู่มือการติดตั้งสำหรับนักพัฒนา (Developer Setup Guide)

หากคุณต้องการนำโปรเจกต์นี้ไปพัฒนาต่อ (Fork/Clone) กรุณาทำตามขั้นตอนต่อไปนี้อย่างละเอียด

📥 1. การดึงโปรเจกต์จาก GitHub (Clone Project)

เปิด Terminal / Command Prompt แล้วพิมพ์คำสั่ง:

# 1. โคลนโปรเจกต์ลงมาที่เครื่อง
git clone [https://github.com/USERNAME/hive-health-monitoring.git](https://github.com/USERNAME/hive-health-monitoring.git)

# 2. เข้าไปในโฟลเดอร์โปรเจกต์
cd hive-health-monitoring


(หมายเหตุ: เปลี่ยน USERNAME เป็นชื่อ GitHub ของคุณ)

📦 2. การบันทึกและอัปเดตโค้ดลง GitHub (Git Workflow)

เมื่อคุณแก้ไขโค้ดเสร็จแล้ว และต้องการบันทึกงานขึ้น GitHub (Commit & Push) ให้ทำตามสเตปนี้เสมอ:

ตรวจสอบสถานะไฟล์ที่แก้ไข:

git status


เพิ่มไฟล์ทั้งหมดที่แก้ไขเข้าสู่ Staging Area:

git add .


บันทึกการเปลี่ยนแปลง (Commit) พร้อมเขียนคำอธิบายให้ชัดเจน:

# ตัวอย่างการเขียนข้อความ Commit
git commit -m "feat: อัปเดตหน้า Mobile App เพิ่มระบบ Health Score และ Multi-hive"


ดันโค้ดขึ้นสู่ GitHub (Push):

git push origin main


(หาก Branch หลักของคุณชื่อ master ให้เปลี่ยนจาก main เป็น master)

⚠️ ข้อควรระวัง (Best Practice): > โปรเจกต์นี้มีการใช้ React Native และ Node.js ซึ่งจะมีโฟลเดอร์ node_modules/ ที่มีขนาดใหญ่มาก ห้าม Push โฟลเดอร์นี้ขึ้น Git เด็ดขาด (ตรวจสอบให้แน่ใจว่าไฟล์ .gitignore ของคุณมีบรรทัดคำว่า node_modules/ อยู่แล้ว)

⚙️ 3. การตั้งค่าฝั่งฮาร์ดแวร์ (ESP32 Node)

บอร์ด ESP32 1 ตัว จะทำหน้าที่เป็น 1 รัง (Node) หากมี 10 รัง ก็อัปโหลดโค้ดนี้ใส่ ESP32 ทั้ง 10 ตัว โดยเปลี่ยนแค่ HIVE_ID

เปิดไฟล์ ESP32/HiveNode_v2.ino ด้วยโปรแกรม Arduino IDE

ติดตั้ง Libraries: Firebase ESP32 Client, DHT sensor library

แก้ไข Config ในโค้ด:

#define WIFI_SSID "ชื่อไวไฟ"
#define WIFI_PASSWORD "รหัสไวไฟ"
#define FIREBASE_HOST "URL_จาก_Firebase"
#define FIREBASE_AUTH "Database_Secret"
#define HIVE_ID "hive_001" // เปลี่ยน ID ให้ไม่ซ้ำกันสำหรับแต่ละรัง


เลือก Board และ Port ให้ถูกต้อง แล้วกด Upload

💻 4. การตั้งค่าและรัน Web Dashboard

เข้าไปที่โฟลเดอร์ web_dashboard/

เปิดไฟล์ index.html แก้ไข firebaseConfig ให้ตรงกับ Project ของคุณ

เปิดไฟล์ผ่าน Live Server หรือเอาขึ้นออนไลน์ผ่าน Firebase Hosting (firebase deploy --only hosting)

📱 5. การตั้งค่าและรัน Mobile Application (React Native)

ตรวจสอบให้แน่ใจว่าติดตั้ง Node.js เรียบร้อยแล้ว

เปิด Terminal เข้าไปที่โฟลเดอร์ Mobile App และติดตั้ง Packages:

cd mobile_app
npm install


แก้ไขไฟล์ firebaseConfig.js ให้ตรงกับ Project ของคุณ

รันแอปพลิเคชัน:

npx expo start -c


🧠 หลักวิชาการที่ใช้ในการวิเคราะห์ (Scientific Reference)

ระบบ Automation ของเราอ้างอิงจากเกณฑ์มาตรฐานในการเลี้ยงผึ้ง/ชันโรง ดังนี้:

อุณหภูมิ (Temperature): ช่วงที่เหมาะสมคือ 32-35°C หากอุณหภูมิสูงกว่า 38°C จะทำให้ไข่ผึ้งตายและน้ำหวานละลาย ระบบจึงตั้งค่าให้เปิดพัดลมระบายอากาศอัตโนมัติหากร้อนเกิน 10 นาที

ความชื้น (Humidity): ควรอยู่ระหว่าง 60-80% หากสูงเกิน 85% จะมีความเสี่ยงต่อการเกิดเชื้อรา

น้ำหนัก (Weight): ใช้ประเมินปริมาณน้ำผึ้ง และเป็นตัวชี้วัดการรอดชีวิต (หากน้ำหนักลดลงฮวบฮาบ อาจเกิดจากการทิ้งรังหรือโดนขโมย)

🤝 การมีส่วนร่วมพัฒนา (Contributing)

หากพบปัญหา (Bug) หรือต้องการเสนอแนะฟีเจอร์ใหม่ สามารถเปิด [Issues] หรือส่ง [Pull Request] เข้ามาได้เลยครับ ยินดีต้อนรับนักพัฒนาทุกท่าน!

Developed as a Final Project - 2026
