export const enforceArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
};
