import { useState, useEffect, forwardRef, useRef } from 'react';

// components
import DayPicker from '../DayPicker/DayPicker';
import Header from '../Header/Header';
import DateObject from 'react-date-object';

// utils
import check from '../../utils/check';
import getSelectedDate from '../../utils/getSelectedDate';
import getDateInRangeOfMinAndMaxDate from '../../utils/getDateInRangeOfMinAndMaxDate';
import getMonthsAndYears from '../../utils/getMonthsAndYears';

// styles
import './Calendar.css';

const Calendar = (
	{
		value,
		calendar,
		locale,
		children,
		onChange,
		minDate,
		maxDate,
		mapDays,
		disableMonthPicker,
		disableYearPicker,
		onReady,
		todayStyle,
		calendarStyle,
		currentDate,
		digits,
		onPropsChange,
		onFocusedDateChange,
		disabled,
		oneDaySelectStyle,
		allDayStyles,
	},
	outerRef
) => {
	const numberOfMonths = 1;

	if (currentDate && !(currentDate instanceof DateObject)) {
		currentDate = undefined;
	}

	[calendar, locale] = check(calendar, locale);

	mapDays = [].concat(mapDays).filter(Boolean);

	let [state, setState] = useState({}),
		listeners = {},
		ref = useRef({ mustCallOnReady: true, currentDate });

	useEffect(() => {
		setState((state) => {
			let { currentDate } = ref.current;
			let { date, selectedDate, initialValue, focused } = state;

			const checkDate = (date) => {
				if (!date) return;
				if (date.calendar.name !== calendar.name) date.setCalendar(calendar);
				if (date.locale.name !== locale.name) date.setLocale(locale);

				date.digits = digits;
				return date;
			};

			const getDate = (value) => {
				return new DateObject(currentDate || value);
			};

			if (!value) {
				if (!date) date = getDate({ calendar, locale });
				if (initialValue) selectedDate = undefined;
			} else {
				selectedDate = getSelectedDate(value, calendar, locale);

				if (!date || numberOfMonths === 1) {
					date = getDate(selectedDate);
				}
			}

			[].concat(selectedDate).forEach(checkDate);

			checkDate(date);

			delete ref.current.currentDate;

			return {
				...state,
				date,
				selectedDate,
				initialValue: state.initialValue || value,
				value,
				focused,
				calendar,
				locale,
				allDayStyles,
				todayStyle,
				calendarStyle,
				year: date.year,
				today: state.today || new DateObject({ calendar }),
			};
		});
	}, [
		value,
		calendar,
		locale,
		numberOfMonths,
		digits,
		calendarStyle,
		todayStyle,
		allDayStyles,
	]);

	useEffect(() => {
		if (!minDate && !maxDate) return;

		setState((state) => {
			let { calendar, locale, format } = state;

			let [selectedDate, $minDate, $maxDate] = getDateInRangeOfMinAndMaxDate(
				getSelectedDate(value, calendar, locale, format),
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

	let globalProps = {
			state,
			setState,
			onChange: handleChange,
			handleFocusedDate,
			monthAndYears: getMonthsAndYears(state, numberOfMonths),
		},
		{ datePickerProps, DatePicker, ...calendarProps } = (...args) => args[0];

	return (
		state.today && (
			<div ref={setRef} className={`z-200 w-full bg-white ${calendarStyle} p-8`}>
				{/* rmdp-wrapper ==> rmdp-calendar */}
				<Header
					{...globalProps}
					disableYearPicker={disableYearPicker}
					disableMonthPicker={disableMonthPicker}
				/>
				<DayPicker
					{...globalProps}
					mapDays={mapDays}
					numberOfMonths={numberOfMonths}
					oneDaySelectStyle={oneDaySelectStyle}
					allDayStyles={allDayStyles}
					todayStyle={todayStyle}
				/>
				{children}
			</div>
		)
	);

	function handleChange(selectedDate, state) {
		if (disabled) return;
		//This one must be done before setState
		if (selectedDate || selectedDate === null) {
			if (listeners.change) listeners.change.forEach((callback) => callback(selectedDate));
		}

		if (state) setState(state);
		if (selectedDate || selectedDate === null) onChange?.(selectedDate);

		handlePropsChange({ value: selectedDate });
	}

	function handlePropsChange(props = {}) {
		if (disabled) return;

		let allProps = {
			...calendarProps,
			...datePickerProps,
			...props,
			value: props.value ?? state.selectedDate,
		};

		delete allProps.onPropsChange;

		onPropsChange?.(allProps);
	}

	function handleFocusedDate(focused, clicked) {
		if (disabled) return;

		onFocusedDateChange?.(focused, clicked);
	}

	function setRef(element) {
		if (element) {
			element.date = state.date;

			element.set = function (key, value) {
				if (disabled) return;

				setState({
					...state,
					date: new DateObject(state.date.set(key, value)),
				});
			};
		}

		ref.current.Calendar = element;

		if (outerRef instanceof Function) return outerRef(element);
		if (outerRef) outerRef.current = element;
	}
};

export default forwardRef(Calendar);
