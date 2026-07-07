// Formatear número con comas
function formatNumber(num) {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Formatear fecha corta (dd/mm)
function formatShortDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

// Formatear fecha completa
function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
}

// Calcular consumo km/l
function calculateConsumption(prevOdometer, currOdometer, liters) {
    const km = currOdometer - prevOdometer;
    if (km <= 0 || liters <= 0) return 0;
    return km / liters;
}

// Obtener color según rendimiento
function getConsumptionColor(kmL) {
    if (kmL >= 15) return 'consumption-excellent';
    if (kmL >= 10) return 'consumption-good';
    return 'consumption-poor';
}

// Obtener emoji según rendimiento
function getConsumptionEmoji(kmL) {
    if (kmL >= 15) return '🟢';
    if (kmL >= 10) return '🟡';
    return '🔴';
}

// Mostrar toast
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Obtener mes actual
function getCurrentMonth() {
    const now = new Date();
    return now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

// Obtener nombre del mes
function getMonthName(month) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month];
}

// Guardar y obtener configuración del auto
function saveCarName(name) {
    localStorage.setItem('carName', name);
}

function getCarName() {
    return localStorage.getItem('carName') || 'Nissan March';
}

// Guardar y obtener último precio
function saveLastPrice(price) {
    localStorage.setItem('lastPrice', price);
}

function getLastPrice() {
    return localStorage.getItem('lastPrice') || null;
}
