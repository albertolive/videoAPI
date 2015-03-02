var _ = require('underscore');

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
	  	var Youtube = Parse.Object.extend("youtube");
		var prom = _.map(httpResponse.data.items, function(singleItem){

			var query = new Parse.Query("youtube");
		  	query.equalTo('externalId', singleItem.contentDetails.upload.videoId)
			return query.first().then(function(foundedYoutube) {

				if(foundedYoutube){
					return foundedYoutube.save();
				}else{
					var youtubeObject = new Youtube();
			  		youtubeObject.set('externalId', singleItem.contentDetails.upload.videoId);
					return youtubeObject.save();
				}
			});
		});

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

Parse.Cloud.afterSave("youtube", function(request) {
		var query = new Parse.Query("youtube");
		query.get(request.object.id).then(function(youtubeObject) {

		Parse.Cloud.httpRequest({
		  url: 'https://www.googleapis.com/youtube/v3/videos/',
		  params: {
		  	'part': 'statistics,snippet',
		  	'id': youtubeObject.get('externalId'),
		  	'maxResults': 50,
		  	'key': 'AIzaSyAN4CHpB3th3FJ0hhhtI5YjGXyD4tw847k'
		  },
		  success: function(httpResponse) {
		  	if(youtubeObject.get('title') === undefined){
		  		youtubeObject.set("title", httpResponse.data.items[0].snippet.title);
	      		youtubeObject.set("publishedAt", httpResponse.data.items[0].snippet.publishedAt);
		  	}
	  	  	youtubeObject.set("plays", parseInt(httpResponse.data.items[0].statistics.viewCount));
	  		// save all the newly created objects
		    youtubeObject.save();
		  },
		  error: function(httpResponse) {
		    console.error('Request failed with response code ' + httpResponse.status);
		  }
		});
	});
});

Parse.Cloud.define('videoPlays', function(request, request) {
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