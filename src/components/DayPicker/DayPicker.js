import React, { useMemo, useRef, useState } from 'react';
import DateObject from 'react-date-object';
import selectDate from '../../shared/selectDate';
import isSameDate from '../../shared/isSameDate';
import ShowDayPicker from '../ShowDayPicker/ShowDayPicker';
import getMonths from '../../shared/getMonths';

const DayPicker = ({
	state,
	onChange,
	showOtherDays = false,
	mapDays,
	customWeekDays,
	numberOfMonths,
	weekStartDayIndex,
	handleFocusedDate,
	hideWeekDays,
	monthAndYears: [monthNames],
	allDayStyles,
	todayStyle,
}) => {
	const ref = useRef({}),
		{ today, minDate, maxDate, date, selectedDate, onlyMonthPicker, onlyYearPicker } = state;

	ref.current.date = date;

	const months = useMemo(() => {
		return getMonths(ref.current.date, showOtherDays, numberOfMonths, weekStartDayIndex);
		// eslint-disable-next-line
	}, [
		date.monthIndex,
		date.year,
		date.calendar,
		date.locale,
		showOtherDays,
		numberOfMonths,
		weekStartDayIndex,
	]);

	const mustDisplayDay = (object) => {
		if (object.current) return true;

		return showOtherDays;
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
		} else if (numberOfMonths > 1 && !current) {
			if (monthIndex === 0 && dateObject < date) {
				date = new DateObject(date).toFirstOfMonth();
			}

			if (
				monthIndex > 0 &&
				dateObject.monthIndex > date.monthIndex + monthIndex &&
				monthIndex + 1 === numberOfMonths
			) {
				date = new DateObject(date).toFirstOfMonth().add(1, 'month');
			}
		}

		[selectedDate, focused] = selectDate(dateObject, state);

		onChange(selectedDate, {
			...state,
			date,
			focused,
			selectedDate,
		});

		handleFocusedDate(focused, dateObject);
	};

	const getClassName = (object, numberOfMonths) => {
		let names = [
				// allDayStyles,
				'rmdp-day',
			],
			{ date, current } = object;

		if ((minDate && date < minDate) || (maxDate && date > maxDate) || object.disabled) {
			names.push('rmdp-disabled text-secondary400');

			if (!object.disabled) object.disabled = true;
		}

		if (!current) names.push('rmdp-deactive');

		let mustDisplaySelectedDate = numberOfMonths === 1;

		if (!object.disabled) {
			if (isSameDate(date, today)) names.push('text-primary'); // todayStyle
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
			hideWeekDays={hideWeekDays}
			state={state}
			customWeekDays={customWeekDays}
			weekStartDayIndex={weekStartDayIndex}
			mustDisplayDay={mustDisplayDay}
			getClassName={getClassName}
			numberOfMonths={numberOfMonths}
			selectDay={selectDay}
			selectedDate={selectedDate}
			mapDays={mapDays}
			showOtherDays={showOtherDays}
		/>
	);
};

export default DayPicker;
