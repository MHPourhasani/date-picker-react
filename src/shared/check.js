import DateObject from 'react-date-object';

const { calendar: gregorian, locale: gregorian_en } = new DateObject();

export default function check(calendar, locale) {
	if (calendar && calendar.constructor !== Object) {
		calendar = undefined;
	}

	if (locale && locale.constructor !== Object) {
		locale = undefined;
	}

	return [calendar || gregorian, locale || gregorian_en];
}