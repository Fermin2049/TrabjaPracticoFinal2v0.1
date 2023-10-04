const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: '',
	database: process.env.DATABASE,
	port: process.env.DB_PORT,
});

connection.connect((err) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log('Base de datos conectada!!!!');
	}
	// console.log('db ' + connection.state);
});

class DbService {
	static getDbServiceInstance() {
		return instance ? instance : new DbService();
	}

	async getAllData() {
		try {
			const response = await new Promise((resolve, reject) => {
				const query =
					'SELECT * FROM usuario ORDER BY puntaje DESC,tiempo ASC LIMIT 20;';

				connection.query(query, (err, results) => {
					if (err) reject(new Error(err.message));
					resolve(results);
				});
			});
			// console.log(response);
			return response;
		} catch (error) {
			console.log(error);
		}
	}

	async insertNewName(nombre, puntaje, tiempo) {
		try {
			const response = await new Promise((resolve, reject) => {
				const query =
					'INSERT INTO usuario (nombreUsuario, puntaje, tiempo) VALUES (?, ?, ?)';

				connection.query(query, [nombre, puntaje, tiempo], (err, result) => {
					if (err) reject(new Error(err.message));
					resolve(result);
				});
			});
			return response;
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = DbService;
