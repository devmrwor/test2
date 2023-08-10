import { useLayout } from "@/contexts/layoutContext";
import { Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const Breadcrumbs = () => {
  const { breadcrumbs } = useLayout();
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <MUIBreadcrumbs color="primary" aria-label="breadcrumb">
        {breadcrumbs.map((link, index) => {
          if (index < breadcrumbs.length - 1) {
            return (
              <Link className="text-primary" key={link.name} href={link.route}>
                {t(link.name)}
              </Link>
            );
          } else {
            return (
              <p key={link.name} className="text-text-secondary">
                {t(link.name)}
              </p>
            );
          }
        })}
      </MUIBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
