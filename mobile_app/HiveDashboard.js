import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
// ปิด Firebase ไปก่อน จะได้ไม่ Error เวลาไม่มีเน็ต
// import { ref, onValue, set } from 'firebase/database'; 
// import { db } from './firebaseConfig'; 
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SensorCard from './components/SensorCard';
import SettingsModal from './components/SettingsModal';

const screenWidth = Dimensions.get("window").width;

export default function HiveDashboard() {
  const [data, setData] = useState({
    temperature: 30.5,
    humidity: 65.0,
    weight: 10.0,
    sound: 35
  });

  const [history, setHistory] = useState({
    temperature: [30, 30.5, 31, 30.8],
    humidity: [60, 62, 65, 64],
    weight: [9.8, 9.9, 10.0, 10.0],
    sound: [30, 35, 40, 32]
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    temperature: { min: 30, max: 37 },
    humidity: { min: 40, max: 80 },
    weight: { min: 5, max: 25 },
    sound: { min: 10, max: 60 }
  });

  // 📥 Load Settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem('alertSettings');
        if (saved) setAlertSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    };
    loadSettings();
  }, []);

  // 💾 Save Settings
  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('alertSettings', JSON.stringify(newSettings));
      setAlertSettings(newSettings);
      setModalVisible(false);
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  };

  // 🧪 DEMO MODE: จำลองข้อมูลขยับเองทุกๆ 3 วินาที (ใช้พรีเซนต์)
  useEffect(() => {
    const interval = setInterval(() => {
      // สุ่มตัวเลขให้ดูสมจริง
      const mockVal = {
        temperature: parseFloat((30 + Math.random() * 3).toFixed(1)), // สุ่ม 30.0 - 33.0
        humidity: parseFloat((60 + Math.random() * 10).toFixed(1)),   // สุ่ม 60.0 - 70.0
        weight: parseFloat((10 + Math.random() * 0.5).toFixed(2)),    // สุ่ม 10.00 - 10.50
        sound: Math.floor(20 + Math.random() * 30)                    // สุ่ม 20 - 50
      };

      setData(mockVal);

      // อัปเดตกราฟให้เลื่อนไปเรื่อยๆ (เก็บ 15 ค่าล่าสุด)
      setHistory(prev => ({
        temperature: [...prev.temperature, mockVal.temperature].slice(-15),
        humidity: [...prev.humidity, mockVal.humidity].slice(-15),
        weight: [...prev.weight, mockVal.weight].slice(-15),
        sound: [...prev.sound, mockVal.sound].slice(-15)
      }));
    }, 3000); // เปลี่ยนค่าทุก 3 วินาที

    return () => clearInterval(interval);
  }, []);

  // 🚨 Alert Logic
  const checkAlert = (key, value) => {
    const setting = alertSettings[key];
    if (!setting) return false;
    return value < setting.min || value > setting.max;
  };

  const getSensorConfig = (key) => {
    switch (key) {
      case 'temperature': return { icon: '🌡️', unit: '°C', color: '#f59e0b', title: 'Temperature' };
      case 'humidity': return { icon: '💧', unit: '%', color: '#3b82f6', title: 'Humidity' };
      case 'weight': return { icon: '⚖️', unit: 'kg', color: '#10b981', title: 'Weight' };
      case 'sound': return { icon: '🔊', unit: 'dB', color: '#ef4444', title: 'Sound' };
      default: return { icon: '❓', unit: '', color: '#6b7280', title: key };
    }
  };

  return (
    <LinearGradient colors={['#064e3b', '#047857', '#10b981']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>🐝 Hive Monitor</Text>
            <Text style={styles.headerSubtitle}>Demo Dashboard</Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={{ fontSize: 30 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Sensor Cards Loop */}
        {Object.keys(data).map((key) => {
          if (!['temperature', 'humidity', 'weight', 'sound'].includes(key)) return null;

          const config = getSensorConfig(key);
          const isAlert = checkAlert(key, data[key]);
          
          return (
            <View key={key} style={styles.sectionContainer}>
              <SensorCard
                title={config.title}
                value={data[key]}
                unit={config.unit}
                icon={config.icon}
                color={config.color}
                alert={isAlert}
              />
              
              <LineChart
                data={{
                  labels: [], 
                  datasets: [{ data: history[key].length > 0 ? history[key] : [0] }]
                }}
                width={screenWidth - 48}
                height={160}
                withDots={true} // โชว์จุดบนกราฟให้ดูมี movement
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={false}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientFromOpacity: 0.2,
                  backgroundGradientTo: '#ffffff',
                  backgroundGradientToOpacity: 0.05,
                  decimalPlaces: 1,
                  color: (opacity = 1) => config.color,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, 0.7)`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "3", strokeWidth: "1", stroke: "#fff" }
                }}
                bezier
                style={styles.chart}
              />
            </View>
          );
        })}
      </ScrollView>

      <SettingsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={saveSettings}
        currentSettings={alertSettings}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 16, color: '#a7f3d0', marginTop: 5 },
  sectionContainer: { marginBottom: 20 },
  chart: { marginVertical: 10, borderRadius: 16 }
});