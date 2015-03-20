var _ = require('underscore');

exports.calculate = function() {
	var queryTotals = new Parse.Query('total');
	queryTotals.find().then(function(totalCollection){
		var results = [];
		_.each(totalCollection, function(singleTotal){
			var obj = {
				plays: singleTotal.get('idTotal')
			}
			results.push((obj.plays));
		});
		var result = Math.max.apply( Math, results);
		return result.toString();
	});
};