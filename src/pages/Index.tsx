import React, { useState, useEffect } from "react";
import { CountrySelector } from "../components/CountrySelector";
import { PhoneInput } from "../components/PhoneInput";
import { SubmitButton } from "../components/SubmitButton";
import { useCountries } from "../hooks/useCountries";
import { useAuth } from "../hooks/useAuth";
import { Country } from "../types/Country";
import { Phone } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const Index = () => {
	const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { countries, loading: countriesLoading } = useCountries();
	const { submitTwoFactorAuth } = useAuth();
	const { toast } = useToast();

	// Set default country to US when countries load
	useEffect(() => {
		if (countries && !selectedCountry) {
			const defaultCountry =
				Object.values(countries).find(
					(country) =>
						country.name.toLowerCase().includes("united states") ||
						country.calling_code === "+1"
				) || Object.values(countries)[0];

			if (defaultCountry) {
				setSelectedCountry(defaultCountry);
			}
		}
	}, [countries, selectedCountry]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedCountry || !phoneNumber.trim()) {
			toast({
				title: "Missing Information",
				description: "Please select a country and enter a phone number.",
				variant: "destructive",
			});
			return;
		}

		// Remove formatting from phone number
		const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, "");

		if (cleanPhoneNumber.length !== parseInt(selectedCountry.phone_length)) {
			toast({
				title: "Invalid Phone Number",
				description: `Phone number must be ${selectedCountry.phone_length} digits for ${selectedCountry.name}.`,
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			await submitTwoFactorAuth(cleanPhoneNumber, selectedCountry.id);
			toast({
				title: "Success!",
				description:
					"Two-factor authentication request submitted successfully.",
			});
			setPhoneNumber("");
		} catch (error) {
			toast({
				title: "Submission Failed",
				description:
					"Failed to submit two-factor authentication request. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (countriesLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading countries...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
			<div className='max-w-md mx-auto pt-8'>
				{/* Header */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4'>
						<Phone className='h-8 w-8 text-white' />
					</div>
					<h1 className='text-2xl font-bold text-gray-900 mb-2'>
						React Challenge WebzExperts
					</h1>
					<p className='text-gray-600'>Enter your phone number to continue</p>
				</div>

				{/* Main Form */}
				<div className='bg-white rounded-2xl shadow-xl p-6'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Country Selector */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Country
							</label>
							<CountrySelector
								countries={countries}
								selectedCountry={selectedCountry}
								onCountrySelect={setSelectedCountry}
							/>
						</div>

						{/* Phone Input */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Phone Number
							</label>
							<PhoneInput
								value={phoneNumber}
								onChange={setPhoneNumber}
								selectedCountry={selectedCountry}
							/>
						</div>

						{/* Submit Button */}
						<SubmitButton isSubmitting={isSubmitting} />
					</form>
				</div>

				{/* Footer */}
				<div className='text-center mt-6'>
					<p className='text-sm text-gray-500'>
						We'll send a verification code to your phone number
					</p>
				</div>
			</div>
		</div>
	);
};

export default Index;
