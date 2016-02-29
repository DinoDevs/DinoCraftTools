/*
 * DinoCraftTools
 * Copyright (c) DinoDevs
 *
 * Craft Process Script
 */

 // Load Required Modules
	// Child Process module
	const child = require('child_process');
	// File System module
	const fs = require('fs');
	// NBT library module
	var nbt = require(__dirname + '/nbtjs/NBTjs');

// Module
module.exports = function () {
	var module = {};

	// Info
	module.info = {};
	// Configuration
	module.config = null;
	// Craft process
	module.process = null;
	// Craft Type
	module.type = null;
	// Craft state
	module.state = "STOPED";
	module.starting = false;

// Initiate
	module.init = function (info) {
		// Spawn process
		module.process = child.spawn(info.program, info.parameters, {cwd : info.data});
		// Set state
		module.state = "STARTING";
		module.starting = 0;
		module.resolve = module.resolveStart;
		module.type.process = module.process;
		// Process encoding utf-8
		module.process.stdin.setEncoding('utf-8');
		// Redirect input to craft
		process.stdin.pipe(module.process.stdin);

		// Attach events
		module.process.stdout.on('data', module.stdout);
		module.process.stderr.on('data', module.stderr);
		module.process.on('close', module.close);
	};

// Events
	module.output = {
		leftovers : false
	};

	module.stdout = function (data) {
		// Split data to lines
		var lines = data.toString().replace(/\r\n/g,"\n").split("\n");

		// Add any leftovers
		if(module.output.leftovers){
			lines[0] = module.output.leftovers + lines[0];
			module.output.leftovers = false;
		}

		// Save leftovers if any
		if(lines[lines.length-1].length != 0){
			module.output.leftovers = lines.pop();
		}
		// Remove last \n
		else{
			lines.pop();
		}

		for (var i=0; i<lines.length; i++) {
			console.log("[" + module.type.name + "] " + lines[i]);
			module.resolve(lines[i]);
		}
	}

	module.stderr = function (data) {
		var data = data.toString();
		process.stdout.write("[Error " + module.type.name + "] " + data);
	}

	module.close = function () {
		console.log("[" + module.type.name + " Closed]\n");
		module.state = "STOPED";
	}

// Resolve data
	module.resolve  = function () {};
	module.resolveData = function (data) {
		// Match data
		var type = false;
		var regexp = false;
		for(i in module.type.outputRegExp){
			regexp = data.match(module.type.outputRegExp[i].regexp);
			if(regexp != null){
				type = module.type.outputRegExp[i].type;
				break;
			}
		}

		if(type){
			module.resolveOutputType(data, type, regexp);
		}

		// Split data to lines
		//var lines = data.split("\n");

		// 
		/*
		for(var i=0; i<lines.length; i++){
			// Check chat
			var chat = lines[i].match(SERVER_CHAT_REGEXP);
			if(chat != null){
				// If custom command
				if(chat[3][0] == "%")
					custom_commands(chat[3], chat[2]);
			}
		}
		if(web_commands.length>0){
			web_commands.pop().callback(data);
		}
		*/
	};
	module.resolveOutputType = function (data, type, regexp) {
		switch(type){
			case "chat":
				module.outputType.chat(data, regexp);
				break;
			case "userLoggedIn":
				module.outputType.userLoggedIn(data, regexp);
				break;
		}
	};
	module.resolveStart = function (data) {
		// Check start state
		var check = data.match(module.type.startupRegExp[module.starting][0]);
		if(check != null){
			// Next startup step
			module.starting++;
			
			// Check if server started
			if(module.starting == module.type.startupRegExp.length){
				// Check if we have time data
				if(module.type.startupRegExp[module.starting-1][1] == "DONE_TIME"){
					console.log(module.info.tag() + " Server started (" + check[1] + ").");
					module.type.commandSilence("say", "[" + module.tools.date.getReadable() + "] Server started (" + check[1] + ").");
				}
				// No time data
				else{
					console.log(module.info.tag() + " Server started.");
					module.type.commandSilence("say", "[" + module.tools.date.getReadable() + "] Server started.");
				}

				// Change State
				module.state = "RUNNING";
				module.resolve = module.resolveData;
				module.starting = -1;
			}

		}
		
	};

	module.tools = {
		date : {
			getReadable : function () {
				var date = module.tools.date.getArray();
				return (date[2]+"/"+date[1]+"/"+date[0]+" "+date[3]+":"+date[4]+":"+date[5]);
			},
			getHash : function () {
				var date = module.tools.date.getArray();
				return (date[2]+""+date[1]+""+date[0]+""+date[3]+""+date[4]+""+date[5]);
			},
			getArray : function () {
				var date = new Date();

				var hour = date.getHours();
				hour = (hour < 10 ? "0" : "") + hour;

				var min  = date.getMinutes();
				min = (min < 10 ? "0" : "") + min;

				var sec  = date.getSeconds();
				sec = (sec < 10 ? "0" : "") + sec;

				var year = date.getFullYear();

				var month = date.getMonth() + 1;
				month = (month < 10 ? "0" : "") + month;

				var day  = date.getDate();
				day = (day < 10 ? "0" : "") + day;

				return [year, month, day, hour, min, sec];
			}
		}
	}

	module.outputType = {
		chat : function (data, regexp) {
			//console.log("--> ", regexp);
		},

		userLoggedIn : function (data, regexp) {
			var user = regexp[2];
			//console.log("[userLoggedIn "+user+"]");
			//var location = {}

			// Load User Cache file
			var usercache = fs.readFileSync(module.config.craft.data + "usercache.json").toString();
			usercache = JSON.parse(usercache);
			// Get uuid
			var uuid = false;
			for (var i = usercache.length - 1; i >= 0; i--) {
				if(usercache[i].name == user && usercache[i].uuid){
					uuid = usercache[i].uuid;
					break;
				}
			}

			var xp = 0;
			var level = 0;
			var score = 0;

			if(uuid){
				//module.type.commandSilence("tellraw", "@p[name=" + user + "]", '{"text":"Your uuid is ' + uuid + '","color":"gray"}');
				
				var path = module.config.craft.data + "world\\playerdata\\"+uuid+".dat";
				try {
					fs.accessSync(path, fs.F_OK);
					// Do something
					// NBT decoded object
					// if needed the data will be unzipped
					var nbtObj = nbt.decodeFile(path);
					var user_data = nbtObj.toJson();
					
					xp = nbtObj.getByQuery("XpTotal", user_data);
					if(xp == null) xp = 0;

					level = nbtObj.getByQuery("XpLevel", user_data);
					if(level == null) level = 0;

					score = nbtObj.getByQuery("Score", user_data);
					if(score == null) score = 0;


				} catch (e) {
					xp = 0;
					level = 0;
					score = 0;
				}
			}

			// Display Message after 1 sec
			setTimeout(function(){
				// Say Welcome to player on chat
				module.type.commandSilence("tellraw", "@p[name=" + user + "]", '{"text":"Welcome back ' + user + '","color":"gray"}');
				// Display player's info to the player
				module.type.commandSilence("tellraw", "@p[name=" + user + "]", '{"text":"Level ' + level + ' - Xp ' + xp + ' - Score ' + score + '","color":"gray"}');

				// Say Welcome to player on screen
				module.type.commandSilence("title", "@p[name=" + user + "]", "subtitle", '{"text":"Level ' + level + ' - Xp ' + xp + ' - Score ' + score + '"}');
				// Display player's info to the player
				module.type.commandSilence("title", "@p[name=" + user + "]", "title", '{text:"Welcome ",extra:[{text:"' + user + '",italic:true}]}');
			}, 1000);
		}
	}

	return module;
};





/*

	var web_commands = [];
	var chunck_command = "";
	var resolveData = function(data){
		var commands = data.split("\n");
		for(var i=0; i<commands.length; i++){
			// Check chat
			var chat = commands[i].match(SERVER_CHAT_REGEXP);
			if(chat != null){
				// If custom command
				if(chat[3][0] == "%")
					custom_commands(chat[3], chat[2]);
			}
		}
		if(web_commands.length>0){
			web_commands.pop().callback(data);
		}
	}

	var execute_command = function(cmd, callback){
		web_commands.push({
			command : cmd,
			callback : callback
		});
		process.stdout.write("[WebTools] [Command] "+cmd);
		minecraft.stdin.write(cmd);
	}







// Minecraft run
var minecraft = false;
minecraft = child.spawn(minecraft_info.program, minecraft_info.parameters, {cwd : minecraft_info.data});

minecraft.stdout.on('data', function(data){
	var data = data.toString();
	process.stdout.write(data);
	resolveData(data);
});
minecraft.stderr.on('data', function(data){
	var data = data.toString();
	process.stdout.write(data);
});
minecraft.on('close', function(code){
	minecraft = false;
	console.log('[WebTools] Minecraft closed (' + code.toString() + ')');
});
minecraft.stdin.setEncoding('utf-8');

process.stdin.pipe(minecraft.stdin);

setTimeout(function(){
	
	var command_say = (config.server.type!="bukkit")?"/say ":"say";
	minecraft.stdin.write(command_say+'Started.\n');
	console.log('Flush');
}, 5000);

*/
