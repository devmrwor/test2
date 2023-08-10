import classNames from "classnames";

interface TabsGroupProps {
  buttons: TabsGroupButton[];
}

export interface TabsGroupButton {
  text: string;
  isActive: boolean;
  onClick?: () => void;
}

export const TabsGroup = ({ buttons }: TabsGroupProps) => {
  return (
    <div className="flex justify-between items-center  rounded-lg  p-0.5 w-full">
      {buttons.map(({ text, onClick = () => {}, isActive }) => (
        <button
          key={text}
          type="button"
          className={classNames(
            "text-large text-center h-10 grow transition-all border-border-light",
            isActive
              ? "text-text-primary rounded-tl-small rounded-tr-small border-l-2 border-t-2 border-r-2"
              : "text-text-secondary border-b-2"
          )}
          onClick={onClick}
        >
          {text}
        </button>
      ))}
    </div>
  );
};
