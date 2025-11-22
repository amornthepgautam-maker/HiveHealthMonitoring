import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function SettingsModal({ visible, onClose, onSave, currentSettings }) {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const handleChange = (key, type, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: parseFloat(value) || 0
      }
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>⚙️ Alert Settings</Text>
          
          <ScrollView style={styles.scrollView}>
            {Object.keys(settings).map((key) => (
              <View key={key} style={styles.settingRow}>
                <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Min"
                    keyboardType="numeric"
                    value={String(settings[key].min)}
                    onChangeText={(text) => handleChange(key, 'min', text)}
                  />
                  <Text style={styles.separator}>-</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Max"
                    keyboardType="numeric"
                    value={String(settings[key].max)}
                    onChangeText={(text) => handleChange(key, 'max', text)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => onSave(settings)}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#064e3b',
  },
  scrollView: {
    marginBottom: 20,
  },
  settingRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#374151',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  separator: {
    marginHorizontal: 10,
    fontSize: 20,
    color: '#6b7280',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#9ca3af',
  },
  saveButton: {
    backgroundColor: '#10b981',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
