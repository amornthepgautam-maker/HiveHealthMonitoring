// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// เอาค่า Config จาก Console มาใส่ตรงนี้
const firebaseConfig = {
  apiKey: "AIzaSyD....", 
  authDomain: "hive-health....firebaseapp.com",
  databaseURL: "https://hive-health....firebasedatabase.app", // ตรวจสอบ URL ให้ดี (บางทีต้องไม่มีตัวต่อท้าย)
  projectId: "hive-health...",
  storageBucket: "hive-health....appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db }; // ส่งออกแค่ db ก็พอ