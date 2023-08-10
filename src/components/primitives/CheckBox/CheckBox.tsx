export const Checkbox = ({ ...props }) => {
  return (
    <div className="flex items-center justify-center">
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="hidden" {...props} />
        <span className="h-4 w-4 border border-primary rounded-sm mr-2 flex-shrink-0"></span>
      </label>
    </div>
  );
};
