export class GoogleBooksAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://www.googleapis.com/books/v1/volumes';
        this.cache = new Map();
    }

    async fetchBookDetails(query) {
        if (!this.apiKey) return null;
        if (this.cache.has(query)) {
            return this.cache.get(query);
        }

        const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&maxResults=1&key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (!data.items || data.items.length === 0) return { query };
            
            const book = data.items[0].volumeInfo;
            const isbn = book.industryIdentifiers?.find(id => id.type === 'ISBN_13' || id.type === 'ISBN_10');
            
            const bookDetails = {
                query: query,
                title: book.title,
                author: book.authors ? book.authors.join(', ') : 'Невідомий автор',
                coverUrl: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail,
                isbn: isbn ? isbn.identifier : 'N/A',
                publishedDate: book.publishedDate ? book.publishedDate.substring(0, 4) : 'N/A',
                description: book.description || 'Опис відсутній.'
            };

            this.cache.set(query, bookDetails);
            return bookDetails;
        } catch (error) {
            console.error(`API Error for "${query}":`, error);
            return { query };
        }
    }
}