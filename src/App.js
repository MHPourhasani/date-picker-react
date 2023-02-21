import { useState } from 'react';

import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DatePicker from './components/DatePicker/DatePicker';

const App = () => {
	const [value, setValue] = useState(new Date());

	return (
		<div dir='rtl' className='flex w-full flex-col items-center justify-center'>
			<DatePicker
				value={value}
				onChange={setValue}
				calendar={persian}
				locale={persian_fa}
				maxDate={new Date()}
				inputLable='تاریخ'
				calendarStyle='bg-white shadow-calendar h-auto flex flex-col text-sm justify-between items-center rounded-md p-10 text-center'
				allDayStyles='w-12 h-12 flex justify-center items-center cursor-pointer text-secondary800'
				todayStyle='text-primary'
			/>
		</div>
	);
};

export default App;
