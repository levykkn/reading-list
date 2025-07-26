import { APIService } from './api.service.js';

export class App {
    constructor() {
        this.api = new APIService('http://localhost:3000');
    }

    async init() {
        const path = window.location.pathname;

        if (path.endsWith('admin.html')) {
            await this.loadAdminModule();
        } else if (path.endsWith('course.html')) {
            await this.loadCourseModule();
        } else {
            await this.loadGalleryModule();
        }
    }

    async loadAdminModule() {
        const { AdminController } = await import('../modules/admin/admin.controller.js');
        const controller = new AdminController(this.api);
        controller.init();
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