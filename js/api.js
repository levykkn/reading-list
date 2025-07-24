export class GoogleBooksAPI {
            constructor(apiKey) { this.apiKey = apiKey; this.baseUrl = 'https://www.googleapis.com/books/v1/volumes'; }
            async fetchCover(query) {
                if (!this.apiKey) return null;
                const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&maxResults=1&key=${this.apiKey}`;
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    if (data.items && data.items.length > 0) {
                        const imageLinks = data.items[0].volumeInfo.imageLinks;
                        return imageLinks?.thumbnail || imageLinks?.smallThumbnail || null;
                    }
                    return null;
                } catch (error) {
                    console.error(`API Error for "${query}":`, error);
                    return null;
                }
            }
        }