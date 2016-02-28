/*
 * DinoCraftTools
 * Copyright (c) DinoDevs
 *
 * Ajax Script
 */

// Load Required Modules
	// HTTP module
	const http = require('http');

// Export ajax
module.exports = (function(){
	// Private methods
	var _ajax = {
		resolveUrl : function(url){
			// Reg Exp pattern
			// http://stackoverflow.com/questions/27745/getting-parts-of-a-url-regex
			var pattern = new RegExp(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
			var resolve = url.match(pattern);
			
			return {
				href: url,
				protocol: resolve[2],
				host: resolve[3],
				path: (resolve[4])?resolve[4]:'',
				file: (resolve[6])?resolve[6]:'',
				query: (resolve[7])?resolve[7]:'',
				hash: (resolve[8])?resolve[8]:'',
				path: ((resolve[4])?resolve[4]:'')+((resolve[6])?resolve[6]:'')+((resolve[7])?resolve[7]:'')+((resolve[8])?resolve[8]:'')
			}
		}
	};
	
	var ajax = function(settings){
		// Settings
		var url = _ajax.resolveUrl(settings.url);
		
		// Request Options
		var request_options = {
			host: url.host,
			port: (settings.port)?settings.port:80,
			path: url.path,
			agent: false
		};
		
		if(settings.headers){
			request_options.headers = settings.headers;
		}
		
		// Request actions
		var request_callback = function(response){
			// Page Variable
			var page = '';

			// Construct page chunk by chunk
			response.on('data', function (chunk){
				page += chunk;
			});

			// Request Complete
			response.on('end', function(){
				// Report back
				if(typeof settings.callback != 'undefined')
					settings.callback(response, page);
			});
		}
		
		// Sent Request
		var xhr = http.request(request_options, request_callback);
		xhr.on('error', function(e){
			// Report back
			if(typeof settings.callbackError != 'undefined')
				settings.callbackError(page);
		});
		xhr.on('socket', function(socket){
			socket.setTimeout(10000);  
			socket.on('timeout', function(){
				xhr.abort();
				// Report back
				if(typeof settings.callbackError != 'undefined')
					settings.callbackError();
			});
		});
		xhr.end();
	};
	
	return ajax;
})();