import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SensorCard from './components/SensorCard';
import SettingsModal from './components/SettingsModal';

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
  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    weight: 0,
    sound: 0
  });
  const [history, setHistory] = useState({
    temperature: [0],
    humidity: [0],
    weight: [0],
    sound: [0]
  });

  // ⚙️ Settings State
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
        if (saved) {
          setAlertSettings(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    };
    loadSettings();
  }, []);

  // 💾 Save Settings
  const saveSettings = async (newSettings) => {
    try {
      // Save to Local Storage
      await AsyncStorage.setItem('alertSettings', JSON.stringify(newSettings));
      
      // Save to Firebase
      const settingsRef = ref(db, 'hive1/settings');
      set(settingsRef, newSettings);

      setAlertSettings(newSettings);
      setModalVisible(false);
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  };

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

  // 🚨 เช็กค่าผิดปกติ (ใช้ค่าจาก Settings)
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
    <LinearGradient
      colors={['#064e3b', '#047857', '#10b981']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>🐝 Hive Monitor</Text>
            <Text style={styles.headerSubtitle}>Real-time Dashboard</Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {Object.keys(data).map((key) => {
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
                  datasets: [{ data: history[key] || [0] }],
                }}
                width={screenWidth - 48}
                height={140}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientFromOpacity: 0.1,
                  backgroundGradientTo: '#fff',
                  backgroundGradientToOpacity: 0.1,
                  decimalPlaces: 1,
                  color: (opacity = 1) => isAlert ? `rgba(239, 68, 68, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "4", strokeWidth: "2", stroke: isAlert ? "#ef4444" : "#fff" }
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
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a7f3d0',
    marginTop: 5,
  },
  settingsIcon: {
    fontSize: 30,
    marginTop: 5,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  }
});
