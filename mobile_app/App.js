import { StatusBar } from 'expo-status-bar';
import React from 'react';
// ⚠️ สำคัญ: ชี้เป้าหมายไปที่โฟลเดอร์ใหม่ที่เราเพิ่งย้ายไฟล์เข้าไป
import HiveDashboard from '../src/screens/HiveDashboard';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <HiveDashboard />
    </>
  );
}