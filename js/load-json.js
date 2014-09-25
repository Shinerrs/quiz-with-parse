Parse.initialize("h9Klv5bd9JJUz2Go267205fq5mbTU4sxz5mCd7MZ", "2IEA1cZbM6nJgRDJ5JVcWTHq6dGQFQp6Mid9vK5e");
var userId = LocalStorageStore.getUserId();

function getNextQuestion(callback) {
	Parse.Cloud.run('nextRandomQuestion', {localuserid: userId}, {
	  success: function(resp) {
	     console.log(resp);
	     resp && callback(resp.result);

	  },
	  error: function(error) {
		//console.log(error);
	  }
	});
}

$(document).ready(function(){
	//$(document).bind('deviceready', function(){

	//});
	getNextQuestion(function(r) {

		$('#mainbody').html(r.title);
	});


});
