import { useState, useEffect, useRef, useCallback, forwardRef } from 'react';

// components
import ElementPopper from 'react-element-popper';
import DateObject from 'react-date-object';
import Calendar from '../Calendar/Calendar';

// utils
import check from '../../utils/check';
import toLocaleDigits from '../../common/toLocaleDigits';
import getStringDate from '../../utils/getStringDate';

// styles
import './DatePicker.css';

const DatePicker = (
	{
		value,
		calendar,
		locale,
		format,
		onChange,
		placeholder,
		required,
		className = '',
		inputClass,
		weekDays,
		months,
		children,
		hideOnScroll,
		minDate,
		maxDate,
		containerClassName = '',
		calendarPosition = 'bottom-right',
		onOpen,
		onClose,
		arrowClassName = '',
		arrow = true,
		fixMainPosition,
		onPositionChange,
		onPropsChange,
		onFocusedDateChange,
		mobileLabels,
		inputLable,
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

	[calendar, locale] = check(calendar, locale);

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
				locale,
				format,
			});

			return date;
		}

		if (!value && !initialValue && refDate) {
			date = refDate;
		} else if (initialValue && !value) {
			initialValue = undefined;
		}

		date = checkDate(date);

		if (document.activeElement !== getInput(inputRef)) {
			setStringDate(date ? date.format() : '');
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
	}, [value, calendar, locale, format, weekDays, months]);

	const renderInput = () => {
		return (
			<div className='flex flex-col items-start gap-1'>
				<label htmlFor='datePickerInput' className='text-14'>
					{inputLable}
				</label>
				<input
					id='datePickerInput'
					ref={inputRef}
					type='text'
					value={stringDate}
					required={required}
					onFocus={openCalendar}
					className={
						inputClass ||
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
			onChange={onPositionChange}
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
				weekDays={weekDays}
				months={months}
				minDate={minDate}
				maxDate={maxDate}
				onPropsChange={onPropsChange}
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

		// 	if ((!minDate || date > minDate) && (!maxDate || date < maxDate)) {
		// 		handleChange(date);
		// 		onPropsChange?.({ ...datePickerProps, value: date });

		// 		ref.current.date = date;
		// 	}
		// }

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

		let value = e.target.value,
			object = {
				calendar,
				locale,
				format,
			};

		if (!value) {
			setStringDate('');
			return handleChange(null);
		}

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
		setStringDate(toLocaleDigits(value));
	}

	function setCalendarReady() {
		setIsCalendarReady(true);
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
