const dal = require('../data/dal');

class CourseService {
    async getCourses() {
        return await dal.readData();
    }

    async createCourse(newCourseData) {
        const db = await dal.readData();
        
        const newCourse = {
            id: `course-${Date.now()}`, // Generate a unique ID
            ...newCourseData
        };

        if (!Array.isArray(db.categories)) {
            db.categories = [];
        }
        db.categories.push(newCourse);

        await dal.writeData(db);
        return newCourse;
    }

    async updateCourse(courseId, courseData) {
        const db = await dal.readData();
        const courseIndex = db.categories.findIndex(c => c.id === courseId);

        if (courseIndex === -1) {
            return null; // Course not found
        }

        db.categories[courseIndex] = { ...db.categories[courseIndex], ...courseData };
        
        await dal.writeData(db);
        return db.categories[courseIndex];
    }

    async deleteCourse(courseId) {
        const db = await dal.readData();
        const initialLength = db.categories.length;
        
        db.categories = db.categories.filter(c => c.id !== courseId);

        if (db.categories.length === initialLength) {
            return false; // Course not found, nothing deleted
        }

        await dal.writeData(db);
        return true; // Deletion was successful
    }
}

module.exports = new CourseService();
