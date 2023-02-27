import { Fragment, useState, useMemo } from 'react';
import { Listbox, Transition } from '@headlessui/react';

// components
import DateObject from 'react-date-object';
import toLocaleDigits from '../../common/toLocaleDigits';

// icons
import { ReactComponent as ArrowDown } from '../../assets/svg/arrow-down.svg';

// styles
import styles from './YearPicker.module.css';

const YearPicker = ({ state, onChange, handleFocusedDate, onYearChange }) => {
	const { date, today, minDate, maxDate, selectedDate, onlyShowInRangeDates, year } = state,
		digits = date.digits;

	const [selectedYear, setSelectedYear] = useState(today.year);

	const changeHandler = (e) => {
		setSelectedYear(e);
	};

	let minYear = today.year - 4;

	minYear = minYear - 12 * Math.ceil((minYear - year) / 12);

	const notInRange = (year) => {
		return (minDate && year < minDate.year) || (maxDate && year > maxDate.year);
	};

	const years = useMemo(() => {
		let years = [],
			year = minYear;

		for (let j = 0; j < 10; j++) {
			years.push(year);
			year++;
		}

		return years;
	}, [minYear]);

	const selectYear = (year) => {
		if (notInRange(year)) return;

		let date = new DateObject(state.date).setYear(year);

		if (minDate && date.monthIndex < minDate.monthIndex) {
			date = date.setMonth(minDate.monthIndex + 1);
		} else if (maxDate && date.monthIndex > maxDate.monthIndex) {
			date = date.setMonth(maxDate.monthIndex + 1);
		}

		onChange(selectedDate, {
			...state,
			date,
			selectedDate,
			selectedYear,
			mustShowYearPicker: false,
		});
		console.log(selectedDate.year);
	};

	const getClassName = (year) => {
		let names = ['rmdp-day'];
		// { date, selectedDate } = state;

		if (notInRange(year)) names.push('text-secondary400'); // rmdp-disabled

		if (names.includes('text-secondary400') && onlyShowInRangeDates) return; // rmdp-disabled

		if (today.year === year) names.push('text-primary'); // rmdp-today

		if (year === date.year) names.push('text-primary'); // rmdp-selected

		return names.join(' ');
	};

	return (
		<div dir='rtl'>
			{/* <Listbox value={selectedYear} onChange={(e) => changeHandler(e)}> */}
			<Listbox value={selectedDate.year} onChange={(e) => changeHandler(e)}>
				<div className='relative mt-1'>
					<Listbox.Button className='relative flex w-auto cursor-pointer items-center gap-4 bg-white py-2 text-15'>
						<span className='block truncate'>{selectedYear}</span>
						<ArrowDown />
					</Listbox.Button>

					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
						className={styles.scrollbar_hidden}>
						<Listbox.Options className='absolute h-60 w-36 overflow-y-scroll rounded-md border-1 border-secondary300 bg-white py-1 text-15 shadow-calendar focus:outline-none'>
							{years.map((year, index) => (
								<Listbox.Option
									key={index}
									value={year}
									disabled={notInRange(year)}
									onClick={() => selectYear(year)}
									className={({ active }) =>
										`${getClassName(
											year
										)} relative flex cursor-pointer select-none flex-col items-start py-2 pr-4 disabled:text-secondary400 ${
											active ? 'text-primary' : 'text-secondary800'
										}`
									}>
									{({ selected }) => (
										<span
											className={`truncate font-medium ${
												selected ? 'text-primary' : ''
											}`}>
											{toLocaleDigits(year.toString(), digits)}
										</span>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
};

export default YearPicker;
