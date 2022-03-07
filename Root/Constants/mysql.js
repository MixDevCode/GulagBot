const mysql = require('mysql');
const botConfig = require('../../Config.js')
module.exports = () => {
	if(botConfig.dbpass.length < 1) {
		const con = mysql.createConnection({
			host: botConfig.dbhost,
			user: botConfig.dbuser,
			database: botConfig.dbname
		});
		return con;
	} else {
		cosnt con = mysql.createConnection({
			host: botConfig.dbhost,
			user: botConfig.dbuser,
			password: botConfig.dbpass,
			database: botConfig.dbname
		});
		return con;
	}
    
}
