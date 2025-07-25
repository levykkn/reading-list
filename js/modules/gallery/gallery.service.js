export class GalleryService {
    constructor(api, dataService) {
        this.api = api;
        this.dataService = dataService;
        this.categories = null;
    }

    async getCategoriesWithCovers() {
        const data = await this.dataService.loadData('data/data.json');
        this.categories = data.categories;

        const categoriesWithCovers = {};
        for (const key in this.categories) {
            const category = this.categories[key];
            const coverPromises = category.books.map(book => this.api.fetchBookDetails(book).then(details => details?.coverUrl));
            const covers = await Promise.all(coverPromises);
            categoriesWithCovers[key] = {
                ...category,
                covers: covers.map((url, i) => ({ url, query: category.books[i] }))
            };
        }
        return categoriesWithCovers;
    }

    getCategory(key) {
        return this.categories ? this.categories[key] : null;
    }
}