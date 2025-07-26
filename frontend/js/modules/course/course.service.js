export class CourseService {
    constructor(apiService) {
        this.api = apiService;
    }

    async getCourseById(courseId) {

        const data = await this.api.get('/api/courses');
        

        const course = data.categories.find(c => c.id === courseId);
        
        if (course) {
            return course;
        }

        throw new Error(`Course with ID "${courseId}" not found.`);
    }
}