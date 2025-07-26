export class CourseUI {
    constructor() {
        this.titleEl = document.getElementById('course-title');
        this.descriptionEl = document.getElementById('course-description');
        this.bookListEl = document.getElementById('book-list-container');
        this.loaderEl = document.querySelector('.loader-container');
        this.appContainer = document.getElementById('app-container');
    }

    render(course) {
        if (this.loaderEl) this.loaderEl.style.display = 'none';

        document.title = course.title;
        this.titleEl.textContent = course.title;
        this.descriptionEl.innerHTML = course.description; 

        this.bookListEl.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400">Reading List</h2>
                <a href="/download-all/${course.id}" class="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-lg transition-colors text-xs">
                    Download All
                </a>
            </div>
            <div class="space-y-3">
                ${course.books.map(book => this.createBookHTML(book)).join('')}
            </div>
        `;
    }

    createBookHTML(book) {
        return `
            <div class="bg-white border border-gray-200/80 p-3 rounded-lg flex items-center transition-shadow hover:shadow-sm">
                <div class="w-12 h-16 flex-shrink-0 mr-4">
                    <img src="${book.coverUrl}" alt="Cover for ${book.title}" class="w-full h-full object-cover rounded-sm">
                </div>
                <div class="flex-grow">
                    <h3 class="font-bold text-sm text-gray-800">${book.title}</h3>
                    <p class="text-xs text-gray-500">${book.author}</p>
                </div>
                <div class="ml-4 flex-shrink-0">
                    <a href="/download/${book.id}" class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded-md transition-colors text-xs">
                        Download
                    </a>
                </div>
            </div>
        `;
    }

    displayError(message) {
        if(this.appContainer) {
            this.appContainer.innerHTML = `<p class="text-center text-red-500 text-lg">${message}</p>`;
        }
    }
}