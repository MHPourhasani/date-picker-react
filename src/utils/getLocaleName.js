const getLocaleName = (locale) => {
	if (!locale || !locale.name) return '';

	return locale.name.split('_')[1];
};

export default getLocaleName;
