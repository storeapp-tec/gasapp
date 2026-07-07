document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('carName').textContent = getCarName();
    
    document.getElementById('editCarName').addEventListener('click', () => {
        const currentName = getCarName();
        const newName = prompt('✏️ Editar nombre del auto:', currentName);
        if (newName && newName.trim()) {
            saveCarName(newName.trim());
            document.getElementById('carName').textContent = newName.trim();
            showToast('✅ Nombre actualizado', 'success');
        }
    });
    
    document.getElementById('addFuelBtn').addEventListener('click', () => {
        location.href = 'add-fuel.html';
    });
    
    document.getElementById('serviceBtn').addEventListener('click', async () => {
        try {
            const services = await getAllServices();
            
            if (services.length === 0) {
                const add = confirm('🔧 No hay servicios registrados.\n¿Quieres agregar uno nuevo?');
                if (add) location.href = 'add-service.html';
                return;
            }
            
            let options = '📋 Servicios guardados:\n\n';
            options += '0: ➕ Agregar nuevo servicio\n';
            const currentOdometer = await getCurrentOdometer();
            services.forEach((s, index) => {
                const kmLeft = s.nextKm - currentOdometer;
                options += `${index + 1}: ${s.type} (próximo: ${formatNumber(s.nextKm)} km, faltan ${formatNumber(kmLeft)} km)\n`;
            });
            options += '\nEscribe el número:';
            
            const choice = prompt(options);
            if (choice === null) return;
            
            const index = parseInt(choice);
            if (isNaN(index)) {
                showToast('❌ Opción inválida', 'error');
                return;
            }
            
            if (index === 0) {
                location.href = 'add-service.html';
            } else if (index > 0 && index <= services.length) {
                const service = services[index - 1];
                location.href = `edit-service.html?id=${service.id}`;
            } else {
                showToast('❌ Opción inválida', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('❌ Error al cargar servicios', 'error');
        }
    });
    
    await updateDashboard();
});

async function getCurrentOdometer() {
    const lastFuel = await getLastFuel();
    if (lastFuel) return lastFuel.odometer;
    
    const initialKm = getInitialKm();
    if (initialKm) return initialKm;
    
    return 0;
}

async function updateDashboard() {
    try {
        const allFuels = await getAllFuels();
        const lastFuel = await getLastFuel();
        const initialKm = getInitialKm();
        
        let currentOdometer = 0;
        if (lastFuel) {
            currentOdometer = lastFuel.odometer;
        } else if (initialKm) {
            currentOdometer = initialKm;
        }
        document.getElementById('currentOdometer').textContent = formatNumber(currentOdometer);
        
        if (!lastFuel && !initialKm) {
            document.getElementById('lastFuels').innerHTML = `
                <div class="empty-state">
                    🚗 Configura tu auto<br>
                    <small>Agrega tu primera carga o establece el km inicial</small>
                </div>
            `;
            document.getElementById('serviceAlert').style.display = 'none';
            return;
        }
        
        const container = document.getElementById('lastFuels');
        if (allFuels.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    📭 No hay cargas registradas<br>
                    <small>Agrega tu primera carga de combustible</small>
                </div>
            `;
        } else {
            const latest = allFuels.slice(0, 5);
            let html = '';
            for (let i = 0; i < latest.length; i++) {
                const fuel = latest[i];
                const prev = i < allFuels.length - 1 ? allFuels[i + 1] : null;
                let consumption = 0;
                if (prev) {
                    consumption = calculateConsumption(prev.odometer, fuel.odometer, fuel.liters);
                } else if (initialKm) {
                    consumption = calculateConsumption(initialKm, fuel.odometer, fuel.liters);
                }
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
        
        const nextService = await getNextService(currentOdometer);
        const alertDiv = document.getElementById('serviceAlert');
        
        if (nextService) {
            const kmLeft = nextService.nextKm - currentOdometer;
            if (kmLeft <= 500 && kmLeft > 0) {
                alertDiv.style.display = 'flex';
                document.getElementById('serviceDetail').textContent = nextService.type;
                document.getElementById('serviceKm').textContent = `⚠️ Faltan ${formatNumber(kmLeft)} km (programado: ${formatNumber(nextService.nextKm)} km)`;
                
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
        console.error('Error:', error);
        document.getElementById('lastFuels').innerHTML = `
            <div class="empty-state">
                📭 Sin datos para mostrar<br>
                <small>Agrega tu primera carga de combustible</small>
            </div>
        `;
    }
}