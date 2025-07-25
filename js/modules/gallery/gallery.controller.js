export class GalleryController {
    constructor(service, ui) {
        this.service = service;
        this.ui = ui;
    }

    async init() {
        try {
            const categories = await this.service.getCategoriesWithCovers();
            this.ui.render(categories);
            this.ui.setupEventListeners((key) => this.handleCategoryClick(key));
        } catch (error) {
            console.error("Failed to initialize gallery:", error);
            this.ui.displayError("Failed to load data. Please check the console.");
        }
    }

    handleCategoryClick(key) {
        const category = this.service.getCategory(key);
        if (category) {
            window.location.href = `course.html?id=${key}`;
        }
    }
}