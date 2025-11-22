import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { LineChart } from 'react-native-chart-kit';

// 🔧 Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://hivehealthmonitoring.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "YOUR_APP_ID"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const screenWidth = Dimensions.get("window").width;

export default function HiveDashboard() {
  const [data, setData] = useState({});
  const [history, setHistory] = useState({
    temperature: [],
    humidity: [],
    weight: [],
    sound: []
  });

  // 📡 อ่านข้อมูลเรียลไทม์จาก Firebase
  useEffect(() => {
    const dataRef = ref(db, 'hive1/data');
    onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);
        setHistory(prev => ({
          temperature: [...prev.temperature.slice(-9), val.temperature || 0],
          humidity: [...prev.humidity.slice(-9), val.humidity || 0],
          weight: [...prev.weight.slice(-9), val.weight || 0],
          sound: [...prev.sound.slice(-9), val.sound || 0]
        }));
      }
    });
  }, []);

  // 🚨 เช็กค่าผิดปกติ
  const checkAlert = (key, value) => {
    const limits = {
      temperature: [30, 37],
      humidity: [40, 80],
      weight: [5, 25],
      sound: [10, 60]
    };
    const [min, max] = limits[key];
    return value < min || value > max;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb', padding: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
        🐝 Hive Health Dashboard
      </Text>

      {Object.keys(data).map((key) => (
        <View
          key={key}
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            marginVertical: 8,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: checkAlert(key, data[key]) ? 'red' : '#059669',
            }}
          >
            {data[key]} {key === 'temperature' ? '°C' :
              key === 'humidity' ? '%' :
                key === 'weight' ? 'kg' : 'dB'}
          </Text>

          <LineChart
            data={{
              labels: Array(history[key].length).fill(''),
              datasets: [{ data: history[key] }],
            }}
            width={screenWidth - 40}
            height={180}
            chartConfig={{
              backgroundColor: '#f3f4f6',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              strokeWidth: 2,
            }}
            bezier
            style={{ borderRadius: 16, marginTop: 8 }}
          />
        </View>
      ))}
    </ScrollView>
  );
}
