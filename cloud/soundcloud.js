var _ = require('underscore');

Parse.Cloud.job('soundcloud', function(request, status) {
	Parse.Cloud.httpRequest({
	  url: 'https://api.soundcloud.com/users/827566/tracks/',
	  params: {
	  	'client_id': '53af733efcdd4d7055d576217b95752a'
	  },
		success: function(httpResponse) {
			// for (var i = 0; i < httpResponse.data.length; i++) {
			// 	console.log(httpResponse.data[i]);
			// };
			_.each(httpResponse.data.length, function(httpResponse){
				console.log(httpResponse.data);
			});
			status.success();
			// var query = new Parse.Query("soundcloud");
			// query.get(request.object.id).then(function(soundCloudObject) {
			//   	if(soundCloudObject.get('title') === undefined){
			//   		soundCloudObject.set("title", httpResponse.data.items[0].snippet.title);
		 //      		soundCloudObject.set("publishedAt", httpResponse.data.items[0].snippet.publishedAt);
			//   	}
		 //  	  	soundCloudObject.set("plays", parseInt(httpResponse.data.items[0].statistics.viewCount));
		 //  		// save all the newly created objects
			//     soundCloudObject.save();
		 //    }
		  },
		  error: function(httpResponse) {
		    console.error('Request failed with response code ' + httpResponse.status);
		  }
	});
});








Parse.Cloud.define('soundCloudPlays', function(request, request) {
	var query = new Parse.Query("youtube");
	query.find().then(function(youtubeCollection) {
		var results = [];
		_.each(youtubeCollection, function(singleYoutubeObject){
			var obj = {
				title: singleYoutubeObject.get('title'),
				plays: singleYoutubeObject.get('plays')
			}
			results.push(obj);
		});

		request.success(results);
	});
});