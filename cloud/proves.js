
Parse.Cloud.define("vimeo", function(request, response) {
	Parse.Cloud.httpRequest({
	  url: 'https://api.vimeo.com/',
	  headers: {
	    'Content-Type': 'application/vnd.vimeo.video+json'
	  },
	  params: {
	  	'access_token': '5e32ecbfff92f594092cefc20cb6c929'
	  },
	  success: function(httpResponse) {
	  	console.log("text: " + httpResponse);
	  	// for (var i = httpResponse.data.items.length - 1; i >= 0; i--) {
	  	// 	console.log(httpResponse.data.items[i].id);
	  	// };
	  	response.success(httpResponse);
	  },
	  error: function(httpResponse) {
	  	response.error(err);
	    console.error('Request failed with response code ' + httpResponse.status);
	  }
	}).then(function(request, response) {
		console.log(response)
		// Parse.Cloud.httpRequest({
		//   url: 'https://www.googleapis.com/youtube/v3/videos/',
		//   params: {
		//   	'part': 'statistics',
		//   	'id': request,
		//   	'key': 'AIzaSyAN4CHpB3th3FJ0hhhtI5YjGXyD4tw847k'
		//   },
		//   success: function(httpResponse) {
		//   	console.log("text: " + httpResponse.data.items);
		//   	for (var i = httpResponse.data.items.length - 1; i >= 0; i--) {
		//   		console.log(httpResponse.data.items[i].id);
		//   	};
		//   	response.success(httpResponse);
		//   },
		//   error: function(httpResponse) {
		//   	response.error(err);
		//     console.error('Request failed with response code ' + httpResponse.status);
		//   }
		// })
	})
});