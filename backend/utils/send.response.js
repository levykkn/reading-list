module.exports = function sendResponse(res, statusCode, data, contentType = 'application/json') {
  res.writeHead(statusCode, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      // CRITICAL FIX: Added PUT and DELETE to the list of allowed methods.
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(contentType === 'application/json' ? JSON.stringify(data) : data);
};
