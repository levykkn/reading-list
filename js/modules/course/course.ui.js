export class CourseUI {
    constructor() {
        this.container = document.getElementById('app-container');
        this.titleEl = document.getElementById('course-title');
        this.descriptionEl = document.getElementById('course-description');
        this.bookListEl = document.getElementById('book-list-container');
        this.loaderEl = document.getElementById('loader');
    }

    render(courseDetails) {
        this.loaderEl.style.display = 'none';
        this.titleEl.textContent = courseDetails.title;
        document.title = courseDetails.title;
        this.descriptionEl.textContent = courseDetails.description;
        
        this.bookListEl.innerHTML = courseDetails.books.map(book => this.createBookHTML(book)).join('');
    }

    createBookHTML(book) {
        const coverImg = book.coverUrl ? `<img src="${book.coverUrl}" alt="Обкладинка ${book.title}" class="w-full h-auto object-cover rounded-md shadow-lg">` : `<div class="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500">Немає зображення</div>`;
        return `
            <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <div class="w-full md:w-1/4 flex-shrink-0">
                    ${coverImg}
                </div>
                <div class="w-full md:w-3/4">
                    <h2 class="text-2xl font-bold mb-1">${book.title || book.query}</h2>
                    <p class="text-lg text-gray-600 mb-4">${book.author || ''}</p>
                    <div class="text-sm text-gray-500 space-y-1 mb-4">
                        <p><strong>ISBN:</strong> ${book.isbn}</p>
                        <p><strong>Рік видання:</strong> ${book.publishedDate}</p>
                    </div>
                    <p class="text-gray-700 leading-relaxed">${book.description ? (book.description.substring(0, 300) + '...') : ''}</p>
                </div>
            </div>
        `;
    }

    displayError(message) {
        this.container.innerHTML = `<h1 class="text-2xl text-center text-red-600">${message}</h1>`;
    }
}