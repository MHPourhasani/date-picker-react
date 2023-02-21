import WeekDays from '../WeekDays/WeekDays';
import getAllProps from '../../utils/getAllProps';
import isSameDate from '../../common/isSameDate';

const ShowDayPicker = ({
	months,
	state,
	customWeekDays,
	weekStartDayIndex,
	mustDisplayDay,
	getClassName,
	numberOfMonths,
	selectDay,
	selectedDate,
	mapDays,
	showOtherDays,
}) => {
	return (
		<div className='mt-8 w-full'>
			{months.map((weeks, monthIndex) => (
				<div key={monthIndex} className='w-full'>
					<WeekDays
						state={state}
						customWeekDays={customWeekDays}
						weekStartDayIndex={weekStartDayIndex}
					/>
					{weeks.map((week, index) => (
						<div
							// هر هفته
							key={index}
							className='flex w-full items-center justify-between'>
							{/* rmdp-week */}
							{/* یک هفته */}
							{week.map((object, i) => {
								//To clear the properties which are added from the previous render
								object = {
									date: object.date,
									day: object.day,
									current: object.current,
								};

								// let allProps = getAllProps(object),
								// let allProps = getAllProps(object, state, showOtherDays, mapDays),
								let allProps = getAllProps(object, state, mapDays),
									mustAddClassName = mustDisplayDay(object) && !object.disabled,
									// mustAddClassName = !object.disabled,
									className = ``,
									children = allProps.children;

								if (mustAddClassName)
									className = `${className} ${allProps.className || ''}`;

								delete allProps.className;
								delete allProps.children;

								let parentClassName = getClassName(object, numberOfMonths);

								return (
									<div
										// یک روز
										key={i}
										className={`cursor-pointer text-secondary800 ${parentClassName} text-14`}
										onClick={() => {
											if (!mustDisplayDay(object) || object.disabled) return;
											selectDay(object, monthIndex, numberOfMonths);
										}}>
										<span
											className={`${className} flex h-12 w-12 items-center justify-center rounded-xl text-14 hover:border-1.5 hover:border-primary`}
											{...allProps}>
											{mustDisplayDay(object) && !object.hidden
												? children ?? object.day
												: ''}
										</span>
									</div>
								);
							})}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default ShowDayPicker;
