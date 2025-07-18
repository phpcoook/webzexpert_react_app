import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Country, CountriesResponse } from "../types/Country";

interface CountrySelectorProps {
	countries: CountriesResponse | null;
	selectedCountry: Country | null;
	onCountrySelect: (country: Country) => void;
	containerRef?: React.RefObject<HTMLDivElement>;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
	countries,
	selectedCountry,
	onCountrySelect,
	containerRef,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (!isOpen) return;

		const activeItem = document.querySelector(
			`[data-country-index='${highlightedIndex}']`
		);
		if (activeItem) {
			(activeItem as HTMLElement).scrollIntoView({
				block: "nearest",
			});
		}
	}, [highlightedIndex, isOpen]);

	const filteredCountries = countries
		? Object.values(countries)
				.filter((country) =>
					country.name.toLowerCase().includes(searchTerm.toLowerCase())
				)
				.sort((a, b) => {
					const aName = a.name.toLowerCase();
					const bName = b.name.toLowerCase();
					const term = searchTerm.toLowerCase();

					const aStartsWith = aName.startsWith(term);
					const bStartsWith = bName.startsWith(term);

					if (aStartsWith && !bStartsWith) return -1;
					if (!aStartsWith && bStartsWith) return 1;
					return aName.localeCompare(bName); // fallback alphabetical
				})
		: [];

	const getFlagEmoji = (countryCode: string) => {
		if (!countryCode || countryCode.length !== 2) return "🌍";

		const codePoints = countryCode
			.toUpperCase()
			.split("")
			.map((char) => 127397 + char.charCodeAt(0));

		return String.fromCodePoint(...codePoints);
	};

	const handleCountrySelect = (country: Country) => {
		onCountrySelect(country);
		setIsOpen(false);
		setSearchTerm("");
	};

	return (
		<div className='relative' ref={dropdownRef}>
			{/* Selector Button */}
			<button
				type='button'
				onClick={() => setIsOpen(!isOpen)}
				className='w-full flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
				<div className='flex items-center space-x-3'>
					{selectedCountry && (
						<>
							<span className='text-2xl'>
								{getFlagEmoji(selectedCountry.country_code || "")}
							</span>
							<span className='font-medium text-gray-900'>
								{selectedCountry.calling_code}
							</span>
						</>
					)}
					{!selectedCountry && (
						<span className='text-gray-400'>Select country</span>
					)}
				</div>
			</button>

			{/* Dropdown */}
			{isOpen && (
				<div
					className='absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden'
					style={{
						width: containerRef?.current?.offsetWidth || "100%",
					}}>
					{/* Search Field */}
					<div className='p-3 border-b border-gray-100'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
							<input
								type='text'
								placeholder='Search countries...'
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setHighlightedIndex(0);
								}}
								onKeyDown={(e) => {
									if (!filteredCountries.length) return;

									if (e.key === "ArrowDown") {
										e.preventDefault();
										setHighlightedIndex((prev) =>
											prev < filteredCountries.length - 1 ? prev + 1 : 0
										);
									} else if (e.key === "ArrowUp") {
										e.preventDefault();
										setHighlightedIndex((prev) =>
											prev > 0 ? prev - 1 : filteredCountries.length - 1
										);
									} else if (e.key === "Enter" && highlightedIndex >= 0) {
										e.preventDefault();
										handleCountrySelect(filteredCountries[highlightedIndex]);
									}
								}}
								className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								autoFocus
							/>
						</div>
					</div>

					{/* Country List */}
					<div className='max-h-60 overflow-y-auto'>
						{filteredCountries.length > 0 ? (
							filteredCountries.map((country, index) => (
								<button
									key={country.id}
									data-country-index={index}
									type='button'
									onClick={() => handleCountrySelect(country)}
									className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
										index === highlightedIndex
											? "bg-gray-100"
											: "hover:bg-gray-50"
									}`}>
									<span className='text-2xl'>
										{getFlagEmoji(country.country_code || "")}
									</span>
									<div className='flex-1 min-w-0'>
										<div className='font-medium text-gray-900 truncate'>
											{country.name}
										</div>
									</div>
									<span className='text-gray-600 font-medium'>
										{country.calling_code}
									</span>
								</button>
							))
						) : (
							<div className='px-4 py-6 text-center text-gray-500'>
								No countries found
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
