const crypto = require('crypto');

const generateETag = (data) => {
    const hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
    return `"${hash}"`;
};

const conditionalGet = (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (body) => {
        if (req.method === 'GET') {
            const etag = generateETag(body);

            res.setHeader('ETag', etag);
            res.setHeader('Cache-Control', 'private, max-age=60');
            res.setHeader('Last-Modified', new Date().toUTCString());

            const clientETag = req.headers['if-none-match'];

            if (clientETag && clientETag === etag) {
                return res.status(304).end();
            }
        }

        return originalJson(body);
    };

    next();
};

module.exports = conditionalGet;
