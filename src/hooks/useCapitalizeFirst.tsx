import { useCallback } from 'react';

// Custom hook to capitalize the first letter of a string
const useCapitalizeFirstWord = () => {
  const capitalizeFirstWord = useCallback((str: string) => {
    if (!str) return ''; // Return an empty string if input is falsy
    return str.charAt(0).toUpperCase() + str.slice(1); // Capitalize the first character
  }, []);
  const trimString = useCallback((str: string, maxLength: number = 10) => {
    if (!str) return ''; // Return an empty string if input is falsy
    return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str; // Trim and add "..."
  }, []);
  const capitalizeEachWord = (str: string): string => {
    return str ? str.toUpperCase() : '';
  };

  return { capitalizeFirstWord, trimString, capitalizeEachWord };
};

export default useCapitalizeFirstWord;
