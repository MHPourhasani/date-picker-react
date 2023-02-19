import DateObject from 'react-date-object';
import getValidProps from '../../shared/getValidProps';
import getLocaleName from '../../shared/getLocaleName';
import './toolbar.css';

const Toolbar = ({
	state,
	handleChange,
	position,
	calendarProps,
	nodes,
	className,
	names,
	sort = ['today', 'انصراف', 'انصراف'],
	handleFocusedDate,
	DatePicker,
	...props
}) => {
	let {
			date: { locale },
		} = state,
		name = {
			fa: { close: 'بستن' },
		},
		localeName = names || name[getLocaleName(locale)],
		classNames = ['rmdp-toolbar', position],
		getButton = (name, index) =>
			({
				

				close: DatePicker && (
					<div key={index} onClick={() => DatePicker.closeCalendar()}>
						{localeName.close}
					</div>
				),
			}[name]);

	return (
		<div className={`${classNames.join(' ')} ${className}`} {...getValidProps(props)}>
			{sort.map(getButton)}
		</div>
	);
};

export default Toolbar;
