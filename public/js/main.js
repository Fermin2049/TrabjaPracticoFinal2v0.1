// Importar las funciones del archivo dom.js
import {
	agregarUsuario,
	llenarContinentesSelect,
	mostrarPreguntaPais,
	mostrarPreguntaBandera,
	actualizarTablaUsuarios,
	puntajeUsuario,
	resetearPuntaje,
} from './dom.js';

document.addEventListener('DOMContentLoaded', function () {
	fetch('http://localhost:3000/getAll')
		.then((response) => response.json())
		.then((data) => {
			console.log('Antes de llenar la tabla');
			console.log(data);
			const tablaMejoresPuntajes = document.querySelector(
				'#tablaMejoresPuntajes table tbody'
			);
			if (tablaMejoresPuntajes) {
				tablaMejoresPuntajes.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

				data.data.forEach((registro) => {
					const fila = document.createElement('tr');
					fila.innerHTML = `
                        <td class="text-center">${registro.nombreUsuario}</td>
                        <td class="text-center">${registro.puntaje}</td>
                        <td class="text-center">${registro.tiempo}</td>
                    `;
					tablaMejoresPuntajes.appendChild(fila);
				});
			}
		});
});

// Variables globales
let paisesPorContinente = {};
let preguntasRealizadas = 0;
let tiempoTranscurrido = 0; // Tiempo transcurrido en segundos
let contadorInterval;
let tiempoTotalPartida = 0;

// Función para obtener la lista de países y organizarlos por continente
async function obtenerPaisesPorContinentes() {
	try {
		const response = await fetch('https://restcountries.com/v3.1/all');

		if (!response.ok) {
			throw new Error(
				`Error al obtener datos de la API: ${response.statusText}`
			);
		}

		const data = await response.json();

		// Organizar los países por continente (excluyendo "Antarctic")
		data.forEach((pais) => {
			const continente = pais.region;
			if (continente !== 'Antarctic') {
				if (!paisesPorContinente[continente]) {
					paisesPorContinente[continente] = [];
				}
				paisesPorContinente[continente].push(pais);
			}
		});

		// Llamar a la función para llenar el select de continentes
		llenarContinentesSelect(paisesPorContinente);
	} catch (error) {
		console.error('Error al obtener la lista de países:', error);
		throw error;
	}
}

// Evento para confirmar usuario

let nombre;
const inputNombre = document.getElementById('inputNombre');
const confirmButton = document.getElementById('confirmButton');
const preguntaContienente = document.getElementById('preguntaContienente');

// Oculta la pregunta inicialmente
preguntaContienente.classList.add('d-none');

confirmButton.addEventListener('click', (event) => {
	event.preventDefault();
	nombre = inputNombre.value.trim(); // Elimina espacios en blanco al inicio y al final del nombre
	if (nombre) {
		agregarUsuario(nombre);
		document.querySelector('#usuarioPregunta form').classList.add('d-none'); // Ocultar el formulario completo
		preguntaContienente.classList.remove('d-none'); // Mostrar la pregunta después de agregar el nombre
	} else {
		// Mostrar un alert si el campo está vacío
		alert('Por favor, ingresa un nombre de usuario.');
	}
});

// Función para cargar preguntas aleatorias
async function cargarPreguntasAleatorias(continent) {
	if (preguntasRealizadas >= 10) {
		const preguntaContienente = document.getElementById('preguntaContienente');
		clearInterval(contadorInterval); // Detiene el contador
		const tiempoTotalPartida = tiempoTranscurrido; // Calcula el tiempo total de la partida
		console.log(nombre, puntajeUsuario, tiempoTotalPartida);

		// Realiza la solicitud POST
		await fetch('http://localhost:3000/insert', {
			headers: {
				'Content-type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				nombreUsuario: nombre,
				puntaje: puntajeUsuario,
				tiempo: tiempoTotalPartida,
			}),
		});
		await fetch('http://localhost:3000/getAll')
			.then((response) => response.json())
			.then((data) => {
				llenarTabla(data);
			});

		// Muestra un mensaje de juego completado
		alert(
			`¡Juego completado! Tu puntaje es: ${puntajeUsuario}\n
            Tu Tiempo total es ${tiempoTotalPartida} segundos.\n
            Respuestas incorrectas: ${(100 - puntajeUsuario) / 10}.\n
            Tiempo promedio tardado en responder cada pregunta: ${
							tiempoTotalPartida / 10
						} Segundos.`
		);

		// Actualiza la tabla de usuarios
		actualizarTablaUsuarios(puntajeUsuario);
		document.addEventListener(
			'DOMContentLoaded',
			preguntaContienente.classList.add('d-none')
		);
		restablecerCampos();
		return;
	}

	const tipoPreguntas = Math.random() < 0.5 ? 'capital' : 'bandera';
	if (tipoPreguntas === 'capital') {
		mostrarPreguntaPais(continent);
	} else {
		mostrarPreguntaBandera(continent);
	}

	// Incrementa el contador de preguntas realizadas
	preguntasRealizadas++;
}

// Función para llenar la tabla con datos
function llenarTabla(data) {
	console.log('Antes de llenar la tabla');
	console.log(data);
	const tablaMejoresPuntajes = document.querySelector(
		'#tablaMejoresPuntajes table tbody'
	);
	if (tablaMejoresPuntajes) {
		tablaMejoresPuntajes.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

		data.data.forEach((registro) => {
			const fila = document.createElement('tr');
			fila.innerHTML = `
                <td class="text-center">${registro.nombreUsuario}</td>
                <td class="text-center">${registro.puntaje}</td>
                <td class="text-center">${registro.tiempo}</td>
            `;
			tablaMejoresPuntajes.appendChild(fila);
		});
	}
}

// Evento cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function () {
	fetch('http://localhost:3000/getAll')
		.then((response) => response.json())
		.then((data) => {
			// Llamar a la función para llenar la tabla con los datos
			llenarTabla(data);
		});
});

function iniciarContador() {
	const contador = document.getElementById('tiempo');
	contadorInterval = setInterval(function () {
		tiempoTranscurrido++;
		tiempoTotalPartida++;
		contador.textContent = tiempoTranscurrido;
	}, 1000);
}

// Evento para seleccionar continente
const continentesSelect = document.getElementById('continentesSelect');
let selectedContinent;
continentesSelect.addEventListener('change', () => {
	selectedContinent = continentesSelect.value;
	//mostrarPreguntaPais(selectedContinent);
	cargarPreguntasAleatorias(selectedContinent);
	continentesSelect.disabled = true;
	iniciarContador();
});

function restablecerCampos() {
	preguntasRealizadas = 0;
	tiempoTranscurrido = 0;
	tiempoTotalPartida = 0;
	inputNombre.disabled = false;
	continentesSelect.disabled = false;
	inputNombre.value = ''; // Limpiar el valor del input de nombre
	preguntaContienente.classList.add('d-none'); // Ocultar el elemento preguntaContienente
	document.querySelector('#usuarioPregunta form').classList.remove('d-none'); // Mostrar el formulario de nombre nuevamente
	resetearPuntaje();
}

// Llamar a la función que obtiene los países por continente cuando se carga la página
document.addEventListener('DOMContentLoaded', obtenerPaisesPorContinentes);

export { paisesPorContinente, cargarPreguntasAleatorias, selectedContinent };
