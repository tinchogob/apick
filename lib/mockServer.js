var fs = require('fs');
var express = require('express');

var servers = {};
var httpServers = {};

var default_port = 3001;

servers[default_port] = {
	app: express(),
	httpServer: undefined,
	started: false,
};

var methods = ['get', 'post', 'put', 'head', 'delete'];

var mock = function(args) {

	var port = args.port || default_port;
	var path = args.path || '/';
	var method = args.method || 'get';
	var file = args.file || args.f;
	var data = args.data ||  args.d;
	var code = args.code || 200;
	
	var app = servers[default_port].app;
	
	app[method](path, function (req, res, next) {
		
		if (file && file.match(/.json/))
			res.send(JSON.parse(fs.readFileSync(file, {encoding:'utf-8'})), code);
		else if (file)
			res.sendfile(file);
		else if (data)
			res.send(JSON.parse(data), code);
		else 
			res.send("no response configured", code);
	});

	start(port);

	return "Mock: " + method + " " + path + " returns " + code + " with " + (file || data);
};

var start = function(port) {
	if (servers[port].started) return;
	servers[port].httpServer = servers[port].app.listen(port);
	servers[port].started = true;
};

var stop = function(port) {
	if (!servers[port].started) return;
	servers[port].httpServer.close();
	servers[port].started = false;
};

var clean = function(args) {
	var new_array = [];
	
	servers[args.port || 3001].app._router.map[args.method || 'get'].forEach(function(route) {
		if (route.path !== args.path) new_array.push(route); 
	});

	servers[args.port || 3001].app._router.map[args.method || 'get'] = new_array;
 	
};

var reset = function(port) {
	servers[port].app._router.map = {};
};

module.exports.mock = mock;
module.exports.clean = clean;
module.exports.reset = reset;
module.exports.start = start;
module.exports.stop = stop;