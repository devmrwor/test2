export const getErrorMessage = (err: unknown, alterText = "Bad request") => {
  return {
    message: err instanceof Error ? err.message : alterText,
  };
};
