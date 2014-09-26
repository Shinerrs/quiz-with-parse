Parse.initialize("h9Klv5bd9JJUz2Go267205fq5mbTU4sxz5mCd7MZ", "2IEA1cZbM6nJgRDJ5JVcWTHq6dGQFQp6Mid9vK5e");
var userId = LocalStorageStore.getUserId();

function getNextQuestion(callback) {
	Parse.Cloud.run('nextRandomQuestion', {localuserid: userId}, {
	  success: function(resp) {
	     //console.log(resp._serverData);
	     callback(resp._serverData);

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
		var tmpl = $('#question-tmpl').html();
		var obj = {
			title: r.title,
			answer: r.answer,
			list: [{id: 1, title: r.option1}, {id: 2, title: r.option2}, {id: 3, title: r.option3}, {id: 4, title: r.option4}]
		};

		$('#mainbody').html(Mustache.render(tmpl, obj));
	});

	$('#submitAnswer').live('click', function() {
		var ans = $('#submitAnswer').data('codenext');
		console.log("Answer: " + ans);
		console.log("Clicked: " + $('input[name=group]:checked').data('id'));
	});

});
