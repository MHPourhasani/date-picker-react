import { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import ElementPopper from 'react-element-popper';
import DateObject from 'react-date-object';
import Calendar from '../Calendar/Calendar';
import getFormat from '../../shared/getFormat';
import stringify from '../../shared/stringify';
import isArray from '../../shared/isArray';
import check from '../../shared/check';
import toLocaleDigits from '../../shared/toLocaleDigits';
import getStringDate from '../../shared/getStringDate';
import './DatePicker.css';

const DatePicker = (
	{
		value,
		calendar,
		locale,
		format,
		onlyMonthPicker,
		onlyYearPicker,
		onChange,
		multiple = false,
		name,
		title,
		placeholder,
		required,
		className = '',
		inputClass,
		disabled,
		weekDays,
		months,
		children,
		inputMode,
		scrollSensitive = true,
		hideOnScroll,
		minDate,
		maxDate,
		formattingIgnoreList,
		containerClassName = '',
		calendarPosition = 'bottom-left',
		editable = true,
		onOpen,
		onClose,
		arrowClassName = '',
		zIndex = 100,
		arrow = true,
		fixMainPosition,
		onPositionChange,
		onPropsChange,
		digits,
		shadow = true,
		onFocusedDateChange,
		type,
		weekPicker,
		mobileLabels,
		inputLable,
		onOpenPickNewDate = true,
		...otherProps
	},
	outerRef
) => {
	let [date, setDate] = useState(),
		[temporaryDate, setTemporaryDate] = useState(),
		[stringDate, setStringDate] = useState(''),
		[isVisible, setIsVisible] = useState(false),
		[isCalendarReady, setIsCalendarReady] = useState(false),
		datePickerRef = useRef(),
		inputRef = useRef(),
		calendarRef = useRef(),
		ref = useRef({}),
		datePickerProps = (...args) => args[0],
		closeCalendar = useCallback(() => {
			if (onClose?.() === false) return;

			let input = getInput(inputRef);

			if (input) input.blur();

			setIsVisible(false);
			setIsCalendarReady(false);
		}, [onClose]),
		buttons = [
			{
				className: 'text-primary flex-1 h-12',
				onClick: () => {
					setTemporaryDate(undefined);
					closeCalendar();
				},
				label: 'انصراف',
			},
			{
				className: 'bg-primary text-white flex-1 rounded-xl h-12', // rmdp-button rmdp-action-button
				onClick: () => {
					if (temporaryDate) {
						handleChange(temporaryDate, true);
						setTemporaryDate(undefined);
					}
					closeCalendar();
				},
				label: 'تایید',
			},
		];

	console.log(temporaryDate);

	function renderButtons() {
		return (
			<div className='flex w-full items-center justify-between text-14'>
				{buttons.map(({ className, label, ...props }, index) => (
					<button key={index} {...props} className={`${className} text-14`}>
						{label}
					</button>
				))}
			</div>
		);
	}

	// if (!isMobileMode && ref.current.mobile) ref.current = { ...ref.current, mobile: false };

	formattingIgnoreList = stringify(formattingIgnoreList);
	format = getFormat(onlyMonthPicker, onlyYearPicker, format);

	[calendar, locale] = check(calendar, locale);

	useEffect(() => {
		function handleClickOutside(event) {
			// if (!isVisible || ref.current.mobile) return;
			/**
			 * Due to the fact that by activating the portal mode,
			 * the calendar element is moved out of the date picker container,
			 * it is not possible to detect external clicks using the datePickerRef.
			 * Therefore, inputRef and calendarRef can be checked separately.
			 *
			 * If the clicked area is outside of both the input and calendar elements,
			 * the calendar should be closed.
			 */
			let outsideList = [];

			[inputRef.current, calendarRef.current].forEach((element) => {
				if (
					element &&
					!element.contains(event.target) &&
					!event.target.classList.contains('b-deselect')
				) {
					outsideList.push(element);
				}
			});

			if (outsideList.length === 2) return closeCalendar();

			if (calendarRef.current && calendarRef.current.contains(event.target)) {
				datePickerRef.current.removeTransition();
				datePickerRef.current.refreshPosition();
			}
		}

		function handleScroll() {
			if (hideOnScroll && isVisible) closeCalendar();
		}

		document.addEventListener('click', handleClickOutside, false);
		document.addEventListener('scroll', handleScroll, true);

		return () => {
			document.removeEventListener('click', handleClickOutside, false);
			document.removeEventListener('scroll', handleScroll, true);
		};
	}, [closeCalendar, outerRef, isVisible, hideOnScroll]);

	useEffect(() => {
		let date = value,
			{ date: refDate, initialValue } = ref.current,
			getLastDate = () => date[date.length - 1];

		function checkDate(date) {
			if (!date) return;
			if (!(date instanceof DateObject))
				date = new DateObject({ date, calendar, locale, format });

			if (date.calendar !== calendar) date.setCalendar(calendar);

			date.set({
				weekDays,
				months,
				digits,
				locale,
				format,
				ignoreList: JSON.parse(formattingIgnoreList),
			});

			return date;
		}

		if (!value && !initialValue && refDate) {
			date = refDate;
		} else if (initialValue && !value) {
			initialValue = undefined;
		}

		if (isArray(date)) {
			if (!isArray(date)) date = [date];

			date = date.map(checkDate).filter((value) => value !== undefined);

			setStringDate(getStringDate(date));
		} else {
			if (isArray(date)) date = getLastDate();

			date = checkDate(date);

			if (document.activeElement !== getInput(inputRef)) {
				setStringDate(date ? date.format() : '');
			}
		}

		ref.current = {
			...ref.current,
			date,
			initialValue: initialValue || value,
		};

		if (ref.current.mobile && datePickerRef.current.isOpen) {
			setTemporaryDate(date);
		} else {
			setDate(date);
		}
	}, [value, calendar, locale, format, weekDays, months, digits, formattingIgnoreList]);

	useEffect(() => {
		/**
		 * If the locale is non-English, after manually changing the input value,
		 * the caret position jumps to the end of the input.
		 * To solve this issue, we save the previous position of caret in the ref,
		 * and in this effect, we recover it.
		 */
		let { selection } = ref.current;

		if (!selection) return;
		/**
		 * If the caret position is undefined, there is no reason to get the input.
		 * So we only get the input if the caret position is available.
		 */
		let input = getInput(inputRef);

		if (!input) return;

		ref.current.selection = undefined;
		/**
		 * after manually changing the month by typing in the input,
		 * if the calendar position is in top of the input
		 * and the number of days in the new month is greater than the number of days in the previous month,
		 * the calendar will cover the input due to its larger size.
		 * To resolve this issue, we refresh the calendar position here.
		 */
		datePickerRef.current.refreshPosition();
	}, [stringDate]);

	return (
		<ElementPopper
			ref={setRef}
			element={renderInput()}
			popper={isVisible && renderCalendar()}
			active={isCalendarReady}
			position={calendarPosition}
			zIndex={zIndex}
			onChange={onPositionChange}
			containerClassName={`rmdp-container font-iranyekan ${containerClassName}`}
			arrowClassName={[
				// 'rmdp-ep-arrow',
				className,
				arrowClassName,
			].join(' ')}
			{...otherProps}
		/>
	);

	function setRef(element) {
		if (element) {
			element.openCalendar = () => setTimeout(() => openCalendar(), 10);
			element.closeCalendar = closeCalendar;
			element.isOpen = isVisible && isCalendarReady;
		}

		datePickerRef.current = element;

		if (outerRef instanceof Function) return outerRef(element);
		if (outerRef) outerRef.current = element;
	}

	function renderInput() {
		return (
			<div className='flex flex-col items-start gap-1'>
				<label className='text-14'>{inputLable}</label>
				<input
					ref={inputRef}
					type='text'
					value={stringDate}
					// value={value}
					name={name}
					title={title}
					required={required}
					onFocus={openCalendar}
					className={
						inputClass ||
						'h-12 w-36 rounded-xl border-1.5 border-secondary300 text-center text-16 tracking-widest'
					} // rmdp-input
					placeholder={placeholder}
					onChange={handleValueChange}
					autoComplete='off'
					disabled={disabled ? true : false}
					inputMode={inputMode}
				/>
			</div>
		);
	}

	function renderCalendar() {
		return (
			<Calendar
				ref={calendarRef}
				value={temporaryDate || date}
				onChange={handleChange}
				calendar={calendar}
				locale={locale}
				format={format}
				className={className}
				weekDays={weekDays}
				months={months}
				digits={digits}
				minDate={minDate}
				maxDate={maxDate}
				formattingIgnoreList={JSON.parse(formattingIgnoreList)}
				onPropsChange={onPropsChange}
				shadow={shadow}
				onReady={setCalendarReady}
				DatePicker={datePickerRef.current}
				datePickerProps={datePickerProps}
				onFocusedDateChange={handleFocusedDate}
				weekPicker={weekPicker}
				{...otherProps}>
				{children}
				{renderButtons()}
			</Calendar>
		);
	}

	function openCalendar() {
		if (disabled || onOpen?.() === false) return;

		if (mustPickNewDate()) {
			let date = new DateObject({
				calendar,
				locale,
				format,
				months,
				weekDays,
				digits,
				ignoreList: JSON.parse(formattingIgnoreList),
			});

			if ((!minDate || date > minDate) && (!maxDate || date < maxDate)) {
				handleChange(date);
				onPropsChange?.({ ...datePickerProps, value: date });

				ref.current.date = date;
			}
		}

		let input = getInput(inputRef);

		if (input) input.blur();

		if (input || !isVisible) {
			setIsVisible(true);
		} else {
			closeCalendar();
		}
	}

	function mustPickNewDate() {
		return onOpenPickNewDate && !value && !ref.current.date;
	}

	function handleChange(date, force) {
		if (!force) return setTemporaryDate(date);

		setDate(date);

		ref.current = { ...ref.current, date };

		onChange?.(date);

		if (date) setStringDate(getStringDate(date));
	}

	function handleValueChange(e) {
		if (isArray(date) || !editable) return;

		ref.current.selection = e.target.selectionStart;

		let value = e.target.value,
			object = {
				calendar,
				locale,
				format,
				ignoreList: JSON.parse(formattingIgnoreList),
			};

		digits = isArray(digits) ? digits : locale.digits;

		if (!value) {
			setStringDate('');

			return handleChange(null);
		}

		if (!digits) return;

		let newDate;
		/**
		 * Given that the only valid date is the date that has all three values ​​of the day, month, and year.
		 * To generate a new date, we must check whether the day, month, and year
		 * are defined in the format or not.
		 */
		if (/(?=.*Y)(?=.*M)(?=.*D)/.test(format)) {
			/**
			 * If the above condition is true,
			 * we generate a new date from the input value.
			 */
			newDate = new DateObject({
				...object,
				date: value,
			});
		} else {
			/**
			 * Otherwise, we generate today's date and replace the input value ​​with today's values.
			 * For example, if we are only using the TimePicker and the input value follows the format "HH:mm",
			 * if we generate a new date from the format "HH:mm", given that the values ​​of the day, month, and year
			 * do not exist in the input value, an invalid date will be generated.
			 * Therefore, it is better to generate today's date and replace only the hour and minute with today's values.
			 */
			newDate = new DateObject(object).parse(value);
		}

		handleChange(newDate.isValid ? newDate : null);
		setStringDate(toLocaleDigits(value, digits));
	}

	function setCalendarReady() {
		setIsCalendarReady(true);

		// if (!isMobileMode) return;

		let popper = calendarRef.current.parentNode.parentNode;

		popper.className = 'rmdp-calendar-container-mobile';
		popper.style.position = 'fixed';
		popper.style.transform = '';

		setTimeout(() => {
			popper.style.visibility = 'visible';
		}, 5000);
	}

	function handleFocusedDate(focusedDate, clickedDate) {
		onFocusedDateChange?.(focusedDate, clickedDate);
	}
};

export default forwardRef(DatePicker);

function getInput(inputRef) {
	if (!inputRef.current) return;

	return inputRef.current.tagName === 'INPUT'
		? inputRef.current
		: inputRef.current.querySelector('input');
}
