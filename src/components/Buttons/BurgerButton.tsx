import { BurgerIcon } from "../Icons/Icons";

export const BurgerButton = (props = {}) => {
  return (
    <button
      className="mt-0.5 min-w-28 min-h-28 text-grey-100 hover:text-primary-900 active:text-primary-80 focus:outline-primary-800"
      {...props}
    >
      <BurgerIcon fill="currentColor" />
    </button>
  );
};
