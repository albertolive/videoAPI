Parse.Cloud.job('vimeoTest', function(request, status) {
	Parse.Cloud.httpRequest({
	  url: 'https://api.vimeo.com/me/videos',
	  headers: {
	    'Content-Type': 'application/vnd.vimeo.video+json'
	  },
	  params: {
	  	'access_token': '5e32ecbfff92f594092cefc20cb6c929',
	  	'per_page': 1,
	  	'sort': 'plays'
	  },
	  success: function(httpResponse) {

	  	console.log("text: " + httpResponse.text);

	  	status.success();
	  },
	  error: function(httpResponse) {
	  	status.error(httpResponse);
	    console.error('Request failed with response code ' + httpResponse.status);
	  }
	});
});