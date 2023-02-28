import { useState, useEffect, forwardRef, useRef } from 'react';

// components
import DayPicker from '../DayPicker/DayPicker';
import Header from '../Header/Header';
import DateObject from 'react-date-object';

// utils
import getSelectedDate from '../../utils/getSelectedDate';
import getDateInRangeOfMinAndMaxDate from '../../utils/getDateInRangeOfMinAndMaxDate';
import getMonthsAndYears from '../../utils/getMonthsAndYears';

// styles
import './Calendar.css';

const Calendar = ({
	value,
	calendar,
	locale,
	children,
	onChange,
	minDate,
	maxDate,
	disableMonthPicker,
	onReady,
	oneDaySelectStyle,
	calendarStyle,
	todayStyle,
	allDayStyles,
}) => {
	const numberOfMonths = 1;

	let [state, setState] = useState({}),
		ref = useRef({ mustCallOnReady: true });

	useEffect(() => {
		setState((state) => {
			let { date, selectedDate } = state;

			const getDate = (value) => {
				return new DateObject(value);
			};

			selectedDate = getSelectedDate(value, calendar, locale);

			if (!date || numberOfMonths === 1) {
				date = getDate(selectedDate);
			}

			return {
				...state,
				date,
				selectedDate,
				value,
				calendar,
				locale,
				year: date.year,
				today: state.today || new DateObject({ calendar }),
			};
		});
	}, [calendar, locale, value]);

	useEffect(() => {
		if (!minDate && !maxDate) return;

		setState((state) => {
			let { calendar, locale } = state;

			let [selectedDate, $minDate, $maxDate] = getDateInRangeOfMinAndMaxDate(
				getSelectedDate(value, calendar, locale),
				minDate,
				maxDate,
				calendar
			);

			return {
				...state,
				minDate: $minDate,
				maxDate: $maxDate,
			};
		});
	}, [minDate, maxDate, value]);

	if (state.today && !ref.current.isReady) ref.current.isReady = true;

	useEffect(() => {
		if (ref.current.isReady && ref.current.mustCallOnReady && onReady instanceof Function) {
			ref.current.mustCallOnReady = false;
			onReady();
		}
	}, [ref.current.isReady, onReady]);

	const handleChange = (selectedDate, state) => {
		if (state) setState(state);
		if (selectedDate || selectedDate === null) onChange?.(selectedDate);
	};

	let globalProps = {
		state,
		setState,
		onChange: handleChange,
		monthAndYears: getMonthsAndYears(state, numberOfMonths),
	};

	return (
		state.today && (
			<div dir='rtl' className={`z-200 w-full bg-white ${calendarStyle} p-8`}>
				{/* rmdp-wrapper ==> rmdp-calendar */}
				<Header {...globalProps} disableMonthPicker={disableMonthPicker} />
				<DayPicker
					{...globalProps}
					numberOfMonths={numberOfMonths}
					oneDaySelectStyle={oneDaySelectStyle}
					allDayStyles={allDayStyles}
					todayStyle={todayStyle}
				/>
				{children}
			</div>
		)
	);
};

export default forwardRef(Calendar);
