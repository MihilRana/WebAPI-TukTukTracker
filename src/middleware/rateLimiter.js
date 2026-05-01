const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        error: true,
        message: 'Too many requests. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        error: true,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const pingLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: {
        error: true,
        message: 'Too many location pings. Maximum 60 per minute.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { generalLimiter, authLimiter, pingLimiter };
