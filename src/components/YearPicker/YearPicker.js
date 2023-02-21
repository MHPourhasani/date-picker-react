import { useMemo, useState } from 'react';
import selectDate from '../../utils/selectDate';
import toLocaleDigits from '../../utils/toLocaleDigits';
import DateObject from 'react-date-object';

const YearPicker = ({ state, onChange, handleFocusedDate, onYearChange }) => {
	const { date, today, minDate, maxDate, onlyYearPicker, onlyShowInRangeDates, year } = state,
		digits = date.digits;

	const [selectedYear, setSelectedYear] = useState(today.year);

	const changeHandler = (e) => {
		setSelectedYear(e.target.value);
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

		onYearChange?.(date);

		onChange(undefined, {
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
		<select
			value={selectedYear}
			onChange={(e) => changeHandler(e)}
			// rmdp-year-picker
			className={`absolute top-0 h-auto w-16 bg-white`}>
			{years.map((year, index) => (
				<option
					key={index}
					value={year}
					onClick={() => selectYear(year)}
					// rmdp-ym
					className={`${getClassName(year)} cursor-pointer`}>
					{toLocaleDigits(year.toString(), digits)}
				</option>
			))}
		</select>
	);
};

export default YearPicker;
