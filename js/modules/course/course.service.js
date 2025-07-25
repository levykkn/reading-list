export class CourseService {
    constructor(apiService) {
        this.api = apiService;
    }

    async getCourseById(courseId) {
        const data = await this.api.get('/data.json');
        // The .find() method is correct for the array structure in your data.json
        const course = data.categories.find(c => c.id === courseId);
        if (course) {
            return course;
        }
        throw new Error(`Course with ID "${courseId}" not found.`);
    }
}