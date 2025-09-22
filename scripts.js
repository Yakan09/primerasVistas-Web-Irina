// Inicialización del calendario
$(document).ready(function() {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        events: [
            {
                title: 'Examen Psicología',
                start: '2025-02-15'
            },
            {
                title: 'Consulta Psicológica',
                start: '2025-02-18'
            }
        ]
    });
});

// Fichaje - Variables y Funciones
let startTime, endTime, timerInterval;
let fichajeIniciado = false;

const startButton = document.getElementById("startFichaje");
const endButton = document.getElementById("endFichaje");
const timerDisplay = document.getElementById("timer");
const fichajeForm = document.getElementById("fichajeForm");
const fotoFinInput = document.getElementById("fotoFin");

startButton.addEventListener("click", startFichaje);
endButton.addEventListener("click", endFichaje);
fichajeForm.addEventListener("submit", handleFichajeSubmit);

function startFichaje() {
    fichajeIniciado = true;
    startButton.disabled = true; // Desactivar el botón de "Iniciar"
    endButton.disabled = false; // Activar el botón de "Finalizar"
    fichajeForm.style.display = "block"; // Mostrar el formulario de fotos

    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000); // Actualizar el temporizador cada segundo
}

function endFichaje() {
    if (!fichajeIniciado) return;

    endTime = Date.now();
    clearInterval(timerInterval); // Detener el temporizador

    // Habilitar la foto de fin para que se pueda seleccionar
    fotoFinInput.disabled = false;

    // Verificar si la foto de fin fue cargada
    if (!fotoFinInput.files[0]) {
        alert("Por favor, sube una foto para finalizar el fichaje.");
        return;
    }

    // Aquí guardamos directamente los datos sin mostrar un mensaje de confirmación
    fichajeForm.style.display = "none"; // Ocultar el formulario de fotos
    saveFichajeData(); // Guardar los datos automáticamente
    startButton.disabled = false; // Habilitar el botón de "Iniciar"
    endButton.disabled = true; // Deshabilitar el botón de "Finalizar"
}

function updateTimer() {
    const elapsed = Date.now() - startTime;
    timerDisplay.textContent = formatTime(elapsed);
}

function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

function handleFichajeSubmit(event) {
    event.preventDefault();

    const formData = new FormData(fichajeForm);
    const fotoInicio = document.getElementById("fotoInicio").files[0];
    const fotoFin = document.getElementById("fotoFin").files[0];

    if (!fotoInicio || !fotoFin) {
        alert("Ambas fotos son obligatorias.");
        return;
    }

    formData.append("fotoInicio", fotoInicio);
    formData.append("fotoFin", fotoFin);
    formData.append("fechaInicio", startTime);
    formData.append("fechaFin", endTime);

    // Enviar los datos al servidor
    fetch("/api/fichaje", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        fichajeForm.reset(); // Limpiar el formulario
        fichajeForm.style.display = "none"; // Ocultar el formulario
    })
    .catch(err => {
        alert("Error al registrar el fichaje.");
    });
}

function saveFichajeData() {
    const formData = new FormData();
    const fotoInicio = document.getElementById("fotoInicio").files[0];
    const fotoFin = document.getElementById("fotoFin").files[0];

    formData.append("fotoInicio", fotoInicio);
    formData.append("fotoFin", fotoFin);
    formData.append("fechaInicio", startTime);
    formData.append("fechaFin", endTime);

    // Enviar los datos directamente sin mostrar confirmación
    fetch("/api/fichaje", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .catch(err => {
        console.error("Error al guardar el fichaje", err);
    });
}
