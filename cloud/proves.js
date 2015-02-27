
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
// Parse.Cloud.define("hello", function(request, response) {
//   response.success("Hello world!");
// });

Parse.Cloud.define("video", function(request, response) {
	Parse.Cloud.httpRequest({
	  url: 'https://www.googleapis.com/youtube/v3/activities/',
	  params: {
	  	'part': 'contentDetails',
	  	'channelId': 'UCQHwCPItWeOJMx5_NWY1y_g',
	  	'maxResults': 50,
	  	'key': 'AIzaSyAN4CHpB3th3FJ0hhhtI5YjGXyD4tw847k'
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