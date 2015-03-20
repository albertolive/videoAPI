var _ = require('underscore');
var getLastVideo = require('cloud/lastVideoId.js');

Parse.Cloud.job('lastVideos', function(request, status) {

	Parse.Promise.when(getLastVideo.calculate()).then(function(testValue){
		console.log(testValue);
		status.success(testValue);
	});
});