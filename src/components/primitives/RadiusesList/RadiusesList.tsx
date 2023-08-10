import { useTranslation } from "next-i18next";

interface RadiusesListProps {
  active: string;
  list: string[];
  onChange: (radius: string) => void;
}

export const RadiusesList = ({ active, list, onChange }: RadiusesListProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      {list.map((radius: string) => (
        <button
          key={radius}
          type="button"
          onClick={() => onChange(radius)}
          className={`transition-all px-1.5 py-1 text-sm border rounded-md ${
            active === radius
              ? "bg-primary-100 text-white border-primary-100"
              : "bg-background text-text-secondary  border-text-secondary hover:bg-primary-100 hover:text-white hover:border-primary-100"
          }`}
        >
          {t("distance", { distance: radius })}
        </button>
      ))}
    </div>
  );
};
