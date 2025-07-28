import { AdminService } from './admin.service.js';
import { AdminUI } from './admin.ui.js';

export class AdminController {
    constructor(apiService) {
        this.service = new AdminService(apiService);
        this.ui = new AdminUI();
        this.allCourses = [];
        this.isFormDirty = false;
        this.autosaveTimeout = null;
    }

    async init() {
        this.ui.init({
            onSwitchToDashboard: () => this.switchToDashboardView(),
            onSwitchToCreateMode: () => this.switchToCreateMode(),
            onFormSubmit: (formData, courseId) => this.handleFormSubmit(formData, courseId),
            onEdit: (courseId) => this.handleEdit(courseId),
            onDelete: (courseId) => this.handleDelete(courseId),
            onBookSearch: (query) => this.handleBookSearch(query),
            onCourseSearch: (query) => this.handleCourseSearch(query),
            onFormDirty: () => this.setDirtyState(),
        });
        
        await this.loadInitialData();
        this.ui.showDashboard();
        
        this.ui.form.addEventListener('input', () => this.setDirtyState());

        window.addEventListener('beforeunload', (e) => {
            if (this.isFormDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    async loadInitialData() {
        try {
            this.allCourses = await this.service.getCourses();
            this.ui.renderCourseList(this.allCourses);
            this.updateDashboardStats();
        } catch (error) {
            console.error("Failed to load initial data", error);
        }
    }

    updateDashboardStats() {
        const totalCourses = this.allCourses.length;
        const totalBooks = this.allCourses.reduce((sum, course) => sum + course.books.length, 0);
        const tagCounts = this.allCourses.flatMap(c => c.tags).reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});
        const mostUsedTag = Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b, null);
        
        this.ui.renderDashboard({ totalCourses, totalBooks, mostUsedTag });
    }

    switchToDashboardView() {
        if (this.isFormDirty && !confirm("You have unsaved changes. Are you sure you want to go back?")) {
            return;
        }
        this.isFormDirty = false;
        this.ui.resetForm();
        this.ui.showDashboard();
    }

    switchToCreateMode() {
        this.isFormDirty = false;
        this.ui.resetForm();
        this.ui.showForm();
    }

    async handleFormSubmit(formData, courseId) {
        clearTimeout(this.autosaveTimeout);
        const isUpdating = !!courseId;
        this.ui.setStatus('Saving...');

        try {
            if (isUpdating) {
                await this.service.updateCourse(courseId, formData);
            } else {
                const newCourse = await this.service.createCourse(formData);
                this.ui.currentCourseId = newCourse.id;
            }
            this.isFormDirty = false;
            this.ui.setStatus('✅ All changes saved!', false, 2000);
            await this.loadInitialData();
            this.ui.setActiveCourse(this.ui.currentCourseId);
        } catch (error) {
            this.ui.setStatus(`❌ Error: ${error.message}`, true, 5000);
        }
    }

    handleEdit(courseId) {
        if (this.isFormDirty && !confirm("You have unsaved changes. Are you sure you want to switch?")) {
            return;
        }
        const course = this.allCourses.find(c => c.id === courseId);
        if (course) {
            this.isFormDirty = false;
            this.ui.populateForm(course);
            this.ui.setActiveCourse(courseId);
        }
    }

    async handleDelete(courseId) {
        this.ui.setStatus('Deleting...');
        try {
            await this.service.deleteCourse(courseId);
            this.ui.setStatus('🗑️ Course deleted!', false);
            await this.loadInitialData();
            this.switchToDashboardView();
        } catch (error) {
            this.ui.setStatus(`❌ Error: ${error.message}`, true, 5000);
        }
    }

    async handleBookSearch(query) {
        if (!query) {
            this.ui.renderBookSearchResults([]);
            return;
        }
        const results = await this.service.searchGoogleBooks(query);
        this.ui.renderBookSearchResults(results);
    }
    
    handleCourseSearch(query) {
        const lowerCaseQuery = query.toLowerCase();
        const filteredCourses = this.allCourses.filter(course => 
            course.title.toLowerCase().includes(lowerCaseQuery)
        );
        this.ui.renderCourseList(filteredCourses);
    }

    setDirtyState() {
        this.isFormDirty = true;
        this.ui.setStatus('Unsaved changes...');
        
        clearTimeout(this.autosaveTimeout);
        this.autosaveTimeout = setTimeout(() => {
            if(this.ui.currentCourseId) {
               this.handleFormSubmit(this.ui.getFormData(), this.ui.currentCourseId);
            }
        }, 2500);
    }
}
