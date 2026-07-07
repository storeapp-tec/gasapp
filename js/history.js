let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

document.addEventListener('DOMContentLoaded', () => {
    updateHistory();
    
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
        document.getElementById('currentMonthDisplay').textContent = 
            `${getMonthName(currentMonth)} ${currentYear}`;
        
        const fuels = await getFuelsByMonth(currentYear, currentMonth);
        const allFuels = await getAllFuels();
        
        updateSummary(fuels);
        
        const container = document.getElementById('historyList');
        
        if (allFuels.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    📭 No hay registros aún<br>
                    <small>Agrega tu primera carga de combustible</small>
                </div>
            `;
            return;
        }
        
        if (fuels.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    📭 No hay registros en ${getMonthName(currentMonth)} ${currentYear}<br>
                    <small>Selecciona otro mes o agrega una carga</small>
                </div>
            `;
            return;
        }
        
        fuels.sort((a, b) => b.date.localeCompare(a.date));
        
        let html = '';
        const initialKm = getInitialKm();
        
        for (let i = 0; i < fuels.length; i++) {
            const fuel = fuels[i];
            let prev = null;
            let consumption = 0;
            
            if (i < fuels.length - 1) {
                prev = fuels[i + 1];
            } else {
                const allFuelsSorted = await getAllFuels();
                const currentIndex = allFuelsSorted.findIndex(f => f.id === fuel.id);
                if (currentIndex < allFuelsSorted.length - 1) {
                    prev = allFuelsSorted[currentIndex + 1];
                } else if (initialKm) {
                    consumption = calculateConsumption(initialKm, fuel.odometer, fuel.liters);
                }
            }
            
            if (prev) {
                consumption = calculateConsumption(prev.odometer, fuel.odometer, fuel.liters);
            }
            
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
        document.getElementById('historyList').innerHTML = `
            <div class="empty-state">
                📭 Sin datos para mostrar<br>
                <small>Agrega tu primera carga de combustible</small>
            </div>
        `;
    }
}

function updateSummary(fuels) {
    const allFuels = getAllFuels();
    
    if (!allFuels || allFuels.length === 0) {
        document.getElementById('summaryMonth').textContent = '---';
        document.getElementById('summaryTotal').textContent = '$0';
        document.getElementById('summaryLiters').textContent = '0 L';
        document.getElementById('summaryAvg').textContent = '0 km/L';
        return;
    }
    
    if (fuels.length === 0) {
        document.getElementById('summaryMonth').textContent = getMonthName(currentMonth).substring(0, 3);
        document.getElementById('summaryTotal').textContent = '$0';
        document.getElementById('summaryLiters').textContent = '0 L';
        document.getElementById('summaryAvg').textContent = '0 km/L';
        return;
    }
    
    const total = fuels.reduce((sum, f) => sum + f.totalCost, 0);
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
    
    const liters = fuels.reduce((sum, f) => sum + f.liters, 0);
    document.getElementById('summaryLiters').textContent = `${liters.toFixed(1)} L`;
    
    let totalConsumption = 0;
    let validCount = 0;
    const initialKm = getInitialKm();
    
    for (let i = 0; i < fuels.length; i++) {
        const curr = fuels[i];
        let prev = null;
        
        if (i < fuels.length - 1) {
            prev = fuels[i + 1];
        } else {
            const allFuelsSorted = getAllFuels();
            const currentIndex = allFuelsSorted.findIndex(f => f.id === curr.id);
            if (currentIndex < allFuelsSorted.length - 1) {
                prev = allFuelsSorted[currentIndex + 1];
            } else if (initialKm) {
                const consumption = calculateConsumption(initialKm, curr.odometer, curr.liters);
                if (consumption > 0) {
                    totalConsumption += consumption;
                    validCount++;
                }
                continue;
            }
        }
        
        if (prev) {
            const consumption = calculateConsumption(prev.odometer, curr.odometer, curr.liters);
            if (consumption > 0) {
                totalConsumption += consumption;
                validCount++;
            }
        }
    }
    
    const avg = validCount > 0 ? totalConsumption / validCount : 0;
    document.getElementById('summaryAvg').textContent = `${avg.toFixed(1)} km/L`;
    document.getElementById('summaryMonth').textContent = getMonthName(currentMonth).substring(0, 3);
}