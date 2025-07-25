import { GoogleBooksAPI } from '../services/google-books.api.js';
import { DataService } from '../services/data.service.js';
import { GalleryController } from '../modules/gallery/gallery.controller.js';
import { GalleryService } from '../modules/gallery/gallery.service.js';
import { GalleryUI } from '../modules/gallery/gallery.ui.js';
import { CourseController } from '../modules/course/course.controller.js';
import { CourseService } from '../modules/course/course.service.js';
import { CourseUI } from '../modules/course/course.ui.js';
import { API_KEY } from '../config.js';

const googleBooksAPI = new GoogleBooksAPI(API_KEY);
const dataService = new DataService();

const galleryUI = new GalleryUI('#app-root', '#modal-root');
const galleryService = new GalleryService(googleBooksAPI, dataService);
const galleryController = new GalleryController(galleryService, galleryUI);

const courseUI = new CourseUI();
const courseService = new CourseService(googleBooksAPI, dataService);
const courseController = new CourseController(courseService, courseUI);

export const dependencies = {
    galleryController,
    courseController
};