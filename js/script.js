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
  obtenerUbicacionYClima();
  actualizarHora();
  inicializarMenuMovil();

  // Configurar actualizaciones periódicas
  setInterval(actualizarHora, 1000); // Actualizar hora cada segundo
<<<<<<< HEAD
  setInterval(obtenerClima, 600000); // Actualizar clima cada 10 minutos

  // Iniciar lluvia inmediatamente (para pruebas)
  // Puedes comentar estas líneas cuando quieras que funcione solo con la API
  setTimeout(() => {
    console.log("Iniciando lluvia manualmente para pruebas");
=======
  setInterval(obtenerUbicacionYClima, 600000); // Actualizar clima cada 10 minutos

  // TEMPORAL: Forzar lluvia para pruebas (puedes comentar estas líneas después)
  setTimeout(() => {
    console.log("Forzando lluvia para pruebas");
>>>>>>> feature/feature_branch_2
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
 * Obtiene la ubicación actual del usuario y luego obtiene el clima para esa ubicación
 */
function obtenerUbicacionYClima() {
  console.log("Obteniendo ubicación del usuario...");

  // Verificar si el navegador soporta geolocalización
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // Éxito - tenemos la ubicación
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Ubicación obtenida: Lat ${latitude}, Long ${longitude}`);

        // Obtener el clima con las coordenadas del usuario
        await obtenerClima(latitude, longitude);
      },
      // Error - no se pudo obtener la ubicación
      (error) => {
        console.error("Error obteniendo la ubicación:", error.message);
        // Usar coordenadas predeterminadas (San José, Costa Rica)
        obtenerClima(9.93, -84.08);
      },
      // Opciones
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    console.error("Geolocalización no soportada por este navegador");
    // Usar coordenadas predeterminadas (San José, Costa Rica)
    obtenerClima(9.93, -84.08);
  }
}

/**
 * Obtiene datos del clima desde la API y actualiza la interfaz
 * @param {number} latitude - Latitud de la ubicación
 * @param {number} longitude - Longitud de la ubicación
 */
async function obtenerClima(latitude, longitude) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    console.log("Consultando API del clima:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error de red: ${response.status}`);
    }

    const data = await response.json();
    const hora = new Date().getHours();
    let clima = data.current_weather.weathercode;

    console.log("Código de clima recibido:", clima);
<<<<<<< HEAD

    // TEMPORAL: Si está lloviendo actualmente, forzar el código de lluvia
    // Puedes comentar estas líneas cuando quieras que vuelva a funcionar automáticamente
    const estaLloviendo = true; // Cambiar a false cuando no esté lloviendo
    if (estaLloviendo) {
      console.log("Forzando efecto de lluvia");
      clima = 61; // Código para lluvia ligera
    }
=======
>>>>>>> feature/feature_branch_2

    // Aplicar estilos según hora y clima
    aplicarEstilosPorHora(hora);
    aplicarEstilosPorClima(clima);

    // Mostrar información del clima en la consola
    mostrarInfoClima(clima, data.current_weather.temperature);

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
 * Muestra información del clima en la consola
 * @param {number} codigoClima - Código del clima
 * @param {number} temperatura - Temperatura actual
 */
function mostrarInfoClima(codigoClima, temperatura) {
  const tiposClima = {
    0: "Cielo despejado",
    1: "Principalmente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    66: "Lluvia helada ligera",
    67: "Lluvia helada intensa",
    71: "Nevada ligera",
    73: "Nevada moderada",
    75: "Nevada intensa",
    80: "Chubascos ligeros",
    81: "Chubascos moderados",
    82: "Chubascos violentos",
    95: "Tormenta eléctrica",
    96: "Tormenta con granizo ligero",
    99: "Tormenta con granizo fuerte"
  };

  const descripcion = tiposClima[codigoClima] || "Clima desconocido";
  console.log(`Clima actual: ${descripcion} (${codigoClima}), Temperatura: ${temperatura}°C`);
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
  const headerElement = document.querySelector('.header__title');
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
<<<<<<< HEAD
  for (let i = 0; i < 50; i++) {
=======
  for (let i = 0; i < 100; i++) {
>>>>>>> feature/feature_branch_2
    crearGotaDeLluvia(rainContainer);
  }

  // Crear identificador único para este intervalo
  window.lluviaInterval = setInterval(() => {
    crearGotaDeLluvia(rainContainer);
<<<<<<< HEAD
  }, 50); // Crear gotas más frecuentemente

  console.log("Efecto de lluvia iniciado");
=======
  }, 25); // Crear gotas más frecuentemente

  // Mostrar mensaje en la consola
  console.log("Efecto de lluvia iniciado");

  // Verificar que el contenedor tenga gotas
  setTimeout(() => {
    const gotas = rainContainer.querySelectorAll('.raindrop');
    console.log(`Número de gotas creadas: ${gotas.length}`);
  }, 500);
>>>>>>> feature/feature_branch_2
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
<<<<<<< HEAD
  const duracion = Math.random() * 1.5 + 1; // Entre 1 y 2.5 segundos
  drop.style.animationDuration = duracion + "s";

  // Tamaño aleatorio para dar sensación de profundidad
  const escala = Math.random() * 0.5 + 0.5; // Entre 0.5 y 1
  drop.style.height = (15 * escala) + "px";
  drop.style.width = (2 * escala) + "px";
  drop.style.opacity = 0.7 + (escala * 0.3); // Más opaco si es más grande
=======
  const duracion = Math.random() * 1.5 + 0.8; // Entre 0.8 y 2.3 segundos
  drop.style.animationDuration = duracion + "s";

  // Tamaño aleatorio para dar sensación de profundidad
  const escala = Math.random() * 0.7 + 0.5; // Entre 0.5 y 1.2
  drop.style.height = (15 * escala) + "px";
  drop.style.width = (2 * escala) + "px";
  drop.style.opacity = 0.8 + (escala * 0.2); // Más opaco si es más grande

  // Color azul con variación aleatoria
  const azul = 200 + Math.floor(Math.random() * 55);
  drop.style.backgroundColor = `rgba(100, ${azul}, 255, ${0.7 + (escala * 0.3)})`;

  // Sombra para mayor visibilidad
  drop.style.boxShadow = `0 0 3px rgba(100, ${azul}, 255, 0.5)`;
>>>>>>> feature/feature_branch_2

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
  const elementoFechaHora = document.querySelector("#fecha-hora p");
  if (elementoFechaHora) {
    elementoFechaHora.textContent = `${formatoFecha} - ${formatoHora}`;
  }
}
