/**
 * Represents an HTTP error with a specific status code.
 * Use this to throw consistent errors within your API logic or middleware.
 */
export class HttpError extends Error {
  /**
   * HTTP status code (e.g., 400, 404, 500).
   */
  status: number;

  /**
   * Create a new HttpError.
   *
   * @param status - The HTTP status code to return (e.g., 404).
   * @param message - A human-readable error message.
   */
  constructor(status: number, message: string) {
    super(message); // Call base Error constructor
    this.status = status;
    this.name = 'HttpError'; // Set error name for better stack traces
  }
}
