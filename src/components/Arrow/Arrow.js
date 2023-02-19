import { IoIosArrowForward } from 'react-icons/io';

const Arrow = ({ direction, onClick, disabled }) => {
	return (
		<span
			className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full hover:text-primary ${direction} ${
				disabled ? 'hover:text-secondary400' : ''
			}`}
			onClick={onClick}>
			{direction === 'right' ? (
				<IoIosArrowForward className='h-auto w-5 rotate-180' />
			) : (
				<IoIosArrowForward className='h-auto w-5' />
			)}
		</span>
	);
};

export default Arrow;
