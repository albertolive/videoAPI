var _ = require('underscore');

Parse.Cloud.job('vimeo', function(request, status) {
	Parse.Cloud.httpRequest({
	  url: 'https://api.vimeo.com/me/videos',
	  headers: {
	    'Content-Type': 'application/vnd.vimeo.video+json'
	  },
	  params: {
	  	'access_token': '5e32ecbfff92f594092cefc20cb6c929',
	  	'per_page': 1,
	  	'sort': 'plays'
	  },
	  success: function(httpResponse) {
	  	console.log("prova " + httpResponse.text.total);
	  	//var Vimeo = Parse.Object.extend("vimeo");
		var prom = _.map(httpResponse.data, function(singleItem){
			console.log("prova " + singleItem);
			// var query = new Parse.Query("vimeo");
		 //  	query.equalTo('externalId', singleItem.contentDetails.upload.videoId)
			// return query.first().then(function(foundedYoutube) {

			// 	if(foundedYoutube){
			// 		return foundedYoutube.save();
			// 	}else{
			// 		var vimeoObject = new Vimeo();
			//   		youtubeObject.set('externalId', singleItem.contentDetails.upload.videoId);
			// 		return youtubeObject.save();
			// 	}
			// });
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

// Parse.Cloud.afterSave("vimeo", function(request) {
// 		var query = new Parse.Query("youtube");
// 		query.get(request.object.id).then(function(youtubeObject) {

// 		Parse.Cloud.httpRequest({
// 		  url: 'https://www.googleapis.com/youtube/v3/videos/',
// 		  params: {
// 		  	'part': 'statistics,snippet',
// 		  	'id': youtubeObject.get('externalId'),
// 		  	'maxResults': 50,
// 		  	'key': 'AIzaSyAN4CHpB3th3FJ0hhhtI5YjGXyD4tw847k'
// 		  },
// 		  success: function(httpResponse) {
// 		  	if(youtubeObject.get('title') === undefined){
// 		  		youtubeObject.set("title", httpResponse.data.items[0].snippet.title);
// 	      		youtubeObject.set("publishedAt", httpResponse.data.items[0].snippet.publishedAt);
// 		  	}
// 	  	  	youtubeObject.set("plays", parseInt(httpResponse.data.items[0].statistics.viewCount));
// 	  		// save all the newly created objects
// 		    youtubeObject.save();
// 		  },
// 		  error: function(httpResponse) {
// 		    console.error('Request failed with response code ' + httpResponse.status);
// 		  }
// 		});
// 	});
// });

// Parse.Cloud.define('vimeoPlays', function(request, request) {
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