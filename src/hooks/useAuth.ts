
import { submitTwoFactorAuth as apiSubmitTwoFactorAuth } from '../services/api';

export const useAuth = () => {
  const submitTwoFactorAuth = async (phoneNumber: string, countryId: string) => {
    try {
      const result = await apiSubmitTwoFactorAuth(phoneNumber, countryId);
      return result;
    } catch (error) {
      console.error('Two-factor auth submission failed:', error);
      throw error;
    }
  };

  return {
    submitTwoFactorAuth,
  };
};
