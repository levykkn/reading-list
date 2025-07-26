const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url'); // Import the built-in 'url' module
const courseService = require('./services/course.service.js');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'frontend');

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
};

const sendResponse = (res, statusCode, data, contentType = 'application/json') => {
    res.writeHead(statusCode, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(contentType === 'application/json' ? JSON.stringify(data) : data);
};

const server = http.createServer(async (req, res) => {
    // Use the url.parse() method to separate the pathname from the query string
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (method === 'OPTIONS') return sendResponse(res, 204, null);

    try {

        if (req.url.startsWith('/api/')) {
            if (method === 'GET' && req.url === '/api/courses') {
                const courses = await courseService.getCourses();
                return sendResponse(res, 200, courses);
            }
            if (method === 'POST' && req.url === '/api/admin/courses') {
                let body = '';
                for await (const chunk of req) { body += chunk; }
                const newCourse = await courseService.createCourse(JSON.parse(body));
                return sendResponse(res, 201, newCourse);
            }
        }
        
        // Static File Serving (uses the pathname only)
        const requestedPath = pathname === '/' ? '/index.html' : pathname;
        const filePath = path.join(PUBLIC_DIR, requestedPath);
        const fileExt = path.extname(filePath);
        const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return sendResponse(res, 404, { error: 'Not Found' });
                }
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