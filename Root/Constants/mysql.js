const mysql = require('mysql');
const botConfig = require('../../Config.js')
module.exports = () => {
	const con = mysql.createConnection({
		host: botConfig.dbhost,
		user: botConfig.dbuser,
		database: botConfig.dbname
	});
    return con;
}