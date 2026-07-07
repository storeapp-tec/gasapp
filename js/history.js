let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', async () => {
    await populateMonthSelector();
    await updateHistory();
    
    document.getElementById('monthSelect').addEventListener('change', async () => {
        const [year, month] = document.getElementById('monthSelect').value.split('-').map(Number);
        currentYear = year;
        currentMonth = month;
        await updateHistory();
    });
});

async function populateMonthSelector() {
    const allFuels = await getAllFuels();
    if (allFuels.length === 0) {
        const select = document.getElementById('monthSelect');
        select.innerHTML = `<option value="${currentYear}-${currentMonth}">${getMonthName(currentMonth)} ${currentYear}</option>`;
        return;
    }
    
    // Obtener meses únicos con datos
    const monthsSet = new Set();
    allFuels.forEach(f => {
        const d = new Date(f.date + 'T00:00:00');
        monthsSet.add(`${d.getFullYear()}-${d.getMonth()}`);
    });
    
    const months = Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
    
    const select = document.getElementById('monthSelect');
    select.innerHTML = '';
    months.forEach(m => {
        const [year, month] = m.split('-').map(Number);
        const option = document.createElement('option');
        option.value = m;
        option.textContent = `${getMonthName(month)} ${year}`;
        if (year === currentYear && month === currentMonth) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

async function updateHistory() {
    try {
        const fuels = await getFuelsByMonth(currentYear, currentMonth);
        const allFuels = await getAllFuels();
        
        // Resumen
        if (allFuels.length === 0) {
            document.getElementById('summaryMonth').textContent = '---';
            document.getElementById('summaryTotal').textContent = '$0';
            document.getElementById('summaryLiters').textContent = '0 L';
            document.getElementById('summaryAvg').textContent = '0 km/L';
        } else if (fuels.length === 0) {
            document.getElementById('summaryMonth').textContent = getMonthName(currentMonth).substring(0, 3);
            document.getElementById('summaryTotal').textContent = '$0';
            document.getElementById('summaryLiters').textContent = '0 L';
            document.getElementById('summaryAvg').textContent = '0 km/L';
        } else {
            const total = fuels.reduce((sum, f) => sum + f.totalCost, 0);
            const liters = fuels.reduce((sum, f) => sum + f.liters, 0);
            
            let totalConsumption = 0, validCount = 0;
            const initialKm = getInitialKm();
            
            for (let i = 0; i < fuels.length; i++) {
                const curr = fuels[i];
                let prev = null;
                if (i < fuels.length - 1) {
                    prev = fuels[i + 1];
                } else {
                    const allSorted = await getAllFuels();
                    const idx = allSorted.findIndex(f => f.id === curr.id);
                    if (idx < allSorted.length - 1) {
                        prev = allSorted[idx + 1];
                    } else if (initialKm) {
                        const c = calculateConsumption(initialKm, curr.odometer, curr.liters);
                        if (c > 0) { totalConsumption += c; validCount++; }
                        continue;
                    }
                }
                if (prev) {
                    const c = calculateConsumption(prev.odometer, curr.odometer, curr.liters);
                    if (c > 0) { totalConsumption += c; validCount++; }
                }
            }
            
            document.getElementById('summaryMonth').textContent = getMonthName(currentMonth).substring(0, 3);
            document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
            document.getElementById('summaryLiters').textContent = `${liters.toFixed(1)} L`;
            document.getElementById('summaryAvg').textContent = `${(validCount > 0 ? totalConsumption / validCount : 0).toFixed(1)} km/L`;
        }
        
        // Lista
        const container = document.getElementById('historyList');
        if (allFuels.length === 0) {
            container.innerHTML = `<div class="empty-state-mini">Sin registros</div>`;
            return;
        }
        if (fuels.length === 0) {
            container.innerHTML = `<div class="empty-state-mini">Sin registros en este mes</div>`;
            return;
        }
        
        fuels.sort((a, b) => b.date.localeCompare(a.date));
        let html = '';
        const initialKm = getInitialKm();
        
        for (let i = 0; i < fuels.length; i++) {
            const fuel = fuels[i];
            let prev = null, consumption = 0;
            
            if (i < fuels.length - 1) {
                prev = fuels[i + 1];
            } else {
                const allSorted = await getAllFuels();
                const idx = allSorted.findIndex(f => f.id === fuel.id);
                if (idx < allSorted.length - 1) {
                    prev = allSorted[idx + 1];
                } else if (initialKm) {
                    consumption = calculateConsumption(initialKm, fuel.odometer, fuel.liters);
                }
            }
            if (prev) {
                consumption = calculateConsumption(prev.odometer, fuel.odometer, fuel.liters);
            }
            
            const cClass = getConsumptionColor(consumption);
            const emoji = getConsumptionEmoji(consumption);
            
            html += `
                <div class="history-item-compact" onclick="editFuel(${fuel.id})">
                    <div class="history-date-compact">${formatDateFull(fuel.date)}</div>
                    <div class="history-main-compact">
                        <span class="history-km-compact">📟 ${formatNumber(fuel.odometer)} km</span>
                        <span class="history-total-compact">$${fuel.totalCost.toFixed(2)}</span>
                    </div>
                    <div class="history-details-compact">
                        <span>⛽ ${fuel.liters.toFixed(1)} L</span>
                        <span>💰 $${fuel.pricePerLiter.toFixed(2)}/L</span>
                        <span class="history-consumption-compact ${cClass}">${emoji} ${consumption > 0 ? consumption.toFixed(1) : '0.0'} km/L</span>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('historyList').innerHTML = `<div class="empty-state-mini">Error al cargar</div>`;
    }
}

function editFuel(id) {
    location.href = `edit-fuel.html?id=${id}`;
}