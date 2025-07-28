export class AdminUI {
    constructor() {
        // Views
        this.dashboardView = document.getElementById('dashboard-view');
        this.formView = document.getElementById('form-view');

        // Dashboard elements
        this.statsTotalCourses = document.getElementById('stats-total-courses');
        this.statsTotalBooks = document.getElementById('stats-total-books');
        this.statsMostUsedTag = document.getElementById('stats-most-used-tag');
        this.dashboardNewCourseBtn = document.getElementById('dashboard-new-course-btn');
        
        // Form elements
        this.form = document.getElementById('course-form');
        this.formTitle = document.getElementById('form-title');
        this.formDescription = document.getElementById('form-description');
        this.submitBtn = document.getElementById('submit-btn');
        this.backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
        this.statusDiv = document.getElementById('form-status');

        // Tag input
        this.tagInputContainer = document.getElementById('tag-input-container');
        this.tagInput = document.getElementById('tag-input');

        // Book search
        this.bookSearchInput = document.getElementById('book-search-input');
        this.bookSearchResults = document.getElementById('book-search-results');
        this.booksContainer = document.getElementById('books-container');
        
        // Course list and search
        this.courseListContainer = document.getElementById('course-list-container');
        this.courseSearchInput = document.getElementById('course-search-input');

        // Delete Modal
        this.deleteModal = document.getElementById('delete-modal');
        this.cancelDeleteBtn = document.getElementById('cancel-delete-btn');
        this.confirmDeleteBtn = document.getElementById('confirm-delete-btn');

        // State
        this.currentCourseId = null; 
        this.activeCourseListItem = null;
        this.tags = new Set();
    }

    init(callbacks) {
        // View switching
        this.dashboardNewCourseBtn.addEventListener('click', () => callbacks.onSwitchToCreateMode());
        this.backToDashboardBtn.addEventListener('click', () => callbacks.onSwitchToDashboard());

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = this.getFormData();
            callbacks.onFormSubmit(formData, this.currentCourseId);
        });

        // Course list interactions
        this.courseListContainer.addEventListener('click', (e) => {
            const courseItem = e.target.closest('.course-list-item');
            if (!courseItem) return;
            const courseId = courseItem.dataset.id;
            const deleteButton = e.target.closest('.delete-btn');
            if (deleteButton) {
                e.stopPropagation(); 
                this.showDeleteModal(courseId);
            } else {
                callbacks.onEdit(courseId);
            }
        });
        
        // Course search listener
        this.courseSearchInput.addEventListener('input', () => {
            callbacks.onCourseSearch(this.courseSearchInput.value);
        });

        // Delete modal
        this.cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
        this.confirmDeleteBtn.addEventListener('click', () => {
            callbacks.onDelete(this.confirmDeleteBtn.dataset.id);
            this.hideDeleteModal();
        });

        // Init feature-specific listeners
        this.initTagInput(callbacks.onFormDirty);
        this.initBookSearch(callbacks.onBookSearch, callbacks.onFormDirty);
        this.initBookContainer(callbacks.onFormDirty);
        this.initDragAndDrop(callbacks.onFormDirty);
    }

    // --- View Management ---
    showDashboard() {
        this.dashboardView.classList.remove('hidden');
        this.formView.classList.add('hidden');
    }

    showForm() {
        this.dashboardView.classList.add('hidden');
        this.formView.classList.remove('hidden');
    }

    renderDashboard(stats) {
        this.statsTotalCourses.textContent = stats.totalCourses;
        this.statsTotalBooks.textContent = stats.totalBooks;
        this.statsMostUsedTag.textContent = stats.mostUsedTag || '-';
    }
    
    // --- Course List ---
    renderCourseList(courses) {
        this.courseListContainer.innerHTML = courses.map(course => `
            <div class="course-list-item group p-3 m-2 rounded-lg hover:bg-slate-700 transition-all duration-200 flex items-center justify-between cursor-pointer" data-id="${course.id}">
                <div class="flex items-center course-info flex-grow min-w-0">
                    <img src="${course.books[0]?.coverUrl}" onerror="this.onerror=null;this.src='https://placehold.co/48x64/e2e8f0/334155?text=?';" class="w-10 h-14 object-cover rounded-md mr-4 flex-shrink-0 bg-slate-700 border border-slate-600">
                    <div class="min-w-0">
                        <h4 class="font-semibold text-sm text-white truncate">${course.title}</h4>
                        <p class="text-xs text-slate-400 truncate">${course.tags.join(', ')}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-1 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="icon-btn delete-btn !text-slate-400 hover:!text-red-500" title="Delete Course"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
            </div>
        `).join('');
    }

    setActiveCourse(courseId) {
        if (this.activeCourseListItem) {
            this.activeCourseListItem.classList.remove('bg-slate-700', 'shadow-lg');
        }
        const newActiveItem = this.courseListContainer.querySelector(`[data-id="${courseId}"]`);
        if (newActiveItem) {
            newActiveItem.classList.add('bg-slate-700', 'shadow-lg');
            this.activeCourseListItem = newActiveItem;
        }
    }

    // --- Form Handling ---
    populateForm(course) {
        this.resetForm();
        this.currentCourseId = course.id;
        this.form.elements.title.value = course.title;
        this.form.elements.description.value = course.description;
        
        course.tags.forEach(tag => this.addTag(tag));
        course.books.forEach(book => this.addBookToDom(book));
        
        this.formTitle.textContent = 'Edit Course';
        this.formDescription.textContent = `Now editing: "${course.title}"`;
        this.submitBtn.textContent = 'Save Changes';
        this.showForm();
    }

    resetForm() {
        this.form.reset();
        this.booksContainer.innerHTML = '';
        this.bookSearchResults.innerHTML = '';
        this.currentCourseId = null;
        this.tags.clear();
        this.renderTags();
        if (this.activeCourseListItem) {
            this.activeCourseListItem.classList.remove('bg-slate-700', 'shadow-lg');
            this.activeCourseListItem = null;
        }
        this.formTitle.textContent = 'Create New Course';
        this.formDescription.textContent = 'Fill in the details to add a new course.';
        this.submitBtn.textContent = 'Create Course';
        this.setStatus('');
    }

    getFormData() {
        return {
            id: this.currentCourseId || this.form.elements.title.value.toLowerCase().replace(/\s+/g, '-'),
            title: this.form.elements.title.value,
            description: this.form.elements.description.value,
            tags: Array.from(this.tags),
            books: Array.from(this.booksContainer.querySelectorAll('.book-card')).map(card => ({
                id: card.dataset.id,
                title: card.dataset.title,
                author: card.dataset.author,
                coverUrl: card.dataset.coverurl
            }))
        };
    }

    // --- Tag Input ---
    initTagInput(onFormDirty) {
        this.tagInputContainer.addEventListener('click', () => this.tagInput.focus());
        this.tagInput.addEventListener('keydown', (e) => {
            if (e.key === ',' || e.key === 'Enter') {
                e.preventDefault();
                const tagName = this.tagInput.value.trim();
                if (tagName) {
                    this.addTag(tagName);
                    this.tagInput.value = '';
                    onFormDirty();
                }
            }
        });
    }

    addTag(tagName) {
        this.tags.add(tagName);
        this.renderTags();
    }

    removeTag(tagName, onFormDirty) {
        this.tags.delete(tagName);
        this.renderTags();
        onFormDirty();
    }

    renderTags(onFormDirty) {
        while (this.tagInputContainer.firstChild !== this.tagInput) {
            this.tagInputContainer.removeChild(this.tagInputContainer.firstChild);
        }
        this.tags.forEach(tag => {
            const pill = document.createElement('div');
            pill.className = 'tag-pill';
            pill.innerHTML = `<span>${tag}</span><button type="button" class="tag-remove-btn">&times;</button>`;
            pill.querySelector('button').addEventListener('click', () => this.removeTag(tag, onFormDirty));
            this.tagInputContainer.insertBefore(pill, this.tagInput);
        });
    }

    // --- Book Search & Management ---
    initBookContainer(onFormDirty) {
        this.booksContainer.addEventListener('click', (e) => {
            if (e.target.closest('.remove-book-btn')) {
                e.target.closest('.book-card').remove();
                onFormDirty();
            }
        });
    }

    initBookSearch(onSearch, onFormDirty) {
        let searchTimeout;
        this.bookSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                onSearch(this.bookSearchInput.value);
            }, 300);
        });
        
        this.bookSearchResults.addEventListener('click', (e) => {
            const addButton = e.target.closest('.add-book-from-search-btn');
            if(addButton) {
                onFormDirty();
            }
        });
    }

    renderBookSearchResults(results) {
        this.bookSearchResults.innerHTML = results.map(book => {
            const volumeInfo = book.volumeInfo;
            const title = volumeInfo.title;
            const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
            const coverUrl = volumeInfo.imageLinks?.thumbnail || 'https://placehold.co/48x72/e2e8f0/334155?text=?';
            
            return `
                <div class="p-2 border rounded-lg flex items-center space-x-3 bg-white hover:bg-slate-50">
                    <img src="${coverUrl}" class="w-12 h-auto rounded-md">
                    <div class="flex-grow">
                        <p class="font-semibold text-sm">${title}</p>
                        <p class="text-xs text-slate-500">${authors}</p>
                    </div>
                    <button type="button" class="btn btn-secondary !py-1 !px-3 add-book-from-search-btn">Add</button>
                </div>
            `;
        }).join('');

        this.bookSearchResults.querySelectorAll('.add-book-from-search-btn').forEach((button, index) => {
            button.addEventListener('click', () => {
                const book = results[index];
                this.addBookToDom({
                    id: book.id,
                    title: book.volumeInfo.title,
                    author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown',
                    coverUrl: book.volumeInfo.imageLinks?.thumbnail || ''
                });
                this.bookSearchInput.value = '';
                this.bookSearchResults.innerHTML = '';
            });
        });
    }

    addBookToDom(book) {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-card bg-white p-4 border border-slate-200 rounded-lg shadow-sm relative transition-shadow';
        bookDiv.setAttribute('draggable', true);
        bookDiv.dataset.id = book.id;
        bookDiv.dataset.title = book.title;
        bookDiv.dataset.author = book.author;
        bookDiv.dataset.coverurl = book.coverUrl;

        bookDiv.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="drag-handle text-slate-400 hover:text-slate-600 pt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg></div>
                <img src="${book.coverUrl}" onerror="this.onerror=null;this.src='https://placehold.co/80x120/f1f5f9/cbd5e1?text=Invalid';" class="w-16 h-auto object-cover rounded-md bg-slate-100 aspect-[2/3] border">
                <div class="flex-grow">
                    <p class="font-bold text-slate-800">${book.title}</p>
                    <p class="text-sm text-slate-500">${book.author}</p>
                </div>
            </div>
            <button type="button" class="remove-book-btn absolute -top-2.5 -right-2.5 h-7 w-7 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white z-10">&times;</button>
        `;
        this.booksContainer.appendChild(bookDiv);
    }

    // --- Status & Modals ---
    setStatus(message, isError = false, duration = 4000) {
        this.statusDiv.textContent = message;
        this.statusDiv.className = `text-sm font-medium mr-auto transition-all ${isError ? 'text-red-600' : 'text-green-600'}`;
        this.statusDiv.style.opacity = message ? 1 : 0;
        if (duration && message) {
            setTimeout(() => { this.statusDiv.style.opacity = 0; }, duration);
        }
    }
    
    showDeleteModal(courseId) {
        this.confirmDeleteBtn.dataset.id = courseId;
        this.deleteModal.classList.remove('hidden');
    }

    hideDeleteModal() {
        this.deleteModal.classList.add('hidden');
    }

    // --- Drag and Drop ---
    initDragAndDrop(onFormDirty) {
        let draggedItem = null;
        this.booksContainer.addEventListener('dragstart', (e) => {
            draggedItem = e.target.closest('.book-card');
            if (draggedItem) {
                setTimeout(() => draggedItem.classList.add('dragging'), 0);
            }
        });
        this.booksContainer.addEventListener('dragend', () => {
            if (draggedItem) {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
                onFormDirty();
            }
        });
        this.booksContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(e.clientY);
            const currentDraggable = document.querySelector('.dragging');
            if (currentDraggable) {
                 if (afterElement == null) {
                    this.booksContainer.appendChild(currentDraggable);
                } else {
                    this.booksContainer.insertBefore(currentDraggable, afterElement);
                }
            }
        });
    }

    getDragAfterElement(y) {
        const draggableElements = [...this.booksContainer.querySelectorAll('.book-card:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}
