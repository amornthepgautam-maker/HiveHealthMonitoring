import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAFe2GQ-gnrwzQDmElPTveL9dwCOgBrDDE",
  authDomain: "hivehealthmonitoring.firebaseapp.com",
  databaseURL: "https://hivehealthmonitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hivehealthmonitoring",
  storageBucket: "hivehealthmonitoring.firebasestorage.app",
  messagingSenderId: "1098865690838",
  appId: "1:1098865690838:web:9cf68d33429d483e092177",
  measurementId: "G-5YQKDMS7EX"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // 👈 บรรทัดนี้สำคัญมาก ห้ามขาด!