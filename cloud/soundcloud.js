var _ = require('underscore');

Parse.Cloud.job('soundcloud', function(request, status) {
	Parse.Cloud.httpRequest({
	  url: 'https://api.soundcloud.com/users/827566/tracks/',
	  params: {
	  	'client_id': '53af733efcdd4d7055d576217b95752a'
	  },
		success: function(httpResponse) {
			var Soundcloud = Parse.Object.extend("soundcloud");
			var prom = _.map(httpResponse.data, function(singleItem) {
				//console.log(singleItem.created_at);
				var soundcloudObject = new Soundcloud();
				soundcloudObject.set('externalId', singleItem.id);
				soundcloudObject.set('title', singleItem.title);
				soundcloudObject.set('publishedAt', singleItem.created_at);
				soundcloudObject.set('plays', parseInt(singleItem.playback_count));
				soundcloudObject.save();
			});
			Parse.Promise.when(prom).then(function() {
		  		status.success();
		  	});
		  },
		  error: function(httpResponse) {
		  	status.error(httpResponse);
		    console.error('Request failed with response code ' + httpResponse.status);
		  }
	});
});

// Parse.Cloud.define('soundCloudPlays', function(request, request) {
// 	var query = new Parse.Query("youtube");
// 	query.find().then(function(youtubeCollection) {
// 		var results = [];
// 		_.each(youtubeCollection, function(singleYoutubeObject){
// 			var obj = {
// 				title: singleYoutubeObject.get('title'),
// 				plays: singleYoutubeObject.get('plays')
// 			}
// 			results.push(obj);
// 		});

// 		request.success(results);
// 	});
// });