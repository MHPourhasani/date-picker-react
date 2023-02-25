const getAllProps = (object, state) => {
	// if (!object.current && !showOtherDays) return {};
	if (!object.current) return {};
	let { today } = state;

	let allProps = {};

	delete allProps.disabled;
	delete allProps.hidden;

	return allProps;
};

export default getAllProps;
