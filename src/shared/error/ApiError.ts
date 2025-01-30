import { AError } from "../../base/AError";

export class NotFoundError extends AError {
    constructor(resource: string) {
        super(`${resource} not found`, 404);
    }
}

export class ValidationError extends AError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthorizedError extends AError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
