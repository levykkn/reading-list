import { APIService } from './api.service.js';

export class App {
    constructor() {
        // For development, we point to the local data directory.
        // This can be changed to 'https://api.yourwebsite.com' later.
        this.api = new APIService('../data');
    }

    async init() {
        const path = window.location.pathname;

        if (path.endsWith('course.html')) {
            await this.loadCourseModule();
        } else {
            // Default to loading the gallery on any other page (e.g., index.html)
            await this.loadGalleryModule();
        }
    }

    async loadGalleryModule() {
        const { GalleryController } = await import('../modules/gallery/gallery.controller.js');
        const controller = new GalleryController(this.api);
        controller.init();
    }

    async loadCourseModule() {
        const { CourseController } = await import('../modules/course/course.controller.js');
        const controller = new CourseController(this.api);
        controller.init();
    }
}