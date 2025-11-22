import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SensorCard({ title, value, unit, icon, color, alert }) {
  return (
    <View style={[styles.card, alert && styles.alertCard]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color: alert ? '#ef4444' : color }]}>
        {value} <Text style={styles.unit}>{unit}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  alertCard: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
  },
  unit: {
    fontSize: 18,
    fontWeight: '500',
    color: '#9ca3af',
  },
});
