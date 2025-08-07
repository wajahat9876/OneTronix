/* eslint-disable react/require-default-props */
import DropdownRNE from '@src/components/globals/DropdownRNE'; // Assuming this is the correct import
import Colors from '@src/constants/Colors';
import { getRespValue } from '@utils/getRespValue';

import React, { useEffect, useState } from 'react';

// Utility function to calculate the start and end dates of a month
function getMonthStartAndEnd(month: number, year: number): string {
  const date = new Date(year, month, 0); // 0th day of next month gives us the last day of the month
  const lastDay = date.getDate();
  return `1 - ${lastDay}`;
}

// Function to check if it's a leap year
// function isLeapYear(year: number): boolean {
//   return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
// }
interface MonthYearDropdownProps {
  // Values passed from parent to be handled by this component
  selectedMonth?: number;
  selectedYear?: number;
  onMonthChange?: (month: number, year: number) => void;
  onYearChange?: (year: number) => void;

  // Placeholder text
  monthPlaceholder?: string;
  yearPlaceholder?: string;

  // Year and Month data
  years?: { label: string; value: number }[];
  months?: { label: string; value: number }[];

  // Style Customizations
  dropdownStyle?: object;
  selectedTextStyle?: object;
  placeholderStyle?: object;
  itemContainerStyle?: object;
}

const MonthYearDropdown: React.FC<MonthYearDropdownProps> = ({
  selectedMonth = null,
  selectedYear = null,
  onMonthChange,
  onYearChange,
  monthPlaceholder = 'Select Month',
  yearPlaceholder = 'Select Year',
  years = [
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 },
    { label: '2026', value: 2026 },
  ],
  months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ],
  dropdownStyle = {},
  selectedTextStyle = {},
  placeholderStyle = {},
  itemContainerStyle = {},
}) => {
  // State to hold selected month and year
  const [month, setMonth] = useState<number | null>(selectedMonth);
  const [year, setYear] = useState<number | null>(selectedYear);

  // Handle changes to the months
  const handleMonthChange = (item: any) => {
    const newMonth = item.value;
    const newYear = year || new Date().getFullYear(); // Default to current year if no year is selected
    const dateRange = getMonthStartAndEnd(newMonth, newYear);
    console.log('Selected Month Date Range:', dateRange); // Handle the date range as needed

    setMonth(selectedMonth);

    // Call the callback function if provided
    if (onMonthChange) {
      onMonthChange(newMonth, newYear);
    }
  };

  // Handle changes to the year
  const handleYearChange = (item: any) => {
    const selectedYear2 = item.value;
    setYear(selectedYear2);

    // Recalculate date range when year changes
    if (month !== null) {
      const dateRange = getMonthStartAndEnd(month, selectedYear2);
      console.log('Updated Year Date Range:', dateRange);
    }

    // Call the callback function if provided
    if (onYearChange) {
      onYearChange(selectedYear2);
    }
  };

  useEffect(() => {
    if (selectedMonth !== null) setMonth(selectedMonth);
    if (selectedYear !== null) setYear(selectedYear);
  }, [selectedMonth, selectedYear]);

  return (
    <>
      {/* Month Dropdown */}
      <DropdownRNE
        dropdownType="sm"
        data={months}
        valueField="value"
        labelField="label"
        value={month}
        onChange={handleMonthChange}
        placeholder={monthPlaceholder}
        dropdownPosition="auto"
        style={{
          borderBottomWidth: 1.5,
          borderBottomColor: Colors.light.theme.textInputBottomBorderColor,
          width: '95%',
          ...dropdownStyle,
        }}
        selectedTextStyle={{
          fontSize: getRespValue(18),
          color: 'black',
          paddingTop: 10,
          ...selectedTextStyle,
        }}
        placeholderStyle={{
          color: 'gray',
          fontSize: getRespValue(18),
          paddingTop: 10,
          paddingBottom: 5,
          ...placeholderStyle,
        }}
        itemContainerStyle={{
          borderBottomWidth: 0.5,
          borderColor: 'gray',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          ...itemContainerStyle,
        }}
      />

      {/* Year Dropdown */}
      <DropdownRNE
        dropdownType="sm"
        data={years}
        valueField="value"
        labelField="label"
        value={year}
        onChange={handleYearChange}
        placeholder={yearPlaceholder}
        dropdownPosition="auto"
        style={{
          borderBottomWidth: 1.5,
          borderBottomColor: Colors.light.theme.textInputBottomBorderColor,
          width: '95%',
          ...dropdownStyle,
        }}
        selectedTextStyle={{
          fontSize: getRespValue(18),
          color: 'black',
          paddingTop: 10,
          ...selectedTextStyle,
        }}
        placeholderStyle={{
          color: 'gray',
          fontSize: getRespValue(18),
          paddingTop: 10,
          paddingBottom: 5,
          ...placeholderStyle,
        }}
        itemContainerStyle={{
          borderBottomWidth: 0.5,
          borderColor: 'gray',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          ...itemContainerStyle,
        }}
      />
    </>
  );
};

export default MonthYearDropdown;
