import WeekDays from '../WeekDays/WeekDays';
import getAllProps from '../../utils/getAllProps';

const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const weekStartDayIndex = 0;

const ShowDayPicker = ({
	months,
	state,
	mustDisplayDay,
	getClassName,
	numberOfMonths,
	selectDay,
	selectedDate,
}) => {
	return (
		<div className='my-7 w-[395px]'>
			{months.map((weeks, monthIndex) => (
				<div key={monthIndex} className='w-full flex flex-col items-center justify-center'>
					<WeekDays
						state={state}
						customWeekDays={weekDays}
						weekStartDayIndex={weekStartDayIndex}
						className='w-[380px]'
					/>
					{weeks.map((week, index) => (
						<div
							// هر هفته
							key={index}
							className='flex w-full items-center gap-3 justify-between'>
							{/* rmdp-week */}
							{/* یک هفته */}
							{week.map((object, i) => {
								//To clear the properties which are added from the previous render
								object = {
									date: object.date,
									day: object.day,
									current: object.current,
								};

								let allProps = getAllProps(object, state),
									mustAddClassName = mustDisplayDay(object) && !object.disabled,
									// mustAddClassName = !object.disabled,
									className = ``,
									children = allProps.children;

								if (mustAddClassName)
									className = `${className} ${allProps.className || ''}`;

								delete allProps.className;
								delete allProps.children;

								let parentClassName = getClassName(object);

								return (
									<div
										// یک روز
										key={i}
										className={`text-secondary800 ${parentClassName} mx text-14`}
										onClick={() => {
											if (!mustDisplayDay(object) || object.disabled) return;
											selectDay(object, monthIndex, numberOfMonths);
										}}>
										<span
											className={`${className} flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl text-14 hover:border-1.5 hover:border-primary`}
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
