export class DataService {
    constructor() {
        this.data = null;
    }

    async loadData(url) {
        if (this.data) return this.data;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load data from ${url}`);
        }
        this.data = await response.json();
        return this.data;
    }
}