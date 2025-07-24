import { GalleryService } from './service.js';
import { GalleryUI } from './ui.js';
import { GoogleBooksAPI } from './api.js';


export class App {
            constructor(apiKey) {
                this.ui = new GalleryUI('#app-root', '#modal-root');
                this.api = new GoogleBooksAPI(apiKey);
                this.service = new GalleryService(this.api);
                this.categoriesData = null;
            }
            
            async init() {
                if (!this.api.apiKey) {
                    this.ui.displayError("Будь ласка, вставте ваш ключ Google Books API у змінну API_KEY у файлі js/config.js.");
                    return;
                }
                try {
                    const initialData = await this.service.loadData('data/data.json');
                    this.ui.renderInitialStructure(initialData.categories);
                    
                    this.categoriesData = await this.service.getCategoriesWithCovers();
                    
                    for (const key in this.categoriesData) {
                        this.categoriesData[key].covers.forEach((cover, index) => {
                            this.ui.updateBookCover(key, index, cover);
                        });
                    }
                    
                    this.setupEventListeners();
                    this.ui.showScrollButtons();
                } catch (error) {
                    console.error("Не вдалося ініціалізувати додаток:", error);
                    this.ui.displayError("Не вдалося завантажити дані. Перевірте консоль та переконайтеся, що Live Server запущено.");
                }
            }
            
            setupEventListeners() {
                const scrollContainer = this.ui.galleryContainer;
                this.ui.scrollLeftBtn.addEventListener('click', () => this.scroll(scrollContainer, -1));
                this.ui.scrollRightBtn.addEventListener('click', () => this.scroll(scrollContainer, 1));
                
                scrollContainer.addEventListener('click', (e) => {
                    const categoryItem = e.target.closest('.category-item');
                    if (categoryItem) {
                        const key = categoryItem.dataset.categoryKey;
                        if (this.categoriesData[key]) {
                            this.ui.renderModal(this.categoriesData[key]);
                        }
                    }
                });
            }
            
            scroll(container, direction) {
                const firstItem = container.querySelector('.category-item');
                if (firstItem) {
                    const scrollAmount = (firstItem.offsetWidth + 24) * direction; 
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }