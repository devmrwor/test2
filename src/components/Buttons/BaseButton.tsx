export const BaseButton = ({
  Icon,
  text,
  size = 'small',
  disabled = false,
  type = 'link',
  isActive = false,
  activeClass = '',
  textClasses = '',
  color = 'primary',
  classes = '',
  ...props
}) => {
  const paddingSizes = {
    xs: 'px-1.75 py-0.5',
    small: 'px-2 py-1',
    md: 'px-5 py-1.5',
    medium: 'px-3 py-2',
    large: 'px-7 py-2',
  };

  const fontSizes = {
    xs: 'text-sm',
  };

  const colors = {
    primary:
      type === 'solid'
        ? 'bg-primary-100 hover:bg-primary-900 active:bg-primary-80 focus:bg-primary-300 text-white'
        : 'bg-white hover:bg-primary-200 active:bg-primary-300 text-primary-100 focus:bg-white focus:border-primary-800',
    success:
      type === 'solid'
        ? disabled
          ? 'bg-text-disabled text-grey-0 border-text-disabled'
          : 'bg-green-100 hover:bg-green-400 active:bg-green-200 focus:bg-green-400 text-white'
        : disabled
        ? 'text-grey-0 border-text-disabled bg-transparent'
        : 'bg-white hover:bg-green-50 active:bg-green-80 text-green-100',
  };

  const fills = {
    solid: color === 'primary' ? 'border-primary-100' : 'border-green-100',
    outline: color === 'primary' ? 'border-primary-100' : 'border-green-100',
    link: 'border-transparent',
  };

  const iconColor = type === 'solid' ? '#fff' : '#33a1c9';

  const fontSizeClass = fontSizes[size] || 'text-base';
  const paddingClass = paddingSizes[size] || paddingSizes.medium;
  const colorClass = colors[color] || colors.primary;
  const fillClass = fills[type] || fills.link;
  const disabledClass = disabled
    ? type === 'solid'
      ? 'text-grey-0 cursor-not-allowed'
      : 'text-text-disabled cursor-not-allowed'
    : 'outline-primary-800';
  const activeClasses = isActive ? activeClass || 'bg-primary-900' : '';

  return (
    <button
      type="button"
      disabled={disabled}
      className={`button flex gap-2 items-center border rounded-small ${fillClass} ${colorClass} ${paddingClass} ${disabledClass} ${fontSizeClass} ${activeClasses} ${classes}`}
      {...props}
    >
      {Icon && <Icon fill={disabled ? '#e2e2e2' : iconColor} />}
      {text && <span className={textClasses}>{text}</span>}
    </button>
  );
};
