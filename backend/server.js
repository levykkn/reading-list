const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const { PORT, PUBLIC_DIR } = require('./config');
const sendResponse = require('./utils/send.response');

const coursesRoute = require('./routes/courses.route');
const adminRoute = require('./routes/admin.route');

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (method === 'OPTIONS') return sendResponse(res, 204, null);

    try {
        // Route handling
        if (pathname.startsWith('/api/courses')) return await coursesRoute(req, res);
        if (pathname.startsWith('/api/admin')) return await adminRoute(req, res);

        // Static File Serving
        const requestedPath = pathname === '/' ? '/index.html' : pathname;
        const filePath = path.join(PUBLIC_DIR, requestedPath);
        const fileExt = path.extname(filePath);
        const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') return sendResponse(res, 404, { error: 'Not Found' });
                return sendResponse(res, 500, { error: 'Internal Server Error' });
            }
            sendResponse(res, 200, content, contentType);
        });
    } catch (error) {
        console.error('Server Error:', error);
        return sendResponse(res, 500, { error: 'Internal Server Error' });
    }
});

server.listen(PORT, () => {
    console.log(`✅ Server is running. Visit http://localhost:${PORT}`);
});