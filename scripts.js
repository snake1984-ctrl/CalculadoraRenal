
// ============================================
// REGISTRO DEL SERVICE WORKER
// ============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado:', registration.scope);
      }).catch(error => {
        console.log('Error al registrar Service Worker:', error);
      });
  });
}
// ============================================
// MODO TEST - ACTIVACIÓN COMPLETA CORREGIDA
// ============================================
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const modoTest = urlParams.get('modo') === 'test';

  if (modoTest) {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', activarModoTest);
    } else {
      activarModoTest();
    }
  }

  function activarModoTest() {
    console.log('✅ MODO TEST ACTIVADO');

    // 1. Añadir clase al body para el distintivo visual
    document.body.classList.add('modo-test');

    // 2. Mostrar botón de datos de ejemplo
    const botonTest = document.getElementById('btn-cargar-datos-test');
    if (botonTest) {
      botonTest.style.display = 'inline-block';
      console.log('✅ Botón de test visible');
    } else {
      console.warn('⚠️ No se encontró el botón btn-cargar-datos-test');
    }
    setupTabNavigationScroll();
  }
  document.addEventListener('DOMContentLoaded', function() {
  // Si tienes otras inicializaciones JS, ponlas aquí arriba

  // Asegura el scroll aunque el DOM cambie después
  setupTabNavigationScroll();

  // Activa el modo test si la URL lo indica
  if (window.location.search.includes('modo=test')) {
    activarModoTest();
    // (Dentro de activarModoTest ya se llama al scroll tras modificar el DOM)
  }
});

})();

// ===============================================
        // APLICACIÓN CLÍNICA RENAL - VERSIÓN 9 INTEGRADA
        // Motor de cálculo COMPLETO con funciones exactas
        // ===============================================

        // Lista exacta de TODOS los IDs de los 48 campos
        const fieldIds = [
            // DATOS BÁSICOS (4 campos) - ACTUALIZADO CON FECHAS
            'fecha_nacimiento', 'fecha_analitica', 'peso_kg', 'talla_cm',
          'sexo',
            
            // BIOQUÍMICA PLASMÁTICA (13 campos)
            'urea_mg_dl', 'creatinina_enz_mg_dl', 'au_plasma_mg_dl', 'na_plasma_meq_l', 'k_plasma_meq_l', 'cl_plasma_meq_l', 'fosfatasa_alcalina_u_l', 'ca_plasma_mg_dl', 'p_plasma_mg_dl', 'mg_plasma_mg_dl', 'pth_pg_ml', 'vitamina_d_ng_ml', 'cistatina_c_mg_l',
            
            // GASOMETRÍA (4 campos)
            'ph_plasma', 'pco2_mmhg', 'hco3_mmol_l', 'exceso_bases_mmol_l',
            
            // ORINA PUNTUAL (15 campos)
            'densidad', 'ph_orina', 'au_orina_mg_dl', 'na_orina_meq_l', 'k_orina_meq_l', 'cl_orina_meq_l', 'osmolalidad_orina_mosm_kg', 'ca_orina_mg_dl', 'fosforo_orina_mg_dl', 'magnesio_orina_mg_dl', 'albumina_orina_mg_dl', 'creatinina_orina_mg_dl', 'proteinas_orina_mg_dl', 'citrato_orina_mg_dl', 'oxalato_orina_mg_dl',
            
            // ORINA 24H (8 campos)
            'au_24h_mg', 'ca_24h_mg', 'p_24h_mg', 'mg_24h_mg', 'albumina_24h_mg', 'proteinas_24h_mg', 'citrato_24h_mg', 'oxalato_24h_mg',
            
            // HEMATOLOGÍA (3 campos)
            'hb_g_l', 'ferritina_ng_ml', 'ist_percent'
        ];

        // ===============================================
        // VARIABLES GLOBALES VERSIÓN 9
        // ===============================================
        let calculatedResults = {}; // Compatibilidad con código anterior
        let reportText = '';
        let primeraValidacion = false; // CRÍTICO: FALSE = sin asteriscos hasta presionar Calcular
        
        // Variable global window.calculatedResults para V9
        window.calculatedResults = {};
        
      
        // Variables globales para edad calculada
        window.edadEnAños = 0;
        window.edadEnMeses = 0;
        window.edadTotalMeses = 0;
        window.valoresFueraRango = [];

        // MEJORA 2: Generadores de números aleatorios mejorados
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getRandomFloat(min, max, decimals = 2) {
            let num = Math.random() * (max - min) + min;
            num = Math.max(num, 0); // Evitar negativos
            return parseFloat(num.toFixed(decimals));
        }



        // INICIALIZACIÓN CON VALIDACIÓN NUMÉRICA DIFERENCIADA
        document.addEventListener('DOMContentLoaded', function() {
            // CRÍTICO: Configurar validación numérica diferenciada
            configureNumericValidation();
            console.log('🚀 Inicializando aplicación con validación numérica diferenciada...');
            
            // Configurar eventos de fechas
            configurarEventosFechas();
            
            // Verificar que todos los campos existen
            verifyFieldsExist();
            
            // Configurar eventos
            setupTabNavigation();
            setupFormEvents();
            setupButtons();
            
            // Actualizar contador inicial (0/46)
            updateFieldCounter();
            
           
            // CRÍTICO: primeraValidacion = FALSE hasta presionar "Calcular"
            // Esto garantiza que NO aparezcan asteriscos al inicio
            
            console.log('✅ Aplicación con validación numérica diferenciada inicializada');
            if (modoTest) {
                console.log('🧪 MODO TEST ACTIVADO por URL');
            }
        });

        // FUNCIONES DE FECHAS
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
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            if (value.length >= 5) {
                value = value.substring(0, 5) + '/' + value.substring(5, 9);
            }
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
            
            if (diaAnal < diaNac) {
                meses--;
            }
            
            if (meses < 0) {
                años--;
                meses += 12;
            }
            
            document.getElementById('edad_calculada').value = `${años} años ${meses} meses`;
            
            // Guardar edad en formato numérico para cálculos
            window.edadEnAños = años;
            window.edadEnMeses = meses;
            window.edadTotalMeses = años * 12 + meses;
        }
        
        function configurarEventosFechas() {
            const fechaNac = document.getElementById('fecha_nacimiento');
            const fechaAnal = document.getElementById('fecha_analitica');
            
            if (fechaNac) {
                fechaNac.addEventListener('input', function() {
                    validarFormatoFecha(this);
                });
            }
            
            if (fechaAnal) {
                fechaAnal.addEventListener('input', function() {
                    validarFormatoFecha(this);
                });
            }
        }
        
        // CONFIGURACIÓN DE VALIDACIÓN NUMÉRICA DIFERENCIADA
        function configureNumericValidation() {
            
            // Lista de todos los campos numéricos (ya no hay campo edad individual)
            const camposDecimales = [
                'peso_kg', 'talla_cm',
                'urea_mg_dl', 'creatinina_enz_mg_dl', 'cistatina_c_mg_l', 'au_plasma_mg_dl', 
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

            // VALIDACIÓN FECHAS: Formato DD/MM/AAAA automático
            // Ya configurado en configurarEventosFechas()

            // VALIDACIÓN CAMPOS DECIMALES: Máximo 2 decimales, punto->coma
            camposDecimales.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input) {
                    input.type = 'text'; // Cambiar a text para control total
                    input.setAttribute('inputmode', 'decimal');
                    
                    input.addEventListener('input', function(e) {
                        let value = e.target.value;
                        
                        // Convertir punto en coma automáticamente
                        value = value.replace(/\./g, ',');
                        
                        // Eliminar todo excepto números y comas
// Permitir negativos solo en exceso de bases
        if (fieldId === 'exceso_bases_mmol_l') {
          value = value.replace(/[^0-9,-]/g, '');
        } else {
          value = value.replace(/[^0-9,]/g, '');
        }                        
                        // Permitir solo UNA coma
                        const parts = value.split(',');
                        if (parts.length > 2) {
                            // Si hay más de una coma, mantener solo la primera
                            value = parts[0] + ',' + parts.slice(1).join('');
                        }
                        
                        // Limitar a 2 decimales después de la coma
                        if (parts.length === 2 && parts[1].length > 2) {
                            value = parts[0] + ',' + parts[1].substring(0, 2);
                        }
                        
                        e.target.value = value;
                    });
                    
                    input.addEventListener('blur', function(e) {
                        // Al salir del campo, validar que sea número válido
                        let value = e.target.value;
                        if (value) {
                            // Convertir coma a punto para validación
                            const numValue = parseFloat(value.replace(',', '.'));
                            if (isNaN(numValue)) {
                                e.target.value = '';
                            }
                        }
                    });
                }
            });
            
            console.log('✅ Validación numérica diferenciada aplicada: fechas (DD/MM/AAAA) + otros (decimales con coma)');
        }

        function verifyFieldsExist() {
            console.log('🔍 Verificando 48 campos con tipografía Rubik...');
            let missingFields = [];
            
            fieldIds.forEach(fieldId => {
                const element = document.getElementById(fieldId);
                if (!element) {
                    missingFields.push(fieldId);
                }
            });
            
            if (missingFields.length > 0) {
                console.error('❌ Campos faltantes:', missingFields);
            } else {
                console.log(`✅ Todos los 48 campos están presentes con fuente Rubik aplicada`);
            }
        }

        function setupTabNavigation() {
            const tabButtons = document.querySelectorAll('.tab-button');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const targetTab = this.getAttribute('data-tab');
                    switchTab(targetTab, this);
                });
            });
        }

        function switchTab(tabId, buttonElement) {
            // Ocultar todas las pestañas
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Desactivar todos los botones
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activar la pestaña seleccionada
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            // Activar el botón correspondiente
            if (buttonElement) {
                buttonElement.classList.add('active');
            }
        }

        // ASTERISCOS SOLO EN PESTAÑAS - DESPUÉS DE CALCULAR
        function actualizarMarcadoresEnTiempoReal() {
            if (!primeraValidacion) return; // CRÍTICO: Sin marcadores hasta presionar Calcular

            const secciones = {
                'datos-basicos-tab': ['fecha_nacimiento', 'fecha_analitica', 'peso_kg', 'talla_cm'],
                'bioquimica-tab': ['urea_mg_dl', 'creatinina_enz_mg_dl', 'au_plasma_mg_dl', 'na_plasma_meq_l', 'k_plasma_meq_l', 'cl_plasma_meq_l', 'fosfatasa_alcalina_u_l', 'ca_plasma_mg_dl', 'p_plasma_mg_dl', 'mg_plasma_mg_dl', 'pth_pg_ml', 'vitamina_d_ng_ml', 'cistatina_c_mg_l'],
                'gasometria-tab': ['ph_plasma', 'pco2_mmhg', 'hco3_mmol_l', 'exceso_bases_mmol_l'],
                'orina-puntual-tab': ['densidad', 'ph_orina', 'au_orina_mg_dl', 'na_orina_meq_l', 'k_orina_meq_l', 'cl_orina_meq_l', 'osmolalidad_orina_mosm_kg', 'ca_orina_mg_dl', 'fosforo_orina_mg_dl', 'magnesio_orina_mg_dl', 'albumina_orina_mg_dl', 'creatinina_orina_mg_dl', 'proteinas_orina_mg_dl', 'citrato_orina_mg_dl', 'oxalato_orina_mg_dl'],
                'orina-24h-tab': ['au_24h_mg', 'ca_24h_mg', 'p_24h_mg', 'mg_24h_mg', 'albumina_24h_mg', 'proteinas_24h_mg', 'citrato_24h_mg', 'oxalato_24h_mg'],
                'hematologia-tab': ['hb_g_l', 'ferritina_ng_ml', 'ist_percent']
            };

            Object.keys(secciones).forEach(tabId => {
                const campos = secciones[tabId];
                let tieneError = false;
                
                campos.forEach(campoId => {
                    const campo = document.getElementById(campoId);
                    if (!campo || !campo.value || campo.value.trim() === '') {
                        tieneError = true;
                        if (campo) campo.classList.add('campo-error');
                    } else {
                        if (campo) campo.classList.remove('campo-error');
                    }
                });
                
                const tab = document.getElementById(tabId);
                if (tab) {
                    if (tieneError) {
                        tab.classList.add('tab-error');
                    } else {
                        tab.classList.remove('tab-error');
                    }
                }
            });
        }

        function setupFormEvents() {
            // Event listeners para actualización en tiempo real
            fieldIds.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input) {
                    input.addEventListener('input', () => {
                        updateFieldCounter();
                        actualizarMarcadoresEnTiempoReal(); // CAMBIO 3: Actualización en tiempo real
                    });
                    input.addEventListener('change', () => {
                        updateFieldCounter();
                        actualizarMarcadoresEnTiempoReal(); // CAMBIO 3: Actualización en tiempo real
                    });
                    
                    // Validación en tiempo real para valores negativos (excepto exceso_bases)
                   document.querySelectorAll('input[type="number"]').forEach(input => {
                      let fieldId = input.id;
                      input.addEventListener('input', () => {
                          console.log('Validando:', fieldId, input.value);
                          if (fieldId !== 'exceso_bases_mmol_l' && parseFloat(input.value) < 0) {
                              input.value = '';
                           }
                        });
                      });

                }
            });
        }

        function setupButtons() {
            // Botón Calcular con validación V9
            const calculateButton = document.getElementById('calculateButton');
            if (calculateButton) {
                calculateButton.addEventListener('click', () => {
                    primeraValidacion = true; // Activar validaciones visuales
                    actualizarMarcadoresEnTiempoReal();
                    calculateResults(); // V9 maneja la validación internamente
                });
            }
            
            // Botón Cargar Datos de Ejemplo (solo por hotkey)
            // El botón se crea dinámicamente cuando se activa el modo test
            
            // Botón Limpiar Formulario - UX MODERNO con confirmación única
            // El evento onclick está definido directamente en el HTML
            
            // Botones de exportación
            const exportWordButton = document.getElementById('exportWordButton');
            if (exportWordButton) {
                exportWordButton.addEventListener('click', exportToWord);
            }
            
            const exportPDFButton = document.getElementById('exportPDFButton');
            if (exportPDFButton) {
                exportPDFButton.addEventListener('click', exportToPDF);
            }
            
            const printButton = document.getElementById('printButton');
            if (printButton) {
                printButton.addEventListener('click', printReport);
            }
        }

        // CAMBIO 1 UX MODERNO: Confirmación única al limpiar formulario (SIN mensaje posterior)
        function confirmarLimpiarFormulario() {
            Swal.fire({
                icon: 'question',
                title: '¿Borrar todos los campos?',
                text: 'Se borrarán todos los datos introducidos y no se podrá deshacer.',
                showCancelButton: true,
                confirmButtonText: 'Sí, borrar todo',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                backdrop: true,
                allowOutsideClick: false
            }).then(result => {
                if (result.isConfirmed) {
                    // Limpiar sin mostrar más mensajes
                    clearFormSilent();
                }
            });
        }
        
        // FUNCIÓN AUXILIAR: Limpiar formulario silenciosamente (sin mensajes)
        function clearFormSilent() {
            console.log('🗑️ Limpiando formulario silenciosamente - UX moderno');
            
            let clearedCount = 0;
            
            // Limpiar cada campo individualmente
            fieldIds.forEach(fieldId => {
                const element = document.getElementById(fieldId);
                if (element) {
                    element.value = '';
                    element.classList.remove('campo-error');
                    clearedCount++;
                }
            });
            // Limpiar manualmente los dos textarea de texto libre
            const textareaSedimento = document.getElementById('sedimento_urinario'); 
            if (textareaSedimento) textareaSedimento.value = "";

            const textareaComentario = document.getElementById('comentario_nutricional'); 
            if (textareaComentario) textareaComentario.value = "";

            // Limpiar secciones de resultados e informe
            const resultsSection = document.getElementById('results');
            const reportSection = document.getElementById('report');
            const resultsGrid = document.getElementById('resultsGrid');
            const reportContent = document.getElementById('reportContent');
            
            if (resultsSection) resultsSection.classList.add('hidden');
            if (reportSection) reportSection.classList.add('hidden');
            if (resultsGrid) resultsGrid.innerHTML = '';
            if (reportContent) reportContent.textContent = '';
            
            // Resetear variables globales V9
            calculatedResults = {};
            window.calculatedResults = {};
            reportText = '';
            primeraValidacion = false; // Volver a estado inicial SIN asteriscos
            
            // Limpiar todos los marcadores visuales
            document.querySelectorAll('.campo-error').forEach(campo => {
                campo.classList.remove('campo-error');
            });
            document.querySelectorAll('.tab-error').forEach(tab => {
                tab.classList.remove('tab-error');
            });
            // Limpiar también el campo de edad calculada
                const edadCalculada = document.getElementById('edad_calculada');
                if (edadCalculada) {
                edadCalculada.value = '';
              }

            // Actualizar contador
            updateFieldCounter();
            
            // Volver a la primera pestaña
            switchTab('datos-basicos', document.querySelector('[data-tab="datos-basicos"]'));
            
            console.log(`✅ Formulario limpiado: ${clearedCount}/${fieldIds.length} campos`);
            // NO mostrar mensaje de éxito - UX moderno
        }
        
        // FUNCIÓN LEGACY: clearForm() ahora usa la nueva lógica
        function clearForm() {
            confirmarLimpiarFormulario();
        }

        // ===============================================
        // FUNCIÓN loadSampleData VERSIÓN 9 COMPLETA
        // ===============================================
        function loadSampleData() {
            console.log('🧪 Cargando datos de ejemplo V9...');
            
            // Datos de ejemplo clínicamente coherentes
            const sampleData = {
                // DATOS BÁSICOS
                fecha_nacimiento: '15/03/2012',
                fecha_analitica: '20/10/2024',
                peso_kg: 35.5,
                talla_cm: 140.0,
              sexo: 'hombre',
                
                // BIOQUÍMICA PLASMÁTICA
                urea_mg_dl: 28,
                creatinina_enz_mg_dl: 0.65,
                au_plasma_mg_dl: 4.2,
                na_plasma_meq_l: 138.5,
                k_plasma_meq_l: 4.1,
                cl_plasma_meq_l: 105.2,
                fosfatasa_alcalina_u_l: 180,
                ca_plasma_mg_dl: 9.8,
                p_plasma_mg_dl: 4.5,
                mg_plasma_mg_dl: 1.9,
                pth_pg_ml: 35.2,
                vitamina_d_ng_ml: 28.5,
                cistatina_c_mg_l: 0.92,
                
                // GASOMETRÍA
                ph_plasma: 7.38,
                pco2_mmhg: 42.1,
                hco3_mmol_l: 22.8,
                exceso_bases_mmol_l: -1.2,
                
                // ORINA PUNTUAL
                densidad: 1018,
                ph_orina: 6.2,
                au_orina_mg_dl: 45.8,
                na_orina_meq_l: 85.2,
                k_orina_meq_l: 55.1,
                cl_orina_meq_l: 98.5,
                osmolalidad_orina_mosm_kg: 320,
                ca_orina_mg_dl: 12.5,
                fosforo_orina_mg_dl: 18.2,
                magnesio_orina_mg_dl: 8.5,
                albumina_orina_mg_dl: 3.2,
                creatinina_orina_mg_dl: 68.5,
                proteinas_orina_mg_dl: 8.1,
                citrato_orina_mg_dl: 85.2,
                oxalato_orina_mg_dl: 15.8,
                
                // ORINA 24H
                au_24h_mg: 420,
                ca_24h_mg: 85,
                p_24h_mg: 520,
                mg_24h_mg: 65,
                albumina_24h_mg: 25,
                proteinas_24h_mg: 95,
                citrato_24h_mg: 485,
                oxalato_24h_mg: 28,
                
                // HEMATOLOGÍA
                hb_g_l: 125,
                ferritina_ng_ml: 45.8,
                ist_percent: 22.5
            };
            
            // Aplicar datos con validación
            let camposLlenados = 0;
            Object.keys(sampleData).forEach(key => {
                const input = document.getElementById(key);
                // Manejo especial para radio buttons (sexo)
                if (key === 'sexo') {
                      const sexoRadio = document.querySelector(`input[name="sexo"][value="${sampleData[key]}"]`);
                      if (sexoRadio) {
                              sexoRadio.checked = true;
                              camposLlenados++;
                            }
                      return;
                    }
                if (input) {
                    input.value = sampleData[key];
                    camposLlenados++;
                } else {
                    console.warn(`⚠️ Campo no encontrado: ${key}`);
                }
            });
            
            // Calcular edad después de cargar fechas
            calcularEdad();
            
            // Actualizar interfaz
            updateFieldCounter();
            actualizarMarcadoresEnTiempoReal();
            
            console.log(`✅ Datos V9 cargados: ${camposLlenados}/${fieldIds.length} campos`);
            
            Swal.fire({
                icon: 'success',
                title: 'Datos de ejemplo cargados',
                text: `Se han cargado ${camposLlenados} campos con datos clínicos realistas`,
                timer: 2000,
                showConfirmButton: false
            });
        }

        // Función para marcar/desmarcar errores visuales
        function marcarError(campoId, tieneError) {
            const campo = document.getElementById(campoId);
            if (campo) {
                if (tieneError) {
                    campo.classList.add('campo-error');
                } else {
                    campo.classList.remove('campo-error');
                }
            }
        }
        

        
        // FUNCIÓN DE VALIDACIÓN ELEGANTE CON SWEETALERT2 RESTAURADA
        function validarTodosCampos() {
            let camposVacios = [];
            
            // Activar validaciones visuales por primera vez
            primeraValidacion = true;
            
            fieldIds.forEach(campoId => {
                // Manejo especial para sexo (radio buttons)
                if (campoId === 'sexo') {
                      const sexoChecked = document.querySelector('input[name="sexo"]:checked');
                      if (!sexoChecked) {
                              camposVacios.push(campoId);
                              // Marcar los radio buttons como error
                              const radioButtons = document.querySelectorAll('input[name="sexo"]');
                              radioButtons.forEach(rb => rb.classList.add('campo-error'));
                            } else {
                              // Remover la clase de error si está seleccionado
                              const radioButtons = document.querySelectorAll('input[name="sexo"]');
                              radioButtons.forEach(rb => rb.classList.remove('campo-error'));
                            }
                      return; // Saltar la validación normal para este campo
                    }
                const campo = document.getElementById(campoId);
                if (!campo || !campo.value || campo.value.trim() === '') {
                    camposVacios.push(campoId);
                    marcarError(campoId, true);
                } else {
                    marcarError(campoId, false);
                }
            });
            
            // Actualizar asteriscos en pestañas
            actualizarMarcadoresEnTiempoReal();
            
            if (camposVacios.length > 0) {
                // Obtener nombres legibles de los campos
                const listaCampos = camposVacios.map(id => {
                    const label = document.querySelector(`label[for='${id}']`);
                    return label ? label.textContent.replace(' *', '') : id.replace(/_/g, ' ');
                });
                
                // Scroll automático al primer campo vacío
                const primerCampoVacio = document.getElementById(camposVacios[0]);
                if (primerCampoVacio) {
                    primerCampoVacio.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
                
                // SweetAlert2 elegante con lista y opciones
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    html: `
                        <p>Faltan <strong>${camposVacios.length}</strong> campos por rellenar:</p>
                        <div style="max-height: 250px; overflow-y: auto; text-align: left; margin: 15px 0; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
                            <ul style="margin: 0; padding-left: 20px;">
                                ${listaCampos.map(c => `<li style="margin-bottom: 5px;">${c}</li>`).join('')}
                            </ul>
                        </div>
                        <p style="margin-top: 15px;"><strong>¿Deseas continuar el cálculo con los datos disponibles?</strong></p>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Sí, continuar',
                    cancelButtonText: 'Rellenar campos primero',
                    confirmButtonColor: '#28a745',
                    cancelButtonColor: '#6c757d',
                    reverseButtons: true,
                    customClass: {
                        popup: 'swal-wide'
                    }
                }).then(result => {
                    if (result.isConfirmed) {
                        // Continuar con el cálculo usando datos disponibles
                        executeCalculations();
                    }
                    // Si cancela, no hacer nada (permite al usuario completar campos)
                });
                
                return false; // No continuar automáticamente
            }
            
            return true; // Todos los campos completos
        }

        // CORRECCIÓN CRÍTICA 2: Contador dinámico 48 campos
        function updateFieldCounter() {
            let filledCount = 0;
            
            fieldIds.forEach(fieldId => {
                  // Manejo especial para radio buttons (sexo)
                  if (fieldId === 'sexo') {
                          const sexoChecked = document.querySelector('input[name="sexo"]:checked');
                          if (sexoChecked) {
                                    filledCount++;
                                  }
                          return;
                        }
                const input = document.getElementById(fieldId);
                if (input && input.value.trim() !== '') {
                    filledCount++;
                }
            });
            
            const counter = document.getElementById('fieldCount');
            if (counter) {
                counter.textContent = `${filledCount}/${fieldIds.length}`; // Dinámico: X/46
            }
        }

        // ===============================================
        // FUNCIÓN getFormData AJUSTADA PARA MANEJAR COMAS
        // ===============================================
        // Función para evaluar rangos CORREGIDOS
        function evaluarRango(parametro, valor, edad, edadMeses) {
          if (valor === null || valor === undefined || valor === 0) return { enRango: true };
          
          const edadTotalMeses = (edad * 12) + edadMeses;
          let rangoMin, rangoMax, rangoTexto = '', esRangoValido = true;
          
          switch (parametro) {
            case 'vpercent':
              if (edad >= 1) {
                rangoMax = 0.81;
                rangoTexto = '<0.81%';
                return { 
                  enRango: valor <= rangoMax, 
                  tipo: valor > rangoMax ? 'alto' : 'normal',
                  rangoTexto: rangoTexto
                };
              }
              break;
              
            case 'schwartz2009':
            case 'pottel2017':
              rangoMin = 90;
              rangoTexto = '>90ml/min/1.73m²';
              return { 
                enRango: valor >= rangoMin, 
                tipo: valor < rangoMin ? 'bajo' : 'normal',
                rangoTexto: rangoTexto
              };
              
            case 'efau':
              if (edad >= 1 && edad < 5) {
                rangoMin = 11; rangoMax = 17;
                rangoTexto = '11–17';
              } else if (edad >= 5) {
                rangoMin = 4.45; rangoMax = 9.99;
                rangoTexto = '4.45–9.99';
              } else {
                esRangoValido = false;
              }
              break;
              
            case 'efna':
              rangoMin = 0.42; rangoMax = 0.84;
              rangoTexto = '0.42–0.84';
              break;
              
            case 'efk':
              rangoMin = 5.19; rangoMax = 11.67;
              rangoTexto = '5.19–11.67';
              break;
              
            case 'efcl':
              rangoMin = 0.57; rangoMax = 1.11;
              rangoTexto = '0.57–1.11';
              break;
              
            case 'cacr':
              if (edadTotalMeses < 6) {
                rangoMax = 0.8;
                rangoTexto = '<0.8mg/mg';
              } else if (edadTotalMeses < 12) {
                rangoMax = 0.6;
                rangoTexto = '<0.6mg/mg';
              } else if (edad >= 1 && edad < 2) {
                rangoMax = 0.5;
                rangoTexto = '<0.5mg/mg';
              } else if (edad >= 2 && edad < 4) {
                rangoMax = 0.28;
                rangoTexto = '<0.28mg/mg';
              } else if (edad >= 4) {
                rangoMax = 0.20;
                rangoTexto = '<0.20mg/mg';
              }
              return { 
                enRango: valor <= rangoMax, 
                tipo: valor > rangoMax ? 'alto' : 'normal',
                rangoTexto: rangoTexto
              };
              
            case 'rtp':
              if (edad >= 1 && edad < 3) {
                rangoMin = 81.18; rangoMax = 90.08;
                rangoTexto = '81.18–90.08%';
              } else if (edad >= 3 && edad < 5) {
                rangoMin = 86.43; rangoMax = 95.76;
                rangoTexto = '86.43–95.76%';
              } else if (edad >= 5) {
                rangoMin = 90.26; rangoMax = 94.86;
                rangoTexto = '90.26–94.86%';
              } else {
                esRangoValido = false;
              }
              break;
              
            case 'mgcr':
              if (edad >= 1 && edad < 2) {
                rangoMin = 0.09; rangoMax = 0.37;
                rangoTexto = '0.09–0.37mg/mg';
              } else if (edad >= 2 && edad < 3) {
                rangoMin = 0.07; rangoMax = 0.34;
                rangoTexto = '0.07–0.34mg/mg';
              } else if (edad >= 3 && edad < 5) {
                rangoMin = 0.07; rangoMax = 0.29;
                rangoTexto = '0.07–0.29mg/mg';
              } else if (edad >= 5 && edad < 7) {
                rangoMin = 0.06; rangoMax = 0.21;
                rangoTexto = '0.06–0.21mg/mg';
              } else if (edad >= 7 && edad < 10) {
                rangoMin = 0.05; rangoMax = 0.18;
                rangoTexto = '0.05–0.18mg/mg';
              } else if (edad >= 10 && edad < 14) {
                rangoMin = 0.05; rangoMax = 0.15;
                rangoTexto = '0.05–0.15mg/mg';
              } else {
                esRangoValido = false;
              }
              break;
              
            case 'pcr':
              if (edad >= 0 && edad < 3) {
                rangoMin = 0.8; rangoMax = 2;
                rangoTexto = '0.8–2mg/mg';
              } else if (edad >= 3 && edad < 5) {
                rangoMin = 0.33; rangoMax = 2.17;
                rangoTexto = '0.33–2.17mg/mg';
              } else if (edad >= 5 && edad < 7) {
                rangoMin = 0.33; rangoMax = 1.49;
                rangoTexto = '0.33–1.49mg/mg';
              } else if (edad >= 7 && edad < 10) {
                rangoMin = 0.32; rangoMax = 0.97;
                rangoTexto = '0.32–0.97mg/mg';
              } else if (edad >= 10 && edad < 14) {
                rangoMin = 0.22; rangoMax = 0.86;
                rangoTexto = '0.22–0.86mg/mg';
              } else {
                esRangoValido = false;
              }
              break;
              
            case 'aucr':
              if (edad >= 3 && edad < 5) {
                rangoMin = 0.66; rangoMax = 1.1;
                rangoTexto = '0.66–1.1mg/mg';
              } else if (edad >= 5 && edad < 7) {
                rangoMin = 0.5; rangoMax = 0.92;
                rangoTexto = '0.5–0.92mg/mg';
              } else if (edad >= 7 && edad < 9) {
                rangoMin = 0.44; rangoMax = 0.8;
                rangoTexto = '0.44–0.8mg/mg';
              } else if (edad >= 9 && edad < 11) {
                rangoMin = 0.4; rangoMax = 0.72;
                rangoTexto = '0.4–0.72mg/mg';
              } else if (edad >= 11 && edad < 13) {
                rangoMin = 0.35; rangoMax = 0.61;
                rangoTexto = '0.35–0.61mg/mg';
              } else if (edad >= 13 && edad < 14) {
                rangoMin = 0.28; rangoMax = 0.5;
                rangoTexto = '0.28–0.5mg/mg';
              } else {
                esRangoValido = false;
              }
              break;
              
            case 'citratocr':
              rangoMin = 0.4;
              rangoTexto = '>0.4mg/mg';
              return { 
                enRango: valor > rangoMin, 
                tipo: valor <= rangoMin ? 'bajo' : 'normal',
                rangoTexto: rangoTexto
              };
              
            case 'cacitrato':
              rangoMax = 0.3;
              rangoTexto = '<0.3';
              return { 
                enRango: valor < rangoMax, 
                tipo: valor >= rangoMax ? 'alto' : 'normal',
                rangoTexto: rangoTexto
              };
              
            case 'oxalatocr':
              if (edadTotalMeses < 6) {
                rangoMax = 0.29;
                rangoTexto = '<0.29mg/mg';
              } else if (edadTotalMeses >= 6 && edad < 2) {
                rangoMax = 0.20;
                rangoTexto = '<0.20mg/mg';
              } else if (edad >= 2 && edad < 6) {
                rangoMax = 0.22;
                rangoTexto = '<0.22mg/mg';
              } else if (edad >= 6 && edad < 13) {
                rangoMax = 0.06;
                rangoTexto = '<0.06mg/mg';
              } else if (edad >= 13) {
                rangoMax = 0.03;
                rangoTexto = '<0.03mg/mg';
              }
              return { 
                enRango: valor < rangoMax, 
                tipo: valor >= rangoMax ? 'alto' : 'normal',
                rangoTexto: rangoTexto
              };
              
            case 'albcr':
              rangoMax = 30;
              rangoTexto = '<30mg/g';
              return { 
                enRango: valor < rangoMax, 
                tipo: valor >= rangoMax ? 'alto' : 'normal',
                rangoTexto: rangoTexto
              };
              
            case 'protcr':
              if (edad < 2) {
                rangoMax = 500;
                rangoTexto = '<500mg/g';
              } else {
                rangoMax = 200;
                rangoTexto = '<200mg/g';
              }
              return { 
                enRango: valor < rangoMax, 
                tipo: valor >= rangoMax ? 'alto' : 'normal',
                rangoTexto: rangoTexto
              };
              
            case 'nak':
              rangoMax = 2.5;
              rangoTexto = '<2.5';
              return { 
                enRango: valor < rangoMax, 
                tipo: valor >= rangoMax ? 'alto' : 'normal',
                rangoTexto: rangoTexto
              };
              
            case 'uricosuria':
              rangoMin = 373; rangoMax = 667;
              rangoTexto = '373–667mg/1.73m²/día';
              break;
              
            case 'calciuria':
              rangoMax = 4;
              rangoTexto = '<4mg/kg/día';
              return { 
                enRango: valor < rangoMax, 
                tipo: valor >= rangoMax ? 'alto' : 'normal',
                rangoTexto: rangoTexto
              };
              
            case 'citraturia':
              rangoMin = 5.57; rangoMax = 13.67;
              rangoTexto = '5.57–13.67mg/kg/día';
              break;
              
            case 'fosfaturia':
              rangoMin = 7.8; rangoMax = 17;
              rangoTexto = '7.8–17mg/kg/día';
              break;
              
            case 'oxaluria':
              rangoMin = 23.2; rangoMax = 50.6;
              rangoTexto = '23.2–50.6mg/1.73m²/día';
              break;
              
            case 'magnesuria':
              rangoMin = 1; rangoMax = 3.3;
              rangoTexto = '1–3.3mg/kg/día';
              break;
              
            case 'albuminuria':
              rangoMax = 30;
              rangoTexto = '<30mg/1.73m²/día';
              return { 
                enRango: valor < rangoMax, 
                tipo: valor >= rangoMax ? 'alto' : 'normal',
                rangoTexto: rangoTexto
              };
              
            case 'proteinuria':
            case 'proteinuriaestimada':
              rangoMax = 100;
              rangoTexto = '<100mg/m²/día';
              return { 
                enRango: valor < rangoMax, 
                tipo: valor >= rangoMax ? 'alto' : 'normal',
                rangoTexto: rangoTexto
              };
              
            default:
              return { enRango: true };
          }
          
          if (!esRangoValido) return { enRango: true };
          
          let tipo = 'normal';
          let enRango = true;
          
          if (rangoMin !== undefined && valor < rangoMin) {
            enRango = false;
            tipo = 'bajo';
          } else if (rangoMax !== undefined && valor > rangoMax) {
            enRango = false;
            tipo = 'alto';
          }
          
          return { enRango, tipo, rangoTexto };
        }
        
        // MEJORA 3: Función para obtener unidades de parámetros
        function obtenerUnidadParametro(param) {
            const unidades = {
                vpercent: '%',
                schwartz2009: 'ml/min/1.73m²',
                pottel2017: 'ml/min/1.73m²',
                efau: '',
                efna: '',
                efk: '',
                efcl: '',
                cacr: 'mg/mg',
                rtp: '%',
                mgcr: 'mg/mg',
                pcr: 'mg/mg',
                aucr: 'mg/mg',
                citratocr: 'mg/mg',
                cacitrato: '',
                oxalatocr: 'mg/mg',
                albcr: 'mg/g',
                protcr: 'mg/g',
                nak: '',
                uricosuria: 'mg/1.73m²/día',
                calciuria: 'mg/kg/día',
                citraturia: 'mg/kg/día',
                fosfaturia: 'mg/kg/día',
                oxaluria: 'mg/1.73m²/día',
                magnesuria: 'mg/kg/día',
                albuminuria: 'mg/1.73m²/día',
                proteinuria: 'mg/m²/día',
                proteinuriaestimada: 'mg/m²/día'
            };
            return unidades[param] || '';
        }
        
        // MEJORA 3: Función para obtener rangos de referencia
        function obtenerRangoReferencia(param, edad, edadMeses) {
            const edadTotal = edad + (edadMeses / 12);
            
            switch (param) {
                case 'vpercent':
                    if (edad >= 2) return 'VN <0.8';
                    break;
                case 'schwartz2009':
                case 'pottel2017':
                    return 'VN ≥90ml/min/1.73m²';
                case 'efau':
                    if (edad >= 1 && edad < 5) return 'VN 11-17';
                    else if (edad >= 5) return 'VN 4.45-9.99';
                    break;
                case 'efna':
                    return 'VN 0.42-0.84';
                case 'efk':
                    return 'VN 5.19-11.67';
                case 'efcl':
                    return 'VN 0.57-1.11';
                case 'cacr':
                    if (window.edadTotalMeses <= 6) return 'VN <0.8mg/mg';
                    else if (window.edadTotalMeses <= 12) return 'VN <0.6mg/mg';
                    else if (edad >= 1 && edad < 2) return 'VN <0.5mg/mg';
                    else if (edad >= 2 && edad < 4) return 'VN <0.28mg/mg';
                    else if (edad >= 4) return 'VN <0.20mg/mg';
                    break;
                case 'rtp':
                    if (edad >= 1 && edad < 3) return 'VN 81.18-90.08%';
                    else if (edad >= 3 && edad < 5) return 'VN 86.43-95.76%';
                    else if (edad >= 5) return 'VN 90.26-100%';
                    break;
                case 'calciuria':
                    return 'VN <4mg/kg/día';
                case 'citratocr':
                    return 'VN ≥0.4mg/mg';
                case 'cacitrato':
                    return 'VN <0.3';
                case 'albcr':
                    return 'VN <30mg/g';
                case 'protcr':
                    if (edad < 2) return 'VN <500mg/g';
                    else return 'VN <200mg/g';
                case 'nak':
                    return 'VN <1.5';
                case 'albuminuria':
                    return 'VN <30mg/1.73m²/día';
                case 'proteinuria':
                case 'proteinuriaestimada':
                    return 'VN <100mg/m²/día';
                default:
                    return '';
            }
            return '';
        }
        
        // Función para obtener nombres legibles de parámetros
        function obtenerNombreParametro(param) {
            const nombres = {
                vpercent: 'V%',
                schwartz2009: 'eGFR Creatinina U25 (ml/min/1.73m²)',
                pottel2017: 'eGFR Cistatina C U25 (ml/min/1.73m²)',
                  eGFRCreatinina: 'eGFR por Creatinina U25 (ml/min/1.73m²)',
    eGFRCistatina: 'eGFR por Cistatina C U25 (ml/min/1.73m²)',
    eGFRCombinado: 'eGFR Combinado U25 (ml/min/1.73m²)',
              
                efau: 'EF AU',
                efna: 'EF Na',
                efk: 'EF K',
                efcl: 'EF Cl',
                cacr: 'Ca/Cr (mg/mg)',
                rtp: 'RTP (%)',
                mgcr: 'Mg/Cr (mg/mg)',
                pcr: 'P/Cr (mg/mg)',
                aucr: 'AU/Cr (mg/mg)',
                citratocr: 'Citrato/Cr (mg/mg)',
                cacitrato: 'Ca/Citrato',
                oxalatocr: 'Oxalato/Cr (mg/mg)',
                albcr: 'Alb/Cr (mg/g)',
                protcr: 'Prot/Cr (mg/g)',
                nak: 'Na/K orina',
                uricosuria: 'Uricosuria (mg/1.73m²/día)',
                calciuria: 'Calciuria (mg/kg/día)',
                citraturia: 'Citraturia (mg/kg/día)',
                fosfaturia: 'Fosfaturia (mg/kg/día)',
                oxaluria: 'Oxaluria (mg/1.73m²/día)',
                magnesuria: 'Magnesuria (mg/kg/día)',
                albuminuria: 'Albuminuria (mg/1.73m²/día)',
                proteinuria: 'Proteinuria (mg/m²/día)',
                proteinuriaestimada: 'Proteinuria estimada (mg/m²/día)'
            };
            return nombres[param] || param;
        }
        
        function getFormData() {
            const data = {};
            
            fieldIds.forEach(fieldId => {
                  // Manejo especial para radio buttons (sexo)
                  if (fieldId === 'sexo') {
                          const sexoChecked = document.querySelector('input[name="sexo"]:checked');
                          if (sexoChecked) {
                                    data[fieldId] = sexoChecked.value;
                                  }
                          return;
                        }
                const input = document.getElementById(fieldId);
                if (input) {
                    let value = input.value;
                    
                    // Campos de fecha se mantienen como texto
                    if (fieldId === 'fecha_nacimiento' || fieldId === 'fecha_analitica') {
                        data[fieldId] = value;
                        return;
                    }
                    
                    // Convertir coma a punto para cálculos matemáticos
                    if (value) {
                        value = value.replace(',', '.');
                    }
                    
                    const numValue = parseFloat(value);
                    data[fieldId] = isNaN(numValue) ? 0 : numValue;
                }
            });
            
            // Agregar edad calculada a los datos
            data.edad = window.edadEnAños || 0;
            
            return data;
        }

        // FUNCIÓN PARA EJECUTAR CÁLCULOS (separada de validación)
        function executeCalculations() {
            const data = getFormData();

            // CRÍTICO: Inicializar array de valores fuera de rango
            window.valoresFueraRango = [];

            try {
                // Estado de carga en botón
                const calcButton = document.querySelector('.btn-calcular');
                calcButton.classList.add('loading');
                calcButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando...';

                // CÁLCULOS COMPLETOS DE LA VERSIÓN 9
                // Cálculos básicos
                const superficieCorporal = Math.sqrt(data.peso_kg * data.talla_cm / 3600);
                const imc = data.peso_kg / Math.pow(data.talla_cm / 100, 2);

                // Cálculos renales con fórmulas exactas
// U25 eGFR Formulas - Creatinina, Cistatina, and Combined
     const edad = window.edadEnAños || 0;
     const sexo = data.sexo || 'H'; // H = Hombre, M = Mujer
     
     // Helper function to calculate K for creatinine
     function getKCreatinine(age, isMale) {
       if (age >= 1 && age < 12) {
         return isMale ? 39.0 * Math.pow(1.008, age - 12) : 36.1 * Math.pow(1.008, age - 12);
       } else if (age >= 12 && age < 18) {
         return isMale ? 39.0 * Math.pow(1.045, age - 12) : 36.1 * Math.pow(1.023, age - 12);
       } else if (age >= 18 && age <= 25) {
         return isMale ? 50.8 : 41.4;
       }
       return 0;
     }
     
     // Helper function to calculate K for cystatin C
     function getKCystatin(age, isMale) {
       if (age >= 1 && age < 12) {
         return isMale ? 87.2 * Math.pow(1.011, age - 15) : 79.9 * Math.pow(1.004, age - 12);
       } else if (age >= 12 && age < 15) {
         return isMale ? 87.2 * Math.pow(1.011, age - 15) : 79.9 * Math.pow(0.974, age - 12);
       } else if (age >= 15 && age < 18) {
         return isMale ? 87.2 * Math.pow(0.960, age - 15) : 79.9 * Math.pow(0.974, age - 12);
       } else if (age >= 18 && age <= 25) {
         return isMale ? 77.1 : 41.4;
       }
       return 0;
     }
     
     const isMale = sexo === 'H';
     
     // eGFR por Creatinina (U25)
     const eGFRCreatinina = data.creatinina_enz_mg_dl > 0 ? getKCreatinine(edad, isMale) * (data.talla_cm / data.creatinina_enz_mg_dl) : 0;
     
     // eGFR por Cistatina C (U25)
     const eGFRCistatina = data.cistatina_c_mg_l > 0 ? getKCystatin(edad, isMale) * (1 / data.cistatina_c_mg_l) : 0;
     
     // eGFR Combinado (promedio)
     const eGFRCombinado = (eGFRCreatinina > 0 && eGFRCistatina > 0) ? (eGFRCreatinina + eGFRCistatina) / 2 : (eGFRCreatinina > 0 ? eGFRCreatinina : eGFRCistatina);
     
     // Keep old variables for compatibility
     const schwartz2009 = eGFRCreatinina;
     const pottel2017 = eGFRCistatina;
                // Fracciones de excreción
                const efNa = (data.na_plasma_meq_l && data.creatinina_orina_mg_dl && data.na_orina_meq_l && data.creatinina_enz_mg_dl) ? 
                    (data.na_orina_meq_l * data.creatinina_enz_mg_dl) / (data.na_plasma_meq_l * data.creatinina_orina_mg_dl) * 100 : 0;
                const efK = (data.k_plasma_meq_l && data.creatinina_orina_mg_dl && data.k_orina_meq_l && data.creatinina_enz_mg_dl) ? 
                    (data.k_orina_meq_l * data.creatinina_enz_mg_dl) / (data.k_plasma_meq_l * data.creatinina_orina_mg_dl) * 100 : 0;
                const efCl = (data.cl_plasma_meq_l && data.creatinina_orina_mg_dl && data.cl_orina_meq_l && data.creatinina_enz_mg_dl) ? 
                    (data.cl_orina_meq_l * data.creatinina_enz_mg_dl) / (data.cl_plasma_meq_l * data.creatinina_orina_mg_dl) * 100 : 0;
                const efAU = (data.au_plasma_mg_dl && data.creatinina_orina_mg_dl && data.au_orina_mg_dl && data.creatinina_enz_mg_dl) ? 
                    (data.au_orina_mg_dl * data.creatinina_enz_mg_dl) / (data.au_plasma_mg_dl * data.creatinina_orina_mg_dl) * 100 : 0;

                // Cocientes urinarios
                const cacr = data.creatinina_orina_mg_dl > 0 ? data.ca_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
                const mgcr = data.creatinina_orina_mg_dl > 0 ? data.magnesio_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
                const pcr = data.creatinina_orina_mg_dl > 0 ? data.fosforo_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
                const aucr = data.creatinina_orina_mg_dl > 0 ? data.au_orina_mg_dl / data.creatinina_orina_mg_dl : 0;

                // AlbCr y ProtCr (multiplicar por 1000 para mg/g)
                const albcr = data.creatinina_orina_mg_dl > 0 ? (data.albumina_orina_mg_dl / data.creatinina_orina_mg_dl) * 1000 : 0;
                const protcr = data.creatinina_orina_mg_dl > 0 ? (data.proteinas_orina_mg_dl / data.creatinina_orina_mg_dl) * 1000 : 0;
                
                const citratocr = data.creatinina_orina_mg_dl > 0 ? data.citrato_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
                const oxalatocr = data.creatinina_orina_mg_dl > 0 ? data.oxalato_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
                const nak = data.k_orina_meq_l > 0 ? data.na_orina_meq_l / data.k_orina_meq_l : 0;
                const cacitrato = data.citrato_orina_mg_dl > 0 ? data.ca_orina_mg_dl / data.citrato_orina_mg_dl : 0;

                // RTP (Reabsorción tubular de fosfato)
                const rtp = (data.p_plasma_mg_dl && data.fosforo_orina_mg_dl && data.creatinina_orina_mg_dl && data.creatinina_enz_mg_dl) ? 
                    100 - ((data.fosforo_orina_mg_dl * data.creatinina_enz_mg_dl) / (data.p_plasma_mg_dl * data.creatinina_orina_mg_dl)) * 100 : 0;

                // Excreciones por superficie corporal o peso
                const uricosuria = superficieCorporal > 0 ? (data.au_24h_mg / superficieCorporal) * 1.73 : 0;
                const calciuria = data.peso_kg > 0 ? data.ca_24h_mg / data.peso_kg : 0;
                const citraturia = data.peso_kg > 0 ? data.citrato_24h_mg / data.peso_kg : 0;
                const fosfaturia = data.peso_kg > 0 ? data.p_24h_mg / data.peso_kg : 0;
                const magnesuria = data.peso_kg > 0 ? data.mg_24h_mg / data.peso_kg : 0;
                const oxaluria = superficieCorporal > 0 ? (data.oxalato_24h_mg / superficieCorporal) * 1.73 : 0;
                const albuminuria = superficieCorporal > 0 ? (data.albumina_24h_mg / superficieCorporal) * 1.73 : 0;
                const proteinuria = superficieCorporal > 0 ? data.proteinas_24h_mg / superficieCorporal : 0;

                // Proteinuria estimada usando la fórmula exacta
                const proteinuriaEstimada = protcr * 0.63;

                // Fórmula V% CORRECTA: (Creatinina enz / Creatinina orina) * 100
                const vpercent = (data.creatinina_enz_mg_dl > 0 && data.creatinina_orina_mg_dl > 0) ? 
                    (data.creatinina_enz_mg_dl / data.creatinina_orina_mg_dl) * 100 : 0;

                // Guardar resultados globales
                window.calculatedResults = {
                    superficiecorporal: superficieCorporal,
                    imc: imc,
                    vpercent: vpercent,
                    schwartz2009: schwartz2009,
                    pottel2017: pottel2017,
                    efau: efAU,
                    efna: efNa,
                    efk: efK,
                    efcl: efCl,
                    cacr: cacr,
                    rtp: rtp,
                    mgcr: mgcr,
                    pcr: pcr,
                    aucr: aucr,
                    citratocr: citratocr,
                    cacitrato: cacitrato,
                    oxalatocr: oxalatocr,
                    albcr: albcr,
                    protcr: protcr,
                    nak: nak,
                    uricosuria: uricosuria,
                    calciuria: calciuria,
                    citraturia: citraturia,
                    fosfaturia: fosfaturia,
                    oxaluria: oxaluria,
                    magnesuria: magnesuria,
                    albuminuria: albuminuria,
                    proteinuria: proteinuria,
                    proteinuriaestimada: proteinuriaEstimada
                };

                // Mostrar resultados después de un breve delay
                setTimeout(() => {
                    displayResults(); // Esto llena window.valoresFueraRango
                    setTimeout(() => {
                        generateReport(data); // Esto usa window.valoresFueraRango
                    }, 100);
                    
                    // Restaurar botón
                    calcButton.classList.remove('loading');
                    calcButton.innerHTML = '<i class="fas fa-calculator"></i> Calcular Resultados';
                }, 800);

            } catch (error) {
                console.error('Error en los cálculos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el cálculo',
                    text: 'Se produjo un error al realizar los cálculos. Por favor, verifique los datos ingresados.',
                    confirmButtonColor: '#dc3545'
                });
                
                const calcButton = document.querySelector('.btn-calcular');
                calcButton.classList.remove('loading');
                calcButton.innerHTML = '<i class="fas fa-calculator"></i> Calcular Resultados';
            }
        }

        // FUNCIÓN PRINCIPAL calculateResults (modificada para usar validación)
        function calculateResults() {
            // Primero validar campos
            if (validarTodosCampos()) {
                // Si todos los campos están completos, calcular directamente
                executeCalculations();
            }
            // Si faltan campos, validarTodosCampos() ya maneja el SweetAlert2
        }

        // ===============================================
        // FUNCIÓN calculateResults LEGACY - MANTENER PARA COMPATIBILIDAD
        // ===============================================
        function calculateResultsLegacy() {
            const data = getFormData();
            
            // Validar datos mínimos (código original como respaldo)
            if (!data.edad || !data.peso_kg || !data.talla_cm) {
                alert("Por favor, complete al menos los datos básicos: edad, peso, talla");
                return;
            }

            try {
                // Estado de carga
                const calcButton = document.querySelector('.btn-calcular');
                calcButton.classList.add('loading');
                calcButton.textContent = 'Calculando...';

                // Cálculos básicos
                const superficieCorporal = Math.sqrt(data.peso_kg * data.talla_cm / 3600);
                const imc = data.peso_kg / Math.pow(data.talla_cm / 100, 2);

                // Cálculos renales con fórmulas exactas

                // Fracciones de excreción
                const efNa = (data.na_plasma_meq_l && data.creatinina_orina_mg_dl && data.na_orina_meq_l && data.creatinina_enz_mg_dl) ? 
                    (data.na_orina_meq_l * data.creatinina_enz_mg_dl) / (data.na_plasma_meq_l * data.creatinina_orina_mg_dl) * 100 : 0;
                const efK = (data.k_plasma_meq_l && data.creatinina_orina_mg_dl && data.k_orina_meq_l && data.creatinina_enz_mg_dl) ? 
                    (data.k_orina_meq_l * data.creatinina_enz_mg_dl) / (data.k_plasma_meq_l * data.creatinina_orina_mg_dl) * 100 : 0;
                const efCl = (data.cl_plasma_meq_l && data.creatinina_orina_mg_dl && data.cl_orina_meq_l && data.creatinina_enz_mg_dl) ? 
                    (data.cl_orina_meq_l * data.creatinina_enz_mg_dl) / (data.cl_plasma_meq_l * data.creatinina_orina_mg_dl) * 100 : 0;
                const efAU = (data.au_plasma_mg_dl && data.creatinina_orina_mg_dl && data.au_orina_mg_dl && data.creatinina_enz_mg_dl) ? 
                    (data.au_orina_mg_dl * data.creatinina_enz_mg_dl) / (data.au_plasma_mg_dl * data.creatinina_orina_mg_dl) * 100 : 0;

                // Cocientes urinarios
                const cacr = data.creatinina_orina_mg_dl > 0 ? data.ca_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
                const mgcr = data.creatinina_orina_mg_dl > 0 ? data.magnesio_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
                const pcr = data.creatinina_orina_mg_dl > 0 ? data.fosforo_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
                const aucr = data.creatinina_orina_mg_dl > 0 ? data.au_orina_mg_dl / data.creatinina_orina_mg_dl : 0;

                // AlbCr y ProtCr (multiplicar por 1000 para mg/g)
                const albcr = data.creatinina_orina_mg_dl > 0 ? (data.albumina_orina_mg_dl / data.creatinina_orina_mg_dl) * 1000 : 0;
                const protcr = data.creatinina_orina_mg_dl > 0 ? (data.proteinas_orina_mg_dl / data.creatinina_orina_mg_dl) * 1000 : 0;
                
                const citratocr = data.creatinina_orina_mg_dl > 0 ? data.citrato_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
                const oxalatocr = data.creatinina_orina_mg_dl > 0 ? data.oxalato_orina_mg_dl / data.creatinina_orina_mg_dl : 0;
                const nak = data.k_orina_meq_l > 0 ? data.na_orina_meq_l / data.k_orina_meq_l : 0;
                const cacitrato = data.citrato_orina_mg_dl > 0 ? data.ca_orina_mg_dl / data.citrato_orina_mg_dl : 0;

                // RTP (Reabsorción tubular de fosfato)
                const rtp = (data.p_plasma_mg_dl && data.fosforo_orina_mg_dl && data.creatinina_orina_mg_dl && data.creatinina_enz_mg_dl) ? 
                    100 - ((data.fosforo_orina_mg_dl * data.creatinina_enz_mg_dl) / (data.p_plasma_mg_dl * data.creatinina_orina_mg_dl)) * 100 : 0;

                // Excreciones por superficie corporal o peso
                const uricosuria = superficieCorporal > 0 ? (data.au_24h_mg / superficieCorporal) * 1.73 : 0;
                const calciuria = data.peso_kg > 0 ? data.ca_24h_mg / data.peso_kg : 0;
                const citraturia = data.peso_kg > 0 ? data.citrato_24h_mg / data.peso_kg : 0;
                const fosfaturia = data.peso_kg > 0 ? data.p_24h_mg / data.peso_kg : 0;
                const magnesuria = data.peso_kg > 0 ? data.mg_24h_mg / data.peso_kg : 0;
                const oxaluria = superficieCorporal > 0 ? (data.oxalato_24h_mg / superficieCorporal) * 1.73 : 0;
                const albuminuria = superficieCorporal > 0 ? (data.albumina_24h_mg / superficieCorporal) * 1.73 : 0;
                const proteinuria = superficieCorporal > 0 ? data.proteinas_24h_mg / superficieCorporal : 0;

                // Proteinuria estimada usando la fórmula exacta
                const proteinuriaEstimada = protcr * 0.63;

                // Fórmula V% CORRECTA: (Creatinina enz / Creatinina orina) * 100
                const vpercent = (data.creatinina_enz_mg_dl > 0 && data.creatinina_orina_mg_dl > 0) ? 
                    (data.creatinina_enz_mg_dl / data.creatinina_orina_mg_dl) * 100 : 0;

                // Guardar resultados globales
                window.calculatedResults = {
                    superficiecorporal: superficieCorporal,
                    imc: imc,
                    vpercent: vpercent,
                    schwartz2009: schwartz2009,
                    pottel2017: pottel2017,
                    efau: efAU,
                    efna: efNa,
                    efk: efK,
                    efcl: efCl,
                    cacr: cacr,
                    rtp: rtp,
                    mgcr: mgcr,
                    pcr: pcr,
                    aucr: aucr,
                    citratocr: citratocr,
                    cacitrato: cacitrato,
                    oxalatocr: oxalatocr,
                    albcr: albcr,
                    protcr: protcr,
                    nak: nak,
                    uricosuria: uricosuria,
                    calciuria: calciuria,
                    citraturia: citraturia,
                    fosfaturia: fosfaturia,
                    oxaluria: oxaluria,
                    magnesuria: magnesuria,
                    albuminuria: albuminuria,
                    proteinuria: proteinuria,
                    proteinuriaestimada: proteinuriaEstimada,
                       eGFRCombinado: eGFRCombinado
                };

                // Mostrar resultados
                setTimeout(() => {
                    displayResults();
                    generateReport(data);
                    // Restaurar botón
                    calcButton.classList.remove('loading');
                    calcButton.innerHTML = '<i class="fas fa-calculator"></i> Calcular Resultados';
                }, 500);

            } catch (error) {
                console.error('Error en los cálculos:', error);
                alert('Error al realizar los cálculos. Por favor, verifique los datos ingresados.');
                const calcButton = document.querySelector('.btn-calcular');
                calcButton.classList.remove('loading');
                calcButton.innerHTML = '<i class="fas fa-calculator"></i> Calcular Resultados';
            }
        }

        // ===============================================
        // FUNCIÓN displayResults ACTUALIZADA CON EVALUACIÓN DE RANGOS CORRECTA
        // ===============================================
        function displayResults() {
          const results = window.calculatedResults;
          if (!results) return;
          
          const edad = window.edadEnAños || 0;
          const edadMeses = window.edadEnMeses || 0;
          
          // Limpiar array de valores fuera de rango (ya inicializado en executeCalculations)
          // window.valoresFueraRango ya está inicializado como array vacío
          
          // Lista de parámetros a evaluar
          const parametros = [
            { key: 'vpercent', nombre: 'V%', unidad: '%' },
            { key: 'schwartz2009', nombre: 'eGFR Creatinina U25', unidad: 'ml/min/1.73m²' },
            { key: 'pottel2017', nombre: 'eGFR Cistatina C U25', unidad: 'ml/min/1.73m²' },
            { key: 'efau', nombre: 'EF AU', unidad: '' },
            { key: 'efna', nombre: 'EF Na', unidad: '' },
            { key: 'efk', nombre: 'EF K', unidad: '' },
            { key: 'efcl', nombre: 'EF Cl', unidad: '' },
            { key: 'cacr', nombre: 'Ca/Cr', unidad: 'mg/mg' },
            { key: 'rtp', nombre: 'RTP', unidad: '%' },
            { key: 'mgcr', nombre: 'Mg/Cr', unidad: 'mg/mg' },
            { key: 'pcr', nombre: 'P/Cr', unidad: 'mg/mg' },
            { key: 'aucr', nombre: 'AU/Cr', unidad: 'mg/mg' },
            { key: 'citratocr', nombre: 'Citrato/Cr', unidad: 'mg/mg' },
            { key: 'cacitrato', nombre: 'Ca/Citrato', unidad: '' },
            { key: 'oxalatocr', nombre: 'Oxalato/Cr', unidad: 'mg/mg' },
            { key: 'albcr', nombre: 'Alb/Cr', unidad: 'mg/g' },
            { key: 'protcr', nombre: 'Prot/Cr', unidad: 'mg/g' },
            { key: 'nak', nombre: 'Na/K orina', unidad: '' },
            { key: 'uricosuria', nombre: 'Uricosuria', unidad: 'mg/1.73m²/día' },
            { key: 'calciuria', nombre: 'Calciuria', unidad: 'mg/kg/día' },
            { key: 'citraturia', nombre: 'Citraturia', unidad: 'mg/kg/día' },
            { key: 'fosfaturia', nombre: 'Fosfaturia', unidad: 'mg/kg/día' },
            { key: 'oxaluria', nombre: 'Oxaluria', unidad: 'mg/1.73m²/día' },
            { key: 'magnesuria', nombre: 'Magnesuria', unidad: 'mg/kg/día' },
            { key: 'albuminuria', nombre: 'Albuminuria', unidad: 'mg/1.73m²/día' },
            { key: 'proteinuria', nombre: 'Proteinuria', unidad: 'mg/m²/día' },
            { key: 'proteinuriaestimada', nombre: 'Proteinuria estimada', unidad: 'mg/m²/día' }
          ];
          
          // RESULTADOS COMPLETOS V9 con nombres descriptivos
          const resultLabels = {
              superficiecorporal: 'Superficie Corporal (m²)',
              imc: 'IMC (kg/m²)',
              vpercent: 'V% (creat enz/orina)',
eGFRCreatinina: 'eGFR por Creatinina U25 (ml/min/1.73m²)',
    eGFRCistatina: 'eGFR por Cistatina C U25 (ml/min/1.73m²)',
    eGFRCombinado: 'eGFR Combinado U25 (ml/min/1.73m²)',
            
              efk: 'EF K (%)',
              efcl: 'EF Cl (%)',
              efau: 'EF AU (%)',
              cacr: 'Ca/Cr (mg/mg)',
              mgcr: 'Mg/Cr (mg/mg)',
              pcr: 'P/Cr (mg/mg)',
              aucr: 'AU/Cr (mg/mg)',
              albcr: 'Alb/Cr (mg/g)',
              protcr: 'Prot/Cr (mg/g)',
              citratocr: 'Citrato/Cr (mg/mg)',
              oxalatocr: 'Oxalato/Cr (mg/mg)',
              nak: 'Na/K orina',
              cacitrato: 'Ca/Citrato',
              rtp: 'RTP (%)',
              uricosuria: 'Uricosuria (mg/1.73m²/día)',
              calciuria: 'Calciuria (mg/kg/día)',
              citraturia: 'Citraturia (mg/kg/día)',
              fosfaturia: 'Fosfaturia (mg/kg/día)',
              magnesuria: 'Magnesuria (mg/kg/día)',
              oxaluria: 'Oxaluria (mg/1.73m²/día)',
              albuminuria: 'Albuminuria (mg/1.73m²/día)',
              proteinuria: 'Proteinuria (mg/m²/día)',
              proteinuriaestimada: 'Proteinuria estimada (mg/m²/día)'
          };
          
          const resultsGrid = document.getElementById('resultsGrid');
          const resultsSection = document.getElementById('results');
          resultsGrid.innerHTML = '';
          
          // Evaluar rangos y llenar array de fuera de rango
          parametros.forEach(param => {
            const valor = results[param.key];
            if (valor && valor !== 0) {
              const evaluacion = evaluarRango(param.key, valor, edad, edadMeses);
              
              // Si está fuera de rango, añadir al array global
              if (!evaluacion.enRango) {
                const tipoFuera = evaluacion.tipo === 'alto' ? 'por encima de rango' : 'por debajo de rango';
                const unidadTexto = param.unidad ? `(${param.unidad})` : '';
                const valorFormateado = valor.toFixed(2);
                const textoCompleto = `${param.nombre} ${unidadTexto}: ${valorFormateado}${param.unidad} ${tipoFuera} (VN ${evaluacion.rangoTexto})`;
                window.valoresFueraRango.push(textoCompleto);
              }
            }
          });
          
          // Crear elementos para todos los resultados
          Object.keys(window.calculatedResults).forEach(key => {
              if (1308[key]) {
                  const resultItem = document.createElement('div');
                  resultItem.className = 'result-item';
                  resultItem.id = `resultado-${key}`;  // ID para poder aplicar color
                  
                  const label = document.createElement('div');
                  label.className = 'result-label';
                  label.textContent = resultLabels[key];
                  
                  const value = document.createElement('div');
                  value.className = 'result-value';
                  const numValue = window.calculatedResults[key];
                  const valorFormateado = typeof numValue === 'number' ? numValue.toFixed(2) : '0.00';
                  value.textContent = valorFormateado;
              
                  // Evaluar si está fuera de rango y aplicar color rojo (solo visual)
                  const paramEncontrado = parametros.find(p => p.key === key);
                  if (paramEncontrado && numValue && numValue !== 0) {
                      const evaluacion = evaluarRango(key, numValue, edad, edadMeses);
                      if (!evaluacion.enRango) {
                          value.style.setProperty('color', '#dc2626', 'important');
                          value.style.fontWeight = "bold";
                        } else {
                          value.style.setProperty('color', '#21808d', 'important');
                          value.style.fontWeight = "bold";
                        }

                  }
                     
                //Pone en verde Superficie corporal e IMC
                  if (key === "superficiecorporal" || key === "imc") {
                      value.style.setProperty('color', '#21808d', 'important');
                      value.style.fontWeight = "bold";
                  }

                  resultItem.appendChild(label);
                  resultItem.appendChild(value);
                  resultsGrid.appendChild(resultItem);
              }
          });
          
          resultsSection.classList.remove('hidden');
          console.log('✅ Resultados mostrados con evaluación de rangos');
        }

        // ===============================================
        // FUNCIÓN AUXILIAR PARA RANGOS NORMALES
        // ===============================================
        function obtenerTextoRangoNormal(parametro, edad, edadMeses) {
          const edadTotalMeses = (edad * 12) + edadMeses;
          
          switch (parametro) {
            case 'mgcr':
              if (edad >= 1 && edad < 2) return '(VN 0.09–0.37)';
              if (edad >= 2 && edad < 3) return '(VN 0.07–0.34)';
              if (edad >= 3 && edad < 5) return '(VN 0.07–0.29)';
              if (edad >= 5 && edad < 7) return '(VN 0.06–0.21)';
              if (edad >= 7 && edad < 10) return '(VN 0.05–0.18)';
              if (edad >= 10 && edad < 14) return '(VN 0.05–0.15)';
              return '';
              
            case 'pcr':
              if (edad >= 0 && edad < 3) return '(VN 0.8–2)';
              if (edad >= 3 && edad < 5) return '(VN 0.33–2.17)';
              if (edad >= 5 && edad < 7) return '(VN 0.33–1.49)';
              if (edad >= 7 && edad < 10) return '(VN 0.32–0.97)';
              if (edad >= 10 && edad < 14) return '(VN 0.22–0.86)';
              return '';
              
            case 'aucr':
              if (edad >= 3 && edad < 5) return '(VN 0.66–1.1)';
              if (edad >= 5 && edad < 7) return '(VN 0.5–0.92)';
              if (edad >= 7 && edad < 9) return '(VN 0.44–0.8)';
              if (edad >= 9 && edad < 11) return '(VN 0.4–0.72)';
              if (edad >= 11 && edad < 13) return '(VN 0.35–0.61)';
              if (edad >= 13 && edad < 14) return '(VN 0.28–0.5)';
              return '';
              
            case 'oxalatocr':
              if (edadTotalMeses < 6) return '(VN <0.29)';
              if (edadTotalMeses >= 6 && edad < 2) return '(VN <0.20)';
              if (edad >= 2 && edad < 6) return '(VN <0.22)';
              if (edad >= 6 && edad < 13) return '(VN <0.06)';
              if (edad >= 13) return '(VN <0.03)';
              return '';
              
            case 'uricosuria':
              return '(VN 373–667)';
              
            case 'citraturia':
              return '(VN 5.57–13.67)';
              
            case 'fosfaturia':
              return '(VN 7.8–17)';
              
            case 'oxaluria':
              return '(VN 23.2–50.6)';
              
            case 'magnesuria':
              return '(VN 1–3.3)';
              
            default:
              return '';
          }
        }

        // ===============================================
        // ESTRUCTURA EXACTA DEL INFORME HORIZONTAL POR BLOQUES
        // ===============================================
        function generateReport(data) {
          const results = window.calculatedResults;
          
          if (!results) {
            console.error('No hay resultados calculados');
            return;
          }

          // Obtener edad en generateReport()
          const edad = window.edadEnAños || 0;
          const edadMeses = window.edadEnMeses || 0;

          // Obtener textos libres
          const sedimentoUrinario = document.getElementById('sedimento_urinario') ? 
            document.getElementById('sedimento_urinario').value.trim() : '';
          const comentarioNutricional = document.getElementById('comentario_nutricional') ? 
            document.getElementById('comentario_nutricional').value.trim() : '';

          // Función para verificar valores válidos (excluir 0, null, NaN)
          function isValid(value) {
            return value != null && !isNaN(value) && value !== 0;
          }

          // Función para formatear: "Parametro: valorunidad"
          function fmt(value, decimals = 2) {
            if (!isValid(value)) return null;
            return parseFloat(value).toFixed(decimals);
          }

          let report = [];

          // BLOQUE HIDROSALINO (una línea horizontal con todos los valores)
          let hidrosalino = [];
          if (isValid(data.urea_mg_dl)) hidrosalino.push(`Urea: ${fmt(data.urea_mg_dl)}mg/dL`);
          if (isValid(data.creatinina_enz_mg_dl)) {
            let cr = `Cr: ${fmt(data.creatinina_enz_mg_dl)}mg/dL`;
            if (isValid(results.schwartz2009)) {
              cr += ` (eGFR Creatinina U25: ${fmt(results.schwartz2009)}ml/min/1.73m²)`;
            }
            hidrosalino.push(cr);
          }
          if (isValid(data.cistatina_c_mg_l)) {
            let cist = `Cistatina C: ${fmt(data.cistatina_c_mg_l)}mg/L`;
            if (isValid(results.pottel2017)) {
              cist += ` (eGFR Cistatina C U25: ${fmt(results.pottel2017)}ml/min/1.73m²)`;
            }
            hidrosalino.push(cist);
          }
          if (isValid(results.vpercent)) hidrosalino.push(`V%: ${fmt(results.vpercent)}%`);
          if (isValid(data.na_plasma_meq_l)) hidrosalino.push(`Na: ${fmt(data.na_plasma_meq_l)}mEq/L`);
          if (isValid(results.efna)) hidrosalino.push(`EFNa: ${fmt(results.efna)}`);
          if (isValid(data.k_plasma_meq_l)) hidrosalino.push(`K: ${fmt(data.k_plasma_meq_l)}mEq/L`);
          if (isValid(results.efk)) hidrosalino.push(`EFK: ${fmt(results.efk)}`);
          if (isValid(data.cl_plasma_meq_l)) hidrosalino.push(`Cl: ${fmt(data.cl_plasma_meq_l)}mEq/L`);
          if (isValid(results.efcl)) hidrosalino.push(`EFCl: ${fmt(results.efcl)}`);
          if (isValid(data.au_plasma_mg_dl)) hidrosalino.push(`AU: ${fmt(data.au_plasma_mg_dl)}mg/dL`);
          if (isValid(results.efau)) hidrosalino.push(`EFAU: ${fmt(results.efau)}`);
          
          if (hidrosalino.length > 0) {
            report.push(`- Hidrosalino: ${hidrosalino.join('   ')}`);
          }

          // BLOQUE METABOLISMO FOSFOCÁLCICO
          let fosfocalcico = [];
          if (isValid(data.ca_plasma_mg_dl)) fosfocalcico.push(`Ca: ${fmt(data.ca_plasma_mg_dl)}mg/dL`);
          if (isValid(results.cacr)) fosfocalcico.push(`Ca/Cr: ${fmt(results.cacr)}mg/mg`);
          if (isValid(data.p_plasma_mg_dl)) fosfocalcico.push(`P: ${fmt(data.p_plasma_mg_dl)}mg/dL`);
          if (isValid(results.rtp)) fosfocalcico.push(`RTP: ${fmt(results.rtp)}%`);
          if (isValid(data.mg_plasma_mg_dl)) fosfocalcico.push(`Mg: ${fmt(data.mg_plasma_mg_dl)}mg/dL`);
          if (isValid(results.mgcr)) {
            fosfocalcico.push(`Mg/Cr: ${fmt(results.mgcr)}mg/mg`);
          }
          if (isValid(results.pcr)) {
            fosfocalcico.push(`P/Cr: ${fmt(results.pcr)}mg/mg`);
          }
          if (isValid(data.pth_pg_ml)) fosfocalcico.push(`PTH: ${fmt(data.pth_pg_ml)}pg/mL`);
          if (isValid(data.vitamina_d_ng_ml)) fosfocalcico.push(`Vitamina D: ${fmt(data.vitamina_d_ng_ml)}ng/mL`);
          if (isValid(data.fosfatasa_alcalina_u_l)) fosfocalcico.push(`Fosfatasa alcalina: ${fmt(data.fosfatasa_alcalina_u_l)}U/L`);
          
          if (fosfocalcico.length > 0) {
            report.push(`- Metabolismo fosfocálcico: ${fosfocalcico.join('   ')}`);
          }

          // BLOQUE HEMATOLÓGICO
          let hematologico = [];
          if (isValid(data.hb_g_l)) hematologico.push(`Hemoglobina: ${fmt(data.hb_g_l)}g/L`);
          if (isValid(data.ferritina_ng_ml)) hematologico.push(`Ferritina: ${fmt(data.ferritina_ng_ml)}ng/mL`);
          if (isValid(data.ist_percent)) hematologico.push(`IST: ${fmt(data.ist_percent)}%`);
          
          if (hematologico.length > 0) {
            report.push(`- Hematológico: ${hematologico.join('   ')}`);
          }

          // BLOQUE GASOMETRÍA
          let gasometria = [];
          if (isValid(data.ph_plasma)) gasometria.push(`pH: ${fmt(data.ph_plasma)}`);
          if (isValid(data.pco2_mmhg)) gasometria.push(`pCO2: ${fmt(data.pco2_mmhg)}mmHg`);
          if (isValid(data.hco3_mmol_l)) gasometria.push(`HCO3: ${fmt(data.hco3_mmol_l)}mmol/L`);
          if (isValid(data.exceso_bases_mmol_l)) gasometria.push(`Exceso de bases: ${fmt(data.exceso_bases_mmol_l)}mmol/L`);
          
          if (gasometria.length > 0) {
            report.push(`- Gasometría: ${gasometria.join('   ')}`);
          }

          // BLOQUE ORINA PUNTUAL (CON SEDIMENTO URINARIO)
          let orina = [];
          if (isValid(data.densidad)) orina.push(`Densidad: ${fmt(data.densidad, 0)}`);
          if (isValid(data.ph_orina)) orina.push(`pH: ${fmt(data.ph_orina)}`);
          
          let sedimento = [];
          if (isValid(results.protcr)) sedimento.push(`Prot/Cr: ${fmt(results.protcr)}mg/g`);
          if (isValid(results.proteinuriaestimada)) sedimento.push(`Proteinuria estimada: ${fmt(results.proteinuriaestimada)}mg/m²/día`);
          if (isValid(results.albcr)) sedimento.push(`Alb/Cr: ${fmt(results.albcr)}mg/g`);
          
          // CONSTRUIR LÍNEA DE SEDIMENTO CORRECTAMENTE
          let sedimentoParts = [];
          if (isValid(results.protcr)) sedimentoParts.push(`Prot/Cr: ${fmt(results.protcr)}mg/g`);
          if (isValid(results.proteinuriaestimada)) sedimentoParts.push(`Proteinuria estimada: ${fmt(results.proteinuriaestimada)}mg/m²/día`);
          if (isValid(results.albcr)) sedimentoParts.push(`Alb/Cr: ${fmt(results.albcr)}mg/g`);
          
          // SI HAY TEXTO LIBRE DE SEDIMENTO: Va PRIMERO después de "Sedimento:"
          if (sedimentoUrinario) {
            orina.push(`Sedimento: ${sedimentoUrinario}`);
            // Los valores numéricos van después si existen
            if (sedimentoParts.length > 0) {
              orina.push(sedimentoParts.join('   '));
            }
          } else if (sedimentoParts.length > 0) {
            // Si NO hay texto libre pero SÍ hay valores numéricos
            orina.push(`Sedimento: ${sedimentoParts.join('   ')}`);
          }
          
          if (isValid(data.osmolalidad_orina_mosm_kg)) orina.push(`Osmolalidad urinaria: ${fmt(data.osmolalidad_orina_mosm_kg)}mOsm/kg`);
          
          if (orina.length > 0) {
            report.push(`- Orina puntual: ${orina.join('   ')}`);
          }

          // BLOQUE COCIENTES URINARIOS
          let cocientes = [];
          if (isValid(results.aucr)) {
            cocientes.push(`AU/Cr: ${fmt(results.aucr)}mg/mg`);
          }
          if (isValid(results.nak)) cocientes.push(`Na/K: ${fmt(results.nak)}`);
          if (isValid(results.cacr)) cocientes.push(`Ca/Cr: ${fmt(results.cacr)}mg/mg`);
          if (isValid(results.citratocr)) cocientes.push(`Citrato/Cr: ${fmt(results.citratocr)}mg/mg`);
          if (isValid(results.cacitrato)) cocientes.push(`Ca/Citrato: ${fmt(results.cacitrato)}`);
          if (isValid(results.oxalatocr)) {
            cocientes.push(`Oxalato/Cr: ${fmt(results.oxalatocr)}mg/mg`);
          }
          
          if (cocientes.length > 0) {
            report.push(`- Cocientes urinarios: ${cocientes.join('   ')}`);
          }

          // BLOQUE ORINA 24H
          let orina24h = [];
          if (isValid(results.uricosuria)) {
            orina24h.push(`Uricosuria: ${fmt(results.uricosuria)}mg/1.73m²`);
          }
          if (isValid(results.calciuria)) orina24h.push(`Calciuria: ${fmt(results.calciuria)}mg/kg/día`);
          if (isValid(results.citraturia)) {
            orina24h.push(`Citraturia: ${fmt(results.citraturia)}mg/kg/día`);
          }
          if (isValid(results.fosfaturia)) {
            orina24h.push(`Fosfaturia: ${fmt(results.fosfaturia)}mg/kg/día`);
          }
          if (isValid(results.oxaluria)) {
            orina24h.push(`Oxaluria: ${fmt(results.oxaluria)}mg/1.73m²`);
          }
          if (isValid(results.magnesuria)) {
            orina24h.push(`Magnesuria: ${fmt(results.magnesuria)}mg/kg/día`);
          }
          if (isValid(results.proteinuria)) orina24h.push(`Proteinuria: ${fmt(results.proteinuria)}mg/m²/día`);
          if (isValid(results.albuminuria)) orina24h.push(`Albuminuria: ${fmt(results.albuminuria)}mg/1.73m²/día`);
          
          if (orina24h.length > 0) {
            report.push(`- Orina de 24h: ${orina24h.join('   ')}`);
          }

          // AÑADIR BLOQUE NUTRICIONAL SI HAY TEXTO
          if (comentarioNutricional) {
            report.push('');
            report.push(`Nutricional: ${comentarioNutricional}`);
          }
          
          // AL FINAL: Sección de valores fuera de rango
          if (window.valoresFueraRango && window.valoresFueraRango.length > 0) {
            report.push('');
            report.push('Valores fuera de rango:');
            window.valoresFueraRango.forEach(valorTexto => {
              report.push(valorTexto);
            });
          }

          // Mostrar informe
          const reportText = report.join('\n');
          document.getElementById('reportContent').innerHTML = `<pre style="font-family: 'Rubik', sans-serif; font-size: 14px; line-height: 2.0; white-space: pre-wrap;">${reportText}</pre>`;
          document.getElementById('reportSection').classList.remove('hidden');
          
          // Scroll al informe
          setTimeout(() => {
            document.getElementById('reportSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }

        // ===============================================
        // FUNCIONES DE EXPORTACIÓN VERSIÓN 9
        // ===============================================
        function exportToWord() {
          const reportContent = document.getElementById('reportContent');
          const reportText = reportContent ? reportContent.innerText : '';
          
          if (!reportText || reportText.trim().length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Sin informe para exportar',
              text: 'Debe calcular primero los resultados.',
              confirmButtonColor: '#2563eb'
            });
            return;
          }

          try {
            const header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Informe</title></head><body>';
            const footer = '</body></html>';
            
            const formattedText = reportText.replace(/\n/g, '<br>');
            const sourceHTML = header + '<h2>Informe Clínico Renal</h2><pre style="font-family: Arial; font-size: 12px; line-height: 1.8;">' + formattedText + '</pre>' + footer;
            
            const blob = new Blob(['\ufeff', sourceHTML], {
              type: 'application/msword'
            });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'informe-clinico-renal.doc';
            link.click();
            URL.revokeObjectURL(url);
            
            Swal.fire({
              icon: 'success',
              title: 'Word descargado',
              timer: 1500,
              showConfirmButton: false
            });
          } catch (error) {
            console.error('Error al generar Word:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al generar Word',
              text: 'Ocurrió un error al exportar el documento.',
              confirmButtonColor: '#dc3545'
            });
          }
        }

        function exportToPDF() {
          const reportContent = document.getElementById('reportContent');
          const reportText = reportContent ? reportContent.innerText : '';
          
          if (!reportText || reportText.trim().length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Sin informe para exportar',
              text: 'Debe calcular primero los resultados.',
              confirmButtonColor: '#2563eb'
            });
            return;
          }

          try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(14);
            doc.text('Informe Clínico Renal', 20, 20);
            
            doc.setFontSize(10);
            const lines = doc.splitTextToSize(reportText, 170);
            doc.text(lines, 20, 35);
            
            doc.save('informe-clinico-renal.pdf');
            
            Swal.fire({
              icon: 'success',
              title: 'PDF descargado',
              timer: 1500,
              showConfirmButton: false
            });
          } catch (error) {
            console.error('Error al generar PDF:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al generar PDF',
              text: 'Ocurrió un error al exportar el PDF.',
              confirmButtonColor: '#dc3545'
            });
          }
        }

        function printReport() {
          const reportContent = document.getElementById('reportContent');
          const reportText = reportContent ? reportContent.innerText : '';
          
          if (!reportText || reportText.trim().length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Sin informe para imprimir',
              text: 'Debe calcular primero los resultados para generar el informe.',
              confirmButtonColor: '#2563eb'
            });
            return;
          }

          const printWindow = window.open('', '_blank');
          printWindow.document.write(`
            <!DOCTYPE html>
            <html><head>
              <meta charset="UTF-8">
              <title>Informe Clínico Renal</title>
              <style>
                body { font-family: 'Rubik', Arial, sans-serif; padding: 30px; }
                pre { font-family: 'Rubik', Arial, sans-serif; font-size: 13px; line-height: 2.0; white-space: pre-wrap; }
              </style>
            </head><body>
              <h2>Informe Clínico Renal</h2>
              <pre>${reportText}</pre>
            </body></html>
          `);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => printWindow.print(), 250);
        }
   
// Obtener los parámetros de la URL actual
const urlParams = new URLSearchParams(window.location.search);

// Verificar si existe parametro 'modo' y su valor es 'test'
if (urlParams.get('modo') === 'test') {
  // Activar modo test en la aplicación
  console.log('Modo TEST activado');
  // Aquí puedes llamar a funciones o activar vistas para modo test
  activarModoTest();
}

// Scroll suave para tabs - compatible con iPhone y Android

document.querySelectorAll('.tab-button').forEach((btn, i, allBtns) => {
  btn.addEventListener('click', function() {
    const container = this.closest('.tabs') || this.closest('.nav-tabs');
    if (container && (container.scrollWidth > container.clientWidth)) {
      const btnRect = this.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();

      // Si se pulsa un botón en el borde derecho → desplaza todo hacia la derecha
      if ((btnRect.right >= contRect.right - 8) && (i < allBtns.length - 1)) {
        // En iOS scrollBy no es fiable; usamos scrollLeft directamente
        container.scrollLeft = container.scrollWidth;
      }
      
      // Si se pulsa un botón en el borde izquierdo → desplaza todo hacia la izquierda
      if ((btnRect.left <= contRect.left + 8) && (i > 0)) {
        container.scrollLeft = 0;
      }
    }
  });
});
function setupTabNavigationScroll() {
  document.querySelectorAll('.tab-button').forEach((btn, i, allBtns) => {
    btn.onclick = function() {
      const container = btn.closest('.tabs') || btn.closest('.nav-tabs');
      if (container && (container.scrollWidth > container.clientWidth)) {
        const btnRect = btn.getBoundingClientRect();
        const contRect = container.getBoundingClientRect();
        if ((btnRect.right >= contRect.right - 8) && (i < allBtns.length - 1)) {
          container.scrollLeft = container.scrollWidth;
        }
        if ((btnRect.left <= contRect.left + 8) && (i > 0)) {
          container.scrollLeft = 0;
        }
      }
    };
  });
}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', () => {
      const fieldId = input.id;
      if (fieldId !== 'exceso_bases_mmol_l' && parseFloat(input.value) < 0) {
        input.value = '';
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', function() {
  let testTapCount = 0;
  let tapTimer = null;
  const logo = document.querySelector('.app-title');
  function handleTap(e) {
    // Previene doble disparo en algunos móviles
    if (e) e.preventDefault();
    testTapCount++;
    if (testTapCount >= 5) {
      if(document.body.classList.contains('modo-test')) {
        document.body.classList.remove('modo-test');
        const btnTest = document.getElementById('btn-cargar-datos-test');
        if(btnTest) btnTest.style.display = 'none';
        alert('Modo TEST desactivado');
      } else {
        document.body.classList.add('modo-test');
        const btnTest = document.getElementById('btn-cargar-datos-test');
        if(btnTest) btnTest.style.display = 'block';
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
    logo.addEventListener('click', handleTap, {passive: false});       // Para ratón de escritorio
    logo.addEventListener('touchstart', handleTap, {passive: false});  // Para toques en móvil
    logo.addEventListener('touchend', e => e.preventDefault(), {passive: false}); // Previene doble-detección
  }
});
;





