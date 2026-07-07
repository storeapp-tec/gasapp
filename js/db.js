const DB_NAME = 'GasAppDB';
const DB_VERSION = 2;

let db = null;

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
            
            if (!db.objectStoreNames.contains('fuels')) {
                const store = db.createObjectStore('fuels', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                store.createIndex('date', 'date', { unique: false });
                store.createIndex('odometer', 'odometer', { unique: false });
            }
            
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

async function getAllFuels() {
    await openDB();
    return new Promise((resolve) => {
        try {
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
            request.onerror = () => resolve([]);
        } catch (error) {
            resolve([]);
        }
    });
}

async function getLastFuel() {
    const all = await getAllFuels();
    return all.length > 0 ? all[0] : null;
}

async function getFuelsByMonth(year, month) {
    const all = await getAllFuels();
    return all.filter(r => {
        const d = new Date(r.date + 'T00:00:00');
        return d.getFullYear() === year && d.getMonth() === month;
    });
}

// ===== FUNCIONES PARA SERVICIOS =====

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

async function getAllServices() {
    await openDB();
    return new Promise((resolve) => {
        try {
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
            request.onerror = () => resolve([]);
        } catch (error) {
            resolve([]);
        }
    });
}

async function getNextService(currentOdometer) {
    const all = await getAllServices();
    if (all.length === 0) return null;
    
    const pending = all.filter(s => s.nextKm > currentOdometer);
    if (pending.length === 0) return null;
    
    pending.sort((a, b) => a.nextKm - b.nextKm);
    return pending[0];
}

async function getServiceById(id) {
    const all = await getAllServices();
    return all.find(s => s.id === id) || null;
}

async function updateService(id, data) {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('services', 'readwrite');
        const store = transaction.objectStore('services');
        const request = store.get(id);
        
        request.onsuccess = (e) => {
            const service = e.target.result;
            if (!service) {
                reject(new Error('Servicio no encontrado'));
                return;
            }
            
            service.date = data.date;
            service.type = data.type;
            service.odometer = data.odometer;
            service.nextKm = data.nextKm;
            service.notes = data.notes || '';
            
            const updateRequest = store.put(service);
            updateRequest.onsuccess = () => resolve(updateRequest.result);
            updateRequest.onerror = () => reject(updateRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

async function deleteService(id) {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('services', 'readwrite');
        const store = transaction.objectStore('services');
        const request = store.delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}