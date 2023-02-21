import toDateObject from './toDateObject';

const getDateInRangeOfMinAndMaxDate = (date, minDate, maxDate, calendar) => {
	if (minDate)
		minDate = toDateObject(minDate, calendar).set({
			hour: 0,
			minute: 0,
			second: 0,
		});
	if (maxDate)
		maxDate = toDateObject(maxDate, calendar).set({
			hour: 23,
			minute: 59,
			second: 59,
		});

	return [date, minDate, maxDate];
};

export default getDateInRangeOfMinAndMaxDate;
