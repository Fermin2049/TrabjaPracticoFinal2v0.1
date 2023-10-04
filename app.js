const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// insertar
app.post('/insert', (request, response) => {
	const { nombreUsuario, puntaje, tiempo } = request.body;
	const db = dbService.getDbServiceInstance();

	const result = db.insertNewName(nombreUsuario, puntaje, tiempo);

	result
		.then((data) => response.json({ data: data }))
		.catch((err) => console.log(err));
});

// todos los usuarios
app.get('/getAll', (request, response) => {
	const db = dbService.getDbServiceInstance();

	const result = db.getAllData();

	result
		.then((data) => response.json({ data: data }))
		.catch((err) => console.log(err));
});

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
app.listen(process.env.PORT, () => console.log('app is running'));
