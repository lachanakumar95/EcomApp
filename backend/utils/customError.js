class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }

    static BadRequest(message = 'Bad Request') {
        return new CustomError(message, 400);
    }

    static Unauthorized(message = 'Unauthorized') {
        return new CustomError(message, 401);
    }

    static NotFound(message = 'Not Found') {
        return new CustomError(message, 404);
    }

    static InternalServerError(message = 'Internal Server Error') {
        return new CustomError(message, 500);
    }
}

module.exports = CustomError;
