var http = require('http');
var url  = require('url');

function start(route){	
	var onRequest = function(request,response){
		route(request,response);		
	};
	http.createServer(onRequest).listen(3000);
	console.log("Server has started");
}

exports.start= start;