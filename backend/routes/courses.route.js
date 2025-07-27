const { getCourses, createCourse } = require('../controllers/course.controller');
const sendResponse = require('../utils/send.response');

const courseRoutes = {

    'GET /api/courses': (req, res) => {
        getCourses(req, res, sendResponse);
    },

    'POST /api/courses': (req, res) => {
        createCourse(req, res, sendResponse);
    }
};

module.exports = courseRoutes;
