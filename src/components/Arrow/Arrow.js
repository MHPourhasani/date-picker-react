import { ReactComponent as ArrowRight } from '../../assets/svg/arrow-right.svg';

const Arrow = ({ direction, onClick, disabled }) => {
	return (
		<span
			className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full hover:text-primary ${direction} ${
				disabled ? 'hover:text-secondary400' : ''
			}`}
			onClick={onClick}>
			{direction === 'right' ? (
				<ArrowRight className='rotate-180' />
			) : (
				<ArrowRight className='' />
			)}
		</span>
	);
};

export default Arrow;
