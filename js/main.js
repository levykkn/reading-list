import { API_KEY } from './config.js';
import { App } from './app.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const app = new App(API_KEY);
    app.init();
});
