const logger = {

    // General operational messages (server start, db connected, seed complete)
    info: (message, data) => {
        console.log(`[${new Date().toISOString()}] INFO: ${message}`, data ? JSON.stringify(data) : '');
    },
    // Failures that need attention (db errors, unhandled exceptions)
    error: (message, error) => {
        console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error ? error.message || error : '');
    },
    // Potential issues that are not critical yet (deprecated usage, high memory)
    warn: (message, data) => {
        console.warn(`[${new Date().toISOString()}] WARN: ${message}`, data ? JSON.stringify(data) : '');
    },
    // Verbose output for development only, hidden in production
    debug: (message, data) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[${new Date().toISOString()}] DEBUG: ${message}`, data ? JSON.stringify(data) : '');
        }
    }
};

module.exports = logger;
