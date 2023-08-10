interface IconButtonWrapProps {
	icon: React.ReactNode;
	onClick: () => void;
	classes?: string;
}

export const IconButtonWrap = ({ icon, onClick, classes }: IconButtonWrapProps) => {
	return (
		<button className={classes} onClick={onClick}>
			{icon}
		</button>
	);
};
