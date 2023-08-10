export const SecondaryBaseButton = ({
  Icon,
  text,
  size = 'small',
  disabled = false,
  type = 'link',
  isActive = false,
  activeClass = '',
  textClasses = '',
  color = 'secondary',
  classes = '',
  ...props
}) => {
  const paddingSizes = {
    xs: 'px-1.75 py-0.5',
    small: 'px-2 py-1',
    medium: 'px-3 py-2',
    large: 'px-7 py-2',
  };

  const colors = {
    secondary: disabled
      ? 'bg-transparent text-text-disabled border-text-disabled'
      : 'bg-transparent hover:bg-background hover:border-background active:border-background active:bg-background focus:border-2 focus:border-primary-800 text-text-secondary border-text-secondary',
  };

  const iconColor = type === 'solid' ? '#fff' : '#33a1c9';

  const paddingClass = paddingSizes[size] || paddingSizes.medium;
  const colorClass = colors[color] || colors.primary;
  const activeClasses = isActive ? activeClass || 'bg-primary-900' : '';

  return (
    <button
      type="button"
      disabled={disabled}
      className={`button flex gap-2 items-center border rounded-small ${colorClass} ${paddingClass} ${activeClasses} ${classes}`}
      {...props}
    >
      {Icon && <Icon fill={disabled ? '#e2e2e2' : iconColor} />}
      {text && <span className={textClasses}>{text}</span>}
    </button>
  );
};
