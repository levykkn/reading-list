export class GalleryUI {
constructor(rootSelector, modalRootSelector) {
                this.root = document.querySelector(rootSelector);
                this.modalRoot = document.querySelector(modalRootSelector);
                this.galleryContainer = this.root.querySelector('#gallery-container');
                this.scrollLeftBtn = this.root.querySelector('#scroll-left');
                this.scrollRightBtn = this.root.querySelector('#scroll-right');
            }
            
            renderInitialStructure(categories) {
                this.galleryContainer.innerHTML = Object.keys(categories).map(key => {
                    const category = categories[key];
                    const imagePlaceholders = category.books.map((_, index) => `<div id="cover-${key}-${index}" class="w-full h-full bg-gray-700 flex items-center justify-center"><div class="loader"></div></div>`).join('');
                    return `<div class="category-item snap-start flex-shrink-0 w-64 md:w-72 lg:w-80" data-category-key="${key}">
                                <div class="grid grid-cols-2 grid-rows-2 gap-1 rounded-lg overflow-hidden aspect-[2/3] bg-gray-800 pointer-events-none">${imagePlaceholders}</div>
                                <h3 class="mt-3 text-lg font-medium text-center text-gray-200 pointer-events-none">${category.title}</h3>
                             </div>`;
                }).join('');
            }
            
            updateBookCover(key, index, cover) {
                const placeholderDiv = document.getElementById(`cover-${key}-${index}`);
                if (placeholderDiv) {
                    const img = document.createElement('img');
                    img.src = cover.url || `https://placehold.co/300x450/27272a/f3f4f6?text=${encodeURIComponent(cover.query.split(' ')[0])}`;
                    img.alt = `Обкладинка: ${cover.query}`;
                    img.className = "w-full h-full object-cover";
                    img.onerror = () => { img.src = `https://placehold.co/300x450/27272a/f3f4f6?text=?`; };
                    placeholderDiv.replaceWith(img);
                }
            }
            
            renderModal(category) {
                const modalHTML = `
                    <div id="course-modal" class="fixed inset-0 modal-backdrop flex items-center justify-center p-4 z-50">
                        <div class="bg-gray-800 text-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative animate-fade-in">
                            <button id="modal-close-btn" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                            <h2 class="text-2xl font-bold mb-2">${category.title}</h2>
                            <p class="text-gray-300 mb-4">${category.description}</p>
                            <h3 class="font-semibold mb-2">Ключові твори:</h3>
                            <ul class="list-disc list-inside text-gray-400">${category.books.map(book => `<li>${book}</li>`).join('')}</ul>
                        </div>
                    </div>`;
                this.modalRoot.innerHTML = modalHTML;
                
                const modal = this.modalRoot.querySelector('#course-modal');
                modal.querySelector('#modal-close-btn').addEventListener('click', this.destroyModal.bind(this));
                modal.addEventListener('click', (e) => { if (e.target === modal) this.destroyModal(); });
            }

            destroyModal() {
                this.modalRoot.innerHTML = '';
            }

            showScrollButtons() { this.scrollLeftBtn.classList.remove('hidden'); this.scrollRightBtn.classList.remove('hidden'); }
            
            displayError(message) { this.galleryContainer.innerHTML = `<div class="text-center w-full text-yellow-400 bg-yellow-900/50 p-4 rounded-lg"><strong>Помилка:</strong> ${message}</div>`; }
        }
