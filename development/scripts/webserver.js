/*
 * DinoCraftTools
 * Copyright (c) DinoDevs
 *
 * Web Server Script
 */

// Load Required Modules
	// HTTP module
	const http = require('http');
	// URL resolver module
	const urlResolve = require('url');
	// Cryptografy module
	const crypto = require('crypto');

// Module
module.exports = function () {
	var module = {};

	// Initiate Server
	module.server = false;
	module.sessions = {};
	module.actions = {};

	// Data pointers
	module.database = false;
	module.pages = false;

	// Webserver Tools
	module.tools = {
		// Cookies Tools
		cookies : {
			parse : function(request){
				// List of Cookies
				var list = {};
				// Request Cookies
				var rc = request.headers.cookie;
				rc && rc.split(';').forEach(function(cookie){
					// Parse parts
					var parts = cookie.split('=');
					// Save parts
					list[parts.shift().trim().toLowerCase()] = decodeURI(parts.join('='));
				});
				// Return List
				return list;
			}
		},

		// Queries Tools
		queries : {
			parse : function(url){
				// List of Cookies
				var list = {};
				// Request Cookies
				var rc = url.query;
				rc && rc.split('&').forEach(function(data){
					// Parse parts
					var parts = data.split('=');
					// Save parts
					list[parts.shift().trim()] = decodeURI(parts.join('='));
				});
				// Return List
				return list;
			}
		},

		// Request Tools
		request : {
			isFile : function(url){
				if(url.pathname.match(/\.\w{2,4}/i) != null)
					return true;
				return false;
			},

			isLoggedIn : function(cookies){
				if(cookies["jssession"])
					return true;
				return false;
			},

			getSession : function(cookies){
				// Get Hash
				var hash = cookies["jssession"];

				// Check if hash is valid
				if(module.sessions[hash] && Date.now() - module.sessions[hash].time < 5*60*1000){
					// Update session time
					module.sessions[hash].time = Date.now();
					// Return session
					return module.sessions[hash];
				}

				// Session not valid
				delete module.sessions[hash];
				return false;
			},

			delSession : function(cookies){
				// Get Hash
				var hash = cookies["jssession"];
				// Session valid
				if(module.sessions[hash]){
					delete module.sessions[hash];
					return true;
				}
				// Session not valid
				return false;
			}
		},

		// Authorize
		authorize : {
			user : function(username, password){
				// Check credentials
				if(module.database[username] && module.database[username] == password){

					// Generate token
					var token;
					do{
						token = crypto.randomBytes(32).toString('hex');
					}while(module.sessions[token]);

					// Set a session
					module.sessions[token] = {
						hash : token,
						user : username,
						time : Date.now()
					};

					// Return Session
					return module.sessions[token];
				}

				// Failed to auth user
				return false;
			}
		}

	};

	// Interact methods
	module.interact = {
		executeCommand : function(url, res){
			// Check if action is ready
			if(module.actions.execute){
				var command = decodeURIComponent(url.query);
				var callback = function(data){
					// Response
					res.headers["Content-Length"] = data.length;
					res.super.response.writeHead(res.code, res.headers);
					res.super.response.end(data);
				}

				module.actions.execute(command, callback);

				return true;
			}
			// Action not ready
			return true;
		}
	};

	module.loggedIn = {
		pages : {
			dashboard : function(res, url, cookies, session){
				res.content = module.pages.get("dashboard").replace("[%USER%]", session.user);
				return res;
			},

			command : function(res, url, cookies, session){
				if(module.interact.executeCommand(url, res))
					res.block = true;
				else
					res.content = '{"error":"Failed to execute command."}';
				
				return res;
			},

			logout : function(res, url, cookies, session){
				// Redirect
				res.headers["Location"] = "/login";
				res.code = 302;
				// Session end
				res.headers["Set-Cookie"] = "jssession=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
				module.tools.request.delSession(cookies);
				// No data
				res.content = false;

				return res;
			},

			redirect : function(res, location){
				// Redirect
				res.headers["Location"] = location;
				res.code = 302;
				res.content = false;

				return res;
			}
		},
		page : function(res, url, cookies, session){
			switch(url.pathname){
				
				case '/dashboard':
					res = module.loggedIn.pages.dashboard(res, url, cookies, session);
					break;

				case '/command':
					res = module.loggedIn.pages.command(res, url, cookies, session);
					break;

				case '/logout':
					res = module.loggedIn.pages.logout(res, url, cookies, session);
					break;

				default:
					res = module.loggedIn.pages.redirect(res, "/dashboard");
					break;
			}

			// Return
			return res;
		},
		response : function(res, url, cookies){
			// Get Session
			var session = module.tools.request.getSession(cookies);

			// If is valid
			if(session){
				res = module.loggedIn.page(res, url, cookies, session);
			}

			// Not valid session
			else{
				res = module.loggedIn.pages.logout(res, url, cookies, session);
			}

			return res;
		}
	};

	module.loggedOut = {
		pages : {
			login : function(res, url, cookies){
				// Check if user tries to login
				if(url._GET["username"] && url._GET["password"]){
					// Authorize user
					var session = module.tools.authorize.user(url._GET["username"], url._GET["password"]);
					
					// Successful auth
					if(session){
						// Set Cookie
						res.headers["Set-Cookie"] = "jssession=" + session.hash + "; path=/;";
						// Redirect
						res = this.redirect(res, "/dashboard");
					}

					// Falied to login
					else{
						res.content = module.pages.get("login").replace("[%MESSAGE%]","Invalid username or password.");
					}
				}

				// Sent Login page back
				else{
					res.content = module.pages.get("login").replace("[%MESSAGE%]","");
				}

				return res;
			},

			redirect : function(res, location){
				// Redirect
				res.headers["Location"] = location;
				res.code = 302;
				res.content = false;

				return res;
			}
		},
		page : function(res, url, cookies, session){
			switch(url.pathname){
				
				case '/login':
					res = module.loggedOut.pages.login(res, url, cookies);
					break;

				default:
					res = module.loggedOut.pages.redirect(res, "/login");
					break;
			}

			// Return
			return res;
		},
		response : function(res, url, cookies){
			res = module.loggedOut.page(res, url, cookies);
			return res;
		}
	};

	// Response
	module.response = function (request, response){
		// Resolve Url
		var url = urlResolve.parse(request.url);
		// Resolve Cookies
		var cookies = module.tools.cookies.parse(request);
		// Resolve Paremeters
		url._GET = module.tools.queries.parse(url);

		var res = {
			// Block responce
			block : false,
			// Response Headers
			headers : {"Content-Type": "text/html"},
			// Response Code
			code : 200,
			// Response Content
			content : "\n",

			// Real data
			super : {request : request, response : response}
		}

		// If this is a file request
		if(module.tools.request.isFile(url)){
			res.code = 404;
			res.content = "Page not found.";
		}

		// Check if logged in
		else if(module.tools.request.isLoggedIn(cookies)){
			res = module.loggedIn.response(res, url, cookies);
		}

		// Else if not logged in
		else{
			res = module.loggedOut.response(res, url, cookies);
		}


		// Response
		if(!res.block){
			// Response
			if(res.content)
				res.headers["Content-Length"] = res.content.length;
			else
				res.headers["Content-Length"] = 0;
			response.writeHead(res.code, res.headers);
			if(res.content){
				response.end(res.content);
			}else
				response.end();
		}
	};

	// Create Server
	module.create = function(){
		// Create Server
		module.server = http.createServer(function (request, response){
			// Server Handle
			module.response(request, response);
		});
	};

	// Start Server
	module.start = function(port, ip){
		module.server.listen(port, ip);
	};

	// Return
	return module;
};

/*
if (request.method == 'POST') {
	var body = '';

	request.on('data', function (data) {
		body += data;

		// Too much POST data, kill the connection!
		// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		if (body.length > 1e6)
			request.connection.destroy();
	});

	request.on('end', function () {
	var post = qs.parse(body);
	// use post['blah'], etc.
	});
}*/
