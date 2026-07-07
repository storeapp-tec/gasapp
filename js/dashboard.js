// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    // Mostrar nombre del auto
    document.getElementById('carName').textContent = getCarName();
    
    // Editar nombre del auto
    document.getElementById('editCarName').addEventListener('click', () => {
        const newName = prompt('Nombre de tu auto:', getCarName());
        if (newName && newName.trim()) {
            saveCarName(newName.trim());
            document.getElementById('carName').textContent = newName.trim();
            showToast('✅ Nombre actualizado', 'success');
        }
    });
    
    // Botón para nueva carga
    document.getElementById('addFuelBtn').addEventListener('click', () => {
        location.href = 'add-fuel.html';
    });
    
    // Botón para servicios
    document.getElementById('serviceBtn').addEventListener('click', () => {
        const services = confirm('¿Agregar nuevo servicio?');
        if (services) {
            location.href = 'add-service.html';
        }
    });
    
    // Actualizar dashboard
    await updateDashboard();
});

// Actualizar dashboard
async function updateDashboard() {
    try {
        const allFuels = await getAllFuels();
        const lastFuel = await getLastFuel();
        
        // Actualizar odómetro
        if (lastFuel) {
            document.getElementById('currentOdometer').textContent = formatNumber(lastFuel.odometer);
        } else {
            document.getElementById('currentOdometer').textContent = '0';
        }
        
        // Mostrar últimas 5 cargas
        const container = document.getElementById('lastFuels');
        if (allFuels.length === 0) {
            container.innerHTML = '<div class="empty-state">🚗 No hay registros aún<br><small>Agrega tu primera carga</small></div>';
        } else {
            const latest = allFuels.slice(0, 5);
            let html = '';
            for (let i = 0; i < latest.length; i++) {
                const fuel = latest[i];
                const prev = i < allFuels.length - 1 ? allFuels[i + 1] : null;
                const consumption = prev ? calculateConsumption(prev.odometer, fuel.odometer, fuel.liters) : 0;
                const consumptionClass = getConsumptionColor(consumption);
                const emoji = getConsumptionEmoji(consumption);
                
                html += `
                    <div class="fuel-item">
                        <div class="fuel-left">
                            <div class="fuel-date">${formatShortDate(fuel.date)}</div>
                            <div class="fuel-details">
                                <span class="fuel-liters">⛽ ${fuel.liters.toFixed(1)} L</span>
                                <span class="fuel-cost">$${fuel.totalCost.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="fuel-right">
                            <div class="fuel-consumption ${consumptionClass}">
                                ${emoji} ${consumption > 0 ? consumption.toFixed(1) : '0.0'} km/L
                            </div>
                        </div>
                    </div>
                `;
            }
            container.innerHTML = html;
        }
        
        // Verificar próximo servicio
        const currentOdometer = lastFuel ? lastFuel.odometer : 0;
        const nextService = await getNextService(currentOdometer);
        const alertDiv = document.getElementById('serviceAlert');
        
        if (nextService) {
            const kmLeft = nextService.nextKm - currentOdometer;
            if (kmLeft <= 500) {
                alertDiv.style.display = 'flex';
                document.getElementById('serviceDetail').textContent = nextService.type;
                document.getElementById('serviceKm').textContent = `⚠️ Faltan ${formatNumber(kmLeft)} km (programado: ${formatNumber(nextService.nextKm)} km)`;
                
                // Cambiar color según urgencia
                if (kmLeft <= 100) {
                    document.getElementById('serviceKm').style.color = '#ef4444';
                } else if (kmLeft <= 300) {
                    document.getElementById('serviceKm').style.color = '#f59e0b';
                } else {
                    document.getElementById('serviceKm').style.color = '#10b981';
                }
            } else {
                alertDiv.style.display = 'none';
            }
        } else {
            alertDiv.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error al actualizar:', error);
        showToast('Error al cargar los datos', 'error');
    }
}