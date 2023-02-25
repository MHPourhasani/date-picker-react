import Arrow from '../Arrow/Arrow';
import YearPicker2 from '../YearPicker2/YearPicker2';

const Header = ({
	state,
	setState,
	disableMonthPicker,
	onChange,
	monthAndYears: [months, years],
}) => {
	let { date, mustShowYearPicker, minDate, maxDate, year, today } = state,
		isPreviousDisable =
			minDate && date.year <= minDate.year && minDate.monthIndex > date.monthIndex - 1,
		isNextDisable =
			maxDate && date.year >= maxDate.year && maxDate.monthIndex < date.monthIndex + 1;

	// let maxYear = today.year + 7;
	// maxYear = maxYear - 12 * Math.floor((maxYear - year) / 12);

	return (
		// rmdp-header
		<div className='flex h-6 w-full items-center justify-between text-15'>
			<span>هجری شمسی</span>

			{months.map((month, index) => (
				<div
					key={index}
					className='flex w-fit items-center justify-between' // rmdp-header-values
				>
					{
						<span className={`flex w-16 cursor-pointer justify-between`}>
							<YearPicker2 state={state} onChange={onChange} />
						</span>
					}
					<span className={`flex w-32 cursor-pointer items-center justify-between`}>
						{getButton('left')}
						{month}
						{getButton('right')}
					</span>
				</div>
			))}
		</div>
	);

	function getButton(direction) {
		let handleClick = () => increaseValue(direction === 'right' ? 1 : -1),
			disabled =
				(direction === 'left' && isPreviousDisable) ||
				(direction === 'right' && isNextDisable);

		return <Arrow direction={direction} onClick={handleClick} disabled={disabled} />;
	}

	function increaseValue(value) {
		if ((value < 0 && isPreviousDisable) || (value > 0 && isNextDisable)) return;

		if (!mustShowYearPicker) {
			date.toFirstOfMonth();

			date.month += value;
		} else {
			year = year + value * 12;

			if (value < 0 && minDate && year < minDate.year) year = minDate.year;
			if (value > 0 && maxDate && year > maxDate.year) year = maxDate.year;
		}

		setState({
			...state,
			date,
			year,
		});
	}
};

export default Header;
