import IOSSwitch from '@/components/primitives/IOSswitch';

interface ToggleProps {
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onChange = () => {}, disabled = false, ...props }: ToggleProps) {
  // const getToggleColor = (): string => {
  //   if (disabled && !value) return 'bg-darken-background';
  //   if (!disabled && !value) return 'bg-toggle-background';
  //   if (disabled && value) return 'bg-secondary';
  //
  //   return 'bg-primary-100';
  // };

  return (
    // <button
    //   disabled={disabled}
    //   onClick={() => onChange(!value)}
    //   type="button"
    //   className={classNames('relative min-w-8.75 h-5.75 rounded-3xl transition-all', getToggleColor())}
    // >
    //   <input type="checkbox" className="hidden" {...props} />
    //   <span
    //     className={classNames(
    //       'absolute top-1.5 w-3 h-3 rounded-full transition-all',
    //       value ? 'bg-white right-1.5' : 'bg-white left-1.5'
    //     )}
    //   ></span>
    // </button>
    <IOSSwitch checked={value} disabled={disabled} onChange={() => onChange(!value)} />
  );
}
