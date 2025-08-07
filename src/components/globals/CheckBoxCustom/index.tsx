/* eslint-disable react/require-default-props */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Reusable Checkbox Component
interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  labelStyle?: any;
}

const CheckboxCustom: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  labelStyle,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle}>
        {/* The box itself */}
        <View style={[styles.checkbox, checked && styles.checked]}>
          {checked && <Text style={styles.checkmark}>✔</Text>}
        </View>
      </TouchableOpacity>
      {/* The label */}
      <Text style={[styles.label, { ...labelStyle }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: 'white', // Checkbox background when checked
  },
  checkmark: {
    color: 'black',
    fontSize: 12,
  },
  label: {
    color: 'black',
    fontSize: 16,
  },
});

export default CheckboxCustom;
