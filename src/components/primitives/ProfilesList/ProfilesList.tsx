import { useTranslation } from "next-i18next";

interface RadiusesListProps {
  active: number;
  list: string[];
  onChange: (index: number) => void;
}

export const ProfilesList = ({ active, list, onChange }: RadiusesListProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      {list.map((radius: string, index) => (
        <button
          key={radius}
          type="button"
          onClick={() => onChange(index)}
          className={`transition-all px-1.5 py-1 text-sm rounded-md border border-primary-100 ${
            index === active ? "bg-primary-100 text-white" : "bg-white text-primary-100"
          }`}
        >
          {radius}
        </button>
      ))}
    </div>
  );
};
