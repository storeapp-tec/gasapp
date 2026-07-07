document.addEventListener('DOMContentLoaded', async () => {
    // Fecha actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('serviceDate').value = today;
    
    // Precargar odómetro actual
    const lastFuel = await getLastFuel();
    if (lastFuel) {
        document.getElementById('serviceOdometer').value = lastFuel.odometer;
        // Sugerir próximo servicio (odómetro + 5000 como ejemplo)
        document.getElementById('serviceNextKm').placeholder = `Ej: ${lastFuel.odometer + 5000}`;
    }
});

// Enviar formulario
document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const date = document.getElementById('serviceDate').value;
    const type = document.getElementById('serviceType').value;
    const odometer = parseFloat(document.getElementById('serviceOdometer').value);
    const nextKm = parseFloat(document.getElementById('serviceNextKm').value);
    const notes = document.getElementById('serviceNotes').value;
    
    // Validaciones
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