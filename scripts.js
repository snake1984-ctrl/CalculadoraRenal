// ============================================
// 1. REGISTRO DEL SERVICE WORKER CON DETECCIÓN DE ACTUALIZACIONES
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').then(registration => {
            console.log('SW registrado: ', registration.scope);

            // Detectar si hay una actualización esperando
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    // Si el nuevo SW ya se ha instalado...
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // ... ¡AVISAMOS AL MÉDICO!
                        mostrarAvisoActualizacion();
                    }
                });
            });
        }).catch(error => {
            console.log('Fallo registro SW: ', error);
        });
    });

    // Detectar si el SW ha cambiado (controlado por skipWaiting)
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}

// Función para mostrar el aviso bonito con SweetAlert2
function mostrarAvisoActualizacion() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end', // Abajo a la derecha, no molesta
        showConfirmButton: true,
        confirmButtonText: 'Actualizar',
        timer: null, // No se quita hasta que le den
        background: '#333',
        color: '#fff',
        confirmButtonColor: '#21808d'
    });

    Toast.fire({
        icon: 'info',
        title: 'Nueva versión disponible'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si le dan al botón, recargamos la página
            window.location.reload();
        }
    });
}
// ===============================================
// 2. VARIABLES GLOBALES Y CONFIGURACIÓN
// ===============================================
const fieldIds = [
    'sexo', 'fecha_nacimiento', 'fecha_analitica', 'peso_kg', 'talla_cm',
    'urea_mg_dl', 'creatinina_enz_mg_dl', 'au_plasma_mg_dl', 'na_plasma_meq_l', 'k_plasma_meq_l', 'cl_plasma_meq_l', 'fosfatasa_alcalina_u_l', 'ca_plasma_mg_dl', 'p_plasma_mg_dl', 'mg_plasma_mg_dl', 'pth_pg_ml', 'vitamina_d_ng_ml', 'cistatina_c_mg_l',
    'ph_plasma', 'pco2_mmhg', 'hco3_mmol_l', 'exceso_bases_mmol_l',
    'densidad', 'ph_orina', 'au_orina_mg_dl', 'na_orina_meq_l', 'k_orina_meq_l', 'cl_orina_meq_l', 'osmolalidad_orina_mosm_kg', 'ca_orina_mg_dl', 'fosforo_orina_mg_dl', 'magnesio_orina_mg_dl', 'albumina_orina_mg_dl', 'creatinina_orina_mg_dl', 'proteinas_orina_mg_dl', 'citrato_orina_mg_dl', 'oxalato_orina_mg_dl',
    'au_24h_mg', 'ca_24h_mg', 'p_24h_mg', 'mg_24h_mg', 'albumina_24h_mg', 'proteinas_24h_mg', 'citrato_24h_mg', 'oxalato_24h_mg',
    'hb_g_l', 'ferritina_ng_ml', 'ist_percent'
];

let calculatedResults = {};
window.calculatedResults = {};
let reportText = '';
let primeraValidacion = false; 

window.edadEnAños = 0;
window.edadEnMeses = 0;
window.edadTotalMeses = 0;
window.valoresFueraRango = [];

// ===============================================
// 3. INICIALIZACIÓN PRINCIPAL (DOMContentLoaded Maestro)
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicación...');
    
    // 1. Configuraciones de validación y UI
    configureNumericValidation();
    configurarEventosFechas();
    verifyFieldsExist();
    setupTabNavigation();
    setupTabNavigationScroll();
    setupFormEvents();
    setupButtons();
    updateFieldCounter();
    inyectarUnidadesEnInputs();

    // 2. Detección del Modo Test por URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('modo') === 'test') {
        activarModoTest();
    }

    // 3. Huevo de Pascua (Easter Egg): 5 toques en el logo para Modo Test
    setupSecretTap();
    // 4. Mejoras UX: Tema y Autoguardado
    setupThemeToggle();
    setupAutoSave();
});

// ===============================================
// 4. FUNCIONES DE MODO TEST
// ===============================================
function activarModoTest() {
    console.log('✅ MODO TEST ACTIVADO');
    document.body.classList.add('modo-test');
    const botonTest = document.getElementById('btn-cargar-datos-test');
    if (botonTest) botonTest.style.display = 'inline-block';
}

function desactivarModoTest() {
    console.log('❌ MODO TEST DESACTIVADO');
    document.body.classList.remove('modo-test');
    const botonTest = document.getElementById('btn-cargar-datos-test');
    if (botonTest) botonTest.style.display = 'none';
}

function setupSecretTap() {
    let testTapCount = 0;
    let tapTimer = null;
    const logo = document.querySelector('.app-title');
    
    function handleTap(e) {
        if (e) e.preventDefault();
        testTapCount++;
        if (testTapCount >= 5) {
            if(document.body.classList.contains('modo-test')) {
                desactivarModoTest();
                alert('Modo TEST desactivado');
            } else {
                activarModoTest();
                alert('¡Modo TEST activado!');
            }
            testTapCount = 0;
            if (tapTimer) clearTimeout(tapTimer);
            tapTimer = null;
            return;
        }
        if (tapTimer) clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { testTapCount = 0; }, 2000);
    }

    if (logo) {
        logo.addEventListener('click', handleTap, {passive: false});
        logo.addEventListener('touchstart', handleTap, {passive: false});
        logo.addEventListener('touchend', e => e.preventDefault(), {passive: false});
    }
}
// ===============================================
// MEJORAS UX: MODO OSCURO Y AUTOGUARDADO (SESSION)
// ===============================================
function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    
    // Aquí sí usamos localStorage porque guardar si te gusta el modo oscuro no viola la privacidad
    const savedTheme = localStorage.getItem('themePref');
    if (savedTheme) {
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        updateThemeIcon('dark');
    }

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', currentTheme);
        localStorage.setItem('themePref', currentTheme);
        updateThemeIcon(currentTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        // Sol para modo oscuro, Luna para modo claro
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function setupAutoSave() {
    // Cargar datos temporales al abrir la pestaña
    const savedData = sessionStorage.getItem('calcRenalDataTemporales');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = document.getElementById(key);
                if (input && data[key] !== 0 && data[key] !== '') input.value = data[key];
            });
            // Recalcular edad visualmente
            calcularEdad();
        } catch (e) {
            console.error('Error al recuperar datos temporales');
        }
    }

    // Guardar temporalmente en cada pulsación (solo en esta pestaña)
    document.getElementById('clinicalForm').addEventListener('input', () => {
        const data = getFormData();
        data.sedimento_urinario = document.getElementById('sedimento_urinario')?.value || '';
        data.comentario_nutricional = document.getElementById('comentario_nutricional')?.value || '';
        sessionStorage.setItem('calcRenalDataTemporales', JSON.stringify(data));
    });
}
// ===============================================
// 5. FUNCIONES DE UI, FECHAS Y EVENTOS
// ===============================================
function rellenarFechaHoy() {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const año = hoy.getFullYear();
    document.getElementById('fecha_analitica').value = `${dia}/${mes}/${año}`;
    calcularEdad();
}

function validarFormatoFecha(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2);
    if (value.length >= 5) value = value.substring(0, 5) + '/' + value.substring(5, 9);
    input.value = value;
    calcularEdad();
}

function calcularEdad() {
    const fechaNac = document.getElementById('fecha_nacimiento').value;
    const fechaAnal = document.getElementById('fecha_analitica').value;
    if (!fechaNac || !fechaAnal) return;
    
    const [diaNac, mesNac, añoNac] = fechaNac.split('/').map(Number);
    const [diaAnal, mesAnal, añoAnal] = fechaAnal.split('/').map(Number);
    if (!diaNac || !mesNac || !añoNac || !diaAnal || !mesAnal || !añoAnal) return;
    
    const nacimiento = new Date(añoNac, mesNac - 1, diaNac);
    const analitica = new Date(añoAnal, mesAnal - 1, diaAnal);
    if (nacimiento >= analitica) {
        document.getElementById('edad_calculada').value = 'Fechas inválidas';
        return;
    }
    
    let años = añoAnal - añoNac;
    let meses = mesAnal - mesNac;
    if (diaAnal < diaNac) meses--;
    if (meses < 0) { años--; meses += 12; }
    
    document.getElementById('edad_calculada').value = `${años} años ${meses} meses`;
    window.edadEnAños = años;
    window.edadEnMeses = meses;
    window.edadTotalMeses = años * 12 + meses;
}

function configurarEventosFechas() {
    const fechaNac = document.getElementById('fecha_nacimiento');
    const fechaAnal = document.getElementById('fecha_analitica');
    if (fechaNac) fechaNac.addEventListener('input', function() { validarFormatoFecha(this); });
    if (fechaAnal) fechaAnal.addEventListener('input', function() { validarFormatoFecha(this); });
}

function configureNumericValidation() {
    const camposDecimales = [
        'peso_kg', 'talla_cm', 'urea_mg_dl', 'creatinina_enz_mg_dl', 'cistatina_c_mg_l', 'au_plasma_mg_dl', 
        'na_plasma_meq_l', 'k_plasma_meq_l', 'cl_plasma_meq_l', 'fosfatasa_alcalina_u_l', 
        'ca_plasma_mg_dl', 'p_plasma_mg_dl', 'mg_plasma_mg_dl', 'pth_pg_ml', 'vitamina_d_ng_ml',
        'ph_plasma', 'pco2_mmhg', 'hco3_mmol_l', 'exceso_bases_mmol_l',
        'densidad', 'ph_orina', 'au_orina_mg_dl', 'na_orina_meq_l', 'k_orina_meq_l', 
        'cl_orina_meq_l', 'osmolalidad_orina_mosm_kg', 'ca_orina_mg_dl', 'fosforo_orina_mg_dl', 
        'magnesio_orina_mg_dl', 'albumina_orina_mg_dl', 'creatinina_orina_mg_dl', 
        'proteinas_orina_mg_dl', 'citrato_orina_mg_dl', 'oxalato_orina_mg_dl',
        'au_24h_mg', 'ca_24h_mg', 'mg_24h_mg', 'p_24h_mg', 'citrato_24h_mg', 
        'oxalato_24h_mg', 'albumina_24h_mg', 'proteinas_24h_mg',
        'hb_g_l', 'ferritina_ng_ml', 'ist_percent'
    ];

    camposDecimales.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.type = 'text';
            input.setAttribute('inputmode', 'decimal');
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\./g, ',');
                value = (fieldId === 'exceso_bases_mmol_l') ? value.replace(/[^0-9,-]/g, '') : value.replace(/[^0-9,]/g, '');
                
                const parts = value.split(',');
                if (parts.length > 2) value = parts[0] + ',' + parts.slice(1).join('');
                if (parts.length === 2 && parts[1].length > 2) value = parts[0] + ',' + parts[1].substring(0, 2);
                
                // Validación para no permitir negativos en tiempo real (excepto exceso bases)
                if (fieldId !== 'exceso_bases_mmol_l' && value.includes('-')) value = value.replace('-', '');
                
                e.target.value = value;
            });
            input.addEventListener('blur', function(e) {
                let value = e.target.value;
                if (value) {
                    const numValue = parseFloat(value.replace(',', '.'));
                    if (isNaN(numValue)) e.target.value = '';
                }
            });
        }
    });
}

function verifyFieldsExist() {
    let missingFields = [];
    fieldIds.forEach(fieldId => { if (!document.getElementById(fieldId)) missingFields.push(fieldId); });
    if (missingFields.length > 0) console.error('❌ Campos faltantes:', missingFields);
}

function setupTabNavigation() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() { switchTab(this.getAttribute('data-tab'), this); });
    });
}

function setupTabNavigationScroll() {
    document.querySelectorAll('.tab-button').forEach((btn, i, allBtns) => {
        btn.onclick = function() {
            const container = btn.closest('.tabs') || btn.closest('.nav-tabs');
            if (container && (container.scrollWidth > container.clientWidth)) {
                const btnRect = btn.getBoundingClientRect();
                const contRect = container.getBoundingClientRect();
                if ((btnRect.right >= contRect.right - 8) && (i < allBtns.length - 1)) container.scrollLeft = container.scrollWidth;
                if ((btnRect.left <= contRect.left + 8) && (i > 0)) container.scrollLeft = 0;
            }
        };
    });
}

function switchTab(tabId, buttonElement) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    if (buttonElement) buttonElement.classList.add('active');
}

function actualizarMarcadoresEnTiempoReal() {
    if (!primeraValidacion) return;
    const secciones = {
        'datos-basicos-tab': ['fecha_nacimiento', 'fecha_analitica', 'peso_kg', 'talla_cm'],
        'bioquimica-tab': ['urea_mg_dl', 'creatinina_enz_mg_dl', 'au_plasma_mg_dl', 'na_plasma_meq_l', 'k_plasma_meq_l', 'cl_plasma_meq_l', 'fosfatasa_alcalina_u_l', 'ca_plasma_mg_dl', 'p_plasma_mg_dl', 'mg_plasma_mg_dl', 'pth_pg_ml', 'vitamina_d_ng_ml', 'cistatina_c_mg_l'],
        'gasometria-tab': ['ph_plasma', 'pco2_mmhg', 'hco3_mmol_l', 'exceso_bases_mmol_l'],
        'orina-puntual-tab': ['densidad', 'ph_orina', 'au_orina_mg_dl', 'na_orina_meq_l', 'k_orina_meq_l', 'cl_orina_meq_l', 'osmolalidad_orina_mosm_kg', 'ca_orina_mg_dl', 'fosforo_orina_mg_dl', 'magnesio_orina_mg_dl', 'albumina_orina_mg_dl', 'creatinina_orina_mg_dl', 'proteinas_orina_mg_dl', 'citrato_orina_mg_dl', 'oxalato_orina_mg_dl'],
        'orina-24h-tab': ['au_24h_mg', 'ca_24h_mg', 'p_24h_mg', 'mg_24h_mg', 'albumina_24h_mg', 'proteinas_24h_mg', 'citrato_24h_mg', 'oxalato_24h_mg'],
        'hematologia-tab': ['hb_g_l', 'ferritina_ng_ml', 'ist_percent']
    };

    Object.keys(secciones).forEach(tabId => {
        let tieneError = false;
        secciones[tabId].forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (!campo || !campo.value || campo.value.trim() === '') {
                tieneError = true;
                if (campo) campo.classList.add('campo-error');
            } else {
                if (campo) campo.classList.remove('campo-error');
            }
        });
        const tab = document.getElementById(tabId);
        if (tab) tab.classList.toggle('tab-error', tieneError);
    });
}

function setupFormEvents() {
    fieldIds.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', (e) => { 
                updateFieldCounter(); 
                actualizarMarcadoresEnTiempoReal(); 
                
                // Feedback Positivo en tiempo real
                if(e.target.value.trim() !== '') {
                    e.target.classList.add('campo-valido');
                    e.target.classList.remove('campo-error');
                } else {
                    e.target.classList.remove('campo-valido');
                }
            });
            input.addEventListener('change', () => { updateFieldCounter(); actualizarMarcadoresEnTiempoReal(); });
        }
    });
}

function setupButtons() {
    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) calculateButton.addEventListener('click', () => { primeraValidacion = true; actualizarMarcadoresEnTiempoReal(); calculateResults(); });
    
    // NUEVO: Conectar botón de copiar
    const copyClipboardButton = document.getElementById('copyClipboardButton');
    if (copyClipboardButton) copyClipboardButton.addEventListener('click', copyToClipboard);

    const exportWordButton = document.getElementById('exportWordButton');
    if (exportWordButton) exportWordButton.addEventListener('click', exportToWord);
    
    const exportPDFButton = document.getElementById('exportPDFButton');
    if (exportPDFButton) exportPDFButton.addEventListener('click', exportToPDF);
    
    const printButton = document.getElementById('printButton');
    if (printButton) printButton.addEventListener('click', printReport);
}

function confirmarLimpiarFormulario() {
    Swal.fire({
        icon: 'question', title: '¿Borrar todos los campos?', text: 'Se borrarán todos los datos introducidos y no se podrá deshacer.',
        showCancelButton: true, confirmButtonText: 'Sí, borrar todo', cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545', cancelButtonColor: '#6c757d', backdrop: true, allowOutsideClick: false
    }).then(result => { if (result.isConfirmed) clearFormSilent(); });
}

function clearFormSilent() {
    // 1. Borramos el TEXTO de los campos principales
    fieldIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });

    // 2. Borramos el TEXTO de los campos extra/especiales
    ['sedimento_urinario', 'comentario_nutricional', 'edad_calculada'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    // 3. NUEVO: Llamamos a la función que quita los COLORES (verde/rojo) de todo
    limpiarColoresValidacion();
    
    // 4. Gestión de la interfaz (Resultados vs Estado Vacío)
    document.getElementById('results')?.classList.remove('hidden');
    document.getElementById('reportSection')?.classList.add('hidden');
    
    const resultsGrid = document.getElementById('resultsGrid'); 
    if(resultsGrid) {
        resultsGrid.innerHTML = '';
        resultsGrid.classList.add('hidden'); // Ocultamos los números
    }
    
    const emptyState = document.getElementById('empty-state-results');
    if(emptyState) emptyState.classList.remove('hidden'); // Mostramos el mensaje de "Aún no hay datos"
    
    const reportContent = document.getElementById('reportContent'); 
    if(reportContent) reportContent.textContent = '';
    
    // 5. Reseteo de variables internas y pestañas
    calculatedResults = {}; 
    window.calculatedResults = {}; 
    reportText = ''; 
    primeraValidacion = false;
    
    document.querySelectorAll('.tab-error').forEach(tab => tab.classList.remove('tab-error'));
    
    updateFieldCounter();
    switchTab('datos-basicos', document.querySelector('[data-tab="datos-basicos"]'));
    sessionStorage.removeItem('calcRenalDataTemporales');
}

function clearForm() { confirmarLimpiarFormulario(); }

function loadSampleData() {
    const sampleData = {
        fecha_nacimiento: '15/03/2012', fecha_analitica: '20/10/2024', peso_kg: 35.5, talla_cm: 140.0, sexo: 'M',
        urea_mg_dl: 28, creatinina_enz_mg_dl: 0.65, au_plasma_mg_dl: 4.2, na_plasma_meq_l: 138.5, k_plasma_meq_l: 4.1, cl_plasma_meq_l: 105.2, fosfatasa_alcalina_u_l: 180, ca_plasma_mg_dl: 9.8, p_plasma_mg_dl: 4.5, mg_plasma_mg_dl: 1.9, pth_pg_ml: 35.2, vitamina_d_ng_ml: 28.5, comentario_nutricional: "Paciente normopeso. Dieta equilibrada con buena tolerancia oral. Sin incidencias", cistatina_c_mg_l: 0.92,
        ph_plasma: 7.38, pco2_mmhg: 42.1, hco3_mmol_l: 22.8, exceso_bases_mmol_l: -1.2,
        densidad: 1018, ph_orina: 6.2, sedimento_urinario: "Hematíes 3-5/campo. Leucocitos aislados. Ausencia de cilindros.", au_orina_mg_dl: 45.8, na_orina_meq_l: 85.2, k_orina_meq_l: 55.1, cl_orina_meq_l: 98.5, osmolalidad_orina_mosm_kg: 320, ca_orina_mg_dl: 12.5, fosforo_orina_mg_dl: 18.2, magnesio_orina_mg_dl: 8.5, albumina_orina_mg_dl: 3.2, creatinina_orina_mg_dl: 68.5, proteinas_orina_mg_dl: 8.1, citrato_orina_mg_dl: 85.2, oxalato_orina_mg_dl: 15.8,
        au_24h_mg: 420, ca_24h_mg: 85, p_24h_mg: 520, mg_24h_mg: 65, albumina_24h_mg: 25, proteinas_24h_mg: 95, citrato_24h_mg: 485, oxalato_24h_mg: 28,
        hb_g_l: 125, ferritina_ng_ml: 45.8, ist_percent: 22.5
    };
    
   Object.keys(sampleData).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = sampleData[key];
            // LA LÍNEA MÁGICA: Fuerza el evento para que se pinte de verde
            input.dispatchEvent(new Event('input')); 
        }
    });
    calcularEdad(); updateFieldCounter(); actualizarMarcadoresEnTiempoReal();
    Swal.fire({ 
        icon: 'success', 
        title: 'Datos cargados', 
        text: 'Se han rellenado los campos de ejemplo de forma automática.',
        showConfirmButton: true,
        confirmButtonText: '<i class="fas fa-check"></i> OK',
        confirmButtonColor: '#21808d',
        allowOutsideClick: true // Permite que se cierre también tocando fuera
    });
}

function marcarError(campoId, tieneError) {
    const campo = document.getElementById(campoId);
    if (campo) campo.classList.toggle('campo-error', tieneError);
}

function validarTodosCampos() {
    let camposVacios = [];
    primeraValidacion = true;
    
    fieldIds.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (!campo || !campo.value || campo.value.trim() === '') { camposVacios.push(campoId); marcarError(campoId, true); } 
        else { marcarError(campoId, false); }
    });
    
    actualizarMarcadoresEnTiempoReal();
    
    if (camposVacios.length > 0) {
        const listaCampos = camposVacios.map(id => {
            const label = document.querySelector(`label[for='${id}']`);
            return label ? label.textContent.replace(' *', '') : id.replace(/_/g, ' ');
        });
        const primerCampoVacio = document.getElementById(camposVacios[0]);
        if (primerCampoVacio) primerCampoVacio.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        Swal.fire({
            icon: 'warning', title: 'Campos incompletos',
            html: `<p>Faltan <strong>${camposVacios.length}</strong> campos:</p><div style="max-height: 250px; overflow-y: auto; text-align: left; margin: 15px 0; padding: 10px; background-color: #f8f9fa; border-radius: 5px;"><ul style="margin: 0; padding-left: 20px;">${listaCampos.map(c => `<li style="margin-bottom: 5px;">${c}</li>`).join('')}</ul></div><p style="margin-top: 15px;"><strong>¿Deseas continuar?</strong></p>`,
            showCancelButton: true, confirmButtonText: 'Sí, continuar', cancelButtonText: 'Rellenar primero', confirmButtonColor: '#28a745', cancelButtonColor: '#6c757d', reverseButtons: true
        }).then(result => { if (result.isConfirmed) executeCalculations(); });
        return false;
    }
    return true;
}

function updateFieldCounter() {
    const filledCount = fieldIds.filter(id => document.getElementById(id)?.value.trim() !== '').length;
    const counter = document.getElementById('fieldCount');
    if (counter) {
        counter.textContent = `${filledCount}/${fieldIds.length}`;
        
        // Magia UX: Si hay 1 o más campos, quitamos la clase hidden. Si está en 0, la ponemos.
        if (filledCount > 0) {
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }
    }
}

// ===============================================
// 6. LÓGICA DE CÁLCULO Y EVALUACIÓN
// ===============================================
function evaluarRango(parametro, valor, edad, edadMeses) {
    if (valor === null || valor === undefined || valor === 0) return { enRango: true };
    const edadTotalMeses = (edad * 12) + edadMeses;
    let rangoMin, rangoMax, rangoTexto = '', esRangoValido = true;
    
    switch (parametro) {
        case 'vpercent': if (edad >= 1) { rangoMax = 0.81; rangoTexto = '<0.81%'; return { enRango: valor <= rangoMax, tipo: valor > rangoMax ? 'alto' : 'normal', rangoTexto }; } break;
        case 'ckid_u25_cr': case 'ckid_u25_cistc': case 'ckid_u25_combinado': rangoMin = 90; rangoTexto = '>90ml/min/1.73m²'; return { enRango: valor >= rangoMin, tipo: valor < rangoMin ? 'bajo' : 'normal', rangoTexto };
        case 'efau': if (edad >= 1 && edad < 5) { rangoMin = 11; rangoMax = 17; rangoTexto = '11–17'; } else if (edad >= 5) { rangoMin = 4.45; rangoMax = 9.99; rangoTexto = '4.45–9.99'; } else esRangoValido = false; break;
        case 'efna': rangoMin = 0.42; rangoMax = 0.84; rangoTexto = '0.42–0.84'; break;
        case 'efk': rangoMin = 5.19; rangoMax = 11.67; rangoTexto = '5.19–11.67'; break;
        case 'efcl': rangoMin = 0.57; rangoMax = 1.11; rangoTexto = '0.57–1.11'; break;
        case 'cacr': if (edadTotalMeses < 6) { rangoMax = 0.8; rangoTexto = '<0.8mg/mg'; } else if (edadTotalMeses < 12) { rangoMax = 0.6; rangoTexto = '<0.6mg/mg'; } else if (edad >= 1 && edad < 2) { rangoMax = 0.5; rangoTexto = '<0.5mg/mg'; } else if (edad >= 2 && edad < 4) { rangoMax = 0.28; rangoTexto = '<0.28mg/mg'; } else if (edad >= 4) { rangoMax = 0.20; rangoTexto = '<0.20mg/mg'; } return { enRango: valor <= rangoMax, tipo: valor > rangoMax ? 'alto' : 'normal', rangoTexto };
        case 'rtp': if (edad >= 1 && edad < 3) { rangoMin = 81.18; rangoMax = 90.08; rangoTexto = '81.18–90.08%'; } else if (edad >= 3 && edad < 5) { rangoMin = 86.43; rangoMax = 95.76; rangoTexto = '86.43–95.76%'; } else if (edad >= 5) { rangoMin = 90.26; rangoMax = 94.86; rangoTexto = '90.26–94.86%'; } else esRangoValido = false; break;
        case 'mgcr': if (edad >= 1 && edad < 2) { rangoMin = 0.09; rangoMax = 0.37; rangoTexto = '0.09–0.37mg/mg'; } else if (edad >= 2 && edad < 3) { rangoMin = 0.07; rangoMax = 0.34; rangoTexto = '0.07–0.34mg/mg'; } else if (edad >= 3 && edad < 5) { rangoMin = 0.07; rangoMax = 0.29; rangoTexto = '0.07–0.29mg/mg'; } else if (edad >= 5 && edad < 7) { rangoMin = 0.06; rangoMax = 0.21; rangoTexto = '0.06–0.21mg/mg'; } else if (edad >= 7 && edad < 10) { rangoMin = 0.05; rangoMax = 0.18; rangoTexto = '0.05–0.18mg/mg'; } else if (edad >= 10 && edad < 14) { rangoMin = 0.05; rangoMax = 0.15; rangoTexto = '0.05–0.15mg/mg'; } else esRangoValido = false; break;
        case 'pcr': if (edad >= 0 && edad < 3) { rangoMin = 0.8; rangoMax = 2; rangoTexto = '0.8–2mg/mg'; } else if (edad >= 3 && edad < 5) { rangoMin = 0.33; rangoMax = 2.17; rangoTexto = '0.33–2.17mg/mg'; } else if (edad >= 5 && edad < 7) { rangoMin = 0.33; rangoMax = 1.49; rangoTexto = '0.33–1.49mg/mg'; } else if (edad >= 7 && edad < 10) { rangoMin = 0.32; rangoMax = 0.97; rangoTexto = '0.32–0.97mg/mg'; } else if (edad >= 10 && edad < 14) { rangoMin = 0.22; rangoMax = 0.86; rangoTexto = '0.22–0.86mg/mg'; } else esRangoValido = false; break;
        case 'aucr': if (edad >= 3 && edad < 5) { rangoMin = 0.66; rangoMax = 1.1; rangoTexto = '0.66–1.1mg/mg'; } else if (edad >= 5 && edad < 7) { rangoMin = 0.5; rangoMax = 0.92; rangoTexto = '0.5–0.92mg/mg'; } else if (edad >= 7 && edad < 9) { rangoMin = 0.44; rangoMax = 0.8; rangoTexto = '0.44–0.8mg/mg'; } else if (edad >= 9 && edad < 11) { rangoMin = 0.4; rangoMax = 0.72; rangoTexto = '0.4–0.72mg/mg'; } else if (edad >= 11 && edad < 13) { rangoMin = 0.35; rangoMax = 0.61; rangoTexto = '0.35–0.61mg/mg'; } else if (edad >= 13 && edad < 14) { rangoMin = 0.28; rangoMax = 0.5; rangoTexto = '0.28–0.5mg/mg'; } else esRangoValido = false; break;
        case 'citratocr': rangoMin = 0.4; rangoTexto = '>0.4mg/mg'; return { enRango: valor > rangoMin, tipo: valor <= rangoMin ? 'bajo' : 'normal', rangoTexto };
        case 'cacitrato': rangoMax = 0.3; rangoTexto = '<0.3'; return { enRango: valor < rangoMax, tipo: valor >= rangoMax ? 'alto' : 'normal', rangoTexto };
        case 'oxalatocr': if (edadTotalMeses < 6) { rangoMax = 0.29; rangoTexto = '<0.29mg/mg'; } else if (edadTotalMeses >= 6 && edad < 2) { rangoMax = 0.20; rangoTexto = '<0.20mg/mg'; } else if (edad >= 2 && edad < 6) { rangoMax = 0.22; rangoTexto = '<0.22mg/mg'; } else if (edad >= 6 && edad < 13) { rangoMax = 0.06; rangoTexto = '<0.06mg/mg'; } else if (edad >= 13) { rangoMax = 0.03; rangoTexto = '<0.03mg/mg'; } return { enRango: valor < rangoMax, tipo: valor >= rangoMax ? 'alto' : 'normal', rangoTexto };
        case 'albcr': rangoMax = 30; rangoTexto = '<30mg/g'; return { enRango: valor < rangoMax, tipo: valor >= rangoMax ? 'alto' : 'normal', rangoTexto };
        case 'protcr': if (edad < 2) { rangoMax = 500; rangoTexto = '<500mg/g'; } else { rangoMax = 200; rangoTexto = '<200mg/g'; } return { enRango: valor < rangoMax, tipo: valor >= rangoMax ? 'alto' : 'normal', rangoTexto };
        case 'nak': rangoMax = 2.5; rangoTexto = '<2.5'; return { enRango: valor < rangoMax, tipo: valor >= rangoMax ? 'alto' : 'normal', rangoTexto };
        case 'uricosuria': rangoMin = 373; rangoMax = 667; rangoTexto = '373–667mg/1.73m²/día'; break;
        case 'calciuria': rangoMax = 4; rangoTexto = '<4mg/kg/día'; return { enRango: valor < rangoMax, tipo: valor >= rangoMax ? 'alto' : 'normal', rangoTexto };
        case 'citraturia': rangoMin = 5.57; rangoMax = 13.67; rangoTexto = '5.57–13.67mg/kg/día'; break;
        case 'fosfaturia': rangoMin = 7.8; rangoMax = 17; rangoTexto = '7.8–17mg/kg/día'; break;
        case 'oxaluria': rangoMin = 23.2; rangoMax = 50.6; rangoTexto = '23.2–50.6mg/1.73m²/día'; break;
        case 'magnesuria': rangoMin = 1; rangoMax = 3.3; rangoTexto = '1–3.3mg/kg/día'; break;
        case 'albuminuria': rangoMax = 30; rangoTexto = '<30mg/1.73m²/día'; return { enRango: valor < rangoMax, tipo: valor >= rangoMax ? 'alto' : 'normal', rangoTexto };
        case 'proteinuria': case 'proteinuriaestimada': rangoMax = 100; rangoTexto = '<100mg/m²/día'; return { enRango: valor < rangoMax, tipo: valor >= rangoMax ? 'alto' : 'normal', rangoTexto };
        default: return { enRango: true };
    }
    
    if (!esRangoValido) return { enRango: true };
    let tipo = 'normal'; let enRango = true;
    if (rangoMin !== undefined && valor < rangoMin) { enRango = false; tipo = 'bajo'; } 
    else if (rangoMax !== undefined && valor > rangoMax) { enRango = false; tipo = 'alto'; }
    return { enRango, tipo, rangoTexto };
}

function getFormData() {
    const data = {};
    fieldIds.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            let value = input.value;
            if (['fecha_nacimiento', 'fecha_analitica', 'sexo'].includes(fieldId)) { data[fieldId] = value; return; }
            if (value) value = value.replace(',', '.');
            const numValue = parseFloat(value);
            data[fieldId] = isNaN(numValue) ? 0 : numValue;
        }
    });
    data.edad = window.edadEnAños || 0;
    return data;
}

function calculateResults() {
    if (validarTodosCampos()) executeCalculations();
}

function executeCalculations() {
    const data = getFormData();
    window.valoresFueraRango = [];

    try {
        const calcButton = document.querySelector('.btn-calcular');
        calcButton.classList.add('loading');
        calcButton.innerHTML = 'Calculando... <i class="fas fa-spinner fa-spin" style="margin-left: 8px;"></i>';

        const superficieCorporal = Math.sqrt(data.peso_kg * data.talla_cm / 3600);
        const imc = data.peso_kg / Math.pow(data.talla_cm / 100, 2);

        const edadExacta = window.edadEnAños + (window.edadEnMeses / 12);
        const talla_m = data.talla_cm / 100;
        
        let k_cr = 0;
        if (edadExacta >= 1 && edadExacta < 12) k_cr = (data.sexo === 'M') ? 39.0 * Math.pow(1.008, edadExacta - 12) : 36.1 * Math.pow(1.008, edadExacta - 12);
        else if (edadExacta >= 12 && edadExacta < 18) k_cr = (data.sexo === 'M') ? 39.0 * Math.pow(1.045, edadExacta - 12) : 36.1 * Math.pow(1.023, edadExacta - 12);
        else if (edadExacta >= 18) k_cr = (data.sexo === 'M') ? 50.8 : 41.4;
        const ckid_u25_cr = (k_cr > 0 && data.creatinina_enz_mg_dl > 0 && talla_m > 0) ? k_cr * (talla_m / data.creatinina_enz_mg_dl) : 0;

        let k_cist = 0;
        if (edadExacta >= 1 && edadExacta < 12) k_cist = (data.sexo === 'M') ? 87.2 * Math.pow(1.011, edadExacta - 15) : 79.9 * Math.pow(1.004, edadExacta - 12);
        else if (edadExacta >= 12 && edadExacta < 15) k_cist = (data.sexo === 'M') ? 87.2 * Math.pow(1.011, edadExacta - 15) : 79.9 * Math.pow(0.974, edadExacta - 12);
        else if (edadExacta >= 15 && edadExacta < 18) k_cist = (data.sexo === 'M') ? 87.2 * Math.pow(0.960, edadExacta - 15) : 79.9 * Math.pow(0.974, edadExacta - 12);
        else if (edadExacta >= 18) k_cist = (data.sexo === 'M') ? 77.1 : 41.4;
        const ckid_u25_cistc = (k_cist > 0 && data.cistatina_c_mg_l > 0) ? k_cist * (1 / data.cistatina_c_mg_l) : 0;

        const ckid_u25_combinado = (ckid_u25_cr > 0 && ckid_u25_cistc > 0) ? (ckid_u25_cr + ckid_u25_cistc) / 2 : 0;

        const efNa = (data.na_plasma_meq_l && data.creatinina_orina_mg_dl && data.na_orina_meq_l && data.creatinina_enz_mg_dl) ? (data.na_orina_meq_l * data.creatinina_enz_mg_dl) / (data.na_plasma_meq_l * data.creatinina_orina_mg_dl) * 100 : 0;
        const efK = (data.k_plasma_meq_l && data.creatinina_orina_mg_dl && data.k_orina_meq_l && data.creatinina_enz_mg_dl) ? (data.k_orina_meq_l * data.creatinina_enz_mg_dl) / (data.k_plasma_meq_l * data.creatinina_orina_mg_dl) * 100 : 0;
        const efCl = (data.cl_plasma_meq_l && data.creatinina_orina_mg_dl && data.cl_orina_meq_l && data.creatinina_enz_mg_dl) ? (data.cl_orina_meq_l * data.creatinina_enz_mg_dl) / (data.cl_plasma_meq_l * data.creatinina_orina_mg_dl) * 100 : 0;
        const efAU = (data.au_plasma_mg_dl && data.creatinina_orina_mg_dl && data.au_orina_mg_dl && data.creatinina_enz_mg_dl) ? (data.au_orina_mg_dl * data.creatinina_enz_mg_dl) / (data.au_plasma_mg_dl * data.creatinina_orina_mg_dl) * 100 : 0;

        const cacr = data.creatinina_orina_mg_dl > 0 ? data.ca_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
        const mgcr = data.creatinina_orina_mg_dl > 0 ? data.magnesio_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
        const pcr = data.creatinina_orina_mg_dl > 0 ? data.fosforo_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
        const aucr = data.creatinina_orina_mg_dl > 0 ? data.au_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
        const albcr = data.creatinina_orina_mg_dl > 0 ? (data.albumina_orina_mg_dl / data.creatinina_orina_mg_dl) * 1000 : 0;
        const protcr = data.creatinina_orina_mg_dl > 0 ? (data.proteinas_orina_mg_dl / data.creatinina_orina_mg_dl) * 1000 : 0;
        const citratocr = data.creatinina_orina_mg_dl > 0 ? data.citrato_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
        const oxalatocr = data.creatinina_orina_mg_dl > 0 ? data.oxalato_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
        const nak = data.k_orina_meq_l > 0 ? data.na_orina_meq_l / data.k_orina_meq_l : 0;
        const cacitrato = data.citrato_orina_mg_dl > 0 ? data.ca_orina_mg_dl / data.citrato_orina_mg_dl : 0;

        const rtp = (data.p_plasma_mg_dl && data.fosforo_orina_mg_dl && data.creatinina_orina_mg_dl && data.creatinina_enz_mg_dl) ? 100 - ((data.fosforo_orina_mg_dl * data.creatinina_enz_mg_dl) / (data.p_plasma_mg_dl * data.creatinina_orina_mg_dl)) * 100 : 0;

        const uricosuria = superficieCorporal > 0 ? (data.au_24h_mg / superficieCorporal) * 1.73 : 0;
        const calciuria = data.peso_kg > 0 ? data.ca_24h_mg / data.peso_kg : 0;
        const citraturia = data.peso_kg > 0 ? data.citrato_24h_mg / data.peso_kg : 0;
        const fosfaturia = data.peso_kg > 0 ? data.p_24h_mg / data.peso_kg : 0;
        const magnesuria = data.peso_kg > 0 ? data.mg_24h_mg / data.peso_kg : 0;
        const oxaluria = superficieCorporal > 0 ? (data.oxalato_24h_mg / superficieCorporal) * 1.73 : 0;
        const albuminuria = superficieCorporal > 0 ? (data.albumina_24h_mg / superficieCorporal) * 1.73 : 0;
        const proteinuria = superficieCorporal > 0 ? data.proteinas_24h_mg / superficieCorporal : 0;
        const proteinuriaEstimada = protcr * 0.63;
        const vpercent = (data.creatinina_enz_mg_dl > 0 && data.creatinina_orina_mg_dl > 0) ? (data.creatinina_enz_mg_dl / data.creatinina_orina_mg_dl) * 100 : 0;

        window.calculatedResults = {
            superficiecorporal: superficieCorporal, imc: imc, vpercent: vpercent, ckid_u25_cr: ckid_u25_cr, ckid_u25_cistc: ckid_u25_cistc, ckid_u25_combinado: ckid_u25_combinado, efau: efAU, efna: efNa, efk: efK, efcl: efCl, cacr: cacr, rtp: rtp, mgcr: mgcr, pcr: pcr, aucr: aucr, citratocr: citratocr, cacitrato: cacitrato, oxalatocr: oxalatocr, albcr: albcr, protcr: protcr, nak: nak, uricosuria: uricosuria, calciuria: calciuria, citraturia: citraturia, fosfaturia: fosfaturia, oxaluria: oxaluria, magnesuria: magnesuria, albuminuria: albuminuria, proteinuria: proteinuria, proteinuriaestimada: proteinuriaEstimada
        };

        setTimeout(() => {
            displayResults();
            setTimeout(() => { generateReport(data); }, 100);
            calcButton.classList.remove('loading');
            calcButton.innerHTML = 'Calcular Resultados <i class="fas fa-calculator" style="margin-left: 8px;"></i>';
        }, 800);

    } catch (error) {
        console.error('Error en los cálculos:', error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Se produjo un error al realizar los cálculos.', confirmButtonColor: '#dc3545' });
        const calcButton = document.querySelector('.btn-calcular');
        calcButton.classList.remove('loading'); calcButton.innerHTML = '<i class="fas fa-calculator"></i> Calcular Resultados';
    }
}

function displayResults() {
    const results = window.calculatedResults;
    if (!results) return;
    const edad = window.edadEnAños || 0;
    const edadMeses = window.edadEnMeses || 0;
    
    const parametros = [
        { key: 'vpercent', nombre: 'V%', unidad: '%' }, { key: 'ckid_u25_cr', nombre: 'eGFR CKiD U25 Cr', unidad: 'ml/min/1.73m²' }, { key: 'ckid_u25_cistc', nombre: 'eGFR CKiD U25 CistC', unidad: 'ml/min/1.73m²' }, { key: 'ckid_u25_combinado', nombre: 'eGFR Combinado', unidad: 'ml/min/1.73m²' }, { key: 'efau', nombre: 'EF AU', unidad: '' }, { key: 'efna', nombre: 'EF Na', unidad: '' }, { key: 'efk', nombre: 'EF K', unidad: '' }, { key: 'efcl', nombre: 'EF Cl', unidad: '' }, { key: 'cacr', nombre: 'Ca/Cr', unidad: 'mg/mg' }, { key: 'rtp', nombre: 'RTP', unidad: '%' }, { key: 'mgcr', nombre: 'Mg/Cr', unidad: 'mg/mg' }, { key: 'pcr', nombre: 'P/Cr', unidad: 'mg/mg' }, { key: 'aucr', nombre: 'AU/Cr', unidad: 'mg/mg' }, { key: 'citratocr', nombre: 'Citrato/Cr', unidad: 'mg/mg' }, { key: 'cacitrato', nombre: 'Ca/Citrato', unidad: '' }, { key: 'oxalatocr', nombre: 'Oxalato/Cr', unidad: 'mg/mg' }, { key: 'albcr', nombre: 'Alb/Cr', unidad: 'mg/g' }, { key: 'protcr', nombre: 'Prot/Cr', unidad: 'mg/g' }, { key: 'nak', nombre: 'Na/K orina', unidad: '' }, { key: 'uricosuria', nombre: 'Uricosuria', unidad: 'mg/1.73m²/día' }, { key: 'calciuria', nombre: 'Calciuria', unidad: 'mg/kg/día' }, { key: 'citraturia', nombre: 'Citraturia', unidad: 'mg/kg/día' }, { key: 'fosfaturia', nombre: 'Fosfaturia', unidad: 'mg/kg/día' }, { key: 'oxaluria', nombre: 'Oxaluria', unidad: 'mg/1.73m²/día' }, { key: 'magnesuria', nombre: 'Magnesuria', unidad: 'mg/kg/día' }, { key: 'albuminuria', nombre: 'Albuminuria', unidad: 'mg/1.73m²/día' }, { key: 'proteinuria', nombre: 'Proteinuria', unidad: 'mg/m²/día' }, { key: 'proteinuriaestimada', nombre: 'Proteinuria estimada', unidad: 'mg/m²/día' }
    ];
    
    const resultLabels = {
        superficiecorporal: 'Superficie Corporal (m²)', imc: 'IMC (kg/m²)', vpercent: 'V% (creat enz/orina)', ckid_u25_cr: 'eGFR CKiD U25 Cr (ml/min/1.73m²)', ckid_u25_cistc: 'eGFR CKiD U25 CistC (ml/min/1.73m²)', ckid_u25_combinado: 'eGFR Combinado (ml/min/1.73m²)', efna: 'EF Na (%)', efk: 'EF K (%)', efcl: 'EF Cl (%)', efau: 'EF AU (%)', cacr: 'Ca/Cr (mg/mg)', mgcr: 'Mg/Cr (mg/mg)', pcr: 'P/Cr (mg/mg)', aucr: 'AU/Cr (mg/mg)', albcr: 'Alb/Cr (mg/g)', protcr: 'Prot/Cr (mg/g)', citratocr: 'Citrato/Cr (mg/mg)', oxalatocr: 'Oxalato/Cr (mg/mg)', nak: 'Na/K orina', cacitrato: 'Ca/Citrato', rtp: 'RTP (%)', uricosuria: 'Uricosuria (mg/1.73m²/día)', calciuria: 'Calciuria (mg/kg/día)', citraturia: 'Citraturia (mg/kg/día)', fosfaturia: 'Fosfaturia (mg/kg/día)', magnesuria: 'Magnesuria (mg/kg/día)', oxaluria: 'Oxaluria (mg/1.73m²/día)', albuminuria: 'Albuminuria (mg/1.73m²/día)', proteinuria: 'Proteinuria (mg/m²/día)', proteinuriaestimada: 'Proteinuria estimada (mg/m²/día)'
    };
    
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    resultsGrid.classList.remove('hidden');
    const emptyState = document.getElementById('empty-state-results');
    if(emptyState) emptyState.classList.add('hidden');
  
    parametros.forEach(param => {
        const valor = results[param.key];
        if (valor && valor !== 0) {
            const evaluacion = evaluarRango(param.key, valor, edad, edadMeses);
            if (!evaluacion.enRango) {
                const tipoFuera = evaluacion.tipo === 'alto' ? 'por encima de rango' : 'por debajo de rango';
                window.valoresFueraRango.push(`${param.nombre} ${param.unidad ? `(${param.unidad})` : ''}: ${valor.toFixed(2)}${param.unidad} ${tipoFuera} (VN ${evaluacion.rangoTexto})`);
            }
        }
    });
    
    Object.keys(results).forEach(key => {
        if (resultLabels[key]) {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item'; resultItem.id = `resultado-${key}`;
            
            const label = document.createElement('div');
            label.className = 'result-label'; label.textContent = resultLabels[key];
            
            const value = document.createElement('div');
            value.className = 'result-value';
            const numValue = results[key];
            value.textContent = typeof numValue === 'number' ? numValue.toFixed(2) : '0.00';
            
            if (key === "superficiecorporal" || key === "imc") {
                value.style.setProperty('color', '#21808d', 'important'); value.style.fontWeight = "bold";
            } else {
                const paramEncontrado = parametros.find(p => p.key === key);
                if (paramEncontrado && numValue && numValue !== 0) {
                    const evaluacion = evaluarRango(key, numValue, edad, edadMeses);
                    value.style.setProperty('color', !evaluacion.enRango ? '#dc2626' : '#21808d', 'important');
                    value.style.fontWeight = "bold";
                }
            }
            resultItem.appendChild(label); resultItem.appendChild(value); resultsGrid.appendChild(resultItem);
        }
    });
    document.getElementById('results').classList.remove('hidden');
}

function generateReport(data) {
    const results = window.calculatedResults;
    if (!results) return;

    function isValid(value) { return value != null && !isNaN(value) && value !== 0; }
    function fmt(value, decimals = 2) { return !isValid(value) ? null : parseFloat(value).toFixed(decimals); }

    let report = [];
    
    let hidrosalino = [];
    if (isValid(data.urea_mg_dl)) hidrosalino.push(`Urea: ${fmt(data.urea_mg_dl)}mg/dL`);
    if (isValid(data.creatinina_enz_mg_dl)) {
        let cr = `Cr: ${fmt(data.creatinina_enz_mg_dl)}mg/dL`;
        if (isValid(results.ckid_u25_cr)) cr += ` (eGFR CKiD U25 Cr: ${fmt(results.ckid_u25_cr)}ml/min/1.73m²)`;
        hidrosalino.push(cr);
    }
    if (isValid(data.cistatina_c_mg_l)) {
        let cist = `Cistatina C: ${fmt(data.cistatina_c_mg_l)}mg/L`;
        if (isValid(results.ckid_u25_cistc)) cist += ` (eGFR CKiD U25 CistC: ${fmt(results.ckid_u25_cistc)}ml/min/1.73m²)`;
        hidrosalino.push(cist);
    }
    if (isValid(results.ckid_u25_combinado)) hidrosalino.push(`eGFR Combinado: ${fmt(results.ckid_u25_combinado)}ml/min/1.73m²`);
    if (isValid(results.vpercent)) hidrosalino.push(`V%: ${fmt(results.vpercent)}%`);
    if (isValid(data.na_plasma_meq_l)) hidrosalino.push(`Na: ${fmt(data.na_plasma_meq_l)}mEq/L`);
    if (isValid(results.efna)) hidrosalino.push(`EFNa: ${fmt(results.efna)}`);
    if (isValid(data.k_plasma_meq_l)) hidrosalino.push(`K: ${fmt(data.k_plasma_meq_l)}mEq/L`);
    if (isValid(results.efk)) hidrosalino.push(`EFK: ${fmt(results.efk)}`);
    if (isValid(data.cl_plasma_meq_l)) hidrosalino.push(`Cl: ${fmt(data.cl_plasma_meq_l)}mEq/L`);
    if (isValid(results.efcl)) hidrosalino.push(`EFCl: ${fmt(results.efcl)}`);
    if (isValid(data.au_plasma_mg_dl)) hidrosalino.push(`AU: ${fmt(data.au_plasma_mg_dl)}mg/dL`);
    if (isValid(results.efau)) hidrosalino.push(`EFAU: ${fmt(results.efau)}`);
    if (hidrosalino.length > 0) report.push(`- Hidrosalino: ${hidrosalino.join('   ')}`);

    let fosfocalcico = [];
    if (isValid(data.ca_plasma_mg_dl)) fosfocalcico.push(`Ca: ${fmt(data.ca_plasma_mg_dl)}mg/dL`);
    if (isValid(results.cacr)) fosfocalcico.push(`Ca/Cr: ${fmt(results.cacr)}mg/mg`);
    if (isValid(data.p_plasma_mg_dl)) fosfocalcico.push(`P: ${fmt(data.p_plasma_mg_dl)}mg/dL`);
    if (isValid(results.rtp)) fosfocalcico.push(`RTP: ${fmt(results.rtp)}%`);
    if (isValid(data.mg_plasma_mg_dl)) fosfocalcico.push(`Mg: ${fmt(data.mg_plasma_mg_dl)}mg/dL`);
    if (isValid(results.mgcr)) fosfocalcico.push(`Mg/Cr: ${fmt(results.mgcr)}mg/mg`);
    if (isValid(results.pcr)) fosfocalcico.push(`P/Cr: ${fmt(results.pcr)}mg/mg`);
    if (isValid(data.pth_pg_ml)) fosfocalcico.push(`PTH: ${fmt(data.pth_pg_ml)}pg/mL`);
    if (isValid(data.vitamina_d_ng_ml)) fosfocalcico.push(`Vitamina D: ${fmt(data.vitamina_d_ng_ml)}ng/mL`);
    if (isValid(data.fosfatasa_alcalina_u_l)) fosfocalcico.push(`Fosfatasa alcalina: ${fmt(data.fosfatasa_alcalina_u_l)}U/L`);
    if (fosfocalcico.length > 0) report.push(`- Metabolismo fosfocálcico: ${fosfocalcico.join('   ')}`);

    let hematologico = [];
    if (isValid(data.hb_g_l)) hematologico.push(`Hemoglobina: ${fmt(data.hb_g_l)}g/L`);
    if (isValid(data.ferritina_ng_ml)) hematologico.push(`Ferritina: ${fmt(data.ferritina_ng_ml)}ng/mL`);
    if (isValid(data.ist_percent)) hematologico.push(`IST: ${fmt(data.ist_percent)}%`);
    if (hematologico.length > 0) report.push(`- Hematológico: ${hematologico.join('   ')}`);

    let gasometria = [];
    if (isValid(data.ph_plasma)) gasometria.push(`pH: ${fmt(data.ph_plasma)}`);
    if (isValid(data.pco2_mmhg)) gasometria.push(`pCO2: ${fmt(data.pco2_mmhg)}mmHg`);
    if (isValid(data.hco3_mmol_l)) gasometria.push(`HCO3: ${fmt(data.hco3_mmol_l)}mmol/L`);
    if (isValid(data.exceso_bases_mmol_l)) gasometria.push(`Exceso de bases: ${fmt(data.exceso_bases_mmol_l)}mmol/L`);
    if (gasometria.length > 0) report.push(`- Gasometría: ${gasometria.join('   ')}`);

    let orina = [];
    const sedimentoUrinario = document.getElementById('sedimento_urinario') ? document.getElementById('sedimento_urinario').value.trim() : '';
    if (isValid(data.densidad)) orina.push(`Densidad: ${fmt(data.densidad, 0)}`);
    if (isValid(data.ph_orina)) orina.push(`pH: ${fmt(data.ph_orina)}`);
    
    let sedimentoParts = [];
    if (isValid(results.protcr)) sedimentoParts.push(`Prot/Cr: ${fmt(results.protcr)}mg/g`);
    if (isValid(results.proteinuriaestimada)) sedimentoParts.push(`Proteinuria estimada: ${fmt(results.proteinuriaestimada)}mg/m²/día`);
    if (isValid(results.albcr)) sedimentoParts.push(`Alb/Cr: ${fmt(results.albcr)}mg/g`);
    
    if (sedimentoUrinario) {
        orina.push(`Sedimento: ${sedimentoUrinario}`);
        if (sedimentoParts.length > 0) orina.push(sedimentoParts.join('   '));
    } else if (sedimentoParts.length > 0) {
        orina.push(`Sedimento: ${sedimentoParts.join('   ')}`);
    }
    
    if (isValid(data.osmolalidad_orina_mosm_kg)) orina.push(`Osmolalidad urinaria: ${fmt(data.osmolalidad_orina_mosm_kg)}mOsm/kg`);
    if (orina.length > 0) report.push(`- Orina puntual: ${orina.join('   ')}`);

    let cocientes = [];
    if (isValid(results.aucr)) cocientes.push(`AU/Cr: ${fmt(results.aucr)}mg/mg`);
    if (isValid(results.nak)) cocientes.push(`Na/K: ${fmt(results.nak)}`);
    if (isValid(results.cacr)) cocientes.push(`Ca/Cr: ${fmt(results.cacr)}mg/mg`);
    if (isValid(results.citratocr)) cocientes.push(`Citrato/Cr: ${fmt(results.citratocr)}mg/mg`);
    if (isValid(results.cacitrato)) cocientes.push(`Ca/Citrato: ${fmt(results.cacitrato)}`);
    if (isValid(results.oxalatocr)) cocientes.push(`Oxalato/Cr: ${fmt(results.oxalatocr)}mg/mg`);
    if (cocientes.length > 0) report.push(`- Cocientes urinarios: ${cocientes.join('   ')}`);

    let orina24h = [];
    if (isValid(results.uricosuria)) orina24h.push(`Uricosuria: ${fmt(results.uricosuria)}mg/1.73m²`);
    if (isValid(results.calciuria)) orina24h.push(`Calciuria: ${fmt(results.calciuria)}mg/kg/día`);
    if (isValid(results.citraturia)) orina24h.push(`Citraturia: ${fmt(results.citraturia)}mg/kg/día`);
    if (isValid(results.fosfaturia)) orina24h.push(`Fosfaturia: ${fmt(results.fosfaturia)}mg/kg/día`);
    if (isValid(results.oxaluria)) orina24h.push(`Oxaluria: ${fmt(results.oxaluria)}mg/1.73m²`);
    if (isValid(results.magnesuria)) orina24h.push(`Magnesuria: ${fmt(results.magnesuria)}mg/kg/día`);
    if (isValid(results.proteinuria)) orina24h.push(`Proteinuria: ${fmt(results.proteinuria)}mg/m²/día`);
    if (isValid(results.albuminuria)) orina24h.push(`Albuminuria: ${fmt(results.albuminuria)}mg/1.73m²/día`);
    if (orina24h.length > 0) report.push(`- Orina de 24h: ${orina24h.join('   ')}`);
    
    function evaluarGradoG(egfr) {
        if (!isValid(egfr)) return null;
        if (egfr >= 90) return "Estadio G1 (Normal o elevado)";
        if (egfr >= 60) return "Estadio G2 (Levemente disminuido)";
        if (egfr >= 45) return "Estadio G3a (Leve o moderadamente disminuido)";
        if (egfr >= 30) return "Estadio G3b (Moderado o muy disminuido)";
        if (egfr >= 15) return "Estadio G4 (Muy disminuido)";
        return "Estadio G5 (Fallo renal)";
    }
    function evaluarGradoA(albcr) {
        if (albcr === null || isNaN(albcr) || albcr === undefined) return null;
        if (albcr < 30) return "Estadio A1 (Normal o levemente elevada)";
        if (albcr <= 300) return "Estadio A2 (Moderadamente elevada)";
        return "Estadio A3 (Muy elevada)";
    }

    const gradoCr = evaluarGradoG(results.ckid_u25_cr);
    const gradoCist = evaluarGradoG(results.ckid_u25_cistc);
    const gradoComb = evaluarGradoG(results.ckid_u25_combinado);
    let gradoAlb = (results.albcr !== undefined && results.albcr > 0) ? evaluarGradoA(results.albcr) : null;

    if (gradoCr || gradoCist || gradoComb || gradoAlb) {
        report.push('');
        report.push('ESTADIFICACIÓN SEGÚN GUÍAS KDIGO 2012');
        if (gradoCr) report.push(`- Grado de ERC por Cr: ${gradoCr}`);
        if (gradoCist) report.push(`- Grado de ERC por CistC: ${gradoCist}`);
        if (gradoComb) report.push(`- Grado de ER Combinado: ${gradoComb}`);
        if (gradoAlb) report.push(`- Albuminuria: ${gradoAlb}`);
    }

    const comentarioNutricional = document.getElementById('comentario_nutricional') ? document.getElementById('comentario_nutricional').value.trim() : '';
    if (comentarioNutricional) {
        report.push('');
        report.push(`Nutricional: ${comentarioNutricional}`);
    }
    
    if (window.valoresFueraRango && window.valoresFueraRango.length > 0) {
        report.push('');
        report.push('Valores fuera de rango:');
        window.valoresFueraRango.forEach(v => report.push(v));
    }

    const reportTextReady = report.join('\n');
    document.getElementById('reportContent').innerHTML = `<pre style="font-family: 'Rubik', sans-serif; font-size: 14px; line-height: 2.0; white-space: pre-wrap;">${reportTextReady}</pre>`;
    document.getElementById('reportSection').classList.remove('hidden');
    setTimeout(() => { document.getElementById('reportSection').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
}

// ===============================================
// 7. FUNCIONES DE EXPORTACIÓN
// ===============================================
function exportToWord() {
    const reportContent = document.getElementById('reportContent');
    const reportText = reportContent ? reportContent.innerText : '';
    if (!reportText.trim()) return Swal.fire({ icon: 'warning', title: 'Sin informe', text: 'Calcule primero los resultados.'});
    
    try {
        const header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Informe</title></head><body>';
        const formattedText = reportText.replace(/\n/g, '<br>');
        const sourceHTML = header + '<h2>Informe Clínico Renal</h2><pre style="font-family: Arial; font-size: 12px; line-height: 1.8;">' + formattedText + '</pre></body></html>';
        
        const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.href = url; link.download = 'informe-clinico-renal.doc';
        link.click(); URL.revokeObjectURL(url);
        Swal.fire({ icon: 'success', title: 'Word descargado', timer: 1500, showConfirmButton: false });
    } catch (e) { Swal.fire({ icon: 'error', title: 'Error', text: 'Error exportando.' }); }
}

function exportToPDF() {
    const reportContent = document.getElementById('reportContent');
    const reportText = reportContent ? reportContent.innerText : '';
    if (!reportText.trim()) return Swal.fire({ icon: 'warning', title: 'Sin informe', text: 'Calcule primero los resultados.'});
    
    try {
        const { jsPDF } = window.jspdf; const doc = new jsPDF();
        doc.setFontSize(14); doc.text('Informe Clínico Renal', 20, 20);
        doc.setFontSize(10); const lines = doc.splitTextToSize(reportText, 170); doc.text(lines, 20, 35);
        doc.save('informe-clinico-renal.pdf');
        Swal.fire({ icon: 'success', title: 'PDF descargado', timer: 1500, showConfirmButton: false });
    } catch (e) { Swal.fire({ icon: 'error', title: 'Error', text: 'Error exportando.' }); }
}

function printReport() {
    const reportContent = document.getElementById('reportContent');
    const reportText = reportContent ? reportContent.innerText : '';
    if (!reportText.trim()) return Swal.fire({ icon: 'warning', title: 'Sin informe', text: 'Calcule primero los resultados.'});
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Informe Clínico Renal</title><style>body { font-family: 'Rubik', Arial, sans-serif; padding: 30px; } pre { font-family: 'Rubik', Arial, sans-serif; font-size: 13px; line-height: 2.0; white-space: pre-wrap; }</style></head><body><h2>Informe Clínico Renal</h2><pre>${reportText}</pre></body></html>`);
    printWindow.document.close(); printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
}
function copyToClipboard() {
    const reportContent = document.getElementById('reportContent');
    const reportText = reportContent ? reportContent.innerText : '';
    
    if (!reportText.trim()) {
        return Swal.fire({ icon: 'warning', title: 'Sin informe', text: 'Calcule primero los resultados.'});
    }
    
    // Usamos la API moderna del portapapeles del navegador
    navigator.clipboard.writeText(reportText).then(() => {
        // Alerta de éxito elegante
        Swal.fire({
            icon: 'success',
            title: '¡Copiado!',
            text: 'El informe médico está listo para pegar (Ctrl+V) en la Historia Clínica.',
            timer: 2500,
            showConfirmButton: false,
            backdrop: `rgba(33, 128, 141, 0.2)` // Un fondo verde muy sutil
        });
    }).catch(err => {
        console.error('Error al copiar: ', err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo copiar el texto automáticamente. Por favor, selecciónelo a mano.' });
    });
}
// ===============================================
// 8. LÓGICA DE INSTALACIÓN PWA (Botón Instalar)
// ===============================================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Evita que el navegador muestre su propio mini-aviso feo (sobre todo en Android)
    e.preventDefault();
    // Guardamos el evento para dispararlo luego cuando el usuario pulse nuestro botón
    deferredPrompt = e;
    
    // Mostramos nuestro botón elegante
    const installBtn = document.getElementById('btn-install-pwa');
    if (installBtn) {
        installBtn.classList.remove('hidden');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('btn-install-pwa');
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Mostramos el aviso nativo de instalación del sistema operativo
                deferredPrompt.prompt();
                // Esperamos a ver qué elige el usuario (Aceptar o Cancelar)
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Resultado de la instalación: ${outcome}`);
                // Vaciamos la variable porque solo se puede usar una vez
                deferredPrompt = null;
                // Ocultamos el botón
                installBtn.classList.add('hidden');
            }
        });
    }
});

window.addEventListener('appinstalled', () => {
    // Si ya se ha instalado, ocultamos el botón para siempre
    const installBtn = document.getElementById('btn-install-pwa');
    if (installBtn) installBtn.classList.add('hidden');
    console.log('¡PWA instalada con éxito!');
});

// ===============================================
// 9. TRUCO NINJA: UNIDADES INTEGRADAS EN EL INPUT
// ===============================================
function inyectarUnidadesEnInputs() {
    document.querySelectorAll('.form-label').forEach(label => {
        // Recorremos los textos de la etiqueta (con cuidado de no romper los tooltips ?)
        for (let i = 0; i < label.childNodes.length; i++) {
            const node = label.childNodes[i];
            
            // Buscamos solo el texto normal (NodeType 3)
            if (node.nodeType === 3) {
                // Buscamos cualquier cosa que esté entre paréntesis
                const match = node.nodeValue.match(/\((.*?)\)/);
                
                if (match) {
                    const unidad = match[1].trim();
                    const inputId = label.getAttribute('for');
                    
                    // Excluimos la edad porque "(calculada)" no es una unidad matemática
                    if (inputId === 'edad_calculada') continue;
                    
                    const input = document.getElementById(inputId);
                    if (input && input.tagName.toLowerCase() === 'input') {
                        // 1. Borramos la unidad del título original
                        node.nodeValue = node.nodeValue.replace(/\(.*?\)/, '').trim() + ' ';
                        
                        // 2. Creamos una "caja" invisible para agrupar el input y la unidad
                        const wrapper = document.createElement('div');
                        wrapper.style.position = 'relative';
                        wrapper.style.display = 'flex';
                        wrapper.style.alignItems = 'center';
                        wrapper.style.width = '100%';
                        
                        // Metemos el input dentro de la caja
                        input.parentNode.insertBefore(wrapper, input);
                        wrapper.appendChild(input);
                        
                        // 3. Hacemos hueco a la derecha del input para que los números no pisen la letra
                        const paddingDerecho = (unidad.length * 8 + 15);
                        input.style.paddingRight = paddingDerecho + 'px';
                        
                        // 4. Creamos el texto de la unidad y lo anclamos a la derecha
                        const unitSpan = document.createElement('span');
                        unitSpan.textContent = unidad;
                        unitSpan.style.position = 'absolute';
                        unitSpan.style.right = '12px';
                        unitSpan.style.color = 'var(--color-text-secondary)';
                        unitSpan.style.fontSize = '12px';
                        unitSpan.style.fontWeight = '600';
                        unitSpan.style.pointerEvents = 'none'; // Evita que el click se bloquee
                        unitSpan.style.userSelect = 'none';
                        
                        wrapper.appendChild(unitSpan);
                    }
                    break; // Terminamos con este campo y pasamos al siguiente
                }
            }
        }
    });
}

// ==========================================
// FUNCIÓN AUXILIAR: LIMPIEZA DE COLORES
// ==========================================
function limpiarColoresValidacion() {
    // Busca cualquier input o textarea que sea del formulario
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('campo-valido', 'campo-error');
    });
}













