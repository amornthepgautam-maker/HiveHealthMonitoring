import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

// 📡 Firebase
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebaseConfig'; 

// 📊 Libraries
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🧩 Components
import SensorCard from '../components/SensorCard';
import SettingsModal from '../components/SettingsModal';

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

  // 🟢 FIREBASE REALTIME LISTENER
  useEffect(() => {
    const hiveRef = ref(db, 'hive1/data');

    const unsubscribe = onValue(hiveRef, (snapshot) => {
      const val = snapshot.val();
      
      if (val) {
        setData({
          temperature: val.temperature || 0,
          humidity: val.humidity || 0,
          weight: val.weight || 0,
          sound: val.sound || 0
        });

        setHistory(prev => ({
          temperature: [...prev.temperature, val.temperature || 0].slice(-15),
          humidity: [...prev.humidity, val.humidity || 0].slice(-15),
          weight: [...prev.weight, val.weight || 0].slice(-15),
          sound: [...prev.sound, val.sound || 0].slice(-15)
        }));
      }
    });

    return () => unsubscribe();
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
      case 'sound': return { icon: '🔊', unit: '%', color: '#ef4444', title: 'Sound' };
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
            <Text style={styles.headerSubtitle}>🔴 Live Status</Text> 
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
                withDots={true}
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