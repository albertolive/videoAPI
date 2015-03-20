var _ = require('underscore');

Parse.Cloud.job('vimeo', function(request, status) {
	Parse.Cloud.httpRequest({
	  url: 'https://api.vimeo.com/users/17211520/videos',
	  headers: {
	    'Content-Type': 'application/json',
	    'Accept': 'application/vnd.vimeo.video+json'
	  },
	  params: {
	  	'access_token': '5e32ecbfff92f594092cefc20cb6c929',
	  	'per_page': '50'
	  },
	  success: function(httpResponse) {
	  	var getData = JSON.parse(httpResponse.text);
	  	var Vimeo = Parse.Object.extend('vimeo');

		var prom = _.map(getData.data, function(singleItem){
			var query = new Parse.Query('vimeo');
		  	query.equalTo('externalId', singleItem.uri)
			return query.first().then(function(foundedVimeo) {

				if(foundedVimeo){
					return foundedVimeo.save();
				}else{
					return Parse.Promise.when(getLastVideo.calculate()).then(function(testValue){
						var vimeoObject = new Vimeo();

				  		vimeoObject.set('externalId', singleItem.uri);
				  		vimeoObject.set('vimeoId', newVideoId);

						return vimeoObject.save();
					});
				}
			});
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

Parse.Cloud.afterSave("vimeo", function(request) {
		var query = new Parse.Query('vimeo');
		query.get(request.object.id).then(function(vimeoObject) {

		Parse.Cloud.httpRequest({
		  url: 'https://api.vimeo.com/users/17211520/videos',
		  headers: {
		    'Content-Type': 'application/json',
		    'Accept': 'application/vnd.vimeo.video+json'
		  },
		  params: {
		  	'access_token': '5e32ecbfff92f594092cefc20cb6c929',
		  	'per_page': '50'
		  },
		  success: function(httpResponse) {
		  	var getData = JSON.parse(httpResponse.text);

		  	_.map(getData.data, function(singleItem) {
		  		if (vimeoObject.get('externalId') == singleItem.uri) {
				  	if (vimeoObject.get('title') === undefined) {
				  		vimeoObject.set("title", singleItem.name);
			      		vimeoObject.set("publishedAt", singleItem.created_time);
				  	}
				  	if (vimeoObject.get('plays') !== parseInt(singleItem.stats.plays)) {
				  		vimeoObject.set('plays', parseInt(singleItem.stats.plays));
				  	}
			    	vimeoObject.save();
			    }
		    });
		  },
		  error: function(httpResponse) {
		    console.error('Request failed with response code ' + httpResponse.status);
		  }
		});
	});
});

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