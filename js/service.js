export class GalleryService {
    constructor(api) { this.api = api; this.data = null; }
    
    async loadData(url) { 
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load data from ${url}`);
        }
        this.data = await response.json();
        return this.data;
    }

    async getCategoriesWithCovers() {
                // This check is now correctly placed within the App's logic flow
                // and doesn't need to call loadData itself.
                const categoriesWithCovers = {};
                for (const key in this.data.categories) {
                    const category = this.data.categories[key];
                    const coverPromises = category.books.map(book => this.api.fetchCover(book));
                    const covers = await Promise.all(coverPromises);
                    categoriesWithCovers[key] = {
                        ...category,
                        covers: covers.map((url, i) => ({ url: url, query: category.books[i] }))
                    };
                }
                return categoriesWithCovers;
            }
}
