export class CourseService {
    constructor(api, dataService) {
        this.api = api;
        this.dataService = dataService;
    }

    async getCourseDetails(courseId) {
        const data = await this.dataService.loadData('../data/data.json');
        const course = data.categories[courseId];
        if (!course) return null;

        const bookPromises = course.books.map(bookQuery => this.api.fetchBookDetails(bookQuery));
        const books = await Promise.all(bookPromises);

        return {
            ...course,
            books
        };
    }
}