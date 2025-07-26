import { AdminService } from './admin.service.js';
import { AdminUI } from './admin.ui.js';

export class AdminController {
    constructor(apiService) {
        this.service = new AdminService(apiService);
        this.ui = new AdminUI();
    }

    init() {
        this.ui.init((formData) => this.handleFormSubmit(formData));
    }

    async handleFormSubmit(formData) {
        this.ui.setStatus('Submitting...');
        try {
            const newCourse = await this.service.createCourse(formData);
            this.ui.setStatus('✅ Course created successfully!');
            this.ui.resetForm();
        } catch (error) {
            this.ui.setStatus(`❌ Error: ${error.message}`, true);
        }
    }
}