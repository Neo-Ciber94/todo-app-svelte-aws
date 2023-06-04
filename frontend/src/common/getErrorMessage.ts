export function getErrorMessage(obj: any): string | null {
  if (obj == null) {
    return null;
  }

  if (obj instanceof Error) {
    return obj.message;
  }

  if (typeof obj === "string") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return getErrorMessage(obj[0]);
  }

  if (obj.message) {
    return getErrorMessage(obj.message);
  }

  if (obj.error) {
    return getErrorMessage(obj.error);
  }

  return null;
}
