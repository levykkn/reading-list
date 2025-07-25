export class GalleryUI {
    constructor() {
        this.container = document.getElementById('gallery-container');
        this.tagsContainer = document.getElementById('tags-container');
        this.searchInput = document.getElementById('search-input');
    }

    renderCourses(courses) {
        if (!this.container) return;
        this.container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12";

        if (courses.length === 0) {
            this.container.innerHTML = `<p class="col-span-full text-center text-gray-500">No courses found matching your criteria.</p>`;
            return;
        }

        this.container.innerHTML = courses.map(course => `
            <a href="/course.html?id=${course.id}" class="category-item group">
                <div class="w-full bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <img src="${course.books[0].coverUrl}" alt="Cover for ${course.title}" 
                         class="w-full h-full object-cover aspect-[3/4] transition-transform duration-300 ease-in-out group-hover:scale-105">
                </div>
                <h3 class="text-base font-bold text-gray-900 tracking-tight">${course.title}</h3>
                <p class="text-sm text-gray-500">${course.tags.slice(0, 2).join(', ')}</p>
            </a>
        `).join('');
    }

    renderTags(tags, onTagClick) {
        if (!this.tagsContainer) return;
        this.tagsContainer.innerHTML = tags.sort().map(tag => `
            <button class="tag-btn text-gray-600 bg-white border border-gray-300 text-sm font-medium px-3 py-1 rounded-full hover:border-gray-900 transition-colors" data-tag="${tag}">
                ${tag}
            </button>
        `).join('');

        this.tagsContainer.querySelectorAll('.tag-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.currentTarget.classList.toggle('active');
                onTagClick();
            });
        });
    }

    onSearch(callback) {
        if (this.searchInput) this.searchInput.addEventListener('input', callback);
    }
    
    getActiveTags() {
        return Array.from(this.tagsContainer.querySelectorAll('.tag-btn.active')).map(btn => btn.dataset.tag);
    }

    getSearchQuery() {
        return this.searchInput ? this.searchInput.value : '';
    }

    displayError(message) {
        if (this.container) {
            this.container.innerHTML = `<p class="col-span-full text-center text-red-500">${message}</p>`;
        }
    }
}