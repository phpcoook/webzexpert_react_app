
import { useState, useEffect } from 'react';
import { fetchCountries } from '../services/api';
import { CountriesResponse, Country } from '../types/Country';

// Country code mapping for flag display
const countryCodeMap: { [key: string]: string } = {
  'Pakistan': 'PK',
  'India': 'IN',
  'United States': 'US',
  'United Kingdom': 'GB',
  'Canada': 'CA',
  'Australia': 'AU',
  'Germany': 'DE',
  'France': 'FR',
  'Japan': 'JP',
  'China': 'CN',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'South Korea': 'KR',
};

export const useCountries = () => {
  const [countries, setCountries] = useState<CountriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const countriesData: CountriesResponse = await fetchCountries();
        
        // Add country codes for flag display
        const countriesWithCodes: CountriesResponse = {};
        Object.entries(countriesData).forEach(([key, country]) => {
          countriesWithCodes[key] = {
            ...country,
            country_code: countryCodeMap[country.name] || key,
          };
        });
        
        setCountries(countriesWithCodes);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load countries');
        console.error('Error loading countries:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  return { countries, loading, error };
};
