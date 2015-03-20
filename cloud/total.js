var _ = require('underscore');
var calculator = require('cloud/totalfunction.js');

Parse.Cloud.job('totalVideoPlays', function(request, status) {
	
	var queryTotals = new Parse.Query('total');	
	queryTotals.find().then(function(totalCollection){
		var dependencies = [];

		_.each(totalCollection, function(singleTotal){
			dependencies.push(calculator.calculateTotal(singleTotal));	
		});	

		Parse.Promise.when(dependencies).then(function() {
	  		status.success('Success');
	  	});
	});
	
});