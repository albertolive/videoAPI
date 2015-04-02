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

			var week, month;
			var today = moment().format('MMM D, YYYY');
			var title = singleTotal.get('title').replace('(Albert Olive Mashup)','');

			var weekDate = singleTotal.get('weekDate');
			weekDate.setDate(weekDate.getDate()+7);
			weekDate = moment().format('MMM D, YYYY');

			var monthDate = singleTotal.get('monthDate');
			monthDate.setDate(monthDate.getDate()+30);
			monthDate = moment().format('MMM D, YYYY');

			var nextDate = moment().format('MMM D, YYYY, HH:mm');
			nextDate = new Date(nextDate);

			// CONSTRUCTING HTML

			if (weekDate === today) {
				if (parseInt(singleTotal.get('week')) > 0) {
					html = html + '<table><tr><td>' + title + '</td><td><b>' + singleTotal.get('week') + '</b></td></tr></table> <br><hr><br> <table><tr><td>' + title + '</td><td><b>' + singleTotal.get('day') + '</b></td></tr></table>';
				}
			} else if (monthDate === today) {
				if (parseInt(singleTotal.get('month')) > 0) {
					html = html + '<table><tr><td>' + title + '</td><td><b>' + singleTotal.get('month') + '</b></td></tr></table> <br><hr><br> <table><tr><td>' + title + '</td><td><b>' + singleTotal.get('day') + '</b></td></tr></table>';
				}
			} else {
				if (parseInt(singleTotal.get('day')) > 0) {
					html = html + '<table><tr><td>' + title + '</td><td><b>' + singleTotal.get('day') + '</b></td></tr></table> ';
				}
			}

			// ADDING VIEWS ON WEEK

			if (parseInt(singleTotal.get('week')) > 0) {
				week = parseInt(singleTotal.get('week')) + parseInt(singleTotal.get('day'));
			} else {
				week = parseInt(singleTotal.get('day'));
			}

			//WEEK 

			if (weekDate === today) {
				if (parseInt(singleTotal.get('month')) > 0) {
					month = parseInt(singleTotal.get('month')) + parseInt(singleTotal.get('week'));
				} else {
					month = parseInt(singleTotal.get('week'));
				}
				singleTotal.set('month', month);
				singleTotal.set('week', 0);
				singleTotal.set('weekDate', nextDate);
			} else {
				singleTotal.set('week', week);
			}

			// MONTH

			if (monthDate === today) {
				singleTotal.set('month', 0);
				singleTotal.set('monthDate', nextDate);
			}

			// REMOVING VIEWS ON DAY - TOTAL FUNCTION ADD IT

			singleTotal.set('day', 0);
			singleTotal.save();
		});

		//SENDING EMAIL

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