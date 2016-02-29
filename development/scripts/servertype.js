/*
 * DinoCraftTools
 * Copyright (c) DinoDevs
 *
 * Server Type Script
 */

module.exports = function (server_type, program_info) {
	var module = {};

	// Program info
	module.info = program_info;

	// Type info
	module.name = "";
	// Check type of server
	switch(server_type){
		case "bukkit":
			module.name = "Bukkit";
			break;

		case "vanila":
		default:
			module.name = "MineCraft";
			break;
	}

	// Vanila Minecraft Commands
	module.commands = {
		"achievement" : "/achievement", //Gives or removes an achievement from a player.
		"ban" : "/ban", //Adds player to banlist.
		"ban-ip" : "/ban-ip", //Adds IP address to banlist.
		"banlist" : "/banlist", //Displays banlist.
		"blockdata" : "/blockdata", //Modifies the data tag of a block.
		"clear" : "/clear", //Clears items from player inventory.
		"clone" : "/clone", //Copies blocks from one place to another.
		"debug" : "/debug", //Starts or stops a debugging session.
		"defaultgamemode" : "/defaultgamemode", //Sets the default game mode.
		"deop" : "/deop", //Revoke operator status from a player.
		"difficulty" : "/difficulty", //Sets the difficulty level.
		"effect" : "/effect", //Add or remove status effects.
		"enchant" : "/enchant", //Enchants a player item.
		"entitydata" : "/entitydata", //Modifies the data tag of an entity.
		"execute" : "/execute", //Executes another command.
		"fill" : "/fill", //Fills a region with a specific block.
		"gamemode" : "/gamemode", //Sets a player's game mode.
		"gamerule" : "/gamerule", //Sets or queries a game rule value.
		"give" : "/give", //Gives an item to a player.
		"help" : "/help", //Provides help for commands.
		"kick" : "/kick", //Kicks a player off a server.
		"kill" : "/kill", //Kills entities (players, mobs, items, etc.).
		"list" : "/list", //Lists players on the server.
		"me" : "/me", //Displays a message about yourself.
		"op" : "/op", //Grants operator status to a player.
		"pardon" : "/pardon", //Removes entries from the banlist.
		"particle" : "/particle", //Creates particles.
		"playsound" : "/playsound", //Plays a sound.
		"publish" : "/publish", //Opens single-player world to local network.
		"replaceitem" : "/replaceitem", //Replaces items in inventories.
		"save-all" : "/save-all", //Saves the server to disk.
		"save-off" : "/save-off", //Disables automatic server saves.
		"save-on" : "/save-on", //Enables automatic server saves.
		"say" : "/say", //Displays a message to multiple players.
		"scoreboard" : "/scoreboard", //Manages objectives, players, and teams.
		"seed" : "/seed", //Displays the world seed.
		"setblock" : "/setblock", //Changes a block to another block.
		"setidletimeout" : "/setidletimeout", //Sets the time before idle players are kicked.
		"setworldspawn" : "/setworldspawn", //Sets the world spawn.
		"spawnpoint" : "/spawnpoint", //Sets the spawn point for a player.
		"spreadplayers" : "/spreadplayers", //Teleports entities to random locations.
		"stats" : "/stats", //Update objectives from command results.
		"stop" : "/stop", //Stops a server.
		"summon" : "/summon", //Summons an entity.
		"tell" : "/tell", //Displays a private message to other players.
		"tellraw" : "/tellraw", //Displays a JSON message to players.
		"testfor" : "/testfor", //Counts entities matching specified conditions.
		"testforblock" : "/testforblock", //Tests whether a block is in a location.
		"testforblocks" : "/testforblocks", //Tests whether the blocks in two regions match.
		"time" : "/time", //Changes or queries the world's game time.
		"title" : "/title", //Manages screen titles.
		"toggledownfall" : "/toggledownfall", //Toggles the weather.
		"tp" : "/tp", //Teleports entities.
		"trigger" : "/trigger", //Sets a trigger to be activated.
		"weather" : "/weather", //Sets the weather.
		"whitelist" : "/whitelist", //Manages server whitelist.
		"worldborder" : "/worldborder", //Manages the world border.
		"xp" : "/xp" //Adds or removes player experience.
	};

	// Check type of server
	switch(server_type){
		case "bukkit":
			// Remove "/" infrond of commands
			for(var i in module.commands)
				module.commands[i] = module.commands[i].substr(1);
			break;

		case "vanila":
		default:
			break;
	}

	// Output
	module.startupRegExp = [];
	module.outputRegExp = {};
	module.output = [];

	// Check type of server
	switch(server_type){

		// Bukkit Minecraft Server
		case "bukkit":
			// Start up
			module.startupRegExp = [
				[new RegExp(/\[\d+:\d+:\d+ INFO\]: Starting minecraft server version (\d+\.\d+\.\d+)/i), "VERSION"],
				[new RegExp(/\[\d+:\d+:\d+ INFO\]: Loading properties/i), "PROPERTIES"],
				[new RegExp(/\[\d+:\d+:\d+ INFO\]: Default game type: (\w+)/i), "GAMETYPE"],
				[new RegExp(/\[\d+:\d+:\d+ INFO\]: Generating keypair/i), "KEYPAIR"],
				[new RegExp(/\[\d+:\d+:\d+ INFO\]: Starting Minecraft server on \*:(\d+)/i), "PORT"],
				[new RegExp(/\[\d+:\d+:\d+ INFO\]: This server is running (CraftBukkit .+)/i), "BUKKIT_VERSION"],
				[new RegExp(/\[\d+:\d+:\d+ INFO\]: Done \(([^\)]+)\)! For help, type "help" or "\?"/i), "DONE_TIME"]
			];
			
			// Chat Match
			module.outputRegExp.chat = {
				type : "chat",
				regexp : new RegExp(/\[(\d+:\d+:\d+) INFO\]: <([^>]+)> ([\S\s]*)$/i)
			};
			module.output.push(module.outputRegExp.chat);

			// Log in Match
			module.outputRegExp.userLoggedIn = {
				type : "userLoggedIn",
				regexp : new RegExp(/\[(\d+:\d+:\d+) INFO\]: ([^\[]+)\[\/([^\]]+)\] logged in with entity id (\d+) at \((\[[^\]]+\]|)(-*\d+\.*\d*), (-*\d+\.*\d*), (-*\d+\.*\d*)\)$/i)
			};
			module.output.push(module.outputRegExp.userLoggedin);

			break;

		// Vanila Minecraft Server
		case "vanila":
		default:
			// Start up
			module.startupRegExp = [
				[new RegExp(/\[\d+:\d+:\d+\] \[Server thread\/INFO\]: Starting minecraft server version (\d+\.\d+\.\d+)/i), "VERSION"],
				[new RegExp(/\[\d+:\d+:\d+\] \[Server thread\/INFO\]: Loading properties/i), "PROPERTIES"],
				[new RegExp(/\[\d+:\d+:\d+\] \[Server thread\/INFO\]: Default game type: (\w+)/i), "GAMETYPE"],
				[new RegExp(/\[\d+:\d+:\d+\] \[Server thread\/INFO\]: Generating keypair/i), "KEYPAIR"],
				[new RegExp(/\[\d+:\d+:\d+\] \[Server thread\/INFO\]: Starting Minecraft server on \*:(\d+)/i), "PORT"],
				[new RegExp(/\[\d+:\d+:\d+\] \[Server thread\/INFO\]: Done \(([^\)]+)\)! For help, type "help" or "\?"/i), "DONE_TIME"]
			];
			// Chat Match
			module.outputRegExp.chat = {
				type : "chat",
				regexp : new RegExp(/\[(\d+:\d+:\d+)\] \[Server thread\/INFO\]: <([^>]+)> ([\S\s]*)$/i)
			};
			module.output.push(module.outputRegExp.chat);

			// Log in Match
			module.outputRegExp.userLoggedIn = {
				type : "userLoggedIn",
				regexp : new RegExp(/(\[\d+:\d+:\d+\]) \[Server thread\/INFO\]: ([^\[]+)\[\/([^\]]+)\] logged in with entity id (\d+) at \((\[[^\]]+\]|)(-*\d+\.*\d*), (-*\d+\.*\d*), (-*\d+\.*\d*)\)$/i)
			};
			module.output.push(module.outputRegExp.userLoggedin);

			break;
	}

	module.process = null;
	module.getSyntax = function(list){
		// Construct command
		var syntax = module.commands[list[0]];
		for (var i=1; i<list.length; i++) {
			syntax += " " + list[i];
		}

		return syntax;
	};
	module.command = function(){
		// Check valid input
		if(arguments.length == 0)
			return false;

		// Check if command exist
		if(!module.commands[arguments[0]])
			return false;

		// Construct command
		var syntax = module.getSyntax(arguments);

		// Display command
		console.log(module.info.tag() + " [Excecute] " + syntax);
		// Execute command
		module.process.stdin.write(syntax + "\n");
	};
	module.commandSilence = function(){
		// Check valid input
		if(arguments.length == 0)
			return false;

		// Check if command exist
		if(!module.commands[arguments[0]])
			return false;

		// Construct command
		var syntax = module.getSyntax(arguments);

		// Execute command
		module.process.stdin.write(syntax + "\n");
	};

	return module;
};
