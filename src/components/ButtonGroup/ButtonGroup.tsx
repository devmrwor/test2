import classNames from 'classnames';

interface ButtonGroupProps {
  buttons: ButtonGroupButton[];
}

export interface ButtonGroupButton {
  text: string;
  isActive: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const ButtonGroup = ({ buttons }: ButtonGroupProps) => {
  return (
    <div className="flex justify-between items-center border-1 border-primary-100 bg-primary-50 rounded-md gap-1 p-0.5 w-full">
      {buttons.map(({ text, onClick = () => {}, isActive, disabled }) => (
        <button
          key={text}
          type="button"
          className={classNames(
            'text-sm rounded-small text-center h-8 grow transition-all focus:outline-primary-800',
            isActive
              ? 'text-white bg-primary-100'
              : disabled
              ? 'text-darken-background'
              : 'text-text-primary bg-transparent hover:text-text-secondary'
          )}
          onClick={onClick}
        >
          {text}
        </button>
      ))}
    </div>
  );
};
