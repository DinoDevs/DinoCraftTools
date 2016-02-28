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

		// Minecraft Configuration
		minecraft : {
			program : false,
			parameters : false,
			data : false,
			type : "vanila"
		}

	};

// Load Configuration
	var load = fs.readFileSync('config.json').toString();
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

	// Minecraft Server Info
	if(load.minecraft && load.minecraft.program && load.minecraft.parameters && load.minecraft.data){
		// Program to run
		config.minecraft.program = load.minecraft.program;
		// Program's parameters
		config.minecraft.parameters = load.minecraft.parameters;
		// Path to server's data
		config.minecraft.data = load.minecraft.data;

		// Get server's type
		if(load.minecraft.type)
			config.minecraft.type = load.minecraft.type
	}
	else{
		config.minecraft = false;
	}

// Return Configuration
	module.exports = config;
