/*
 * DinoCraftTools
 * Copyright (c) DinoDevs
 *
 * Informations Script
 */

// Define Informations
	var info = {
		// Name
		name : "DinoCraft",
		// Developer
		developer : "DinoDevs",
		// Version
		version : "0.0.3",
		build : "201602231241"
	};

// Export Informations
	module.exports.name = info.name;
	module.exports.developer = info.developer;
	module.exports.version = info.version;

	// Printable info
	module.exports.header = function(){
		return "" +
			"/*\n" + 
			" * " + info.name + " " + info.version + "\n" + 
			" * " + "by " + info.developer + "\n" + 
			" */";
	}

	// Printable Tag
	module.exports.tag = function(){
		return "[" + info.name + "]";
	}
