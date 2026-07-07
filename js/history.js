let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

document.addEventListener('DOMContentLoaded', () => {
    updateHistory();
    
    // Navegación de meses
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateHistory();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateHistory();
    });
});

async function updateHistory() {
    try {
        // Actualizar título del mes
        document.getElementById('currentMonthDisplay').textContent = 
            `${getMonthName(currentMonth)} ${currentYear}`;
        
        // Obtener registros del mes
        const fuels = await getFuelsByMonth(currentYear, currentMonth);
        
        // Actualizar resumen
        updateSummary(fuels);
        
        // Mostrar lista
        const container = document.getElementById('historyList');
        
        if (fuels.length === 0) {
            container.innerHTML = '<div class="empty-state">📭 No hay registros en este mes</div>';
            return;
        }
        
        // Ordenar por fecha (más reciente primero)
        fuels.sort((a, b) => b.date.localeCompare(a.date));
        
        let html = '';
        for (let i = 0; i < fuels.length; i++) {
            const fuel = fuels[i];
            const prev = i < fuels.length - 1 ? fuels[i + 1] : null;
            const consumption = prev ? calculateConsumption(prev.odometer, fuel.odometer, fuel.liters) : 0;
            const consumptionClass = getConsumptionColor(consumption);
            const emoji = getConsumptionEmoji(consumption);
            
            html += `
                <div class="history-item">
                    <div class="date">${formatDate(fuel.date)}</div>
                    <div class="main-info">
                        <span class="km">📟 ${formatNumber(fuel.odometer)} km</span>
                        <span style="font-weight:700;color:#667eea;">$${fuel.totalCost.toFixed(2)}</span>
                    </div>
                    <div class="details">
                        <span>⛽ ${fuel.liters.toFixed(1)} L</span>
                        <span>💰 $${fuel.pricePerLiter.toFixed(2)}/L</span>
                        <span class="${consumptionClass}" style="font-weight:600;padding:2px 8px;border-radius:4px;">
                            ${emoji} ${consumption > 0 ? consumption.toFixed(1) : '0.0'} km/L
                        </span>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Error al cargar el historial', 'error');
    }
}

function updateSummary(fuels) {
    if (fuels.length === 0) {
        document.getElementById('summaryMonth').textContent = '---';
        document.getElementById('summaryTotal').textContent = '$0';
        document.getElementById('summaryLiters').textContent = '0 L';
        document.getElementById('summaryAvg').textContent = '0 km/L';
        return;
    }
    
    // Total gastado
    const total = fuels.reduce((sum, f) => sum + f.totalCost, 0);
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
    
    // Total litros
    const liters = fuels.reduce((sum, f) => sum + f.liters, 0);
    document.getElementById('summaryLiters').textContent = `${liters.toFixed(1)} L`;
    
    // Consumo promedio (usando todos los registros del mes)
    let totalConsumption = 0;
    let validCount = 0;
    for (let i = 0; i < fuels.length - 1; i++) {
        const curr = fuels[i];
        const prev = fuels[i + 1];
        const consumption = calculateConsumption(prev.odometer, curr.odometer, curr.liters);
        if (consumption > 0) {
            totalConsumption += consumption;
            validCount++;
        }
    }
    const avg = validCount > 0 ? totalConsumption / validCount : 0;
    document.getElementById('summaryAvg').textContent = `${avg.toFixed(1)} km/L`;
    
    // Mostrar mes en el resumen
    document.getElementById('summaryMonth').textContent = getMonthName(currentMonth).substring(0, 3);
}