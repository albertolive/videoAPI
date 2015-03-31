var _ = require('underscore');

exports.calculateTotal = function(totalObj){

	var dependecies = [];
	var vimeoInt, dailymotionInt, soundcloudInt, youtubeInt, vimeoTitle;

	//Create dependencies for all providers and push them to dependencies array

	var querySoundcloud = new Parse.Query('soundcloud');
	querySoundcloud.equalTo('soundCloudId', totalObj.get('idTotal'));
	var soundCloudDep = querySoundcloud.first().then(function(soundCloud){
			soundcloudInt = soundCloud ? soundCloud.get('plays') : 0;
	});
	dependecies.push(soundCloudDep);


	var queryYoutube = new Parse.Query('youtube');
	queryYoutube.equalTo('youtubeId', totalObj.get('idTotal'));
	var youtubeDep = queryYoutube.first().then(function(youtube){
		youtubeInt = youtube ? youtube.get('plays') : 0;
	});
	dependecies.push(youtubeDep);


	var queryVimeo = new Parse.Query('vimeo');
	queryVimeo.equalTo('vimeoId', totalObj.get('idTotal'));
	var vimeoDep = queryVimeo.first().then(function(vimeo){
		if (totalObj.get('title') === undefined) {
			vimeoTitle = vimeo.get('title');
		}
		vimeoInt = vimeo ? vimeo.get('plays') : 0;
	});
	dependecies.push(vimeoDep);


	var queryDailymotion = new Parse.Query('dailymotion');
	queryDailymotion.equalTo('dailymotionId', totalObj.get('idTotal'));
	var dailymotionDep = queryDailymotion.first().then(function(dailymotion){
		dailymotionInt = dailymotion ? dailymotion.get('plays') : 0;
	});
	dependecies.push(dailymotionDep);


	return Parse.Promise.when(dependecies).then(function(){
		var prom = Parse.Promise.when(dependecies).then(function() {
			//sumaremos
			var totalPlays = parseInt(vimeoInt)+parseInt(soundcloudInt)+parseInt(youtubeInt)+parseInt(dailymotionInt);
			if (vimeoTitle) {
				totalObj.set('title', vimeoTitle);
				return totalObj.save();
			}
			if (totalObj.get('plays') !== totalPlays) {
				var lastPlays = parseInt(totalPlays) - parseInt(totalObj.get('plays'));
				console.log('Total - ' + lastPlays + ' plays in ' + totalObj.get('title'));

				if (totalObj.get('day') > 0) {
					totalObj.set('day', parseInt(lastPlays) + parseInt(totalObj.get('day')));
				} else {
					totalObj.set('day', lastPlays);
				}

				totalObj.set('plays', totalPlays);
				
				return totalObj.save();

			} else {
				console.log('Total - no more plays with ' + totalObj.get('title'));
				return "no more updates";
			}
		});
	});	
};