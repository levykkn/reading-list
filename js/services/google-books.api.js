export class GoogleBooksAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://www.googleapis.com/books/v1/volumes';
        this.cache = new Map();
    }

    async fetchBookDetails(query) {
        if (!this.apiKey) return null;

        const cacheKey = `book_${query}`;

        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        if (this.cache.has(query)) {
            return this.cache.get(query);
        }

        const preferredQuery = `${query} (inpublisher:"Penguin Publishing Group" OR inpublisher:"OUP Oxford")`;
        let details = await this._executeFetch(preferredQuery);

        if (!details) {
            details = await this._executeFetch(query);
        }
        
        if (details) {
            localStorage.setItem(cacheKey, JSON.stringify(details));
            this.cache.set(query, details);
        }

        return details || { query }; 
    }

    /**
     * Helper method to execute the fetch request and process the result.
     * @private
     */
    async _executeFetch(searchQuery) {
        const url = `${this.baseUrl}?q=${encodeURIComponent(searchQuery)}&maxResults=1&key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (!data.items || data.items.length === 0) {
                return null; // Return null if no items are found.
            }

            const book = data.items[0].volumeInfo;
            const isbn = book.industryIdentifiers?.find(id => id.type === 'ISBN_13' || id.type === 'ISBN_10');
            
            return {
                title: book.title,
                author: book.authors ? book.authors.join(', ') : 'Невідомий автор',
                coverUrl: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail,
                isbn: isbn ? isbn.identifier : 'N/A',
                publishedDate: book.publishedDate ? book.publishedDate.substring(0, 4) : 'N/A',
                description: book.description || 'Опис відсутній.'
            };
        } catch (error) {
            console.error(`API Error for "${searchQuery}":`, error);
            return null;
        }
    }
}