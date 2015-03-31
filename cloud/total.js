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
	queryTotals.descending("day");
	queryTotals.find().then(function(totalCollection) {
		var html = [];
		_.each(totalCollection, function(singleTotal) {
			if (singleTotal.get('day') > 0) {
				var title = singleTotal.get('title').replace('(Albert Olive Mashup)','');
				html = html + '<table><tr><td>' + title + '</td><td><b>' + singleTotal.get('day') + '</b></td></tr></table> ';
			}

			var week = parseInt(singleTotal.get('week')) + parseInt(singleTotal.get('day'));
			singleTotal.set('week', week);
			singleTotal.set('day', 0);
			singleTotal.save();
		});

		var date = moment().format('D-M-YYYY');

		Mailgun.sendEmail({
		  to: "albertolivecorbella@gmail.com",
		  from: "mailgun@sandboxf2449dafc4ae469a81adb23d9994645b.mailgun.org",
		  subject: "New plays of " + date,
		  html: html
		}, {
		  success: function(httpResponse) {
		    console.log(httpResponse);
		    status.success("Email sent!");
		  },
		  error: function(httpResponse) {
		    console.error(httpResponse);
		    status.error("Uh oh, something went wrong");
		  }
		});
	});
});