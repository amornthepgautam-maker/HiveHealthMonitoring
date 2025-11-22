import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function SensorCard({ label, value, history, width }) {
  const checkAlert = (key, value) => {
    const limits = {
      temperature: [30, 37],
      humidity: [40, 80],
      weight: [5, 25],
      sound: [10, 60]
    };
    const [min, max] = limits[key] || [0, 999];
    return value < min || value > max;
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </Text>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: checkAlert(label, value) ? "red" : "#059669"
        }}
      >
        {value}{" "}
        {label === "temperature"
          ? "°C"
          : label === "humidity"
          ? "%"
          : label === "weight"
          ? "kg"
          : "dB"}
      </Text>

      <LineChart
        data={{
          labels: Array(history.length).fill(""),
          datasets: [{ data: history }]
        }}
        width={width}
        height={180}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          strokeWidth: 2
        }}
        bezier
        style={{ borderRadius: 16, marginTop: 8 }}
      />
    </View>
  );
}
