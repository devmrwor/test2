import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

interface ListItemProps {
  link: string;
  Icon?: (params: any) => JSX.Element;
  label: string;
}

export default function ListItem({ link, Icon, label }: ListItemProps) {
  const router = useRouter();
  const isActive = router.asPath.includes(link);

  return (
    <Link
      href={link}
      className={classNames(
        "w-full flex px-4 py-2 items-center hover:text-primary-100 hover:fill-primary-100 cursor-pointer hover:bg-background transition-all",
        isActive ? "text-primary-100 fill-primary-100" : "text-text-secondary fill-text-secondary"
      )}
    >
      {Icon && <Icon fill={"currentColor"} />}
      <div className={classNames("text-base text-inherit", Icon && "ml-2")}>{label}</div>
    </Link>
  );
}
