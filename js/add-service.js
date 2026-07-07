document.addEventListener('DOMContentLoaded', async () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('serviceDate').value = today;
    
    const currentOdometer = await getCurrentOdometer();
    if (currentOdometer > 0) {
        document.getElementById('serviceOdometer').value = currentOdometer;
        document.getElementById('serviceNextKm').placeholder = `Ej: ${currentOdometer + 5000}`;
    }
});

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const date = document.getElementById('serviceDate').value;
    const type = document.getElementById('serviceType').value;
    const odometer = parseFloat(document.getElementById('serviceOdometer').value);
    const nextKm = parseFloat(document.getElementById('serviceNextKm').value);
    const notes = document.getElementById('serviceNotes').value;
    
    if (!date || !type || !odometer || !nextKm) {
        showToast('❌ Todos los campos son obligatorios', 'error');
        return;
    }
    
    if (odometer < 0 || nextKm <= odometer) {
        showToast('❌ El próximo servicio debe ser mayor al odómetro actual', 'error');
        return;
    }
    
    const entry = {
        date,
        type,
        odometer,
        nextKm,
        notes: notes || ''
    };
    
    try {
        await addService(entry);
        showToast('✅ Servicio guardado exitosamente', 'success');
        
        setTimeout(() => {
            location.href = 'index.html';
        }, 1500);
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Error al guardar el servicio', 'error');
    }
});

// Función auxiliar para obtener el odómetro actual
async function getCurrentOdometer() {
    const lastFuel = await getLastFuel();
    if (lastFuel) return lastFuel.odometer;
    const initialKm = getInitialKm();
    return initialKm || 0;
}