const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const { PORT, PUBLIC_DIR, NODE_ENV } = require('./config');
const sendResponse = require('./utils/send.response');
const mainRouter = require('./routes'); 

if (NODE_ENV === 'development') {
    require('./utils/reloader')();
}

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

    if (req.method === 'OPTIONS') return sendResponse(res, 204, null);

    try {
        if (pathname.startsWith('/api/')) {
            return await mainRouter(req, res);
        }

        const requestedPath = pathname === '/' ? '/index.html' : pathname;
        const filePath = path.join(PUBLIC_DIR, requestedPath);
        const fileExt = path.extname(filePath);
        const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (indexErr, indexContent) => {
                        if (indexErr) {
                            return sendResponse(res, 500, { error: 'Internal Server Error' });
                        }
                        sendResponse(res, 200, indexContent, 'text/html');
                    });
                } else {
                    return sendResponse(res, 500, { error: 'Internal Server Error' });
                }
            } else {
                sendResponse(res, 200, content, contentType);
            }
        });
    } catch (error) {
        console.error('Server Error:', error);
        return sendResponse(res, 500, { error: 'Internal Server Error' });
    }
});

server.listen(PORT, () => {
    console.log(`Server is running. Visit http://localhost:${PORT}`);
});
