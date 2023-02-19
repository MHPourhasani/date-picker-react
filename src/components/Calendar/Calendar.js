import React, { useState, useEffect, forwardRef, useRef, cloneElement } from 'react';
import DayPicker from '../DayPicker/DayPicker';
import Header from '../Header/Header';
import MonthPicker from '../MonthPicker/MonthPicker';
import YearPicker from '../YearPicker/YearPicker';
import DateObject from 'react-date-object';
import getFormat from '../../shared/getFormat';
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
		onlyMonthPicker,
		onlyYearPicker,
		range = false,
		multiple = false,
		className,
		role,
		weekDays,
		months,
		children,
		onChange,
		showOtherDays,
		minDate,
		maxDate,
		mapDays,
		disableMonthPicker,
		disableYearPicker,
		formattingIgnoreList,
		onReady,
		onlyShowInRangeDates = true,
		plugins = [],
		sort,
		numberOfMonths = 1,
		todayStyle,
		calendarStyle,
		currentDate,
		digits,
		buttons = true,
		renderButton,
		weekStartDayIndex = 0,
		disableDayPicker,
		onPropsChange,
		onMonthChange,
		onYearChange,
		onFocusedDateChange,
		readOnly,
		disabled,
		hideMonth,
		hideYear,
		hideWeekDays,
		shadow = true,
		fullYear,
		weekPicker,
		oneDaySelectStyle,
		allDayStyles,
	},
	outerRef
) {
	if (currentDate && !(currentDate instanceof DateObject)) {
		console.warn('currentDate must be instance of DateObject');
		currentDate = undefined;
	}

	if (typeof weekStartDayIndex !== 'number' || weekStartDayIndex < 0 || weekStartDayIndex > 6)
		weekStartDayIndex = 0;

	[calendar, locale] = check(calendar, locale);

	format = getFormat(onlyMonthPicker, onlyYearPicker, format);
	formattingIgnoreList = stringify(formattingIgnoreList);
	mapDays = [].concat(mapDays).filter(Boolean);

	plugins = [].concat.apply([], plugins);

	let [state, setState] = useState({}),
		listeners = {},
		ref = useRef({ mustCallOnReady: true, currentDate });

	useEffect(() => {
		setState((state) => {
			let { currentDate } = ref.current;
			let { date, selectedDate, initialValue, focused, mustSortDates } = state;

			function checkDate(date) {
				if (!date) return;
				if (date.calendar.name !== calendar.name) date.setCalendar(calendar);
				if (date.locale.name !== locale.name) date.setLocale(locale);
				if (date._format !== format) date.setFormat(format);

				date.digits = digits;
				date.ignoreList = JSON.parse(formattingIgnoreList);

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

				if (isArray(selectedDate)) {
					if (!date) date = getDate(selectedDate[0]);
				} else {
					if (!date || numberOfMonths === 1) {
						date = getDate(selectedDate);
					} else {
						let min = new DateObject(date).toFirstOfMonth();
						let max = new DateObject(date)
							.add(numberOfMonths - 1, 'months')
							.toLastOfMonth();

						if (selectedDate < min || selectedDate > max) {
							date = new DateObject(selectedDate);
						}
					}
				}
			}

			[].concat(selectedDate).forEach(checkDate);

			checkDate(date);

			if (multiple || range || isArray(value)) {
				if (!selectedDate) selectedDate = [];
				if (!isArray(selectedDate)) selectedDate = [selectedDate];
			} else if (isArray(selectedDate)) {
				selectedDate = selectedDate[selectedDate.length - 1];
			}

			delete ref.current.currentDate;

			return {
				...state,
				date,
				selectedDate,
				// multiple,
				range,
				// onlyMonthPicker,
				// onlyYearPicker,
				initialValue: state.initialValue || value,
				value,
				focused,
				calendar,
				locale,
				format,
				allDayStyles,
				todayStyle,
				calendarStyle,
				oneDaySelectStyle,
				mustSortDates,
				year: date.year,
				today: state.today || new DateObject({ calendar }),
				weekPicker,
			};
		});
	}, [
		value,
		calendar,
		locale,
		format,
		range,
		multiple,
		sort,
		numberOfMonths,
		digits,
		formattingIgnoreList,
		calendarStyle,
		oneDaySelectStyle,
		fullYear,
		weekPicker,
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
				inRangeDates: onlyShowInRangeDates ? selectedDate : state.selectedDate,
				minDate: $minDate,
				maxDate: $maxDate,
			};
		});
	}, [minDate, maxDate, onlyShowInRangeDates, value]);

	if (state.today && !ref.current.isReady) ref.current.isReady = true;

	useEffect(() => {
		if (ref.current.isReady && ref.current.mustCallOnReady && onReady instanceof Function) {
			ref.current.mustCallOnReady = false;

			onReady();
		}
	}, [ref.current.isReady, onReady]);

	let clonedPlugins = { top: [], bottom: [], left: [], right: [] },
		globalProps = {
			state,
			setState,
			onChange: handleChange,
			sort,
			handleFocusedDate,
			fullYear,
			monthAndYears: getMonthsAndYears(),
		},
		{ datePickerProps, DatePicker, ...calendarProps } = arguments[0];

	return state.today ? (
		<div ref={setRef} role={role || 'dialog'} className={`z-200`}>
			{/* rmdp-wrapper */}
			<div className={`shadow-calendar w-[461px] rounded-xl border-2`}>
				{!disableDayPicker && (
					// rmdp-calendar
					<div className={`${calendarStyle} p-8`}>
						<Header
							{...globalProps}
							disableYearPicker={disableYearPicker}
							disableMonthPicker={disableMonthPicker}
							buttons={buttons}
							renderButton={renderButton}
							handleMonthChange={handleMonthChange}
							disabled={disabled}
							hideMonth={hideMonth}
							hideYear={hideYear}
						/>
						<div className='relative'>
							<DayPicker
								{...globalProps}
								showOtherDays={showOtherDays}
								mapDays={mapDays}
								onlyShowInRangeDates={onlyShowInRangeDates}
								customWeekDays={weekDays}
								numberOfMonths={numberOfMonths}
								weekStartDayIndex={weekStartDayIndex}
								hideWeekDays={hideWeekDays}
								oneDaySelectStyle={oneDaySelectStyle}
								allDayStyles={allDayStyles}
								todayStyle={todayStyle}
								
							/>
							{!fullYear && (
								<>
									{!disableYearPicker && (
										<YearPicker {...globalProps} onYearChange={onYearChange} />
									)}
								</>
							)}
						</div>
						{children}
					</div>
				)}
			</div>
		</div>
	) : null;

	function handleChange(selectedDate, state) {
		if (disabled) return;
		//This one must be done before setState
		if (selectedDate || selectedDate === null) {
			if (readOnly) return;
			if (listeners.change) listeners.change.forEach((callback) => callback(selectedDate));
		}

		if (state) setState(state);
		if (selectedDate || selectedDate === null) onChange?.(selectedDate);

		handlePropsChange({ value: selectedDate });
	}

	function handlePropsChange(props = {}) {
		if (readOnly || disabled) return;

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
		if (readOnly || disabled) return;

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

	return isArray(value) ? selectedDate : selectedDate[0];
}
