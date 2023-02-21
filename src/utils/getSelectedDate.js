import DateObject from 'react-date-object';

const getSelectedDate = (value, calendar, locale, format) => {
	let selectedDate = []
		.concat(value)
		.map((date) => {
			if (!date) return {};
			if (date instanceof DateObject) return date;

			return new DateObject({ date, calendar, locale, format });
		})
		.filter((date) => date.isValid);

	return selectedDate[0];
};

export default getSelectedDate;
