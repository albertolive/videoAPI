Parse.Cloud.define('vimeoTest', function(request, response) {
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

	  	var myEscapedJSONString = httpResponse.text.replace(/\\n/g, "\\n")
		                                      .replace(/\\'/g, "\\'")
		                                      .replace(/\\"/g, '\\"')
		                                      .replace(/\\&/g, "\\&")
		                                      .replace(/\\r/g, "\\r")
		                                      .replace(/\\t/g, "\\t")
		                                      .replace(/\\b/g, "\\b")
		                                      .replace(/\\f/g, "\\f");
	  	console.log("text: " + httpResponse.text.total);

	  	response.success(myEscapedJSONString);
	  },
	  error: function(httpResponse) {
	  	response.error(httpResponse);
	    console.error('Request failed with response code ' + httpResponse.status);
	  }
	});
});