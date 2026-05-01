const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Request-Id', generateRequestId());

    next();
};

function generateRequestId() {
    return 'req_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
}

module.exports = securityHeaders;
