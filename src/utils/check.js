const check = (calendar, locale) => {
	if (calendar && calendar.constructor !== Object) {
		calendar = undefined;
	}

	if (locale && locale.constructor !== Object) {
		locale = undefined;
	}

	return [calendar, locale];
};

export default check;
