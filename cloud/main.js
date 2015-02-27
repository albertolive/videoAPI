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
	  	'part': 'statistics,snippet',
	  	'id': request,
	  	'maxResults': 50,
	  	'key': 'AIzaSyAN4CHpB3th3FJ0hhhtI5YjGXyD4tw847k'
	  },
	  success: function(httpResponse) {
	  	// console.log("Title: " + httpResponse.data.items[0].snippet.title);
	  	// console.log("Views: " + httpResponse.data.items[0].statistics.viewCount);

		var Youtube = Parse.Object.extend("youtube");
		var saveArray = [];
      	var youtube = new Youtube();

      	youtube.set("title", httpResponse.data.items[0].snippet.title);
      	youtube.set("publishedAt", httpResponse.data.items[0].snippet.publishedAt);
  	  	youtube.set("plays", parseInt(httpResponse.data.items[0].statistics.viewCount));
      	saveArray.push(youtube);

      		Parse.Promise.when(saveArray).then(function() {
		  		// save all the newly created objects
			    Parse.Object.saveAll(saveArray, {
			        success: function(objs) {
			            alert('New object created with objectId: ' + youtube.id);
			        },
			        error: function(error) {
			            alert('Failed to create new object, with error code: ' + error.message);
			        }
			    });
  			});
	  },
	  error: function(httpResponse) {
	    console.error('Request failed with response code ' + httpResponse.status);
	  }
	})
};