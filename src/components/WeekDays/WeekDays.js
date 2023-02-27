import { useMemo } from 'react';
import isArray from '../../common/isArray';

const WeekDays = ({
	state: {
		date: { calendar, locale },
	},
	customWeekDays,
	weekStartDayIndex,
	className,
}) => {
	let weekDays = useMemo(() => {
		let weekDays = customWeekDays;

		if (isArray(weekDays) && weekDays.length >= 7) {
			weekDays.length = 7;

			weekDays = weekDays.map((weekDay) => {
				if (isArray(weekDay) & (weekDay.length > 1)) {
					weekDay = weekDay[1];
				} else if (isArray(weekDay)) {
					weekDay = weekDay[0];
				}

				return weekDay;
			});
		}

		return weekDays;
	}, [customWeekDays]);

	weekDays = [...weekDays]
		.slice(weekStartDayIndex)
		.concat([...weekDays].splice(0, weekStartDayIndex));

	return (
		// rmdp-week
		// <div className='flex items-center justify-between text-16 font-medium text-primary'>
		<div className={`flex items-center justify-between text-16 font-medium text-primary ${className}`}>
			{weekDays.map((weekDay, index) => (
				<span key={index} className=''>
					{weekDay}
				</span>
			))}
		</div>
	);
};

export default WeekDays;
