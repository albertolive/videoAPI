
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
// Parse.Cloud.define("hello", function(request, response) {
//   response.success("Hello world!");
// });

Parse.Cloud.job('video', function(request, status) {
	Parse.Cloud.httpRequest({
	  url: 'https://www.googleapis.com/youtube/v3/activities/',
	  params: {
	  	'part': 'contentDetails',
	  	'channelId': 'UCQHwCPItWeOJMx5_NWY1y_g',
	  	'maxResults': 50,
	  	'key': 'AIzaSyAN4CHpB3th3FJ0hhhtI5YjGXyD4tw847k'
	  },
	  success: function(httpResponse) {
	  	var prom = [];
	  	for (var i = httpResponse.data.items.length - 1; i >= 0; i--) {
	  		// console.log(httpResponse.data.items[i].contentDetails.upload.videoId);
	  		prom.push(myFunction(httpResponse.data.items[i].contentDetails.upload.videoId));
	  	};

		//status.success(httpResponse);
	  	Parse.Promise.when(prom).then(function() {
	  		status.success();
	  	});
	  },
	  error: function(httpResponse) {
	  	status.error(err);
	    console.error('Request failed with response code ' + httpResponse.status);
	  }
	});
});


var myFunction = function(request){
 return Parse.Cloud.httpRequest({
	  url: 'https://www.googleapis.com/youtube/v3/videos/',
	  params: {
	  	'part': 'statistics',
	  	'id': request,
	  	'key': 'AIzaSyAN4CHpB3th3FJ0hhhtI5YjGXyD4tw847k'
	  },
	  success: function(httpResponse) {
	  	console.log("text: " + httpResponse.data.items[0].statistics.viewCount);
	  },
	  error: function(httpResponse) {
	    console.error('Request failed with response code ' + httpResponse.status);
	  }
	})
};