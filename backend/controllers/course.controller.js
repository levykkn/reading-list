const courseService = require('../services/course.service');
const sendResponse = require('../utils/send.response');


const parseBody = async (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(new Error('Invalid JSON in request body'));
            }
        });
        req.on('error', err => reject(err));
    });
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await courseService.getCourses();
        sendResponse(res, 200, courses);
    } catch (err) {
        sendResponse(res, 500, { error: 'Failed to fetch courses' });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const data = await parseBody(req);
        const newCourse = await courseService.createCourse(data);
        sendResponse(res, 201, newCourse);
    } catch (err) {
        sendResponse(res, 400, { error: 'Failed to create course' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        const courseData = await parseBody(req);
        
        const updatedCourse = await courseService.updateCourse(courseId, courseData);
        if (!updatedCourse) {
            return sendResponse(res, 404, { error: 'Course not found' });
        }
        sendResponse(res, 200, updatedCourse);
    } catch (err) {
        sendResponse(res, 400, { error: `Failed to update course: ${err.message}` });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        const success = await courseService.deleteCourse(courseId);
        if (!success) {
            return sendResponse(res, 404, { error: 'Course not found' });
        }
        sendResponse(res, 204, null); // 204 No Content for successful deletion
    } catch (err) {
        sendResponse(res, 500, { error: 'Failed to delete course' });
    }
};
