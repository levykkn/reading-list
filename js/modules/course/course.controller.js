import { CourseService } from './course.service.js';
import { CourseUI } from './course.ui.js';

export class CourseController {
    constructor(apiService) {
        this.service = new CourseService(apiService);
        this.ui = new CourseUI();
    }

    async init() {
        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('id');

        if (!courseId) {
            this.ui.displayError("Course ID is missing from the URL.");
            return;
        }

        try {
            const course = await this.service.getCourseById(courseId);
            this.ui.render(course);
        } catch (error) {
            console.error(error);
            this.ui.displayError(error.message);
        }
    }
}