const url = require('url');
const courseRoutes = require('./courses.route');
const sendResponse = require('../utils/send.response');

const allRoutes = { ...courseRoutes };

// A more robust router that understands URL parameters (e.g., /:id)
const routeMatchers = Object.keys(allRoutes).map(route => {
    const [method, path] = route.split(' ');
    const paramNames = [];
    // Convert path to a regular expression
    const regexPath = path.replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^\\/]+)'; // Capture group for the parameter
    });
    const regex = new RegExp(`^${regexPath}$`);
    
    return {
        method,
        regex,
        paramNames,
        handler: allRoutes[route]
    };
});

module.exports = async (req, res) => {
    const { pathname } = url.parse(req.url);
    const { method } = req;

    for (const matcher of routeMatchers) {
        if (method === matcher.method) {
            const match = pathname.match(matcher.regex);

            if (match) {
                req.params = {};
                matcher.paramNames.forEach((name, index) => {
                    req.params[name] = match[index + 1];
                });

                try {
                    await matcher.handler(req, res);
                } catch (error) {
                    console.error(`Error in handler for ${method} ${pathname}:`, error);
                    sendResponse(res, 500, { error: 'An unexpected error occurred on the server.' });
                }
                return;
            }
        }
    }
    sendResponse(res, 404, { error: `API endpoint not found: ${method} ${pathname}` });
};
