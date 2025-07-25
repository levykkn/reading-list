import { App } from './core/app.js';
import { dependencies } from './core/dependencies.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new App(dependencies);
    app.init();
});

//