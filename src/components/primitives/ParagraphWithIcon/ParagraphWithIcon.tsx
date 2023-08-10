import { FormControlsWrapper } from "@/components/FormControlsWrapper/FormControlsWrapper";
import classNames from "classnames";

interface ParagraphWithIconProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
  isActive?: boolean;
}

export const ParagraphWithIcon = ({
  icon,
  text,
  className = "",
  isActive = false,
}: ParagraphWithIconProps) => {
  return (
    <FormControlsWrapper
      classes={classNames(
        "gap-2",
        isActive ? "text-green-100" : "text-icon-background",
        className
      )}
      type="left"
    >
      {icon}
      <p className="text-text-primary">{text}</p>
    </FormControlsWrapper>
  );
};
