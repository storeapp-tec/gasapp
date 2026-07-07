const DB_NAME = 'FuelioDB';
const DB_VERSION = 2;

let db = null;

// Abrir base de datos
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            
            // Store para cargas de combustible
            if (!db.objectStoreNames.contains('fuels')) {
                const store = db.createObjectStore('fuels', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                store.createIndex('date', 'date', { unique: false });
                store.createIndex('odometer', 'odometer', { unique: false });
            }
            
            // Store para servicios
            if (!db.objectStoreNames.contains('services')) {
                const store = db.createObjectStore('services', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                store.createIndex('date', 'date', { unique: false });
                store.createIndex('nextKm', 'nextKm', { unique: false });
            }
        };
    });
}

// ===== FUNCIONES PARA COMBUSTIBLE =====

// Insertar carga
async function addFuel(entry) {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('fuels', 'readwrite');
        const store = transaction.objectStore('fuels');
        const request = store.add(entry);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Obtener todas las cargas (más reciente primero)
async function getAllFuels() {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('fuels', 'readonly');
        const store = transaction.objectStore('fuels');
        const index = store.index('date');
        const request = index.openCursor(null, 'prev');
        
        const results = [];
        request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

// Obtener última carga
async function getLastFuel() {
    const all = await getAllFuels();
    return all.length > 0 ? all[0] : null;
}

// Obtener cargas por mes
async function getFuelsByMonth(year, month) {
    const all = await getAllFuels();
    return all.filter(r => {
        const d = new Date(r.date + 'T00:00:00');
        return d.getFullYear() === year && d.getMonth() === month;
    });
}

// ===== FUNCIONES PARA SERVICIOS =====

// Insertar servicio
async function addService(entry) {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('services', 'readwrite');
        const store = transaction.objectStore('services');
        const request = store.add(entry);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Obtener todos los servicios
async function getAllServices() {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('services', 'readonly');
        const store = transaction.objectStore('services');
        const index = store.index('date');
        const request = index.openCursor(null, 'prev');
        
        const results = [];
        request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

// Obtener próximo servicio (el que tenga nextKm más cercano al actual)
async function getNextService(currentOdometer) {
    const all = await getAllServices();
    if (all.length === 0) return null;
    
    // Filtrar servicios cuyo nextKm sea mayor al odómetro actual
    const pending = all.filter(s => s.nextKm > currentOdometer);
    if (pending.length === 0) return null;
    
    // Ordenar por nextKm (más cercano primero)
    pending.sort((a, b) => a.nextKm - b.nextKm);
    return pending[0];
}

// Actualizar servicio
async function updateService(id, data) {
    await openDB();
   
