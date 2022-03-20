var config = require('./config.json');
var http = require('http');
var url = require('url') ;
module.exports = function (fileName) {
	return function(req, res, next) {
		var hostname = req.headers.host; // hostname = 'localhost:8080'
		var pathname = url.parse(req.url).pathname;
		// console.log("hhhhhh", hostname, pathname);
		//var parsed_url = req.url.split('/');
			var auth = req.headers['authorization'];
			if(pathname.includes('.pdf') || req.url == "/api-docs" || req.url == "/api-docs/swagger-ui.css" || req.url ==  "/api-docs/swagger-ui-bundle.js" || req.url == "/api-docs/swagger-ui-standalone-preset.js" || req.url == "/api-docs.json" ){
				next();
			}
			else if(!auth) {
				next();
				// res.end('Auth Fail. Invalid UserName or Password');
			} else {
				var tmp = auth.split(' ');
				var buf = new Buffer(tmp[1], 'base64');
				var plain_auth = buf.toString(); 
				var creds = plain_auth.split(':');
				var username = creds[0];
				var password = creds[1];

				if((username == config.auth.user) && (password == config.auth.pass)) {
					next();
				}
				else {
					next();
					// res.end('Auth Fail. Invalid UserName or Password');
				}
			}
	}
};