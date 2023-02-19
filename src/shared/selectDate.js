import isSameDate from './isSameDate';
import DateObject from 'react-date-object';

const selectDate = (date, { selectedDate, format, focused: previousFocused }) => {
	date.setFormat(format);

	let focused = new DateObject(date);
	selectedDate = focused;

	return [selectedDate, focused];
};

export default selectDate;
