
export interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
  country_code?: string; // ISO country code for flag display
}

export interface CountriesResponse {
  [key: string]: Country;
}
