import { app, BrowserWindow } from 'electron';
import path from 'path'; // Módulo de Node.js para trabajar con rutas de archivos de forma segura, 
// independiente del sistema operativo.
import { fileURLToPath } from 'url'; // Convierte un URL de archivo (como import.meta.url) 
// en una ruta del sistema operativo.

const __filename = fileURLToPath(import.meta.url); // ruta completa del archivo actual (main.js)
const __dirname = path.dirname(__filename); // carpeta donde se ubica el archivo actual

let mainWindow;
let splash;

function createWindow() {
    // Mostramos el Splash, Pantalla de carga
    splash = new BrowserWindow({
        // Definimos los atributos de la ventana
        width: 400,
        height: 300,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        roundedCorners: true,
    });
    splash.loadFile(path.join(__dirname, 'splash.html'));

    // Main Window
    const mainWindow = new BrowserWindow({
        // Definimos los atributos de la ventana
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.setMenu(null);
    // En desarrollo cargamos vite
    mainWindow.loadURL('http://localhost:5173');

    // En producción usaremos 
    // win.loadFile('dist/index.html');

    // Cuando termine de cargar React, cerramos splash y mostramos la ventana
    mainWindow.once('ready-to-show', () => {
        // Simulamos tiempo de carga extra
        setTimeout(() => {
            splash.destroy();
            mainWindow.show();
        }, 2000);
    });
}
// Esperamos que la app este lista
app.whenReady().then(createWindow);

// Cerramos la app correctamente, cuando todas las ventanas esten cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});