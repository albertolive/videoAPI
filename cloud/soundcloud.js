var _ = require('underscore');
var getLastVideo = require('cloud/lastVideoId.js');

Parse.Cloud.job('soundcloud', function(request, status) {
	Parse.Cloud.httpRequest({
	  url: 'https://api.soundcloud.com/users/827566/tracks/',
	  params: {
	  	'client_id': '53af733efcdd4d7055d576217b95752a'
	  },
		success: function(httpResponse) {
			var Soundcloud = Parse.Object.extend("soundcloud");
			var prom = _.map(httpResponse.data, function(singleItem) {
				var query = new Parse.Query("soundcloud");
				query.equalTo('externalId', singleItem.id)
				return query.first().then(function(foundedSoundcloud) {

					if(foundedSoundcloud){
						if (foundedSoundcloud.get('plays') !== parseInt(singleItem.playback_count)) {
							return foundedSoundcloud.save();
						} else {
							console.log('Soundcloud - no more plays with ' + foundedSoundcloud.get('title'));
						}
					}else{
						return Parse.Promise.when(getLastVideo.calculate()).then(function(newVideoId){
							var soundcloudObject = new Soundcloud();
				  			soundcloudObject.set('externalId', singleItem.id);
				  			soundcloudObject.set('soundCloudId', newVideoId);
				  			soundcloudObject.set('plays', 0);
							return soundcloudObject.save();
						});
					
					}
				});
			});
			Parse.Promise.when(prom).then(function() {
		  		status.success('success');
		  	});
		  },
		  error: function(httpResponse) {
		  	status.error(httpResponse);
		    console.error('Request failed with response code ' + httpResponse.status);
		  }
	});
});

Parse.Cloud.afterSave("soundcloud", function(request) {
	var query = new Parse.Query("soundcloud");
	query.get(request.object.id).then(function(soundcloudObject) {
		Parse.Cloud.httpRequest({
		 	url: 'https://api.soundcloud.com/users/827566/tracks/',
		 	params: {
		  		'client_id': '53af733efcdd4d7055d576217b95752a'
 			},
			success: function(httpResponse) {
				_.map(httpResponse.data, function(singleItem) {
					if (soundcloudObject.get('externalId') == singleItem.id) {
						if(soundcloudObject.get('title') === undefined){
							soundcloudObject.set('title', singleItem.title);
							soundcloudObject.set('publishedAt', singleItem.created_at);
							soundcloudObject.save();
						}
						var lastPlays = parseInt(singleItem.playback_count) - parseInt(soundcloudObject.get('plays'));
						if (lastPlays !== 0) {
							console.log('Soundcloud - ' + lastPlays + ' plays in ' + singleItem.title);
						}
						soundcloudObject.set('plays', parseInt(singleItem.playback_count));
				  		soundcloudObject.save();
					}
				});
			},
			error: function(httpResponse) {
			    console.error('Request failed with response code ' + httpResponse.status);
			}
		});
	});
});