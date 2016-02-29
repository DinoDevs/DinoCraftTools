/*
 * DinoCraftTools
 * Copyright (c) DinoDevs
 *
 * Pages Script
 */

// Load Required Modules
	// File System module
	const fs = require('fs');

module.exports = function (preload) {
	var module = {};

	// Webdata
	const webpage_path = __dirname + "/pages/";

	// Preload
	if(preload) module.preload = preload;
	else module.preload = false;

	// Pages names
	var names = {
		login : "login.html",
		dashboard : "dashboard.html"
	}

	// Preload FALSE
	if(preload){
		// Load Page's Data
		module.data = {};

		// Preload Pages
		var temp_data;
		for(i in names){
			temp_data = fs.readFileSync(webpage_path + names[i]).toString();
			module.data[i] = temp_data;
		}
		
		// Get page function
		module.get = function(name){
			// Check if page exist
			if(module.data[name])
				// Return page
				return module.data[name];

			// Retrun empty string
			return "";
		}
	}

	// Preload TRUE
	else{
		// Get page function
		module.get = function(name){
			// Check if page exist
			if(!names[name])
				// Retrun empty string
				return "";

			// Get page
			var temp_data = fs.readFileSync(webpage_path + names[i]).toString();
			return temp_data;
		}
	}

	return module;
};
