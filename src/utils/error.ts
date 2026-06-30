/**
 * API validation error shape: either array of single-key objects or flat record.
 * Example: [{ weight: ["msg1"] }, { measurement: ["msg2"] }] or { weight: ["msg1"], measurement: ["msg2"] }
 */
type RawValidationErrors = Record<string, string[]> | Array<Record<string, string[]>>;

function isValidationErrorShape(
  value: unknown
): value is { message?: string; errors: RawValidationErrors } {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  if (!obj.errors || typeof obj.errors !== "object") return false;
  if (Array.isArray(obj.errors)) {
    return obj.errors.every(
      (item) => typeof item === "object" && item !== null && !Array.isArray(item)
    );
  }
  return typeof obj.errors === "object";
}

function normalizeFieldErrors(raw: RawValidationErrors): Record<string, string[]> {
  if (Array.isArray(raw)) {
    return Object.assign(
      {},
      ...raw.map((item) => (typeof item === "object" && item !== null ? item : {}))
    );
  }
  return raw;
}

/** Accepts any form with setError (e.g. react-hook-form) so caller does not need type assertion */
type FormWithSetError = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accept RHF's typed setError without cast
  setError: (name: any, error: { type?: string; message: string }) => void;
};

/** Human-readable message for API rejects (plain objects), Error, or string */
export function getErrorMessage(error: unknown, defaultMessage = "Something went wrong"): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return defaultMessage;
}

/**
 * Parses API validation error response, applies field errors to the form.
 * Handles both formats: errors as array of objects or as Record<string, string[]>.
 *
 * @param form - Form instance with setError (e.g. from useForm)
 * @param error - Caught error (unknown), typically from mutation/API call
 * @returns The human-readable error message string
 *
 * @example
 * } catch (err) {
 *   const message = handleServerError(form, err)
 *   setErrorMessage(message)
 * }
 */
export function handleServerError(form: FormWithSetError, error: unknown): string {
  if (isValidationErrorShape(error)) {
    const raw = (error as { errors: RawValidationErrors }).errors;
    const fieldErrors = normalizeFieldErrors(raw);
    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (messages?.length) {
        form.setError(field, { type: "server", message: messages.join(". ") });
      }
    }
  }
  return getErrorMessage(error);
}
