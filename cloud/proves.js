var _ = require('underscore');
var getLastVideo = require('cloud/lastVideoId.js');

Parse.Cloud.job('lastVideos', function(request, status) {
	
	console.log("si " + getLastVideo.calculate());
	status.success('Success');
	// var queryTotals = new Parse.Query('total');
	// queryTotals.find().then(function(totalCollection){
	// 	var results = [];
	// 	_.each(totalCollection, function(singleTotal){
	// 		var obj = {
	// 			plays: singleTotal.get('idTotal')
	// 		}
	// 		results.push((obj.plays));
	// 	});
	// 	var result = Math.max.apply( Math, results);
	// 	status.success(result.toString());
	// });
});