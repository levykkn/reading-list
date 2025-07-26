export class AdminUI {
    constructor() {
        this.form = document.getElementById('create-course-form');
        this.booksContainer = document.getElementById('books-container');
        this.addBookBtn = document.getElementById('add-book-btn');
        this.statusDiv = document.getElementById('form-status');
        this.bookCount = 0;
    }

    init(onFormSubmit) {
        this.addBookBtn.addEventListener('click', () => this.createBookFields());
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = this.getFormData();
            onFormSubmit(formData);
        });
        this.createBookFields(); // Add the first book field on initial render
    }

    createBookFields() {
        this.bookCount++;
        const bookDiv = document.createElement('div');
        // This class structure creates the cleaner, two-column layout
        bookDiv.className = 'p-4 border border-gray-200 rounded-lg bg-gray-50/50';
        bookDiv.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div>
                    <label class="form-label text-xs">Book Title</label>
                    <input type="text" name="book_title_${this.bookCount}" class="form-input mt-1" required>
                </div>
                <div>
                    <label class="form-label text-xs">Author</label>
                    <input type="text" name="book_author_${this.bookCount}" class="form-input mt-1" required>
                </div>
                <div class="sm:col-span-2">
                    <label class="form-label text-xs">Cover Image URL</label>
                    <input type="url" name="book_coverUrl_${this.bookCount}" class="form-input mt-1" required>
                </div>
            </div>
        `;
        this.booksContainer.appendChild(bookDiv);
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const books = [];
        for (let i = 1; i <= this.bookCount; i++) {
            const title = formData.get(`book_title_${i}`);
            if (title) {
                books.push({
                    id: title.toLowerCase().replace(/\s+/g, '-'),
                    title: title,
                    author: formData.get(`book_author_${i}`),
                    coverUrl: formData.get(`book_coverUrl_${i}`)
                });
            }
        }
        return {
            id: formData.get('title').toLowerCase().replace(/\s+/g, '-'),
            title: formData.get('title'),
            description: formData.get('description'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()),
            books: books
        };
    }

    setStatus(message, isError = false) {
        this.statusDiv.textContent = message;
        this.statusDiv.className = `mt-4 text-center font-medium ${isError ? 'text-red-600' : 'text-green-600'}`;
    }

    resetForm() {
        this.form.reset();
        this.booksContainer.innerHTML = '';
        this.bookCount = 0;
        this.createBookFields();
    }
}