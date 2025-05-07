/*
 * Grupo Jiménez - Script principal
 * Funcionalidades:
 * - Obtención de datos climáticos
 * - Efectos visuales según clima y hora
 * - Actualización de fecha y hora en tiempo real
 * - Menú móvil responsivo
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarApp);

/**
 * Función principal que inicializa la aplicación
 */
function inicializarApp() {
  // Iniciar funciones principales
  obtenerClima();
  actualizarHora();
  inicializarMenuMovil();

  // Configurar actualizaciones periódicas
  setInterval(actualizarHora, 1000); // Actualizar hora cada segundo
  setInterval(obtenerClima, 600000); // Actualizar clima cada 10 minutos

  // Iniciar lluvia inmediatamente (para pruebas)
  // Puedes comentar estas líneas cuando quieras que funcione solo con la API
  setTimeout(() => {
    console.log("Iniciando lluvia manualmente para pruebas");
    iniciarLluvia();
    mostrarNubes();
  }, 1000);
}

/**
 * Inicializa la funcionalidad del menú móvil
 */
function inicializarMenuMovil() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.header_menu nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('show');

      // Cambiar el texto del botón según el estado
      if (nav.classList.contains('show')) {
        menuToggle.innerHTML = '✕';
        menuToggle.setAttribute('aria-label', 'Cerrar menú');
      } else {
        menuToggle.innerHTML = '☰';
        menuToggle.setAttribute('aria-label', 'Abrir menú');
      }
    });

    // Cerrar el menú cuando se hace clic en un enlace
    const menuLinks = nav.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Solo cerrar el menú, no prevenir la navegación por defecto
        nav.classList.remove('show');
        menuToggle.innerHTML = '☰';
        menuToggle.setAttribute('aria-label', 'Abrir menú');
      });
    });
  }
}

/**
 * Obtiene datos del clima desde la API y actualiza la interfaz
 */
async function obtenerClima() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=9.93&longitude=-84.08&current_weather=true';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error de red: ${response.status}`);
    }

    const data = await response.json();
    const hora = new Date().getHours();
    let clima = data.current_weather.weathercode;

    console.log("Código de clima recibido:", clima);

    // TEMPORAL: Si está lloviendo actualmente, forzar el código de lluvia
    // Puedes comentar estas líneas cuando quieras que vuelva a funcionar automáticamente
    const estaLloviendo = true; // Cambiar a false cuando no esté lloviendo
    if (estaLloviendo) {
      console.log("Forzando efecto de lluvia");
      clima = 61; // Código para lluvia ligera
    }

    // Aplicar estilos según hora y clima
    aplicarEstilosPorHora(hora);
    aplicarEstilosPorClima(clima);

  } catch (error) {
    console.error("Error obteniendo el clima:", error);
    // Usar valores predeterminados en caso de error
    aplicarEstilosPorHora(new Date().getHours());

    // TEMPORAL: Forzar lluvia incluso en caso de error
    console.log("Forzando efecto de lluvia después de error");
    iniciarLluvia();
    mostrarNubes();
  }
}

/**
 * Aplica estilos visuales según la hora del día
 * @param {number} hora - Hora actual (0-23)
 */
function aplicarEstilosPorHora(hora) {
  let colorFondoBody, colorTitulo;

  // Define los colores según la hora
  if (hora >= 6 && hora < 16) { // Día claro
    colorFondoBody = "#87CEEB"; // Celeste
    colorTitulo = "#8e1616"; // Color primario
  } else if (hora >= 16 && hora < 18) { // Atardecer
    colorFondoBody = "#FF8C00"; // Naranja oscuro
    colorTitulo = "#8e1616"; // Color primario
  } else if (hora >= 18 || hora < 4.5) { // Noche
    colorFondoBody = "#2C3E50"; // Azul oscuro
    colorTitulo = "#8e1616"; // Color primario
  } else { // Amanecer
    colorFondoBody = "#FFD700"; // Dorado
    colorTitulo = "#8e1616"; // Color primario
  }

  // Aplicar colores
  document.body.style.background = `linear-gradient(to bottom, ${colorFondoBody}, #f5f5f5)`;

  // Mantener el color del encabezado consistente con el diseño
  const headerElement = document.querySelector('.header');
  if (headerElement) {
    headerElement.style.backgroundColor = colorTitulo;
  }
}

/**
 * Aplica efectos visuales según el código de clima
 * @param {number} codigoClima - Código de clima de la API
 */
function aplicarEstilosPorClima(codigoClima) {
  // Limpiar efectos anteriores
  detenerLluvia();
  ocultarNubes();

  // Códigos de clima nublado: 45, 48
  if ([45, 48].includes(codigoClima)) {
    mostrarNubes();
  }

  // Códigos de clima lluvioso: 51, 53, 55, 61, 63, 65, 80, 81, 82
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(codigoClima)) {
    iniciarLluvia();
    mostrarNubes();
  }
}

/**
 * Inicia el efecto de lluvia
 */
function iniciarLluvia() {
  console.log("Iniciando efecto de lluvia");
  const rainContainer = document.getElementById("rain-container");

  if (!rainContainer) {
    console.error("No se encontró el contenedor de lluvia");
    return;
  }

  // Asegurarse de que el contenedor sea visible
  rainContainer.style.display = "block";
  rainContainer.style.zIndex = "0";
  rainContainer.innerHTML = ""; // Limpia la lluvia anterior

  // Detener cualquier intervalo anterior
  if (window.lluviaInterval) {
    clearInterval(window.lluviaInterval);
  }

  // Crear gotas iniciales
  for (let i = 0; i < 50; i++) {
    crearGotaDeLluvia(rainContainer);
  }

  // Crear identificador único para este intervalo
  window.lluviaInterval = setInterval(() => {
    crearGotaDeLluvia(rainContainer);
  }, 50); // Crear gotas más frecuentemente

  console.log("Efecto de lluvia iniciado");
}

/**
 * Crea una gota de lluvia y la añade al contenedor
 * @param {HTMLElement} container - El contenedor donde añadir la gota
 */
function crearGotaDeLluvia(container) {
  const drop = document.createElement("div");
  drop.classList.add("raindrop");

  // Posición horizontal aleatoria
  drop.style.left = Math.random() * 100 + "vw";

  // Duración de la animación aleatoria
  const duracion = Math.random() * 1.5 + 1; // Entre 1 y 2.5 segundos
  drop.style.animationDuration = duracion + "s";

  // Tamaño aleatorio para dar sensación de profundidad
  const escala = Math.random() * 0.5 + 0.5; // Entre 0.5 y 1
  drop.style.height = (15 * escala) + "px";
  drop.style.width = (2 * escala) + "px";
  drop.style.opacity = 0.7 + (escala * 0.3); // Más opaco si es más grande

  // Añadir al contenedor
  container.appendChild(drop);

  // Eliminar gotas después de caer para evitar sobrecarga del DOM
  setTimeout(() => {
    if (drop && drop.parentNode) {
      drop.remove();
    }
  }, duracion * 1000 + 500); // Tiempo de animación + margen
}

/**
 * Detiene el efecto de lluvia
 */
function detenerLluvia() {
  if (window.lluviaInterval) {
    clearInterval(window.lluviaInterval);
    const rainContainer = document.getElementById("rain-container");
    rainContainer.innerHTML = "";
  }
}

/**
 * Muestra el fondo de nubes
 */
function mostrarNubes() {
  const fondoClima = document.getElementById("fondo-clima");
  fondoClima.style.backgroundImage = "url('assets/nubes.jpg')";
  fondoClima.style.backgroundSize = "cover";
  fondoClima.style.backgroundRepeat = "no-repeat";
  fondoClima.style.backgroundPosition = "center";
  fondoClima.style.opacity = "0.3"; // Hacer las nubes semi-transparentes
}

/**
 * Oculta el fondo de nubes
 */
function ocultarNubes() {
  document.getElementById("fondo-clima").style.backgroundImage = "none";
}

/**
 * Actualiza la fecha y hora en tiempo real
 */
function actualizarHora() {
  const fecha = new Date();
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  // Formatear fecha y hora en español
  const formatoFecha = fecha.toLocaleDateString("es-ES", opciones);
  const formatoHora = fecha.toLocaleTimeString("es-ES");

  // Actualizar el elemento en el DOM
  const elementoFechaHora = document.getElementById("fecha-hora");
  if (elementoFechaHora) {
    elementoFechaHora.textContent = `${formatoFecha} - ${formatoHora}`;
  }
}
