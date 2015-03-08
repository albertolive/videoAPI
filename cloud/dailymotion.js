var _ = require('underscore');

Parse.Cloud.job('dailymotion', function(request, status) {
	Parse.Cloud.httpRequest({
	  url: 'https://api.dailymotion.com/user/djalbertolive/videos',
	  params: {
	  	'fields': 'id, title, views_total',
	  	'sort': 'recent'
	  },
		success: function(httpResponse) {
			var Dailymotion = Parse.Object.extend("dailymotion");
			var prom = _.map(httpResponse.data.list, function(singleItem) {
				var query = new Parse.Query("dailymotion");
				query.equalTo('externalId', singleItem.id)
				return query.first().then(function(foundedDailymotion) {

					if(foundedDailymotion){
						return foundedDailymotion.save();
					}else{
						var dailymotionObject = new Dailymotion();
				  		dailymotionObject.set('externalId', singleItem.id);
						return dailymotionObject.save();
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