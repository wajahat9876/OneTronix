/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/require-default-props */
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface CurrencyInput {
  currency?: string;
  onValueChange?: (value: string) => void;
  containerStyle?: any;
}

const currencySymbols = {
  GBP: '£',
  EUR: '€',
  USD: '$',
  // Add more currencies as needed
};

const CurrencyInput = ({
  currency = 'GBP',
  onValueChange,
  containerStyle,
}: CurrencyInput) => {
  const [displayValue, setDisplayValue] = useState('');
  const { getCurrencySymbol } = useCurrencyFlag();
  const handleChangeText = (text: string) => {
    // Allow only numbers (no decimal point handling needed for this requirement)
    const cleanedText = text.replace(/[^0-9]/g, '');

    // Convert the cleaned text to a number and divide by 100
    const numericValue = parseInt(cleanedText, 10);

    // If the input is empty or non-numeric, handle it gracefully
    if (isNaN(numericValue)) {
      setDisplayValue('');
      if (onValueChange) onValueChange('');
      return;
    }

    // Perform the calculation (divide by 100)
    const resultValue = (numericValue / 100).toFixed(2);

    // Set the display value to the formatted result
    setDisplayValue(resultValue);

    // Notify parent component with the result (numeric value only)
    if (onValueChange) {
      onValueChange(resultValue);
    }
  };

  const symbol = getCurrencySymbol(currency) || '£';

  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        ...containerStyle,
      }}
    >
      <Text style={styles.symbol}>{symbol}</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={displayValue}
        onChangeText={handleChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderWidth: 0,
    borderBottomColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  symbol: {
    fontSize: 22,
    fontWeight: '500',
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 24,
    textAlign: 'left',
  },
});

export default CurrencyInput;
