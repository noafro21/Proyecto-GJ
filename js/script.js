async function obtenerClima() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=9.93&longitude=-84.08&current_weather=true');
        const data = await response.json();
        const hora = new Date().getHours();
        const clima = data.current_weather.weathercode;

        let colorFondoBody, colorTitulo;

        //Define los colores según la hora
        if (hora >= 6 && hora < 16) { // Día claro
            colorFondoBody = "#87CEEB"; // Celeste
            colorTitulo = "#FFFAF0"; // Crema
        } else if (hora >= 16 && hora < 18) { // Atardecer
            colorFondoBody = "#FF8C00"; // Naranja oscuro
            colorTitulo = "#FFD700"; // Dorado
        } else if (hora >= 18 || hora < 4.5) { // Noche
            colorFondoBody = "#2C3E50"; // Azul oscuro
            colorTitulo = "#696969"; // Gris oscuro
        } else { // Amanecer
            colorFondoBody = "#FFD700"; // Dorado
            colorTitulo = "#FFA07A"; // Salmón claro
        }

        //Si está nublado, cambia el fondo del clima
        if ([45, 48].includes(clima)) {
            document.getElementById("fondo-clima").style.backgroundImage = "url('assets/nubes.jpg')";
            colorFondoBody = "#B0C4DE"; // Azul grisáceo
        } else {
            document.getElementById("fondo-clima").style.backgroundImage = "none";
        }

        //Si llueve, iniciar la lluvia
        if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(clima)) {
            iniciarLluvia();
            colorFondoBody = "#708090"; // Gris pizarra para lluvia
        }

        //Aplica un degradado entre el fondo del cuerpo y el título
        document.body.style.background = `linear-gradient(to bottom, ${colorFondoBody}, ${colorTitulo})`;
        // Aplicar color al título
        const headerElement = document.querySelector('.header');
        if (headerElement) {
            headerElement.style.backgroundColor = colorTitulo;
        }

    } catch (error) {
        console.error("Error obteniendo el clima:", error);
    }
}

//Función corregida para la lluvia
function iniciarLluvia() {
    const rainContainer = document.getElementById("rain-container");
    rainContainer.innerHTML = ""; // Limpia la lluvia anterior

    setInterval(() => {
        const drop = document.createElement("div");
        drop.classList.add("raindrop");
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = (Math.random() * 2 + 2) + "s";
        rainContainer.appendChild(drop);

        setTimeout(() => {
            drop.remove();
        }, 2000); // Elimina las gotas después de caer
    }, 100);
}

//Función corregida para mostrar nubes
/*function mostrarNubes() {

    document.getElementById("fondo-clima").style.backgroundImage = "url('assets/nubes.jpg')";
    document.getElementById("fondo-clima").style.backgroundSize = "cover";
    document.getElementById("fondo-clima").style.backgroundRepeat = "no-repeat";
    document.getElementById("fondo-clima").style.backgroundPosition = "center";
}*/

//Función para actualizar la hora en tiempo real
function actualizarHora() {
    const fecha = new Date();
    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formatoFecha = fecha.toLocaleDateString("es-ES", opciones);
    const formatoHora = fecha.toLocaleTimeString("es-ES");

    document.getElementById("fecha-hora").textContent = `${formatoFecha} - ${formatoHora}`;
}

//Actualizar la hora cada segundo
setInterval(actualizarHora, 1000);

//Ejecutar funciones
obtenerClima();
iniciarLluvia();
//mostrarNubes();
actualizarHora();

