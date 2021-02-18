/* 
 * BBMKT API / index.js
 * Made by: Mauricio Alcala
 * @maualka
 * Created: feb 17, 2021
 */

// Dependencies

const http = require("http");
const https = require("https");
const url = require("url");
const stringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");

// Instanciate the http server
var httpServer = http.createServer(function(req, res){
	unifiedServer(req, res);
});

// Start http server getting the port from the config.js file
httpServer.listen(config.httpPOrt, function(){
	console.log(" ----> Server listening in port " + config.httpPort + " in " + config.envName + " enviroment. ");
});

// Instanciate the https server
var httpsServerOptions = {
	'key': fs.readFilesync("./sslcert/privkey.pem"),
	'cert': fs.readFileSync("./sslcert/cacert.pem")
};

var httpsServer = https.createServer(httpsServerOptions, function(req, res){
	unifiedServer(req, res);
});

// Start the https server getting the port from the config.js file
httpsServer.listen(config.httpsPort, function(){
	console.log(" ----> Server is listening in port " + config.httpsPort + " in " + config.envName + " enviroment.");
});

// Unified logic for the for the http and https servers.
var unifiedServer = unifiedServer = function(req, res){
	// Get the URL and parse it.
	var parsedUrl = url.parse(req, url, true);
	// Get Url path.
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');
	// Get the query string as an object.
	var queryStringObject = parsedUrl.query;
	// Get Http Method.
	var method = req.method.toLowerCase();
	// Get the headers as am object
	var headers = req.headers;
	// Get payload if any.
	var decoder = new StringDecoder("utf-8");
	var buffer = "";
	req.on("data", function(data){
		buffer += decoder.write(data);
	});
	req.on("end", function(){
		buffer += decoder.end();
		// Choose which handler this request should go.
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
		// Construct the data object to be sent.
		var data = {
			'trimmedPath': trimmedPath,
			'queryStringObject': queryStringObject,
			'method': method,
			'headers': headers,
			'payload': buffer
		}
		chosenHandler(data, function(stautsCode, payload){
			// Use the status code called back by the handler, or default to 200
			status = typeof(statusCode) == 'number' ? statusCode : 200;
			// Use the payload called back by the handler or default to an empty object.
			payload = typeof(payload) == 'object' ? payload : {};
			// Convert the payload to a string
			var payloadString = JSON.stringify(payload);
			// Return response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			// Log the request Path
			console.log("----> returning this response: ", statusCode, payloadString);
		});
	});
};

// Define the handlers
var handlers = {};
// Connected Handler
handlers.connected = function(data, callback){
	callback(200);
};
// Not found handler
handlers.notFound = function(data, callback){
	callback(404);
};
// Define a request router
var router = {
	'connected': handlers.connected
}

