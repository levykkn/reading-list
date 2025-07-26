export class APIService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch from endpoint: ${endpoint}`, error);
            throw error; 
        }
    }
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'API request failed');
            }
            return responseData;
        } catch (error) {
            console.error(`Failed to post to endpoint: ${endpoint}`, error);
            throw error;
        }
    }
}