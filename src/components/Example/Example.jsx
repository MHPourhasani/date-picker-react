import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useMemo } from 'react';

// components
import DateObject from 'react-date-object';
import toLocaleDigits from '../../common/toLocaleDigits';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const Example = ({ state, onChange, handleFocusedDate, onYearChange }) => {
	const { date, today, minDate, maxDate, onlyYearPicker, onlyShowInRangeDates, year } = state,
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

		for (var j = 0; j < 10; j++) {
			years.push(year);
			year++;
		}

		return years;
	}, [minYear]);

	const selectYear = (year) => {
		if (notInRange(year)) return;

		let date = new DateObject(state.date).setYear(year),
			{ selectedDate, focused } = state;

		if (minDate && date.monthIndex < minDate.monthIndex) {
			date = date.setMonth(minDate.monthIndex + 1);
		} else if (maxDate && date.monthIndex > maxDate.monthIndex) {
			date = date.setMonth(maxDate.monthIndex + 1);
		}

		onChange(onlyYearPicker ? selectedDate : undefined, {
			...state,
			date,
			focused,
			selectedDate,
			mustShowYearPicker: false,
		});
	};

	const getClassName = (year) => {
		let names = ['rmdp-day'],
			{ date, selectedDate } = state;

		if (notInRange(year)) names.push('text-secondary400'); // rmdp-disabled

		if (names.includes('text-secondary400') && onlyShowInRangeDates) return; // rmdp-disabled

		if (today.year === year) names.push('rmdp-today text-primary'); // text-primary

		if (!onlyYearPicker) {
			if (year === date.year) names.push('rmdp-selected bg-primary text-white rounded-md');
		}

		return names.join(' ');
	};

	return (
		<div dir='rtl'>
			<Listbox value={selectedYear} onChange={(e) => changeHandler(e)}>
				<div className='relative mt-1'>
					<Listbox.Button className='relative flex w-auto cursor-pointer items-center gap-4 bg-white py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'>
						<span className='block truncate'>{selectedYear}</span>
						<IoIosArrowDown className='text-gray-400 h-auto w-4' aria-hidden='true' />
					</Listbox.Button>

					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'>
						<Listbox.Options className='absolute max-h-60 w-28 overflow-y-scroll rounded-md bg-white py-1 text-15 shadow-calendar border-secondary300 border-1 focus:outline-none'>
							{years.map((year, index) => (
								<Listbox.Option
									key={index}
									value={year}
									onClick={() => selectYear(year)}
									className={({ active }) =>
										`relative flex cursor-pointer select-none flex-col items-start py-2 pr-4 ${
											active ? 'text-primary' : 'text-secondary800'
										}`
									}>
									{({ selected }) => (
										<span
											className={`block truncate font-medium ${
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

export default Example;
