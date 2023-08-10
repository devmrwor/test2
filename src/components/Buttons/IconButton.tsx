import Link from "next/link";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  Icon?: (params: any) => JSX.Element;
  text: string;
}

export const IconButton = ({ href, Icon, text, ...props }: IconButtonProps) => {
  return href ? (
    <Link href={href} passHref>
      <button
        type="button"
        className="h-9.5 rounded-md bg-white grow px-4 text-primary-100 border-primary-100 border hover:bg-primary-100 hover:text-white transition-all"
        {...props}
      >
        <div className="flex gap-2 items-center">
          {Icon && <Icon fill="currentColor" />}
          <span className=""> {text}</span>
        </div>
      </button>
    </Link>
  ) : (
    <button
      type="button"
      className="h-9.5 rounded-md bg-white grow px-4 text-primary-100 border-primary-100 border hover:bg-primary-100 hover:text-white transition-all"
      {...props}
    >
      <div className="flex gap-2 items-center">
        {Icon && <Icon fill="currentColor" />}
        <span className=""> {text}</span>
      </div>
    </button>
  );
};
