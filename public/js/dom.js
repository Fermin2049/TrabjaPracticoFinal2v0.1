import {
	paisesPorContinente,
	cargarPreguntasAleatorias,
	selectedContinent,
} from './main.js';
let puntajeUsuario = 0;
// Función para agregar un usuario a la tabla de usuarios
function agregarUsuario(nombre) {
	const tablaUsuarios = document.querySelector('#tablaYUsuario table tbody');
	const row = tablaUsuarios.insertRow();
	const cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell1.textContent = nombre;
	cell2.textContent = '0';
}

// Función para llenar el select de continentes
function llenarContinentesSelect(continentes) {
	const continentesSelect = document.getElementById('continentesSelect');

	for (const continente in continentes) {
		const option = document.createElement('option');
		option.value = continente;
		option.textContent = continente;
		continentesSelect.appendChild(option);
	}
}

// Función para mostrar la pregunta basada en el continente seleccionado
function mostrarPreguntaPais(continent) {
	const preguntaDiv = document.getElementById('pregunta');

	if (continent) {
		preguntaDiv.classList.remove('d-none');

		// Obtener un país aleatorio del continente seleccionado
		const paisesDelContinente = paisesPorContinente[continent];

		if (paisesDelContinente && paisesDelContinente.length > 0) {
			const paisAleatorio =
				paisesDelContinente[
					Math.floor(Math.random() * paisesDelContinente.length)
				];
			const preguntaContenido = document.getElementById('preguntaContenido');
			const nombrePais = paisAleatorio.name.common;
			preguntaContenido.innerHTML = `¿Cuál es la capital de <span class="text-danger font-weight-bold">${nombrePais}</span>?`;

			// Obtener las respuestas aleatorias
			const respuestas = obtenerRespuestasAleatorias2(
				paisAleatorio,
				paisesDelContinente
			);

			// Mostrar las respuestas en el HTML
			const respuestasDiv = document.getElementById('respuestas');
			const formCheckLabels =
				respuestasDiv.getElementsByClassName('form-check-label');

			for (let i = 0; i < formCheckLabels.length; i++) {
				formCheckLabels[i].textContent = respuestas[i];
			}

			// Agregar evento clic al botón de comprobación
			const comprobarButton = document.getElementById('botonRespuesta');

			function comprobarRespuesta(event) {
				event.preventDefault();
				const respuestaSeleccionada = document.querySelector(
					'input[name="respuestas"]:checked'
				);
				if (respuestaSeleccionada) {
					if (
						respuestaSeleccionada.nextElementSibling.textContent ===
						paisAleatorio.capital[0]
					) {
						alert('¡Respuesta Correcta!');
						preguntaDiv.classList.add('d-none');
						puntajeUsuario += 10;
						cargarPreguntasAleatorias(selectedContinent);
					} else {
						alert(
							'Respuesta Incorrecta. la respuesta correcta es = ' +
								paisAleatorio.capital[0]
						);
						preguntaDiv.classList.add('d-none');
						cargarPreguntasAleatorias(selectedContinent);
					}
				} else {
					alert('Por favor, selecciona una respuesta antes de comprobar.');
				}

				// Eliminar el evento clic después de usarlo
				comprobarButton.removeEventListener('click', comprobarRespuesta);
			}

			comprobarButton.addEventListener('click', comprobarRespuesta);
		}
	} else {
		preguntaDiv.classList.add('d-none');
		console.log('algo está mal');
	}
}

function mostrarPreguntaBandera(continent) {
	const preguntaDiv = document.getElementById('pregunta');
	const imagen = document.createElement('img');
	if (continent) {
		preguntaDiv.classList.remove('d-none');

		// Obtener un país aleatorio del continente seleccionado
		const paisesDelContinente = paisesPorContinente[continent];

		if (paisesDelContinente && paisesDelContinente.length > 0) {
			const paisAleatorio =
				paisesDelContinente[
					Math.floor(Math.random() * paisesDelContinente.length)
				];
			const preguntaContenido = document.getElementById('preguntaContenido');
			preguntaContenido.textContent = `¿cual es la bandera de este Pais?`;
			const banderaURL = paisAleatorio.flags.png;
			imagen.src = banderaURL;
			imagen.classList.add('img-fluid');
			preguntaContenido.appendChild(imagen);
			// Obtener las respuestas aleatorias
			const respuestas = obtenerRespuestasAleatorias(
				paisAleatorio,
				paisesDelContinente
			);

			// Mostrar las respuestas en el HTML
			const respuestasDiv = document.getElementById('respuestas');
			const formCheckLabels =
				respuestasDiv.getElementsByClassName('form-check-label');

			for (let i = 0; i < formCheckLabels.length; i++) {
				formCheckLabels[i].textContent = respuestas[i];
			}

			// Agregar evento clic al botón de comprobación
			const comprobarButton = document.getElementById('botonRespuesta');

			function comprobarRespuesta(event) {
				event.preventDefault();
				const respuestaSeleccionada = document.querySelector(
					'input[name="respuestas"]:checked'
				);
				if (respuestaSeleccionada) {
					if (
						respuestaSeleccionada.nextElementSibling.textContent ===
						paisAleatorio.name.common
					) {
						alert('¡Respuesta Correcta!');
						preguntaDiv.classList.add('d-none');
						puntajeUsuario += 10;
						cargarPreguntasAleatorias(selectedContinent);
					} else {
						alert(
							'Respuesta Incorrecta. la respuesta correcta es = ' +
								paisAleatorio.name.common
						);
						preguntaDiv.classList.add('d-none');
						cargarPreguntasAleatorias(selectedContinent);
					}
				} else {
					alert('Por favor, selecciona una respuesta antes de comprobar.');
					comprobarRespuesta();
				}

				// Eliminar el evento clic después de usarlo
				comprobarButton.removeEventListener('click', comprobarRespuesta);
			}

			comprobarButton.addEventListener('click', comprobarRespuesta);
		}
	} else {
		preguntaDiv.classList.add('d-none');
		console.log('algo está mal');
	}
}
// Función para obtener respuestas aleatorias
function obtenerRespuestasAleatorias(pais, paises) {
	const respuestas = [];

	// Agrega la respuesta correcta
	respuestas.push(pais.name.common);

	// Genera respuestas incorrectas aleatorias
	while (respuestas.length < 4) {
		const paisAleatorio = paises[Math.floor(Math.random() * paises.length)];
		const capitalAleatoria = paisAleatorio.name.common;

		// Verifica que la capital no se repita y no sea la correcta
		if (
			!respuestas.includes(capitalAleatoria) &&
			capitalAleatoria !== pais.name.common[0]
		) {
			respuestas.push(capitalAleatoria);
		}
	}

	// Baraja las respuestas para que la correcta no siempre esté en el mismo lugar
	for (let i = respuestas.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[respuestas[i], respuestas[j]] = [respuestas[j], respuestas[i]];
	}

	return respuestas;
}

function obtenerRespuestasAleatorias2(pais, paises) {
	const respuestas = [];

	// Agrega la respuesta correcta
	respuestas.push(pais.capital[0]);

	// Genera respuestas incorrectas aleatorias
	while (respuestas.length < 4) {
		const paisAleatorio = paises[Math.floor(Math.random() * paises.length)];
		const capitalAleatoria = paisAleatorio.capital[0];

		// Verifica que la capital no se repita y no sea la correcta
		if (
			!respuestas.includes(capitalAleatoria) &&
			capitalAleatoria !== pais.capital[0]
		) {
			respuestas.push(capitalAleatoria);
		}
	}

	// Baraja las respuestas para que la correcta no siempre esté en el mismo lugar
	for (let i = respuestas.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[respuestas[i], respuestas[j]] = [respuestas[j], respuestas[i]];
	}

	return respuestas;
}

function actualizarTablaUsuarios(puntaje) {
	const tablaUsuarios = document.querySelector('#tablaYUsuario table tbody');
	const filasUsuarios = tablaUsuarios.querySelectorAll('tr');

	// Encuentra la última fila de usuario (donde se añadió el puntaje)
	const ultimaFila = filasUsuarios[filasUsuarios.length - 1];

	// Actualiza el puntaje en la última fila
	const celdas = ultimaFila.querySelectorAll('td');
	if (celdas.length === 2) {
		// Asegúrate de que haya dos celdas (nombre y puntaje)
		const celdaPuntaje = celdas[1]; // La segunda celda es la del puntaje
		celdaPuntaje.textContent = puntaje;
	}
}

function resetearPuntaje() {
	puntajeUsuario = 0;
}

// Exportar las funciones para su uso en otros archivos
export {
	agregarUsuario,
	llenarContinentesSelect,
	mostrarPreguntaPais,
	mostrarPreguntaBandera,
	actualizarTablaUsuarios,
	puntajeUsuario,
	resetearPuntaje,
};
