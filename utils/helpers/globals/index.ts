/* eslint-disable no-plusplus */
import moment from 'moment';
import { DobDataType } from './types';

export const generateArray = (start: number, end: number): DobDataType => {
  const result: DobDataType = [];
  for (let i = start; i <= end; i++) {
    const value = i.toString().padStart(2, '0');
    result.push({ value, label: value });
  }
  return result;
};

export const years: DobDataType = generateArray(1980, moment().year() - 18);
export const getYears = (startYear: number, endYear: number): DobDataType => {
  return generateArray(startYear, endYear)?.reverse();
};

export const generateDays = (
  selectedMonth: string,
  selectedYear: string,
  startDay: number,
): DobDataType => {
  if (selectedMonth === '') return [];

  const daysInMonth: number = new Date(
    Number(selectedYear),
    Number(selectedMonth),
    0,
  ).getDate();

  const currentMonth = moment().format('MM');

  if (selectedMonth === currentMonth) {
    return generateArray(startDay, daysInMonth);
  }
  return generateArray(1, daysInMonth);
};

export const months: DobDataType = [
  {
    value: '01',
    label: 'January',
  },
  {
    value: '02',
    label: 'February',
  },
  {
    value: '03',
    label: 'March',
  },
  {
    value: '04',
    label: 'April',
  },
  {
    value: '05',
    label: 'May',
  },
  {
    value: '06',
    label: 'June',
  },
  {
    value: '07',
    label: 'July',
  },
  {
    value: '08',
    label: 'August',
  },
  {
    value: '09',
    label: 'September',
  },
  {
    value: '10',
    label: 'October',
  },
  {
    value: '11',
    label: 'November',
  },
  {
    value: '12',
    label: 'December',
  },
];

export const getMonthLabel = (monthNumber: string): string => {
  const month = months.find(item => item.value === monthNumber);
  return month ? month.label : '';
};
