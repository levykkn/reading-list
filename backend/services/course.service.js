const dal = require('../data/dal'); // Import the new DAL

/**
 * The CourseService handles the business logic for courses.
 * It relies on the Data Access Layer (DAL) to interact with the data source.
 */
class CourseService {
    /**
     * Reads all courses from the data source via the DAL.
     * @returns {Promise<Object>} The courses data.
     */
    async getCourses() {
        // The service now calls the DAL to get data, abstracting the "how".
        return await dal.readData();
    }

    /**
     * Creates a new course and saves it to the data source via the DAL.
     * @param {Object} newCourseData - Data for the new course.
     * @returns {Promise<Object>} The newly added course object.
     */
    async createCourse(newCourseData) {
        // 1. Get current data from the DAL
        const db = await dal.readData();

        // 2. Perform business logic (create new course object)
        const newCourse = {
            id: newCourseData.title
                ? newCourseData.title.toLowerCase().replace(/\s+/g, '-')
                : Date.now().toString(), // fallback in case there's no title
            ...newCourseData
        };

        // Ensure the categories array exists before pushing to it
        if (!Array.isArray(db.categories)) {
            db.categories = [];
        }
        db.categories.push(newCourse);

        // 3. Write the updated data back using the DAL
        await dal.writeData(db);
        
        return newCourse;
    }
}

module.exports = new CourseService();
