/**
 * Check if a value is truthy
 *
 * @param value - The value to check
 * @returns True if the value is truthy, false otherwise
 */
export const isTruthy = (value: string | number | boolean | null | undefined): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0 && !Number.isNaN(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    return (
      trimmed !== "" &&
      trimmed !== "false" &&
      trimmed !== "0" &&
      trimmed !== "null" &&
      trimmed !== "undefined" &&
      trimmed !== "nan"
    );
  }

  return false;
};
