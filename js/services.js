document.addEventListener('DOMContentLoaded', async () => {
    console.log('Servicios cargado');
    
    const addBtn = document.getElementById('addServiceBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            window.location.href = 'add-service.html';
        });
    }
    
    await loadServices();
});

async function loadServices() {
    try {
        console.log('Cargando servicios...');
        const services = await getAllServices();
        const currentOdometer = await getCurrentOdometer();
        const container = document.getElementById('servicesList');
        
        if (!container) return;
        
        if (services.length === 0) {
            container.innerHTML = `
                <div class="empty-state-mini">
                    No hay servicios registrados<br>
                    <small style="color:#bbb;">Presiona + para agregar</small>
                </div>
            `;
            return;
        }
        
        let html = '';
        services.forEach(service => {
            const kmLeft = service.nextKm - currentOdometer;
            let statusClass = 'status-ok';
            let statusText = '✅ OK';
            
            if (kmLeft <= 0) {
                statusClass = 'status-danger';
                statusText = '⚠️ Vencido';
            } else if (kmLeft <= 500) {
                statusClass = 'status-warning';
                statusText = `⏳ ${formatNumber(kmLeft)} km`;
            } else {
                statusText = `✅ ${formatNumber(kmLeft)} km`;
            }
            
            html += `
                <div class="service-item-compact" onclick="editService(${service.id})">
                    <div class="service-left-compact">
                        <div class="service-name-compact">${service.type}</div>
                        <div class="service-date-compact">${formatDateFull(service.date)}</div>
                    </div>
                    <div class="service-right-compact">
                        <div class="service-km-compact">${formatNumber(service.nextKm)} km</div>
                        <div class="service-status-compact ${statusClass}">${statusText}</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        
        console.log('Servicios cargados correctamente');
        
    } catch (error) {
        console.error('Error al cargar servicios:', error);
        const container = document.getElementById('servicesList');
        if (container) {
            container.innerHTML = `<div class="empty-state-mini">Error al cargar servicios</div>`;
        }
    }
}

async function getCurrentOdometer() {
    const lastFuel = await getLastFuel();
    if (lastFuel) return lastFuel.odometer;
    const initialKm = getInitialKm();
    return initialKm || 0;
}

window.editService = function(id) {
    window.location.href = `edit-service.html?id=${id}`;
};