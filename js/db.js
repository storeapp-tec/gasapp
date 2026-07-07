// ===== FUNCIONES PARA EDITAR =====

async function updateFuel(id, data) {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('fuels', 'readwrite');
        const store = transaction.objectStore('fuels');
        const request = store.get(id);
        
        request.onsuccess = (e) => {
            const fuel = e.target.result;
            if (!fuel) {
                reject(new Error('Carga no encontrada'));
                return;
            }
            
            fuel.date = data.date;
            fuel.odometer = data.odometer;
            fuel.liters = data.liters;
            fuel.pricePerLiter = data.pricePerLiter;
            fuel.totalCost = data.totalCost;
            
            const updateRequest = store.put(fuel);
            updateRequest.onsuccess = () => resolve(updateRequest.result);
            updateRequest.onerror = () => reject(updateRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

async function deleteFuel(id) {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('fuels', 'readwrite');
        const store = transaction.objectStore('fuels');
        const request = store.delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function getFuelById(id) {
    const all = await getAllFuels();
    return all.find(f => f.id === id) || null;
}