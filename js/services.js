document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('addServiceBtn').addEventListener('click', () => {
        location.href = 'add-service.html';
    });
    await loadServices();
});

async function loadServices() {
    try {
        const services = await getAllServices();
        const currentOdometer = await getCurrentOdometer();
        const container = document.getElementById('servicesList');
        
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
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('servicesList').innerHTML = `<div class="empty-state-mini">Error al cargar servicios</div>`;
    }
}

async function getCurrentOdometer() {
    const lastFuel = await getLastFuel();
    if (lastFuel) return lastFuel.odometer;
    const initialKm = getInitialKm();
    return initialKm || 0;
}

function editService(id) {
    location.href = `edit-service.html?id=${id}`;
}