import { useMemo, useState } from 'react';
import selectDate from '../../shared/selectDate';
import toLocaleDigits from '../../shared/toLocaleDigits';
import DateObject from 'react-date-object';

const YearPicker = ({ state, onChange, sort, handleFocusedDate, onYearChange, rangeHover }) => {
	const { date, today, minDate, maxDate, onlyYearPicker, range, onlyShowInRangeDates, year } =
			state,
		mustShowYearPicker = state.mustShowYearPicker || onlyYearPicker,
		digits = date.digits,
		[yearHovered, setyearHovered] = useState();

	const [selectedYear, setSelectedYear] = useState(today.year);

	const changeHandler = (e) => {
		setSelectedYear(e.target.value);
	};

	let minYear = today.year - 4;

	minYear = minYear - 12 * Math.ceil((minYear - year) / 12);

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

		if (onlyYearPicker) {
			[selectedDate, focused] = selectDate(date, sort, state);
		} else {
			if (minDate && date.monthIndex < minDate.monthIndex) {
				date = date.setMonth(minDate.monthIndex + 1);
			} else if (maxDate && date.monthIndex > maxDate.monthIndex) {
				date = date.setMonth(maxDate.monthIndex + 1);
			}

			onYearChange?.(date);
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

		// rmdp-disabled
		if (notInRange(year)) names.push('text-secondary400');

		if (names.includes('text-secondary400') && onlyShowInRangeDates) return; // rmdp-disabled

		if (today.year === year) names.push('rmdp-today text-primary'); // text-primary

		if (!onlyYearPicker) {
			if (year === date.year) names.push('rmdp-selected bg-primary text-white rounded-md');
		} else {
			if (!range) {
				if ([].concat(selectedDate).some((date) => date && date.year === year))
					names.push('bg-primary text-white rounded-md'); // rmdp-selected
			}
		}

		return names.join(' ');
	};

	const notInRange = (year) => {
		return (minDate && year < minDate.year) || (maxDate && year > maxDate.year);
	};

	return (
		<select
			value={selectedYear}
			onChange={(e) => changeHandler(e)}
			// rmdp-year-picker
			className={`bg-white absolute top-0 flex h-auto w-24 flex-col items-center justify-center gap-5`}>
			{years.map((year, i) => (
				<option
					key={i}
					value={year}
					onClick={() => selectYear(year)}
					// onMouseLeave={() => rangeHover && setyearHovered()}
					// onMouseEnter={() => rangeHover && setyearHovered(year)}
					// rmdp-ym
					className={`${getClassName(year)} justify-between`}>
					{toLocaleDigits(year.toString(), digits)}
				</option>
			))}
		</select>
	);
};

export default YearPicker;
