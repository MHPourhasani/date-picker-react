import toLocaleDigits from '../common/toLocaleDigits';

const getMonthsAndYears = (state, numberOfMonths) => {
	let date = state.date;

	if (!date) return [];

	let monthNames = [],
		years = [],
		digits = date.digits;

	for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
		let monthName,
			year = date.year,
			index = date.monthIndex + monthIndex;

		if (index > 11) {
			index -= 12;
			year++;
		}

		monthName = date.months[index].name;

		year = toLocaleDigits(year.toString(), digits);

		monthNames.push(monthName);
		years.push(year);
	}

	return [monthNames, years];
};

export default getMonthsAndYears;
