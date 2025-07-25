export class App {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }

    init() {
        const path = window.location.pathname;
        if (path.endsWith('course.html')) {
            this.dependencies.courseController.init();
        } else {
            this.dependencies.galleryController.init();
        }
    }
}