var _ = require('underscore');

exports.calculate = function() {
	var queryTotals = new Parse.Query('total');
	queryTotals.descending('idTotal');

	return queryTotals.first().then(function(totalCollection){
		return totalCollection.get('idTotal')+1;
	});
};



