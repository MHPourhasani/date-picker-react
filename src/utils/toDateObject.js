import DateObject from 'react-date-object';

const toDateObject = (date, calendar) => {
	if (date instanceof DateObject) {
		date.setCalendar(calendar);
	} else {
		date = new DateObject({ date, calendar });
	}

	return date;
};

export default toDateObject;
