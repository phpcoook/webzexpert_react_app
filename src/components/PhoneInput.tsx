
import React from 'react';
import { Country } from '../types/Country';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedCountry: Country | null;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  selectedCountry,
}) => {
  const formatPhoneNumber = (input: string, maxLength: number): string => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    // Limit to maxLength
    const limitedDigits = digits.slice(0, maxLength);
    
    // Apply formatting based on length
    if (maxLength === 10) {
      // Format as (XXX) XXX-XXXX
      if (limitedDigits.length <= 3) {
        return limitedDigits;
      } else if (limitedDigits.length <= 6) {
        return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
      } else {
        return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
      }
    } else if (maxLength === 11) {
      // Format as X (XXX) XXX-XXXX
      if (limitedDigits.length <= 1) {
        return limitedDigits;
      } else if (limitedDigits.length <= 4) {
        return `${limitedDigits.slice(0, 1)} (${limitedDigits.slice(1)}`;
      } else if (limitedDigits.length <= 7) {
        return `${limitedDigits.slice(0, 1)} (${limitedDigits.slice(1, 4)}) ${limitedDigits.slice(4)}`;
      } else {
        return `${limitedDigits.slice(0, 1)} (${limitedDigits.slice(1, 4)}) ${limitedDigits.slice(4, 7)}-${limitedDigits.slice(7)}`;
      }
    } else {
      // For other lengths, just add spacing every 3-4 digits
      if (limitedDigits.length <= 3) {
        return limitedDigits;
      } else if (limitedDigits.length <= 7) {
        return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3)}`;
      } else {
        return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 7)} ${limitedDigits.slice(7)}`;
      }
    }
  };

  const getPlaceholder = (phoneLength: number): string => {
    if (phoneLength === 10) {
      return '(000) 000-0000';
    } else if (phoneLength === 11) {
      return '0 (000) 000-0000';
    } else {
      return '0'.repeat(phoneLength);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const phoneLength = selectedCountry ? parseInt(selectedCountry.phone_length) : 10;
    const formatted = formatPhoneNumber(inputValue, phoneLength);
    onChange(formatted);
  };

  const phoneLength = selectedCountry ? parseInt(selectedCountry.phone_length) : 10;
  const placeholder = getPlaceholder(phoneLength);

  return (
    <div className="relative">
      {selectedCountry && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
          <span className="text-gray-600 font-medium">
            {selectedCountry.calling_code}
          </span>
          <span className="text-gray-300">|</span>
        </div>
      )}
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          selectedCountry ? 'pl-20' : 'pl-4'
        } pr-4`}
      />
      {selectedCountry && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
          {selectedCountry.phone_length} digits
        </div>
      )}
    </div>
  );
};
