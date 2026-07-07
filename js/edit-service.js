let serviceId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    serviceId = parseInt(params.get('id'));
    
    if (!serviceId) {
        showToast('❌ Servicio no encontrado', 'error');
        setTimeout(() => location.href = 'index.html', 1500);
        return;
    }
    
    await loadServiceData(serviceId);
});

async function loadServiceData(id) {
    try {
        const service = await getServiceById(id);
        
        if (!service) {
            showToast('❌ Servicio no encontrado', 'error');
            setTimeout(() => location.href = 'index.html', 1500);
            return;
        }
        
        document.getElementById('editServiceId').value = service.id;
        document.getElementById('editServiceDate').value = service.date;
        document.getElementById('editServiceType').value = service.type;
        document.getElementById('editServiceOdometer').value = service.odometer;
        document.getElementById('editServiceNextKm').value = service.nextKm;
        document.getElementById('editServiceNotes').value = service.notes || '';
        
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Error al cargar el servicio', 'error');
    }
}

document.getElementById('editServiceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editServiceId').value);
    const date = document.getElementById('editServiceDate').value;
    const type = document.getElementById('editServiceType').value;
    const odometer = parseFloat(document.getElementById('editServiceOdometer').value);
    const nextKm = parseFloat(document.getElementById('editServiceNextKm').value);
    const notes = document.getElementById('editServiceNotes').value;
    
    if (!date || !type || !odometer || !nextKm) {
        showToast('❌ Todos los campos son obligatorios', 'error');
        return;
    }
    
    if (odometer < 0 || nextKm <= odometer) {
        showToast('❌ El próximo servicio debe ser mayor al odómetro actual', 'error');
        return;
    }
    
    try {
        await updateService(id, { date, type, odometer, nextKm, notes });
        showToast('✅ Servicio actualizado', 'success');
        setTimeout(() => location.href = 'index.html', 1500);
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Error al actualizar', 'error');
    }
});

document.getElementById('deleteServiceBtn').addEventListener('click', async () => {
    if (!confirm('¿Eliminar este servicio permanentemente?')) return;
    
    try {
        await deleteService(parseInt(document.getElementById('editServiceId').value));
        showToast('🗑️ Servicio eliminado', 'success');
        setTimeout(() => location.href = 'index.html', 1500);
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Error al eliminar', 'error');
    }
});