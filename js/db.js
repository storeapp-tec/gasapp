// ===== FUNCIONES PARA SERVICIOS (continuación) =====

// Actualizar servicio
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
            
            // Actualizar campos
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

// Eliminar servicio
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

// Obtener servicio por ID
async function getServiceById(id) {
    const all = await getAllServices();
    return all.find(s => s.id === id) || null;
}