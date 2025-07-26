const { getCourses, createCourse } = require('../controllers/course.controller');
const sendResponse = require('../utils/send.response');

module.exports = async (req, res) => {
    const { url, method } = req;

    if (url === '/api/courses' && method === 'GET') {
        return getCourses(req, res, sendResponse);
    }
    if (url === '/api/admin/courses' && method === 'POST') {
        return createCourse(req, res, sendResponse);
    }
    // Add more methods as needed
};