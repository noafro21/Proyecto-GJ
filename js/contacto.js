/**
 * Script específico para la página de contacto
 * Funcionalidades:
 * - Manejo del checkbox personalizado
 * - Validación del formulario
 * - Envío del formulario
 */

document.addEventListener('DOMContentLoaded', inicializarContacto);

/**
 * Inicializa todas las funcionalidades de la página de contacto
 */
function inicializarContacto() {
  inicializarCheckbox();
  inicializarFormulario();
  actualizarFechaHora();

  // Actualizar la fecha y hora cada segundo
  setInterval(actualizarFechaHora, 1000);
}

/**
 * Actualiza la fecha y hora en el pie de página
 */
function actualizarFechaHora() {
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

/**
 * Inicializa el comportamiento del checkbox personalizado
 */
function inicializarCheckbox() {
  const checkbox = document.getElementById('privacy-checkbox');

  if (checkbox) {
    // Manejar clic en el checkbox
    checkbox.addEventListener('click', function() {
      toggleCheckbox(this);
    });

    // Manejar interacción con teclado (accesibilidad)
    checkbox.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCheckbox(this);
      }
    });
  }
}

/**
 * Cambia el estado del checkbox personalizado
 * @param {HTMLElement} checkbox - El elemento checkbox
 */
function toggleCheckbox(checkbox) {
  const isChecked = checkbox.getAttribute('aria-checked') === 'true';
  checkbox.setAttribute('aria-checked', !isChecked);

  if (!isChecked) {
    checkbox.classList.add('checked');
  } else {
    checkbox.classList.remove('checked');
  }
}

/**
 * Inicializa la validación y envío del formulario
 */
function inicializarFormulario() {
  const formulario = document.querySelector('.contact-form');

  if (formulario) {
    formulario.addEventListener('submit', function(e) {
      e.preventDefault();

      if (validarFormulario(this)) {
        // Simulación de envío
        mostrarMensajeExito();
        this.reset();

        // Resetear el checkbox
        const checkbox = document.getElementById('privacy-checkbox');
        if (checkbox) {
          checkbox.setAttribute('aria-checked', 'false');
          checkbox.classList.remove('checked');
        }
      }
    });
  }
}

/**
 * Valida todos los campos del formulario
 * @param {HTMLFormElement} formulario - El formulario a validar
 * @returns {boolean} - True si el formulario es válido, false en caso contrario
 */
function validarFormulario(formulario) {
  let esValido = true;

  // Validar campos requeridos
  const camposRequeridos = formulario.querySelectorAll('[required]');
  camposRequeridos.forEach(campo => {
    if (!campo.value.trim()) {
      marcarError(campo, 'Este campo es obligatorio');
      esValido = false;
    } else {
      limpiarError(campo);
    }
  });

  // Validar email
  const campoEmail = formulario.querySelector('#email');
  if (campoEmail && campoEmail.value.trim() && !validarEmail(campoEmail.value)) {
    marcarError(campoEmail, 'Por favor, introduce un email válido');
    esValido = false;
  }

  // Validar política de privacidad
  const checkbox = document.getElementById('privacy-checkbox');
  if (checkbox && checkbox.getAttribute('aria-checked') !== 'true') {
    const checkboxGroup = checkbox.closest('.checkbox-group');
    if (checkboxGroup) {
      const mensaje = document.createElement('div');
      mensaje.className = 'error-message';
      mensaje.textContent = 'Debes aceptar la política de privacidad';

      // Eliminar mensaje de error anterior si existe
      const errorAnterior = checkboxGroup.querySelector('.error-message');
      if (errorAnterior) {
        errorAnterior.remove();
      }

      checkboxGroup.appendChild(mensaje);
      esValido = false;
    }
  } else if (checkbox) {
    const checkboxGroup = checkbox.closest('.checkbox-group');
    if (checkboxGroup) {
      const errorAnterior = checkboxGroup.querySelector('.error-message');
      if (errorAnterior) {
        errorAnterior.remove();
      }
    }
  }

  return esValido;
}

/**
 * Valida un email usando expresión regular
 * @param {string} email - El email a validar
 * @returns {boolean} - True si el email es válido, false en caso contrario
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Marca un campo como error
 * @param {HTMLElement} campo - El campo con error
 * @param {string} mensaje - El mensaje de error
 */
function marcarError(campo, mensaje) {
  // Limpiar error anterior
  limpiarError(campo);

  // Añadir clase de error
  campo.classList.add('error');

  // Crear mensaje de error
  const errorMensaje = document.createElement('div');
  errorMensaje.className = 'error-message';
  errorMensaje.textContent = mensaje;

  // Añadir mensaje después del campo
  campo.parentNode.appendChild(errorMensaje);
}

/**
 * Limpia el error de un campo
 * @param {HTMLElement} campo - El campo a limpiar
 */
function limpiarError(campo) {
  campo.classList.remove('error');

  // Buscar y eliminar mensaje de error
  const contenedor = campo.parentNode;
  const errorMensaje = contenedor.querySelector('.error-message');
  if (errorMensaje) {
    errorMensaje.remove();
  }
}

/**
 * Muestra un mensaje de éxito al enviar el formulario
 */
function mostrarMensajeExito() {
  // Crear elemento de mensaje
  const mensaje = document.createElement('div');
  mensaje.className = 'success-message';
  mensaje.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';

  // Añadir al contenedor
  const contenedor = document.querySelector('.contact-container');
  if (contenedor) {
    // Eliminar mensaje anterior si existe
    const mensajeAnterior = contenedor.querySelector('.success-message');
    if (mensajeAnterior) {
      mensajeAnterior.remove();
    }

    contenedor.insertBefore(mensaje, contenedor.firstChild);

    // Desplazar a la parte superior del contenedor
    contenedor.scrollTop = 0;

    // Eliminar mensaje después de 5 segundos
    setTimeout(() => {
      mensaje.classList.add('fade-out');
      setTimeout(() => {
        mensaje.remove();
      }, 500);
    }, 5000);
  }
}
