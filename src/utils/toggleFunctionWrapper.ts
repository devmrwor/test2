export const toggleFunctionWrapper = (
  setterFunc: (value: boolean) => void,
  userUpdateFunc: (value: boolean) => void
) => {
  const updateValue = (value: boolean) => {
    console.log('value', value);
    setterFunc(value);
    userUpdateFunc(value);
  };
  return updateValue;
};
