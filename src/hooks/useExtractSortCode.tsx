import { useCallback } from 'react';

// Custom hook to extract and format the sort code
const useExtractSortCode = () => {
  const extractSortCode = useCallback((iban: any) => {
    if (!iban || iban.length < 14) {
      return null; // Return null if the IBAN is invalid
    }
    // Extract the raw sort code (digits 9 to 14)
    const sortCode = iban.substring(8, 14);
    // Format the sort code as '12-34-56'
    return `${sortCode.substring(0, 2)}-${sortCode.substring(
      2,
      4,
    )}-${sortCode.substring(4, 6)}`;
  }, []);

  return { extractSortCode };
};

export default useExtractSortCode;
