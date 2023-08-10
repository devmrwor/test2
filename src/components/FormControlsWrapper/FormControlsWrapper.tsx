import classNames from 'classnames';

interface FormControlsWrapperProps {
  type?: 'between' | 'left';
  children: React.ReactNode;
  classes?: string;
  onClick?: () => void;
}

export const FormControlsWrapper = ({ type = 'between', children, classes, onClick }: FormControlsWrapperProps) => (
  <div
    onClick={onClick}
    className={classNames('flex items-center gap-1', type === 'between' && 'justify-between', classes)}
  >
    {children}
  </div>
);
