const fs = require('fs/promises');
const path = require('path');

// Path to the JSON "database"
const DB_PATH = path.join(__dirname, '..', 'data', 'data.json');

class CourseService {
    /**
     * Reads all courses from the data file.
     * @returns {Promise<Object>} The parsed JSON data.
     */
    async getCourses() {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    }

    /**
     * Adds a new course to the data file.
     * @param {Object} newCourseData - Data for the new course.
     * @returns {Promise<Object>} The newly added course object.
     */
    async createCourse(newCourseData) {
        const db = await this.getCourses();

        const newCourse = {
            id: newCourseData.title
                ? newCourseData.title.toLowerCase().replace(/\s+/g, '-')
                : Date.now().toString(), // fallback in case there's no title
            ...newCourseData
        };

        // Assuming your data structure is { categories: [...] }
        if (!Array.isArray(db.categories)) {
            db.categories = [];
        }
        db.categories.push(newCourse);

        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        return newCourse;
    }
}

module.exports = new CourseService();