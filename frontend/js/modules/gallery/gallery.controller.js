import { GalleryService } from './gallery.service.js';
import { GalleryUI } from './gallery.ui.js';

export class GalleryController {
    constructor(apiService) {
        this.service = new GalleryService(apiService);
        this.ui = new GalleryUI();
    }

    async init() {
        try {
            const { courses, tags } = await this.service.getCoursesAndTags();
            this.ui.renderCourses(courses);
            this.ui.renderTags(tags, () => this.handleFilterChange());
            this.ui.onSearch(() => this.handleFilterChange());
        } catch (error) {
            this.ui.displayError("Could not load courses. Please try again later.");
        }
    }

    handleFilterChange() {
        const query = this.ui.getSearchQuery();
        const activeTags = this.ui.getActiveTags();
        const filteredCourses = this.service.filterCourses(query, activeTags);
        this.ui.renderCourses(filteredCourses);
    }
}