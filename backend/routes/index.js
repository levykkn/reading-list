const url = require('url');
const courseRoutes = require('./courses.route');
const sendResponse = require('../utils/send.response');

/**
 * The main router for the application. It consolidates all route definitions
 * from various modules and dispatches incoming requests to the correct handler.
 * This centralized approach makes the routing system clean and scalable.
 */

// In the future, you can add more route modules here (e.g., userRoutes, etc.)
// and they will be automatically included in the routing system.
const allRoutes = {
    ...courseRoutes,
};

/**
 * The main router handler function. It looks up the correct handler for the
 * incoming request based on its method and path and executes it.
 *
 * @param {http.IncomingMessage} req - The standard Node.js request object.
 * @param {http.ServerResponse} res - The standard Node.js response object.
 * @returns {Promise<void>}
 */
module.exports = async (req, res) => {
    const { pathname } = url.parse(req.url);
    const { method } = req;

    // Construct the key (e.g., "GET /api/courses") to look up the handler.
    const routeKey = `${method} ${pathname}`;

    // Find the handler associated with the current request's method and path.
    const handler = allRoutes[routeKey];

    if (handler) {
        try {
            // If a handler is found, execute it.
            await handler(req, res);
        } catch (error) {
            // Catch any unhandled errors that occur within the route handler.
            console.error(`Error in handler for ${routeKey}:`, error);
            sendResponse(res, 500, { error: 'An unexpected error occurred on the server.' });
        }
    } else {
        // If no handler matches the route key, respond with a 404 Not Found error.
        sendResponse(res, 404, { error: `API endpoint not found: ${method} ${pathname}` });
    }
};
