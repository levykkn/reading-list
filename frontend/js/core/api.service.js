export class APIService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async _request(endpoint, options) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);
            
            // Handle cases with no content response (like DELETE)
            if (response.status === 204) {
                return null;
            }

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || `API Error: ${response.status}`);
            }
            return responseData;
        } catch (error) {
            console.error(`API request failed for ${options.method} ${endpoint}:`, error);
            throw error;
        }
    }

    get(endpoint) {
        return this._request(endpoint, { method: 'GET' });
    }

    post(endpoint, data) {
        return this._request(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    put(endpoint, data) {
        return this._request(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    delete(endpoint) {
        return this._request(endpoint, { method: 'DELETE' });
    }
}
