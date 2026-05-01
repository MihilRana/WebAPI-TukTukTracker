const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`${req.method} ${req.originalUrl}`, err);

    // Mongoose schema validation failed
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            error: true,
            message: 'Validation failed',
            details: messages
        });
    }

    // Invalid MongoDB ObjectId format
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            error: true,
            message: 'Invalid ID format'
        });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            error: true,
            message: `Duplicate value for ${field}. This ${field} already exists.`
        });
    }

    // JWT token is malformed or tampered with
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: true,
            message: 'Invalid token'
        });
    }

    // JWT token was valid but has expired
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: true,
            message: 'Token has expired. Please login again.'
        });
    }

    // Hide actual error details in production to avoid leaking sensitive info
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : err.message;

    res.status(statusCode).json({
        error: true,
        message: message
    });
};

module.exports = errorHandler;
