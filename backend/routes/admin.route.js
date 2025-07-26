const url = require('url');
const courseService = require('../services/course.service');
const sendResponse = require('../utils/send.response');

module.exports = async function adminRoute(req, res) {
  const parsedUrl = url.parse(req.url);
  const { pathname } = parsedUrl;
  const method = req.method;

  // POST /api/admin/courses
  if (pathname === '/api/admin/courses' && method === 'POST') {
      let body = '';
      for await (const chunk of req) { body += chunk; }
      const newCourse = await courseService.createCourse(JSON.parse(body));
      return sendResponse(res, 201, newCourse);
  }
};