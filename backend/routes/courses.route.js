const { getCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/course.controller');

const courseRoutes = {
    'GET /api/courses': getCourses,
    'POST /api/courses': createCourse,
    'PUT /api/courses/:id': updateCourse,
    'DELETE /api/courses/:id': deleteCourse
};

module.exports = courseRoutes;
