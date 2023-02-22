import isArray from '../common/isArray';
import toLocaleDigits from '../common/toLocaleDigits';

const getMonthsAndYears = (state, numberOfMonths, months) => {
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

		if (isArray(months) && months.length >= 12) {
			let month = months[index];

			monthName = isArray(month) ? month[0] : month;
		} else {
			monthName = date.months[index].name;
		}

		year = toLocaleDigits(year.toString(), digits);

		monthNames.push(monthName);
		years.push(year);
	}

	return [monthNames, years];
};

export default getMonthsAndYears;
