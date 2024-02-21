
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
  
    return /^\d{10}$/.test(formattedPhoneNumber);
  };
  