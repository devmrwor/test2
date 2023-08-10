export const uniteValues = (value: string, additional_values: string[]) => {
  return []
    .concat(value, additional_values)
    .filter(Boolean)
    .map((value, id) => ({ id, value }));
};

export const uniteSimpleValues = (value: string, additional_values: string[]) => {
  return [].concat(value, additional_values).filter(Boolean);
};
