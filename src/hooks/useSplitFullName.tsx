import { useMemo } from 'react';

/**
 * Global hook to split a full name into first name and last name.
 * @param {string | undefined} fullName - The full name to split.
 * @returns {object} - An object containing firstName and lastName.
 */
const useSplitFullName = (fullName: string) => {
  return useMemo(() => {
    if (!fullName) return { firstName: '', lastName: '' }; // Return empty values if fullName is undefined
    const nameParts = fullName.trim().split(' '); // Split the full name by spaces
    const firstName = nameParts[0] || ''; // Get the first part as firstName
    const lastName = nameParts.slice(1).join(' ') || ''; // Combine the rest as lastName
    return { firstName, lastName };
  }, [fullName]);
};

export default useSplitFullName;
