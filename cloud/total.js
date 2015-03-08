var _ = require('underscore');

Parse.Cloud.job('totalVideoPlays', function(request, status) {
	var Total = Parse.Object.extend("total");
	var saveTotal = new Total();
	var queryTotal = new Parse.Query(Total);

	var query = new Parse.Query("youtube");
	query.find().then(function(youtubeCollection) {
		var prom = _.each(youtubeCollection, function(singleYoutubeObject){
			queryTotal.equalTo('idTotal', singleYoutubeObject.get('youtubeId'))
			return queryTotal.first().then(function(foundedTotal) {
				console.log(foundedTotal);
			});
			// if (total = singleYoutubeObject.get('youtubeId')) {
			// 	saveTotal.set('title', singleYoutubeObject.get('title'));
			// 	saveTotal.set('plays', singleYoutubeObject.get('plays'));
			// 	saveTotal.save();
			// }
		});
		
		Parse.Promise.when(prom).then(function() {
	  		status.success();
	  	});
	});


	// queryTotal.find().then(function(totalCollection) {
	// 	var total = [];
	// 	_.each(totalCollection, function(singleTotal) {
	// 		var obj = {
	// 			id: singleTotal.get('idTotal')
	// 		}
	// 		total.push(obj);
	// 	});
		

	// });
});