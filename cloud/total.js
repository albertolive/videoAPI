var _ = require('underscore');
var moment = require('moment');
var Mailgun = require('mailgun');
Mailgun.initialize('sandboxf2449dafc4ae469a81adb23d9994645b.mailgun.org', 'key-e13d5af9c855772a722f8dfd5d9f2074');
var calculator = require('cloud/totalfunction.js');

Parse.Cloud.job('totalVideoPlays', function(request, status) {
	
	var queryTotals = new Parse.Query('total');	
	queryTotals.find().then(function(totalCollection){
		var dependencies = [];

		_.each(totalCollection, function(singleTotal){
			dependencies.push(calculator.calculateTotal(singleTotal));	
		});	

		Parse.Promise.when(dependencies).then(function() {

			Parse.Events.bind('total');

	  		status.success('Success');
	  	});
	});
});

Parse.Cloud.job('removeDayPlays', function(request, status) {
	
	var queryTotals = new Parse.Query('total');	
	queryTotals.find().then(function(totalCollection){
		var results = [];
		_.each(totalCollection, function(singleTotal) {
			if (singleTotal.get('day') > 0) {
				var obj = {
					title: singleTotal.get('title'),
					plays: singleTotal.get('day')
				}
				results.push(obj);
			} else {
				var obj = {
					error: "no plays"
				}
			}

			singleTotal.set('day', 0);
			singleTotal.save();
		});

		Mailgun.sendEmail({
		  to: "albertolivecorbella@gmail.com",
		  from: "mailgun@sandboxf2449dafc4ae469a81adb23d9994645b.mailgun.org",
		  subject: "New plays of" + moment(Date),
		  text: JSON.stringify(results)
		}, {
		  success: function(httpResponse) {
		    console.log(httpResponse);
		    response.success("Email sent!");
		  },
		  error: function(httpResponse) {
		    console.error(httpResponse);
		    response.error("Uh oh, something went wrong");
		  }
		});
	});
});