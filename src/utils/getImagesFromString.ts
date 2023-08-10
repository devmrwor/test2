export const getImagesFromString = (str: string) => {
  return str
    .split(", ")
    .filter(Boolean)
    .map((image) => image.trim());
};
