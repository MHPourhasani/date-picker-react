import { useState, useEffect, useRef, useCallback, forwardRef } from 'react';

// components
import ElementPopper from 'react-element-popper';
import DateObject from 'react-date-object';
import Calendar from '../Calendar/Calendar';

// utils
import check from '../../utils/check';
import toLocaleDigits from '../../common/toLocaleDigits';
import getStringDate from '../../utils/getStringDate';

import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

// styles
import './DatePicker.css';

const DatePicker = (
	{
		value,
		format,
		onChange,
		placeholder,
		className = '',
		children,
		minDate,
		maxDate,
		containerClassName = '',
		calendarPosition = 'bottom-right',
		onOpen,
		onClose,
		onFocusedDateChange,
		inputLabel,
		inputLabelClassname,
		inputClassname,
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
					// setStringDate(getStringDate(date))
					closeCalendar();
				},
				label: 'تایید',
			},
		],
		calendar = persian,
		locale = persian_fa;

	const renderButtons = () => {
		return (
			<div className='flex w-full items-center justify-between text-14'>
				{buttons.map(({ className, label, ...props }, index) => (
					<button key={index} {...props} className={`${className} text-14`}>
						{label}
					</button>
				))}
			</div>
		);
	};

	// if (!isMobileMode && ref.current.mobile) ref.current = { ...ref.current, mobile: false };

	// [calendar, locale] = check(calendar, locale);

	useEffect(() => {
		let date = value,
			{ date: refDate } = ref.current;

		const checkDate = (date) => {
			if (!(date instanceof DateObject))
				date = new DateObject({ date, calendar, locale, format });

			if (date.calendar !== calendar) date.setCalendar(calendar);

			date.set({
				locale,
				format,
			});

			return date;
		};

		if (!value && refDate) {
			date = refDate;
		}

		date = checkDate(date);

		if (document.activeElement !== getInput(inputRef)) {
			setStringDate(date ? date.format() : '');
		}

		ref.current = {
			...ref.current,
			date,
			initialValue: value,
		};

		setDate(date);
	}, [value, calendar, locale, format]);

	const renderInput = () => {
		return (
			<div className='flex flex-col items-start gap-1'>
				<label htmlFor='datePickerInput' className={`${inputLabelClassname}`}>
					{inputLabel}
				</label>
				<input
					id='datePickerInput'
					ref={inputRef}
					type='text'
					value={stringDate}
					onFocus={openCalendar}
					className={
						inputClassname ||
						'h-12 w-36 rounded-xl border-1.5 border-secondary300 text-center text-16 tracking-widest'
					} // rmdp-input
					placeholder={placeholder}
					onChange={handleValueChange}
				/>
			</div>
		);
	};

	return (
		<ElementPopper
			ref={setRef}
			element={renderInput()}
			popper={isVisible && renderCalendar()}
			active={isCalendarReady}
			position={calendarPosition}
			containerClassName={`z-200 font-iranyekan ${containerClassName}`} // rmdp-container
			{...otherProps}
		/>
	);

	function setRef(element) {
		if (element) {
			element.openCalendar = () => openCalendar();
			element.closeCalendar = closeCalendar;
			element.isOpen = isVisible && isCalendarReady;
		}

		datePickerRef.current = element;

		if (outerRef instanceof Function) return outerRef(element);
		if (outerRef) outerRef.current = element;
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
				minDate={minDate}
				maxDate={maxDate}
				onReady={setCalendarReady}
				DatePicker={datePickerRef.current}
				datePickerProps={datePickerProps}
				onFocusedDateChange={handleFocusedDate}
				{...otherProps}>
				{children}
				{renderButtons()}
			</Calendar>
		);
	}

	function openCalendar() {
		if (onOpen?.() === false) return;

		if ((!minDate || date > minDate) && (!maxDate || date < maxDate)) {
			handleChange(date);
			ref.current.date = date;
		}

		let input = getInput(inputRef);

		if (input) input.blur();

		if (input || !isVisible) {
			setIsVisible(true);
		} else {
			closeCalendar();
		}
	}

	function handleChange(date, force) {
		if (!force) return setTemporaryDate(date);

		setDate(date);

		ref.current = { ...ref.current, date };

		onChange?.(date);

		if (date) setStringDate(getStringDate(date));
	}

	function handleValueChange(e) {
		ref.current.selection = e.target.selectionStart;

		let value = e.target.value;

		if (!value) {
			setStringDate('');
			return handleChange(null);
		}

		handleChange(null);
		setStringDate(toLocaleDigits(value));
	}

	function setCalendarReady() {
		setIsCalendarReady(true);
	}

	function handleFocusedDate(focusedDate, clickedDate) {
		onFocusedDateChange?.(focusedDate, clickedDate);
	}
};

function getInput(inputRef) {
	if (!inputRef.current) return;

	return inputRef.current.tagName === 'INPUT'
		? inputRef.current
		: inputRef.current.querySelector('input');
}

export default forwardRef(DatePicker);
