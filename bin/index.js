#!/usr/bin/env node
var repl = require("repl");
var mockServer = require('../lib/mockServer.js')

function eval(cmd, context, filename, callback) {
	cmd = cmd.replace(/\r?\n|\r/g,"");
	cmd = cmd.replace(/\(/g,"");
	cmd = cmd.replace(/\)/g,"");
	
	var argv = cmd.split(" ");
	var method = argv[0]; 
	var args = require('minimist')(argv.slice(1));
	
	if (context[method]) return context[method](args, callback);
	else return context.unknown(args, callback);
}

var options = {
	prompt: "node::apick> ",
	useColors: true,
	eval: eval
};

var local = repl.start(options);

local.context.unknown = function(args, callback) {
	
	return callback(null, "command not found. see(k) help");
};

local.context.help = function(args, callback) {
	
	return callback(null, "HELP is a pending issue");
};

local.context.mock = function(args, callback) {
	
	if (args.h || args.help) return callback(null, "Usage: mock --path /test --method get -d {'test':'mock'}");

	return callback(null, mockServer.mock(args));
};

local.context.clean = function(args, callback) {
	if (!args.path) return callback(null, "path to clean is required");
	mockServer.clean(args);	
	return callback(null, "Mock server cleaned that path");
};

local.context.start = function(args, callback) {
	mockServer.start(args.port || 3001);
	return callback(null, "Mock server listening on port " + args.port || 3001);
};

local.context.stop = function(args, callback) {
	mockServer.stop(args.port || 3001);
	return callback(null, "Mock server on port " + args.port || 3001 + " was shutdown");
};

local.context.reset = function(args, callback) {
	mockServer.reset(args.port || 3001);	
	return callback(null, "Mock server cleaned ok");
};

local.context.exit = function(args, callback) {
	process.exit(0);//should shutdown gracefully
};