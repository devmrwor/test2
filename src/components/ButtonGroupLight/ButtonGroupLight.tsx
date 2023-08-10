import classNames from "classnames";

interface ButtonGroupProps {
  buttons: ButtonGroupButton[];
}

export interface ButtonGroupButton {
  text: string;
  isActive: boolean;
  onClick?: () => void;
}

export const ButtonGroupLight = ({ buttons }: ButtonGroupProps) => {
  return (
    <div className="flex justify-between items-center bg-border-light rounded-lg gap-1 p-0.75 w-full">
      {buttons.map(({ text, onClick = () => {}, isActive }) => (
        <button
          key={text}
          type="button"
          className={classNames(
            "text-large rounded-small text-center h-8 grow transition-all text-text-primary",
            isActive ? "bg-white" : "bg-transparent"
          )}
          onClick={onClick}
        >
          {text}
        </button>
      ))}
    </div>
  );
};
