import { useState, useEffect, useRef, useCallback, forwardRef } from 'react';

// components
import ElementPopper from 'react-element-popper';
import DateObject from 'react-date-object';
import Calendar from '../Calendar/Calendar';

// utils
import toLocaleDigits from '../../common/toLocaleDigits';
import getStringDate from '../../utils/getStringDate';

import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

// styles
import './DatePicker.css';

const DatePicker = ({
	value,
	onChange,
	className = '',
	children,
	minDate,
	maxDate,
	containerClassName = '',
	inputLabel,
	inputLabelClassname,
	inputClassname,
	...otherProps
}) => {
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
			let input = getInput(inputRef);

			if (input) input.blur();

			setIsVisible(false);
			setIsCalendarReady(false);
		}, []),
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

	useEffect(() => {
		let date = value,
			{ date: refDate } = ref.current;

		const checkDate = (date) => {
			if (!(date instanceof DateObject)) date = new DateObject({ date, calendar, locale });
			date.set({ locale });

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
	}, [value, calendar, locale]);

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
					onChange={handleValueChange}
				/>
			</div>
		);
	};

	const setRef = (element) => {
		if (element) {
			element.openCalendar = () => openCalendar();
			element.closeCalendar = closeCalendar;
			element.isOpen = isVisible && isCalendarReady;
		}

		datePickerRef.current = element;
	};

	const renderCalendar = () => {
		return (
			<Calendar
				ref={calendarRef}
				value={temporaryDate || date}
				onChange={handleChange}
				calendar={calendar}
				locale={locale}
				className={className}
				minDate={minDate}
				maxDate={maxDate}
				onReady={() => setIsCalendarReady(true)}
				DatePicker={datePickerRef.current}
				datePickerProps={datePickerProps}
				{...otherProps}>
				{children}
				{renderButtons()}
			</Calendar>
		);
	};

	const openCalendar = () => {
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
	};

	const handleChange = (date, force) => {
		if (!force) return setTemporaryDate(date);

		setDate(date);
		ref.current = { ...ref.current, date };
		onChange?.(date);

		if (date) setStringDate(getStringDate(date));
	};

	const handleValueChange = (e) => {
		ref.current.selection = e.target.selectionStart;

		let value = e.target.value;

		if (!value) {
			setStringDate('');
			return handleChange(null);
		}

		handleChange(null);
		setStringDate(toLocaleDigits(value));
	};

	const getInput = (inputRef) => {
		if (!inputRef.current) return;
		return inputRef.current;
	};

	return (
		<ElementPopper
			ref={setRef}
			element={renderInput()}
			popper={isVisible && renderCalendar()}
			active={isCalendarReady}
			position='bottom-right'
			containerClassName={`z-200 font-iranyekan ${containerClassName}`} // rmdp-container
			{...otherProps}
		/>
	);
};

export default forwardRef(DatePicker);
