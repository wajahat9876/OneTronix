import moment from 'moment';
import { useCallback } from 'react';

// Custom hook to format a date string
const useFormatDate = () => {
  const formatDate = useCallback((dateString: string | undefined | null) => {
    if (!dateString) return ''; // Return empty string if no date is provided
    return moment(dateString).format('DD MMM YYYY'); // Format the date as 'DD MMM YYYY'
  }, []);

  const formatTime = useCallback((dateString: any): any => {
    if (!dateString) return '';
    return moment(dateString).format('hh:mm A'); // 12-hour format with AM/PM
  }, []);
  return { formatDate, formatTime };
};
export default useFormatDate;
