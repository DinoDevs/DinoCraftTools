/*
 * DinoCraftTools
 * Copyright (c) DinoDevs
 *
 * Configurations Script
 */

// Load Required Modules
	// File System module
	const fs = require('fs');

// Configurations Data
	var config = {
		// Web Server Configuration
		server : {
			active : true,
			preload : true,
			ip : "0.0.0.0",
			port : 8080,
			admins : {}
		},

		// Craft Configuration
		craft : {
			program : false,
			parameters : false,
			data : false,
			type : "vanila"
		}

	};
// Parameters pass
	var parameters = {
		// Default config path
		configPath : "config.json"
	}

// Script arguments parse
	var i=2;
	while(i < process.argv.length){
		console.log(process.argv[i]);
		switch(process.argv[i]){
			case "-c":
			case "-Config":
				parameters.configPath = process.argv[++i];
		}
		i++;
	}


// Load Configuration
	var load = fs.readFileSync(parameters.configPath).toString();
	load = JSON.parse(load);

// Load Server Configurations

	// Web Server
	if(load.server){
		// Port
		if(load.server.port && !isNaN(load.server.port))
			config.server.port = load.server.port
		// Admins
		if(load.server.admins){
			for(name in load.server.admins){
				config.server.admins[name] = load.server.admins[name];
			}
		}
	}

	// Craft Server Info
	if(load.craft && load.craft.program && load.craft.parameters && load.craft.data){
		// Program to run
		config.craft.program = load.craft.program;
		// Program's parameters
		config.craft.parameters = load.craft.parameters;
		// Path to server's data
		config.craft.data = load.craft.data;

		// Get server's type
		if(load.craft.type)
			config.craft.type = load.craft.type
	}
	else{
		config.craft = false;
	}

// Return Configuration
	config.parameters = parameters;
	module.exports = config;
