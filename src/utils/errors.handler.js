function handleError(error) {
    let errors = {};

    // Duplicate key error (e.g., unique constraint violation)
    if (error.code === 11000) {
        Object.keys(error.keyValue).forEach((key) => {
            errors[key] = `${key} already exists`;
        });
        return errors;
    }

    // Validation errors
    if (error.name === 'ValidationError') {
        Object.keys(error.errors).forEach((field) => {
            errors[field] = error.errors[field].message;
        });
        return errors;
    }

    // Cast errors (e.g., invalid ObjectId)
    if (error.name === 'CastError') {
        const field = error.path;
        errors[field] = `Invalid ${field}`;
        return errors;
    }

    // JWT authentication errors
    if (error.name === 'JsonWebTokenError') {
        errors.token = 'Invalid token';
        return errors;
    }

    // Authorization errors
    if (error.name === 'UnauthorizedError') {
        errors.token = 'Unauthorized';
        return errors;
    }

    // ReferenceError
    if (error.name === 'ReferenceError') {
        errors.referenceError = error.message;
        return errors;
    }

    // Handle status codes from 500 to 511
    const statusCode = parseInt(error.code);
    if (statusCode >= 500 && statusCode <= 511) {
        errors.server = 'Internal Server Error';
        return errors;
    }

    // Custom error handling
    if (error.name === 'CustomError') {
        errors.customError = error.message;
        return errors;
    }
    
    // TypeError error handling
    if (error.name === 'TypeError') {
        errors.typeError = error.message;
        return errors;
    }

    // SyntaxError error handling
    if (error.name === 'SyntaxError') {
        errors.syntaxError = error.message;
        return errors;
    }

    // StrictPopulateError error handling
    if (error.name === 'StrictPopulateError') {
        errors.strictPopulateError = error.message;
        return errors;
    }

    return errors;
}

module.exports = handleError;