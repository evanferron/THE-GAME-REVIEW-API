export class AError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // Fix prototype chain
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}