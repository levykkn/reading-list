export class GalleryUI {
    constructor(rootSelector, modalRootSelector) {
        this.root = document.querySelector(rootSelector);
        this.modalRoot = document.querySelector(modalRootSelector);
        this.galleryContainer = this.root.querySelector('#gallery-container');
        this.scrollLeftBtn = this.root.querySelector('#scroll-left');
        this.scrollRightBtn = this.root.querySelector('#scroll-right');
    }
    
    render(categories) {
        this.galleryContainer.innerHTML = Object.keys(categories).map(key => {
            const category = categories[key];
            const imagePlaceholders = category.covers.map((cover, index) => {
                const imgUrl = cover.url || `https://placehold.co/300x450/27272a/f3f4f6?text=${encodeURIComponent(cover.query.split(' ')[0])}`;
                return `<img src="${imgUrl}" alt="Обкладинка: ${cover.query}" class="w-full h-full object-cover">`;
            }).join('');
            return `<div class="category-item snap-start flex-shrink-0 w-64 md:w-72 lg:w-80 cursor-pointer" data-category-key="${key}">
                        <div class="grid grid-cols-2 grid-rows-2 gap-1 rounded-lg overflow-hidden aspect-[2/3] bg-gray-800 pointer-events-none">${imagePlaceholders}</div>
                        <h3 class="mt-3 text-lg font-medium text-center text-gray-200 pointer-events-none">${category.title}</h3>
                     </div>`;
        }).join('');
        this.showScrollButtons();
    }

    setupEventListeners(categoryClickHandler) {
        this.scrollLeftBtn.addEventListener('click', () => this.scroll(-1));
        this.scrollRightBtn.addEventListener('click', () => this.scroll(1));
        
        this.galleryContainer.addEventListener('click', (e) => {
            const categoryItem = e.target.closest('.category-item');
            if (categoryItem) {
                const key = categoryItem.dataset.categoryKey;
                categoryClickHandler(key);
            }
        });
    }

    scroll(direction) {
        const firstItem = this.galleryContainer.querySelector('.category-item');
        if (firstItem) {
            const scrollAmount = (firstItem.offsetWidth + 24) * direction; 
            this.galleryContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
    
    showScrollButtons() { this.scrollLeftBtn.classList.remove('hidden'); this.scrollRightBtn.classList.remove('hidden'); }
    
    displayError(message) { this.galleryContainer.innerHTML = `<div class="text-center w-full text-yellow-400 bg-yellow-900/50 p-4 rounded-lg"><strong>Помилка:</strong> ${message}</div>`; }
}