const getStringDate = (date) => {
	date.toString = function () {
		return this.filter(Boolean);
	};

	return date;
};

export default getStringDate;
