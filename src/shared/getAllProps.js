import isSameDate from './isSameDate';

const getAllProps = (object, state, showOtherDays, mapDays) => {
	if (!object.current && !showOtherDays) return {};
	let { today } = state;

	let allProps = {};

	mapDays.forEach((fn) => {
		let props = fn({
			date: object.date,
			today,
			currentMonth: state.date.month,
			selectedDate: state.selectedDate,
			isSameDate,
		});

		if (props?.constructor !== Object) props = {};
		if (props.disabled || props.hidden) object.disabled = true;
		if (props.hidden) object.hidden = true;

		allProps = {
			...allProps,
			...props,
		};
	});

	delete allProps.disabled;
	delete allProps.hidden;

	return allProps;
};

export default getAllProps;
