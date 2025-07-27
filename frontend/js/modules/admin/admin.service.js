export class AdminService {
    constructor(apiService) {
        this.api = apiService;
    }

    /**
     * Sends a request to create a new course.
     * @param {Object} courseData - The data for the new course.
     * @returns {Promise<Object>} The newly created course object from the server.
     */
    async createCourse(courseData) {
        // The endpoint has been updated to the unified /api/courses path.
        // The backend router will now handle the POST request to this endpoint.
        return this.api.post('/api/courses', courseData);
    }
}
