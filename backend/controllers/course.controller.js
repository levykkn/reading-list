const courseService = require('../services/course.service');

exports.getCourses = async (req, res, sendResponse) => {
    try {
        const courses = await courseService.getCourses();
        sendResponse(res, 200, courses);
    } catch (err) {
        sendResponse(res, 500, { error: 'Failed to fetch courses' });
    }
};

exports.createCourse = async (req, res, sendResponse) => {
    try {
        let body = '';
        for await (const chunk of req) { body += chunk; }
        const data = JSON.parse(body);
        const newCourse = await courseService.createCourse(data);
        sendResponse(res, 201, newCourse);
    } catch (err) {
        sendResponse(res, 400, { error: 'Failed to create course' });
    }
};