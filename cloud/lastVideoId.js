var _ = require('underscore');

exports.calculate = function() {
	var queryTotals = new Parse.Query('total');
	queryTotals.descending('idTotal');
	
	return queryTotals.first().then(function(totalCollection){

		var successful = new Parse.Promise();
		successful.resolve((totalCollection.get('idTotal')+1)+"");
 
		return successful;
	});
};



