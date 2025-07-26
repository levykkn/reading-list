const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'data.json');

class CourseService {
    async getCourses() {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    }

    async createCourse(newCourseData) {
        const db = await this.getCourses();
        const newCourse = {
            id: newCourseData.title.toLowerCase().replace(/\s+/g, '-'),
            ...newCourseData
        };
        db.categories.push(newCourse);
        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
        return newCourse;
    }
}

module.exports = new CourseService();