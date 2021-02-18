/* 
 * BBMKT API / config.js
 * Made by: Mauricio Alcala
 * @maualka
 * Created: feb 17, 2021
 */

var enviroments = {};

// Staging enviroment
enviroments.staging = {
	'httpPort': 3000,
 	'httpsPort': 3001,
 	'envName': 'staging'
 };

// Production Enviroment
enviroments.production = {
	'httpPort': 80, 
	'httpsPort': 81,
	'envName': 'production'
};

// Determine the enviroment to be returned
var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


// Check th current enviroment in one of the variables avobe. if not default to stagging
var enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

// export the module
module.exports = enviromentToExport;