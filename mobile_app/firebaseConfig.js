import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "./firebaseConfig";
import { LineChart } from "react-native-chart-kit";
import SensorCard from "./components/SensorCard";

const screenWidth = Dimensions.get("window").width;

export default function HiveDashboard() {
  const [data, setData] = useState({});
  const [history, setHistory] = useState({
    temperature: [],
    humidity: [],
    weight: [],
    sound: []
  });

  useEffect(() => {
    const dataRef = ref(db, "hive1/data");
    onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);
        setHistory((prev) => ({
          temperature: [...prev.temperature.slice(-9), val.temperature],
          humidity: [...prev.humidity.slice(-9), val.humidity],
          weight: [...prev.weight.slice(-9), val.weight],
          sound: [...prev.sound.slice(-9), val.sound]
        }));
      }
    });
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb", padding: 16 }}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10
        }}
      >
        🐝 Hive Health Dashboard
      </Text>

      {Object.keys(data).map((key) => (
        <SensorCard
          key={key}
          label={key}
          value={data[key]}
          history={history[key]}
          width={screenWidth - 40}
        />
      ))}
    </ScrollView>
  );
}
