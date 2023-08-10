import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ChevronDownSmall } from '../Icons/Icons';

interface CustomSelectProps {
	value: string;
	onChange: (event: SelectChangeEvent) => void;
	placeholder: string;
	data: { id: number; name: string }[];
}

export const CustomSelect = ({ value, onChange, placeholder, data }: CustomSelectProps) => {
	const { t } = useTranslation();
	return (
		<Select
			fullWidth
			displayEmpty
			IconComponent={ChevronDownSmall}
			value={value}
			onChange={onChange}
			renderValue={(selected) => {
				if (!selected) {
					return <em>{t(placeholder)}</em>;
				}
				return typeof selected === 'string' && selected;
			}}
			sx={{
				'& .MuiSelect-icon': { top: 15, right: 10 },
				'& .MuiInputBase-input': {
					paddingTop: '6px',
					paddingBottom: '6px',
				},
			}}
		>
			{data.map((el) => (
				<MenuItem key={el.id} value={el.name}>
					{el.name}
				</MenuItem>
			))}
		</Select>
	);
};
