import { useState } from 'react';

import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from './components/DatePicker/DatePicker';
import Calendar from './components/Calendar/Calendar';

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
			<p className='mt-96 p-96'>shashsfdgsfh</p>
			{/* <Calendar
				value={value}
				onChange={setValue}
				weekDays={weekDays}
				calendar={persian}
				locale={persian_fa}
				maxDate={new Date()}
				calendarStyle='w-1/2 bg-white shadow-sm h-auto flex text-sm justify-between items-center rounded-md bg-white p-10 text-center font-iranyekan'
				allDayStyles='w-12 h-12 flex justify-center items-center cursor-pointer text-secondary800'
				todayStyle='text-primary'
				oneDaySelectStyle='text-black bg- rounde '
			/> */}
		</div>
	);
};

export default App;
