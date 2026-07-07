/* ===== RESET Y BASE ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
    background: #f5f7fa;
    color: #1a1a2e;
    font-size: 14px;
    line-height: 1.4;
}

.app {
    max-width: 480px;
    margin: 0 auto;
    padding: 12px 16px 80px;
}

/* ===== HEADER MINI ===== */
.header-mini {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 16px 18px 20px;
    color: white;
    margin-bottom: 12px;
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.car-name-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.car-name {
    font-size: 16px;
    font-weight: 600;
}

.btn-edit-car {
    background: rgba(255,255,255,0.15);
    border: none;
    color: white;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    height: 22px;
    display: flex;
    align-items: center;
}

.app-name {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.8;
    letter-spacing: 0.5px;
}

.odometer-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
}

.odo-label {
    font-size: 12px;
    opacity: 0.7;
}

.odo-value {
    font-size: 32px;
    font-weight: 700;
    cursor: pointer;
    padding: 2px 10px;
    border-radius: 8px;
    transition: background 0.2s;
    user-select: none;
}

.odo-value.clickable:hover {
    background: rgba(255,255,255,0.1);
}

.odo-value.clickable:active {
    background: rgba(255,255,255,0.2);
    transform: scale(0.96);
}

.odo-unit {
    font-size: 14px;
    opacity: 0.7;
}

/* ===== MODAL ===== */
.modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
    z-index: 999;
    justify-content: center;
    align-items: center;
}

.modal-overlay.active {
    display: flex;
}

.modal-box {
    background: white;
    border-radius: 16px;
    padding: 24px 20px;
    width: 90%;
    max-width: 340px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

.modal-box h3 {
    font-size: 16px;
    margin-bottom: 12px;
    text-align: center;
}

.modal-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 16px;
    text-align: center;
    margin-bottom: 16px;
}

.modal-input:focus {
    border-color: #667eea;
    outline: none;
}

.modal-actions {
    display: flex;
    gap: 10px;
}

.modal-actions button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}

.btn-modal-cancel {
    background: #f3f4f6;
    color: #666;
}

.btn-modal-save {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

/* ===== SERVICE ALERT MINI ===== */
.service-alert-mini {
    background: white;
    border-radius: 10px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    border-left: 3px solid #f59e0b;
}

.alert-icon {
    font-size: 18px;
}

.alert-text {
    display: flex;
    flex-direction: column;
    font-size: 13px;
}

.alert-text strong {
    font-size: 13px;
}

.alert-text span {
    font-size: 12px;
    color: #666;
}

/* ===== SECTION LABEL ===== */
.section-label {
    font-size: 13px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}

/* ===== FUEL LIST COMPACT (UNA LÍNEA) ===== */
.fuel-list-compact {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.fuel-item-compact {
    background: white;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: background 0.1s;
}

.fuel-item-compact:active {
    background: #f8f9fa;
}

.fuel-left-compact {
    display: flex;
    align-items: center;
    gap: 10px;
}

.fuel-date-compact {
    font-size: 12px;
    color: #888;
    min-width: 60px;
}

.fuel-details-compact {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
}

.fuel-liters-compact {
    color: #666;
}

.fuel-cost-compact {
    font-weight: 600;
    color: #1a1a2e;
}

.fuel-right-compact {
    text-align: right;
    flex-shrink: 0;
}

.fuel-consumption-compact {
    font-size: 13px;
    font-weight: 700;
    padding: 1px 8px;
    border-radius: 4px;
}

.consumption-excellent {
    color: #10b981;
    background: #d1fae5;
}

.consumption-good {
    color: #f59e0b;
    background: #fef3c7;
}

.consumption-poor {
    color: #ef4444;
    background: #fecaca;
}

/* ===== EMPTY STATE MINI ===== */
.empty-state-mini {
    text-align: center;
    padding: 24px 10px;
    color: #aaa;
    font-size: 13px;
}

.empty-state-mini small {
    color: #ccc;
    font-size: 12px;
}

/* ===== FAB MINI ===== */
.fab-mini {
    position: fixed;
    bottom: 85px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    font-size: 24px;
    box-shadow: 0 3px 12px rgba(102, 126, 234, 0.35);
    cursor: pointer;
    z-index: 100;
    transition: transform 0.15s;
}

.fab-mini:active {
    transform: scale(0.92);
}

/* ===== BOTTOM NAV MINI ===== */
.bottom-nav-mini {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    display: flex;
    justify-content: space-around;
    padding: 8px 0 10px;
    border-top: 1px solid #eee;
    max-width: 480px;
    margin: 0 auto;
    z-index: 99;
}

.nav-item {
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: pointer;
    opacity: 0.4;
    font-size: 11px;
    color: #666;
    padding: 4px 12px;
}

.nav-item.active {
    opacity: 1;
    color: #667eea;
}

.nav-item span:first-child {
    font-size: 20px;
}

/* ===== HEADER MODAL ===== */
.header-modal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0 16px;
    background: transparent !important;
    color: #1a1a2e !important;
    box-shadow: none !important;
}

.btn-back {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #1a1a2e;
    padding: 0 4px;
}

.modal-title {
    font-size: 17px;
    font-weight: 600;
}

/* ===== FORM COMPACT ===== */
.form-compact {
    background: white;
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
}

.field-group {
    margin-bottom: 14px;
}

.field-group label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #444;
    margin-bottom: 4px;
}

.field-group input,
.field-group select {
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 14px;
    background: #fafafa;
    transition: border-color 0.2s;
}

.field-group input:focus,
.field-group select:focus {
    border-color: #667eea;
    outline: none;
    background: white;
}

.field-row {
    display: flex;
    gap: 12px;
}

.field-group.half {
    flex: 1;
}

.hint {
    display: block;
    font-size: 11px;
    color: #999;
    margin-top: 3px;
}

.total-box {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    padding: 12px 16px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.total-box span:first-child {
    font-size: 13px;
    opacity: 0.8;
}

.total-amount {
    font-size: 22px;
    font-weight: 700;
}

.btn-primary-full {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
}

.btn-primary-full:active {
    transform: scale(0.98);
}

.btn-danger-full {
    width: 100%;
    padding: 12px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
}

.btn-danger-full:active {
    transform: scale(0.98);
}

.form-actions-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* ===== HISTORIAL ===== */
.summary-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin-bottom: 10px;
}

.summary-item {
    background: white;
    border-radius: 8px;
    padding: 8px 4px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.sum-label {
    display: block;
    font-size: 9px;
    text-transform: uppercase;
    color: #999;
    letter-spacing: 0.3px;
}

.sum-value {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #1a1a2e;
    margin-top: 2px;
}

.month-selector-compact {
    margin-bottom: 10px;
}

.month-dropdown {
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 14px;
    background: white;
    appearance: auto;
}

.history-list-compact {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.history-item-compact {
    background: white;
    border-radius: 8px;
    padding: 8px 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    cursor: pointer;
}

.history-item-compact:active {
    background: #f8f9fa;
}

.history-row1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.history-date {
    font-size: 12px;
    color: #555;
}

.history-km {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a2e;
}

.history-row2 {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 12px;
    color: #666;
    margin-top: 2px;
}

.history-consumption-badge {
    font-weight: 600;
    padding: 0 6px;
    border-radius: 3px;
    font-size: 12px;
}

/* ===== SERVICIOS ===== */
.service-list-compact {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.service-item-compact {
    background: white;
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    cursor: pointer;
}

.service-item-compact:active {
    background: #f8f9fa;
}

.service-left-compact {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.service-name-compact {
    font-size: 14px;
    font-weight: 500;
}

.service-date-compact {
    font-size: 11px;
    color: #999;
}

.service-right-compact {
    text-align: right;
}

.service-km-compact {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a2e;
}

.service-status-compact {
    font-size: 11px;
    padding: 1px 8px;
    border-radius: 4px;
}

.status-ok {
    color: #10b981;
    background: #d1fae5;
}

.status-warning {
    color: #f59e0b;
    background: #fef3c7;
}

.status-danger {
    color: #ef4444;
    background: #fecaca;
}

.btn-add-small {
    background: #667eea;
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
}

/* ===== TOAST ===== */
.toast {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 13px;
    z-index: 1000;
    animation: slideDown 0.3s ease;
    max-width: 90%;
}

.toast.success {
    background: #10b981;
}

.toast.error {
    background: #ef4444;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-16px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 400px) {
    .odo-value {
        font-size: 26px;
    }
    .fuel-consumption-compact {
        font-size: 11px;
        padding: 1px 6px;
    }
    .fuel-details-compact {
        font-size: 12px;
        gap: 4px;
    }
    .fuel-left-compact {
        gap: 6px;
    }
    .fuel-date-compact {
        font-size: 11px;
        min-width: 50px;
    }
    .summary-row {
        grid-template-columns: repeat(2, 1fr);
    }
    .history-row2 {
        font-size: 11px;
        gap: 6px;
    }
}