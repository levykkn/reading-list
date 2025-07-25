export class GalleryService {
    constructor(apiService) {
        this.api = apiService;
        this.allCourses = [];
        this.allTags = new Set();
    }

    async getCoursesAndTags() {
        if (this.allCourses.length === 0) {
            const data = await this.api.get('/data.json');
            this.allCourses = data.categories;
            this.allCourses.forEach(course => {
                course.tags.forEach(tag => this.allTags.add(tag));
            });
        }
        return { courses: this.allCourses, tags: Array.from(this.allTags) };
    }

    filterCourses(query, activeTags) {
        const lowerCaseQuery = query.toLowerCase();

        return this.allCourses.filter(course => {
            const matchesQuery = query ? (
                course.title.toLowerCase().includes(lowerCaseQuery) ||
                course.description.toLowerCase().includes(lowerCaseQuery) ||
                course.books.some(book => book.title.toLowerCase().includes(lowerCaseQuery))
            ) : true;

            const matchesTags = activeTags.length > 0 ? activeTags.every(tag => course.tags.includes(tag)) : true;

            return matchesQuery && matchesTags;
        });
    }
}