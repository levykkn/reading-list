export class AdminService {
    constructor(apiService) {
        this.api = apiService;
    }

    async getCourses() {
        const data = await this.api.get('/api/courses');
        return data.categories || [];
    }

    async createCourse(courseData) {
        return this.api.post('/api/courses', courseData);
    }

    async updateCourse(courseId, courseData) {
        return this.api.put(`/api/courses/${courseId}`, courseData);
    }

    async deleteCourse(courseId) {
        return this.api.delete(`/api/courses/${courseId}`);
    }

    async searchGoogleBooks(query) {
        if (!query) return [];
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Google Books API request failed');
            }
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error("Google Books API Error:", error);
            return []; // Return empty array on error
        }
    }
}
