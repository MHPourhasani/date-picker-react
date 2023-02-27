import DateObject from 'react-date-object';

const getSelectedDate = (value, calendar, locale) => {
	let selectedDate = [].concat(value).map((date) => {
		if (!date) return {};
		if (date instanceof DateObject) return date;

		return new DateObject({ date, calendar, locale });
	});

	return selectedDate[0];
};

export default getSelectedDate;
