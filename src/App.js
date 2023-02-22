import { useState } from 'react';

import DatePicker from './components/DatePicker/DatePicker';

const App = () => {
	const [value, setValue] = useState(new Date());

	return (
		<div dir='rtl' className='flex w-full flex-col items-center justify-center'>
			<DatePicker
				value={value}
				onChange={setValue}
				maxDate={new Date()}
				inputLabel='تاریخ'
				inputLabelClassname='text-14'
				inputClassname='h-12 w-36 rounded-xl border-1.5 border-secondary300 text-center text-16 tracking-widest'
				calendarStyle='bg-white shadow-calendar h-auto flex flex-col text-sm justify-between items-center rounded-md p-10 text-center'
				allDayStyles='w-12 h-12 flex justify-center items-center cursor-pointer text-secondary800'
				todayStyle='text-primary'
			/>
		</div>
	);
};

export default App;
