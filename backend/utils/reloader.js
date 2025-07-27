const chokidar = require('chokidar');
const path = require('path');

const DIRS_TO_WATCH = [
    '../routes',
    '../controllers',
    '../services',
    '../data',
    '../utils'
];

function initReloader() {
    console.log('Hot-reloader activated for development.');

    const watcher = chokidar.watch(
        DIRS_TO_WATCH.map(dir => path.join(__dirname, dir)),
        {
            ignored: /(^|[\/\\])\../, // Ignore dotfiles (e.g., .git).
            persistent: true,
            ignoreInitial: true, 
        }
    );

    watcher.on('change', (filePath) => {
        const absolutePath = path.resolve(filePath);

        if (absolutePath === __filename) return;

        if (require.cache[absolutePath]) {
            delete require.cache[absolutePath];
            const relativePath = path.relative(process.cwd(), absolutePath);
            console.log(`🔄 Module reloaded: ${relativePath}`);
        }
    });

    watcher.on('error', error => console.error(`[Reloader] Watcher error: ${error}`));
}

module.exports = initReloader;
