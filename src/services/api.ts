const BASE_URL = "https://sandbox-api.softpoint.io/interface/v1";
const BEARER_TOKEN = "PO8Rlv4TiYdnZ6NF4uYN/98k6zIGBEkbBG7hBXi9QcI=";

export const fetchCountries = async () => {
	const response = await fetch(`${BASE_URL}/challenges/countries`, {
		headers: {
			Authorization: `Bearer ${BEARER_TOKEN}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch countries");
	}

	return response.json();
};

export const submitTwoFactorAuth = async (
	phoneNumber: string,
	countryId: string
) => {
	const response = await fetch(
		`${BASE_URL}/challenges/two_factor_auth?phone_number=${phoneNumber}&country_id=${countryId}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${BEARER_TOKEN}`,
				"Content-Type": "application/json",
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to submit two-factor auth");
	}

	return response.json();
};
