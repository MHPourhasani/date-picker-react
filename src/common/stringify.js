import isArray from './isArray';

const stringify = (array) => {
	if (!isArray(array)) array = [];

	return JSON.stringify(array);
};

export default stringify;
