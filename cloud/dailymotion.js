var _ = require('underscore');

Parse.Cloud.job('dailymotion', function(request, status) {
	Parse.Cloud.httpRequest({
	  url: 'https://api.dailymotion.com/user/djalbertolive/videos?fields=id,title,views_total,&sort=recent&limit=100',
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
		    console.error('Request first call failed with response code ' + httpResponse.status);
		  }
	});
});

Parse.Cloud.afterSave("dailymotion", function(request) {
	var query = new Parse.Query("dailymotion");
	query.get(request.object.id).then(function(dailymotionObject) {
		Parse.Cloud.httpRequest({
	 		url: 'https://api.dailymotion.com/user/djalbertolive/videos?fields=id,title,views_total,&sort=recent&limit=100',
			success: function(httpResponse) {
				_.map(httpResponse.data.list, function(singleItem) {
					if (dailymotionObject.get('externalId') == singleItem.id) {
						if(dailymotionObject.get('title') === undefined){
							dailymotionObject.set('title', singleItem.title);
						}
							dailymotionObject.set('plays', parseInt(singleItem.views_total));
							dailymotionObject.save();
					}
				});
			},
			error: function(httpResponse) {
			    console.error('Request second call failed with response code ' + httpResponse.status);
			}
		});
	});
});