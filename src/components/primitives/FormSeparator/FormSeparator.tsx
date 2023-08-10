import classNames from "classnames";

export const FormSeparator = ({ className }: { className?: string }) => (
  <div className={classNames("w-full border-t border-border-light", className)}></div>
);
