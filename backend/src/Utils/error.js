/**
 * Utility function to create an error object with a specified status code and message.
 * @param {number} statusCode - The HTTP status code for the error.
 * @param {string} message - The error message.
 * @returns {Error} - The created error object.
 */

export const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
}