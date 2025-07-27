const http = require('http');
const fs = require('fs/promises');
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

const cache = new Map();

async function cacheDirectory(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            await cacheDirectory(filePath);
        } else {
            const fileExt = path.extname(filePath);
            if (MIME_TYPES[fileExt]) {
                const content = await fs.readFile(filePath);
                const relativePath = path.relative(PUBLIC_DIR, filePath);
                // Use forward slashes for URL paths, even on Windows
                const urlPath = `/${relativePath.replace(/\\/g, '/')}`;
                cache.set(urlPath, { content, contentType: MIME_TYPES[fileExt] });
            }
        }
    }
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    if (req.method === 'OPTIONS') return sendResponse(res, 204, null);

    try {
        if (pathname.startsWith('/api/')) {
            return await mainRouter(req, res);
        }

        if (pathname === '/') {
            pathname = '/index.html';
        }

        if (cache.has(pathname)) {
            const { content, contentType } = cache.get(pathname);
            return sendResponse(res, 200, content, contentType);
        }

        // Fallback for files not in cache or for serving index.html for SPA routes
        const indexFile = cache.get('/index.html');
        if (indexFile) {
            return sendResponse(res, 200, indexFile.content, indexFile.contentType);
        }

        return sendResponse(res, 404, { error: 'Not Found' });

    } catch (error) {
        console.error('Server Error:', error);
        return sendResponse(res, 500, { error: 'Internal Server Error' });
    }
});

cacheDirectory(PUBLIC_DIR)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running. Visit http://localhost:${PORT}`);
            console.log(`${cache.size} files cached.`);
        });
    })
    .catch(err => {
        console.error('Failed to cache directory:', err);
        process.exit(1);
    });