import { useMemo, useRef } from 'react';

// components
import DateObject from 'react-date-object';
import ShowDayPicker from '../ShowDayPicker/ShowDayPicker';

// common
import isSameDate from '../../common/isSameDate';

// utils
import selectDate from '../../utils/selectDate';
import getMonths from '../../utils/getMonths';

const DayPicker = ({
	state,
	onChange,
	numberOfMonths,
	weekStartDayIndex,
	monthAndYears: [monthNames],
	allDayStyles,
	todayStyle,
}) => {
	const ref = useRef({}),
		{ today, minDate, maxDate, date, selectedDate } = state;

	ref.current.date = date;

	const months = useMemo(() => {
		return getMonths(ref.current.date, numberOfMonths, weekStartDayIndex);
		// eslint-disable-next-line
	}, [date.monthIndex, date.year, date.calendar, date.locale, numberOfMonths, weekStartDayIndex]);

	const mustDisplayDay = (object) => {
		if (object.current) return true;
	};

	const selectDay = ({ date: dateObject, current }, monthIndex, numberOfMonths) => {
		let { selectedDate, focused, date } = state,
			{ hour, minute, second } = date;

		dateObject.set({
			hour: selectedDate?.hour || hour,
			minute: selectedDate?.minute || minute,
			second: selectedDate?.second || second,
		});

		if (numberOfMonths === 1 && !current) {
			date = new DateObject(date).toFirstOfMonth();
		}

		[selectedDate, focused] = selectDate(dateObject, state);

		onChange(selectedDate, {
			...state,
			date,
			focused,
			selectedDate,
		});
	};

	const getClassName = (object) => {
		let names = [
				// allDayStyles,
				'rmdp-day',
				'text-14',
			],
			{ date, current } = object;

		if ((minDate && date < minDate) || (maxDate && date > maxDate) || object.disabled) {
			names.push('rmdp-disabled text-secondary400');

			if (!object.disabled) object.disabled = true;
		}

		if (!current) names.push('rmdp-deactive');

		let mustDisplaySelectedDate = true;

		if (!object.disabled) {
			// if (isSameDate(date, today)) names.push('text-primary'); // todayStyle
			if (isSameDate(date, today)) names.push(todayStyle); // todayStyle
			if (isSelected(date) && mustDisplaySelectedDate) {
				names.push('text-white bg-primary rounded-xl'); //rmdp-selected
			}
		}

		return names.join(' ');
	};

	const isSelected = (dateObject) => {
		return [].concat(selectedDate).some((date) => isSameDate(date, dateObject));
	};

	return (
		<ShowDayPicker
			months={months}
			state={state}
			weekStartDayIndex={weekStartDayIndex}
			mustDisplayDay={mustDisplayDay}
			getClassName={getClassName}
			numberOfMonths={numberOfMonths}
			selectDay={selectDay}
			selectedDate={selectedDate}
		/>
	);
};

export default DayPicker;
