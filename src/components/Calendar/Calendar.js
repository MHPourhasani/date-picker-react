import { useState, useEffect, forwardRef, useRef } from 'react';
import DayPicker from '../DayPicker/DayPicker';
import Header from '../Header/Header';
import MonthPicker from '../MonthPicker/MonthPicker';
import YearPicker from '../YearPicker/YearPicker';
import DateObject from 'react-date-object';
import stringify from '../../shared/stringify';
import toDateObject from '../../shared/toDateObject';
import isArray from '../../shared/isArray';
import check from '../../shared/check';
import toLocaleDigits from '../../shared/toLocaleDigits';
import './Calendar.css';

function Calendar(
	{
		value,
		calendar,
		locale,
		format,
		role,
		months,
		children,
		onChange,
		showOtherDays,
		minDate,
		maxDate,
		mapDays,
		disableMonthPicker,
		disableYearPicker,
		onReady,
		numberOfMonths = 1,
		todayStyle,
		calendarStyle,
		currentDate,
		digits,
		buttons = true,
		disableDayPicker,
		onPropsChange,
		onMonthChange,
		onYearChange,
		onFocusedDateChange,
		disabled,
		hideMonth,
		hideYear,
		oneDaySelectStyle,
		allDayStyles,
	},
	outerRef
) {
	const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
	const weekStartDayIndex = 0;

	if (currentDate && !(currentDate instanceof DateObject)) {
		console.warn('currentDate must be instance of DateObject');
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

			function checkDate(date) {
				if (!date) return;
				if (date.calendar.name !== calendar.name) date.setCalendar(calendar);
				if (date.locale.name !== locale.name) date.setLocale(locale);
				if (date._format !== format) date.setFormat(format);

				date.digits = digits;
				return date;
			}

			function getDate(value) {
				return new DateObject(currentDate || value);
			}

			if (!value) {
				if (!date) date = getDate({ calendar, locale, format });
				if (initialValue) selectedDate = undefined;
			} else {
				selectedDate = getSelectedDate(value, calendar, locale, format);

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
				format,
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
		format,
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
			monthAndYears: getMonthsAndYears(),
		},
		{ datePickerProps, DatePicker, ...calendarProps } = arguments[0];

	return (
		state.today && (
			<div ref={setRef} role={role || 'dialog'} className={`z-200 w-full bg-white`}>
				{/* rmdp-wrapper */}
				{!disableDayPicker && (
					// rmdp-calendar
					<div className={`${calendarStyle} p-8`}>
						<Header
							{...globalProps}
							disableYearPicker={disableYearPicker}
							disableMonthPicker={disableMonthPicker}
							buttons={buttons}
							handleMonthChange={handleMonthChange}
							hideMonth={hideMonth}
							hideYear={hideYear}
						/>
						<DayPicker
							{...globalProps}
							showOtherDays={showOtherDays}
							mapDays={mapDays}
							customWeekDays={weekDays}
							numberOfMonths={numberOfMonths}
							weekStartDayIndex={weekStartDayIndex}
							oneDaySelectStyle={oneDaySelectStyle}
							allDayStyles={allDayStyles}
							todayStyle={todayStyle}
						/>
						{!disableYearPicker && (
							<YearPicker {...globalProps} onYearChange={onYearChange} />
						)}
						{children}
					</div>
				)}
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

	function handleMonthChange(date) {
		onMonthChange?.(date);
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

	function getMonthsAndYears() {
		let date = state.date;

		if (!date) return [];

		let monthNames = [],
			years = [],
			digits = date.digits;

		for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
			let monthName,
				year = date.year,
				index = date.monthIndex + monthIndex;

			if (index > 11) {
				index -= 12;
				year++;
			}

			if (isArray(months) && months.length >= 12) {
				let month = months[index];

				monthName = isArray(month) ? month[0] : month;
			} else {
				monthName = date.months[index].name;
			}

			year = toLocaleDigits(year.toString(), digits);

			monthNames.push(monthName);
			years.push(year);
		}

		return [monthNames, years];
	}
}

export default forwardRef(Calendar);

function getDateInRangeOfMinAndMaxDate(date, minDate, maxDate, calendar) {
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
}

function getSelectedDate(value, calendar, locale, format) {
	let selectedDate = []
		.concat(value)
		.map((date) => {
			if (!date) return {};
			if (date instanceof DateObject) return date;

			return new DateObject({ date, calendar, locale, format });
		})
		.filter((date) => date.isValid);

	return selectedDate[0];
}
