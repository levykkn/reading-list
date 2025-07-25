export class CourseController {
    constructor(service, ui) {
        this.service = service;
        this.ui = ui;
    }

    async init() {
        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('id');

        if (!courseId) {
            this.ui.displayError("Помилка: ID курсу не знайдено.");
            return;
        }

        try {
            const courseDetails = await this.service.getCourseDetails(courseId);
            if (!courseDetails) {
                this.ui.displayError(`Помилка: Курс з ID "${courseId}" не знайдено.`);
                return;
            }
            this.ui.render(courseDetails);
        } catch (error) {
            console.error("Failed to initialize course page:", error);
            this.ui.displayError("Failed to load course data. Please check the console.");
        }
    }
}