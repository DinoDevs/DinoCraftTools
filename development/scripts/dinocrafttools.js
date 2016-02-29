/*
 * DinoCraftTools
 * Copyright (c) DinoDevs
 *
 * Boot Script
 */

// Load Required Modules
	// --

	// Link stderror to stdout
	process.stdout = process.stderr;


// Load Info
	const info = require(__dirname + '/informations');
	console.log(info.header() + "\n");


// Initiate Data
	const config = require(__dirname + '/configurations');
	if(!config.craft) process.exit(0);
	else console.log(info.tag() + " Configs loaded.");


// Server types
	var serverType = require(__dirname + '/servertype')(config.craft.type, info);


// Web Pages
	var pages = (config.server.active)? require(__dirname + '/webpages')(config.server.preload) : {};
	if(config.server.active)
		console.log(info.tag() + " Pages loaded.");


// Webserver
	var webserver = (config.server.active)? require(__dirname + '/webserver')() : {};
	if(config.server.active){
		// Attach database
		webserver.database = config.server.admins;
		// Attach pages
		webserver.pages = pages;
		// Create Server
		webserver.create();

		webserver.start(config.server.port, config.server.ip);

		// Display message
		//console.log(info.tag() + " Webserver started.");
	}


// CraftProcess
	var craft = require(__dirname + '/craftprocess')();
	craft.info = info;
	craft.config = config;
	craft.type = serverType;
	craft.init(config.craft);




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



// Listen on port
	server.listen(config.server.port);
	// Report Server Up
	console.log("[WebTools] Running at port " + config.server.port);

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


// Ajax
	const ajax = require('ajax');


var joke = function(){
	//console.log("[WebTools] [Command] Joke_Command");
	var command_say = (config.server.type!="bukkit")?"/say ":"say ";
	new ajax({
		url : "http://api.icndb.com/jokes/random",
		callback : function(xhr, response){
			try{
				var json = JSON.parse(response);
				if(json.value.joke)
					minecraft.stdin.write(command_say+unescapeHtml(json.value.joke)+'\n');
				else
					minecraft.stdin.write(command_say+' Sorry, I have no Jokes. [3]\n');
			}catch(e){
				minecraft.stdin.write(command_say+'Sorry, I have no Jokes. [2]\n');
			}
		},
		callbackError : function(){
			minecraft.stdin.write(command_say+'Sorry, I have no Jokes. [1]\n');
		}
	});
}

var give_godsword = function(user){
	minecraft.stdin.write('/give '+user+' diamond_sword 1 0 {display:{Name:"God Sword",Lore:["SUPER OP!","Made by: DinoDevs"]},AttributeModifiers:[{AttributeName:"generic.maxHealth",Name:"generic.maxHealth",Amount:100,Operation:0,UUIDMost:46855,UUIDLeast:177713},{AttributeName:"generic.attackDamage",Name:"generic.attackDamage",Amount:9999999,Operation:0,UUIDMost:12947,UUIDLeast:132759}],Unbreakable:1}\n');
}

var give_godchest = function(user){
	minecraft.stdin.write('/give '+user+' leather_chestplate 1 0 {display:{Name:"Double Op Dirt Chestplate",Lore:["SUPER DUPER OP","Made by:Dinodevs"]},AttributeModifiers:[{AttributeName:"generic.maxHealth",Name:"generic.maxHealth",Amount:25,Operation:0,UUIDMost:85425,UUIDLeast:209538},{AttributeName:"generic.attackDamage",Name:"generic.attackDamage",Amount:99999999,Operation:0,UUIDMost:12748,UUIDLeast:376447}],ench:[{id:7,lvl:255}],Unbreakable:1}\n');
}

var custom_commands = function(data, user){
	console.log("[WebTools] [Command] <"+user+"> "+data);

	command = data.match(/%([\S]+)\s*([\S\s]*)$/);
	switch(command[1]){
		case "joke": joke();break;
		case "god_sword":give_godsword(user);break;
		case "god_chest":give_godchest(user);break
		case "version":
			minecraft.stdin.write("/say /*\n");
			minecraft.stdin.write("/say * " + info.name + " " + info.version+"\n");
			minecraft.stdin.write("/say * " + "by " + info.developer+"\n");
			minecraft.stdin.write("/say *\n");
			break;
	}
}

function unescapeHtml(text) {
	var map = {
		"&quot;" : '"',
		"&apos;" : "'",
		"&amp;" : "&",
		"&lt;" : "<",
		"&gt;" : ">",
		"&nbsp;" : " ",
		"&iexcl;" : "¡",
		"&cent;" : "¢",
		"&pound;" : "£",
		"&curren;" : "¤",
		"&yen;" : "¥",
		"&brvbar;" : "¦",
		"&sect;" : "§",
		"&uml;" : "¨",
		"&copy;" : "©",
		"&ordf;" : "ª",
		"&laquo;" : "«",
		"&not;" : "¬",
		"&reg;" : "®",
		"&macr;" : "¯",
		"&deg;" : "°",
		"&plusmn;" : "±",
		"&sup2;" : "²",
		"&sup3;" : "³",
		"&acute;" : "´",
		"&micro;" : "µ",
		"&para;" : "¶",
		"&middot;" : "·",
		"&cedil;" : "¸",
		"&sup1;" : "¹",
		"&ordm;" : "º",
		"&raquo;" : "»",
		"&frac14;" : "¼",
		"&frac12;" : "½",
		"&frac34;" : "¾",
		"&iquest;" : "¿",
		"&times;" : "×",
		"&divide;" : "÷",
		'&#039;' : "'"
	};

	return text.replace(/(&quot;|&apos;|&amp;|&lt;|&gt;|&nbsp;|&iexcl;|&cent;|&pound;|&curren;|&yen;|&brvbar;|&sect;|&uml;|&copy;|&ordf;|&laquo;|&not;|&reg;|&macr;|&deg;|&plusmn;|&sup2;|&sup3;|&acute;|&micro;|&para;|&middot;|&cedil;|&sup1;|&ordm;|&raquo;|&frac14;|&frac12;|&frac34;|&iquest;|&times;|&divide;)/g, function(m) { return map[m]; });
}

*/
