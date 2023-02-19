import React, { useMemo, useRef, useState } from 'react';
import DateObject from 'react-date-object';
import selectDate from '../../shared/selectDate';
import isSameDate from '../../shared/isSameDate';
import ShowDayPicker from '../ShowDayPicker/ShowDayPicker';

const DayPicker = ({
	state,
	onChange,
	showOtherDays = false,
	mapDays,
	onlyShowInRangeDates,
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
		{ today, minDate, maxDate, range, date, selectedDate, onlyMonthPicker, onlyYearPicker } =
			state,
		mustShowDayPicker = !onlyMonthPicker && !onlyYearPicker;
	// [dateHovered, setDateHovered] = useState();

	ref.current.date = date;

	const getMonths = (date, showOtherDays, numberOfMonths, weekStartDayIndex) => {
		if (!date) return [];

		let months = [];

		for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
			date = new DateObject(date).toFirstOfMonth();

			let monthIndex = date.monthIndex,
				weeks = [];

			date.toFirstOfWeek().add(weekStartDayIndex, 'day');

			if (date.monthIndex === monthIndex && date.day > 1) date.subtract(7, 'days');

			for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
				let week = [];

				for (let weekDay = 0; weekDay < 7; weekDay++) {
					week.push({
						date: new DateObject(date),
						day: date.format('D'),
						current: date.monthIndex === monthIndex,
					});

					date.day += 1;
				}

				weeks.push(week);

				if (weekIndex > 2 && date.monthIndex !== monthIndex && !showOtherDays) break;
			}

			months.push(weeks);
		}

		return months;
	};

	const months = useMemo(() => {
		if (!mustShowDayPicker) return [];

		return getMonths(ref.current.date, showOtherDays, numberOfMonths, weekStartDayIndex);
		// eslint-disable-next-line
	}, [
		date.monthIndex,
		date.year,
		date.calendar,
		date.locale,
		mustShowDayPicker,
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
				// 'w-12 h-12 flex justify-center items-center cursor-pointer text-secondary800'
			],
			{ date, hidden, current } = object;

		if (!mustDisplayDay(object) || hidden) {
			names.push('rmdp-day-hidden');
		} else {
			if ((minDate && date < minDate) || (maxDate && date > maxDate) || object.disabled) {
				names.push('rmdp-disabled text-secondary400');

				if (!object.disabled) object.disabled = true;
			}

			if (!current) names.push('rmdp-deactive');

			let mustDisplaySelectedDate = (numberOfMonths > 1 && current) || numberOfMonths === 1;

			if (!object.disabled || !onlyShowInRangeDates) {
				// if (isSameDate(date, today)) names.push(todayStyle); // rmdp-today
				if (isSameDate(date, today)) names.push('text-primary'); // rmdp-today
				if (isSelected(date) && mustDisplaySelectedDate && !range) {
					names.push('text-white bg-primary rounded-xl'); //rmdp-selected
				}
			}
		}

		return names.join(' ');
	};

	const isSelected = (dateObject) => {
		return [].concat(selectedDate).some((date) => isSameDate(date, dateObject));
	};

	return (
		mustShowDayPicker && (
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
		)
	);
};

export default DayPicker;
