import { AError } from "..";

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


export class InternalServerError extends AError {
    constructor(message = "Internal server error") {
        super(message, 500);
    }
}

export class TwitchError extends AError {
    constructor(message = "Twitch error") {
        super(message, 500);
    }
}