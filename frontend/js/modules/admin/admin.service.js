export class AdminService {
    constructor(apiService) {
        this.api = apiService;
    }

    async createCourse(courseData) {
        return this.api.post('/admin/courses', courseData);
    }
}