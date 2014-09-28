Parse.initialize("h9Klv5bd9JJUz2Go267205fq5mbTU4sxz5mCd7MZ", "2IEA1cZbM6nJgRDJ5JVcWTHq6dGQFQp6Mid9vK5e");
var userId = LocalStorageStore.getUserId();

function getNextQuestion(callback) {
	Parse.Cloud.run('nextRandomQuestion', {localuserid: userId}, {
	  success: function(resp) {
	     console.log($.extend({objectId: resp.id}, resp.attributes));
	     callback($.extend({objectId: resp.id}, resp.attributes));

	  },
	  error: function(error) {
		//console.log(error);
	  }
	});
}

function getAnswer(userId, objectId, callback) {
	Parse.Cloud.run('checkAnswer', {localuserid: userId, objectId: objectId}, {
	  success: function(resp) {
	     console.log(resp);
	     callback(resp.attributes);

	  },
	  error: function(error) {
		//console.log(error);
	  }
	});
}

function updateUserActivity(userId, questionId, callback) {
	Parse.Cloud.run('updateUserActivity', {localuserid: userId, questionId: questionId}, {
	  success: function(resp) {
	     //console.log(resp._serverData);
	     callback && callback(resp._serverData);

	  },
	  error: function(error) {
		//console.log(error);
	  }
	});
}

$(document).ready(function(){
	//$(document).bind('deviceready', function(){

	//});
	function nextQuestion() {
		getNextQuestion(function(r) {
			var tmpl = $('#question-tmpl').html();
			var obj = {
				question: {
					title: r.title,
					answer: r.answer,
					objectId: r.objectId
				},
				list: [{id: 1, questionId: r.objectId, title: r.option1}, 
					{id: 2, questionId: r.objectId, title: r.option2}, 
					{id: 3, questionId: r.objectId, title: r.option3}, 
					{id: 4, questionId: r.objectId, title: r.option4}]
			};
			
			$('#mainbody').html(Mustache.render(tmpl, obj));
		});
	}
	nextQuestion();

	$('#submitAnswer').live('click', function() {
		var ans = $('input[name=group]:checked').data('id');
		var questionId = $('input[name=group]:checked').data('questionid');		
		console.log("Clicked: " + ans + ", " + questionId );
		updateUserActivity(userId, questionId, function(o) {
			//
		});
		getAnswer(userId, questionId, function(o) {
			//console.log(o);
			if (ans == o.answer) {				
				alert("Right !");
			} else {
				alert("Wrong !");
			}
			nextQuestion();
		});
	});
});
