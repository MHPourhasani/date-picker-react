const getStringDate = (date) => {
	// let selectedDate = [].concat(date).map(toString);
	let selectedDate = date;

	selectedDate.toString = function () {
		return this.filter(Boolean);
	};

	return selectedDate;

};

export default getStringDate;
