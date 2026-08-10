import "./index.css";

// ==========================================================
// CALCULADORA DE ZONA DE FRESNEL
// Lógica, validaciones, historial y evaluación del despeje
// ==========================================================


// ==========================================================
// ELEMENTOS DEL FORMULARIO
// ==========================================================

const distanciaInput = document.getElementById(
    "distancia"
);

const frecuenciaSelect = document.getElementById(
    "frecuencia"
);

const otraFrecuenciaInput = document.getElementById(
    "otra-frecuencia"
);

const contenedorOtraFrecuencia = document.getElementById(
    "contenedor-otra-frecuencia"
);

const alturaAntenaAInput = document.getElementById(
    "altura-antena-a"
);

const alturaAntenaBInput = document.getElementById(
    "altura-antena-b"
);

const alturaObstaculoInput = document.getElementById(
    "altura-obstaculo"
);

const posicionObstaculoInput = document.getElementById(
    "posicion-obstaculo"
);

const botonCalcular = document.getElementById(
    "boton-calcular"
);

const botonLimpiar = document.getElementById(
    "boton-limpiar"
);

const mensajeError = document.getElementById(
    "mensaje-error"
);


// ==========================================================
// ELEMENTOS DE LOS RESULTADOS
// ==========================================================

const resultadoRadio = document.getElementById(
    "resultado-radio"
);

const resultadoZonaLibre = document.getElementById(
    "resultado-zona-libre"
);

const resultadoImpacto = document.getElementById(
    "resultado-impacto"
);

const resultadoAltura = document.getElementById(
    "resultado-altura"
);

const panelEstado = document.getElementById(
    "panel-estado"
);

const iconoEstado = document.getElementById(
    "icono-estado"
);

const textoEstado = document.getElementById(
    "texto-estado"
);

const descripcionEstado = document.getElementById(
    "descripcion-estado"
);

const zonaFresnelVisual = document.getElementById(
    "zona-fresnel-visual"
);

const referenciaFrecuencia = document.getElementById(
    "referencia-frecuencia"
);


// Barra de despeje

const progresoDespeje = document.getElementById(
    "progreso-despeje"
);

const textoProgreso = document.getElementById(
    "texto-progreso"
);


// ==========================================================
// ELEMENTOS DE LOS MODALES
// ==========================================================

const botonInfo = document.getElementById(
    "boton-info"
);

const modalInfo = document.getElementById(
    "modal-info"
);

const cerrarInfo = document.getElementById(
    "cerrar-info"
);

const entendidoInfo = document.getElementById(
    "entendido-info"
);

const botonHistorial = document.getElementById(
    "boton-historial"
);

const modalHistorial = document.getElementById(
    "modal-historial"
);

const cerrarHistorial = document.getElementById(
    "cerrar-historial"
);

const borrarHistorial = document.getElementById(
    "borrar-historial"
);

const cuerpoHistorial = document.getElementById(
    "cuerpo-historial"
);


// ==========================================================
// CONSTANTES Y VARIABLES
// ==========================================================

const PORCENTAJE_MINIMO = 60;

let historial = [];


// ==========================================================
// CONVERSIÓN Y VALIDACIÓN
// ==========================================================

function convertirNumero(valor) {
    const texto = valor
        .trim()
        .replace(",", ".");

    if (texto === "") {
        return null;
    }

    const numero = Number(texto);

    if (
        !Number.isFinite(numero) ||
        numero <= 0
    ) {
        return null;
    }

    return numero;
}
function convertirNumeroConCero(valor) {
    const texto = valor
        .trim()
        .replace(",", ".");

    if (texto === "") {
        return null;
    }

    const numero = Number(texto);

    if (
        !Number.isFinite(numero) ||
        numero < 0
    ) {
        return null;
    }

    return numero;
}

// Trunca sin redondear

function truncar(numero, decimales = 2) {
    const factor = 10 ** decimales;

    return Math.trunc(numero * factor) / factor;
}


// Muestra siempre dos decimales después de truncar

function mostrarDosDecimales(numero) {
    return truncar(numero, 2).toFixed(2);
}


function obtenerFrecuencia() {
    const valorSeleccionado =
        frecuenciaSelect.value;

    if (valorSeleccionado === "otra") {
        return convertirNumero(
            otraFrecuenciaInput.value
        );
    }

    return convertirNumero(
        valorSeleccionado
    );
}


function mostrarError(
    mensaje,
    elemento = null
) {
    mensajeError.textContent = mensaje;

    mensajeError.classList.remove(
        "oculto"
    );

    if (elemento) {
        elemento.focus();
    }
}


function ocultarError() {
    mensajeError.textContent = "";

    mensajeError.classList.add(
        "oculto"
    );
}


// ==========================================================
// CÁLCULOS
// ==========================================================


// Fórmula indicada por el profesor:
// F1 = 8.656 × raíz cuadrada de D / f

function calcularRadioFresnel(
    distancia,
    frecuencia
) {
    return 8.656 * Math.sqrt(
        distancia / frecuencia
    );
}


// Calcula qué porcentaje del radio queda libre

function calcularZonaLibre(
    alturaAntenas,
    alturaObstaculo,
    radioFresnel
) {
    const espacioLibre =
        alturaAntenas - alturaObstaculo;

    const porcentaje =
        (espacioLibre / radioFresnel) * 100;

    if (porcentaje < 0) {
        return 0;
    }

    if (porcentaje > 100) {
        return 100;
    }

    return porcentaje;
}


// Altura necesaria para obtener un 60 % de despeje

function calcularAlturaRecomendada(
    alturaObstaculo,
    radioFresnel
) {
    const despejeMinimo =
        radioFresnel *
        (PORCENTAJE_MINIMO / 100);

    return alturaObstaculo + despejeMinimo;
}


// ==========================================================
// CÁLCULO PRINCIPAL
// ==========================================================

function calcular() {
    ocultarError();

    const distancia = convertirNumero(
        distanciaInput.value
    );

    const frecuencia =
        obtenerFrecuencia();


    const alturaAntenaA = convertirNumero(
    alturaAntenaAInput.value
    );

    const alturaAntenaB = convertirNumero(
    alturaAntenaBInput.value
    );

   const alturaObstaculo = convertirNumeroConCero(
    alturaObstaculoInput.value
    );

    const posicionObstaculo = convertirNumeroConCero(
    posicionObstaculoInput.value
    );

    // Validación de distancia

    if (distancia === null) {
        mostrarError(
            "Ingresá una distancia total válida mayor que cero.",
            distanciaInput
        );

        return;
    }


    // Validación de frecuencia

    if (frecuencia === null) {
        const elemento =
            frecuenciaSelect.value === "otra"
                ? otraFrecuenciaInput
                : frecuenciaSelect;

        mostrarError(
            "Seleccioná o ingresá una frecuencia válida.",
            elemento
        );

        return;
    }


    // Validación de altura de antenas

    if (alturaAntenaA === null) {
    mostrarError(
        "Ingresá una altura válida para la antena A.",
        alturaAntenaAInput
    );
    return;
}

if (alturaAntenaB === null) {
    mostrarError(
        "Ingresá una altura válida para la antena B.",
        alturaAntenaBInput
    );
    return;
}

    // Validación de altura del obstáculo

    if (alturaObstaculo === null) {
        mostrarError(
            "Ingresá una altura válida para el obstáculo.",
            alturaObstaculoInput
        );

        return;
    }


    // Validación de posición

    if (posicionObstaculo === null) {
        mostrarError(
            "Ingresá una posición válida para el obstáculo.",
            posicionObstaculoInput
        );

        return;
    }


    if (posicionObstaculo >= distancia) {
        mostrarError(
            "La posición del obstáculo debe ser menor que la distancia total.",
            posicionObstaculoInput
        );

        return;
    }


    // Cálculos

    const radio = calcularRadioFresnel(
        distancia,
        frecuencia
    );

    const alturaLineaVisual =
    (alturaAntenaA + alturaAntenaB) / 2;

    const zonaLibre = calcularZonaLibre(
    alturaLineaVisual,
    alturaObstaculo,
    radio
    );

    const obstruccion =
        100 - zonaLibre;

    const alturaRecomendada =
        calcularAlturaRecomendada(
            alturaObstaculo,
            radio
        );

    const estado =
        zonaLibre >= PORCENTAJE_MINIMO
            ? "CUMPLE"
            : "NO CUMPLE";


    actualizarResultados({
        radio,
        zonaLibre,
        obstruccion,
        alturaRecomendada,
        estado
    });


    guardarHistorial({
        distancia,
        frecuencia,
        radio,
        zonaLibre,
        estado
    });
}


// ==========================================================
// ACTUALIZAR RESULTADOS
// ==========================================================

function actualizarResultados(datos) {
    const radioVisible =
        mostrarDosDecimales(
            datos.radio
        );

    const despejeVisible =
        mostrarDosDecimales(
            datos.zonaLibre
        );

    const obstruccionVisible =
        mostrarDosDecimales(
            datos.obstruccion
        );

    const alturaVisible =
        mostrarDosDecimales(
            datos.alturaRecomendada
        );


    // Tarjetas

    resultadoRadio.textContent =
        `${radioVisible} m`;

    resultadoZonaLibre.textContent =
        `${despejeVisible} %`;

    resultadoImpacto.textContent =
        `${obstruccionVisible} %`;

    resultadoAltura.textContent =
        `${alturaVisible} m`;


    // Limpia los estados anteriores

    panelEstado.classList.remove(
        "estado-espera",
        "estado-aprobado",
        "estado-no-recomendable"
    );

    zonaFresnelVisual.classList.remove(
        "aprobada",
        "no-recomendable"
    );

    progresoDespeje.classList.remove(
        "progreso-aprobado",
        "progreso-no-recomendable"
    );


    // Actualiza la barra

    progresoDespeje.style.width =
        `${Math.min(datos.zonaLibre, 100)}%`;

    textoProgreso.textContent =
        `Despeje calculado: ${despejeVisible} %`;


    // Estado del enlace

    if (datos.estado === "CUMPLE") {
        panelEstado.classList.add(
            "estado-aprobado"
        );

        zonaFresnelVisual.classList.add(
            "aprobada"
        );

        progresoDespeje.classList.add(
            "progreso-aprobado"
        );

        iconoEstado.textContent = "✓";

        textoEstado.textContent =
            "CUMPLE EL DESPEJE MÍNIMO (60 %)";

        descripcionEstado.textContent =
            "El enlace mantiene libre al menos el 60 % " +
            "de la primera zona de Fresnel y resulta " +
            "técnicamente recomendable.";
    } else {
        panelEstado.classList.add(
            "estado-no-recomendable"
        );

        zonaFresnelVisual.classList.add(
            "no-recomendable"
        );

        progresoDespeje.classList.add(
            "progreso-no-recomendable"
        );

        iconoEstado.textContent = "✕";

        textoEstado.textContent =
            "NO CUMPLE EL DESPEJE MÍNIMO (60 %)";

        descripcionEstado.textContent =
            `El enlace dispone de ${despejeVisible} % ` +
            "de despeje. Se recomienda elevar las antenas " +
            `hasta, como mínimo, ${alturaVisible} m.`;
    }
}


// ==========================================================
// FRECUENCIAS
// ==========================================================

const referenciasFrecuencia = {
    "0.9":
        "Buena alternativa para enlaces rurales y mayor alcance.",

    "2.4":
        "Frecuencia habitual en hogares y comercios.",

    "5":
        "Mayor velocidad, aunque normalmente con menor alcance.",

    "5.8":
        "Muy utilizada en radioenlaces entre antenas.",

    "6":
        "Frecuencia moderna utilizada por redes Wi-Fi 6E.",

    "24":
        "Usada en enlaces de alta capacidad y distancias cortas.",

    otra:
        "Ingresá manualmente una frecuencia expresada en GHz."
};


function cambiarFrecuencia() {
    const valor =
        frecuenciaSelect.value;

    referenciaFrecuencia.textContent =
        referenciasFrecuencia[valor] ?? "";

    if (valor === "otra") {
        contenedorOtraFrecuencia.classList.remove(
            "oculto"
        );

        otraFrecuenciaInput.focus();
    } else {
        contenedorOtraFrecuencia.classList.add(
            "oculto"
        );

        otraFrecuenciaInput.value = "";
    }
}


// ==========================================================
// LIMPIAR
// ==========================================================

function limpiar() {
    distanciaInput.value = "";

    frecuenciaSelect.value = "2.4";

    otraFrecuenciaInput.value = "";

    alturaAntenaAInput.value = "";
    alturaAntenaBInput.value = "";

    alturaObstaculoInput.value = "";

    posicionObstaculoInput.value = "";


    cambiarFrecuencia();
    ocultarError();


    resultadoRadio.textContent = "-- m";

    resultadoZonaLibre.textContent = "-- %";

    resultadoImpacto.textContent = "-- %";

    resultadoAltura.textContent = "-- m";


    panelEstado.className =
        "panel-estado estado-espera";

    iconoEstado.textContent = "…";

    textoEstado.textContent =
        "Esperando datos";

    descripcionEstado.textContent =
        "Completá el formulario para comprobar si alcanza " +
        "el despeje mínimo recomendado del 60 %.";


    zonaFresnelVisual.classList.remove(
        "aprobada",
        "no-recomendable"
    );


    progresoDespeje.style.width = "0%";

    progresoDespeje.classList.remove(
        "progreso-aprobado",
        "progreso-no-recomendable"
    );

    textoProgreso.textContent =
        "Despeje calculado: -- %";


    distanciaInput.focus();
}


// ==========================================================
// HISTORIAL
// ==========================================================

function guardarHistorial(datos) {
    historial.push({
        numero: historial.length + 1,
        distancia: datos.distancia,
        frecuencia: datos.frecuencia,
        radio: truncar(datos.radio),
        zonaLibre: truncar(datos.zonaLibre),
        estado: datos.estado
    });

    renderizarHistorial();
}


function renderizarHistorial() {
    cuerpoHistorial.innerHTML = "";

    if (historial.length === 0) {
        cuerpoHistorial.innerHTML = `
            <tr class="fila-vacia">
                <td colspan="6">
                    Todavía no se realizaron cálculos.
                </td>
            </tr>
        `;

        return;
    }


    historial.forEach((registro) => {
        const fila =
            document.createElement("tr");

        const estadoVisible =
            registro.estado === "CUMPLE"
                ? "Cumple 60 %"
                : "No cumple 60 %";


        fila.innerHTML = `
            <td>${registro.numero}</td>
            <td>${registro.distancia} km</td>
            <td>${registro.frecuencia} GHz</td>
            <td>${registro.radio.toFixed(2)} m</td>
            <td>${registro.zonaLibre.toFixed(2)} %</td>
            <td>${estadoVisible}</td>
        `;

        cuerpoHistorial.appendChild(fila);
    });
}


function limpiarHistorial() {
    historial = [];

    renderizarHistorial();
}


// ==========================================================
// MODALES
// ==========================================================

function abrirModal(modal) {
    modal.classList.remove(
        "oculto"
    );
}


function cerrarModal(modal) {
    modal.classList.add(
        "oculto"
    );
}


botonInfo.addEventListener(
    "click",
    () => {
        abrirModal(modalInfo);
    }
);


cerrarInfo.addEventListener(
    "click",
    () => {
        cerrarModal(modalInfo);
    }
);


entendidoInfo.addEventListener(
    "click",
    () => {
        cerrarModal(modalInfo);
    }
);


botonHistorial.addEventListener(
    "click",
    () => {
        renderizarHistorial();

        abrirModal(modalHistorial);
    }
);


cerrarHistorial.addEventListener(
    "click",
    () => {
        cerrarModal(modalHistorial);
    }
);


borrarHistorial.addEventListener(
    "click",
    () => {
        limpiarHistorial();
    }
);


modalInfo.addEventListener(
    "click",
    (evento) => {
        if (evento.target === modalInfo) {
            cerrarModal(modalInfo);
        }
    }
);


modalHistorial.addEventListener(
    "click",
    (evento) => {
        if (
            evento.target === modalHistorial
        ) {
            cerrarModal(modalHistorial);
        }
    }
);


// ==========================================================
// EVENTOS
// ==========================================================

botonCalcular.addEventListener(
    "click",
    calcular
);

botonLimpiar.addEventListener(
    "click",
    limpiar
);

frecuenciaSelect.addEventListener(
    "change",
    cambiarFrecuencia
);


document.addEventListener(
    "keydown",
    (evento) => {
        if (
            evento.key === "Enter" &&
            modalInfo.classList.contains(
                "oculto"
            ) &&
            modalHistorial.classList.contains(
                "oculto"
            )
        ) {
            calcular();
        }

        if (evento.key === "Escape") {
            cerrarModal(modalInfo);
            cerrarModal(modalHistorial);
        }
    }
);


// ==========================================================
// ESTADO INICIAL
// ==========================================================

cambiarFrecuencia();
limpiar();