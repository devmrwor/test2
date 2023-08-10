import classNames from 'classnames';
import { CaretDown } from '@/components/Icons/Icons';
import { Stack, Tooltip } from '@mui/material';

interface TableLabelProps {
  children: string;
  position?: 'left' | 'center';
  sortOrder?: 'asc' | 'desc';
  onClick?: () => void;
  isActive?: boolean;
  labelTip?: string;
}

export const TableLabel = ({
  children,
  position = 'left',
  onClick,
  sortOrder = 'asc',
  isActive = false,
  labelTip = '',
}: TableLabelProps) => {
  return (
    <div
      className={classNames(
        'h-full w-full flex items-center',
        position === 'center' ? 'justify-center' : 'justify-start',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick ?? (() => {})}
    >
      <Tooltip title={labelTip} arrow enterDelay={1000}>
        <p
          className={classNames(
            'text-text-secondary decoration-text-secondary whitespace-nowrap hover:text-primary-900 hover:decoration-primary-900',
            isActive && 'underline'
          )}
        >
          {children}
        </p>
      </Tooltip>
      {isActive && (
        <Stack
          as="span"
          className={classNames('flex ml-1 h-3 text-primary-900', sortOrder === 'desc' && 'rotate-180')}
          sx={{
            minWidth: '8px',
          }}
        >
          <CaretDown />
        </Stack>
      )}
    </div>
  );
};
