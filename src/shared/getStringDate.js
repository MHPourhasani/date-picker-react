const getStringDate = (date) => {
	// let selectedDate = [].concat(date).map(toString);
	let selectedDate = date;

	console.log(date);

	selectedDate.toString = function () {
		return this.filter(Boolean);
	};

	return selectedDate;

	function toString(date) {
		return date?.isValid ? date.format() : '';
	}
};

export default getStringDate;
