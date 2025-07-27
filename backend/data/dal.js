const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

class DataAccessLayer {
    /**
     * Reads and parses the entire data file.
     * @returns {Promise<Object>} The parsed JSON data from the file.
     */
    async readData() {
        try {
            const data = await fs.readFile(DB_PATH, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return { categories: [] }; 
            }
            console.error("Error reading data file:", error);
            throw error;
        }
    }

    /**
     * Writes the given data object to the JSON file.
     * @param {Object} data - The JavaScript object to write to the file.
     * @returns {Promise<void>}
     */
    async writeData(data) {
        try {
            await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.error("Error writing data file:", error);
            throw error;
        }
    }
}


module.exports = new DataAccessLayer();
