function randomBetween(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
//get req param using request.params.xxx

Parse.Cloud.define("nextRandomQuestion", function(request, response) {
  var query = new Parse.Query("UserActivity");
  query.equalTo("userId", request.params.localuserid);
  query.find({
    success: function(results) {
    	console.log(results);
    	if (results.length == 0) {
    		createUserActivity(getQuestion);
    	} else {
    		getQuestion(results);
    	}
    },
    error: function(error) {
		console.log("0Error: " + error.code + " " + error.message);
    }
  });

  function getQuestion(userActivities) {
	console.log("getQuestion");
	var doneQuesIds = [];
	if (userActivities && userActivities.length > 0) {
		doneQuesIds = userActivities.map(function(d) { return d.questionId });
	}
	var quesQuery = new Parse.Query("IndiaQuiz");
	doneQuesIds.length > 0 && quesQuery.notContainedIn('objectId', doneQuesIds);
	quesQuery.limit(1);
	quesQuery.first({
	  success: function(object) {
		//console.log(object);
		response.success(object);
	  },
	  error: function(error) {
		console.log("2Error: " + error.code + " " + error.message);
	  }
	});

  }
  function createUserActivity(callback) {
	var UserActivity = Parse.Object.extend("UserActivity");
	var userActivity = new UserActivity();

	userActivity.set("userId", request.params.localuserid);
	userActivity.save(null, {
	  success: function(suc) {
		callback(null);
	  },
	  error: function(error) {
		console.log("1Error: " + error.code + " " + error.message);
	  }
	});
  }
});

Parse.Cloud.define("checkAnswer", function(request, response) {
	var IndiaQuiz = Parse.Object.extend("IndiaQuiz");
	var query = new Parse.Query(IndiaQuiz);	
	
	query.equalTo("objectId", request.params.objectId);	
	query.first({
		success: function(object) {
			response.success(object);
		},
		error: function(error) {
			console.log("Error " + error);
		}
	});
});

Parse.Cloud.define("updateUserActivity", function(request, response) {
	var UserActivity = Parse.Object.extend("UserActivity");
	var userActivity = new UserActivity();
	 
	userActivity.set("userId", request.params.localuserid);
	userActivity.set("questionId", request.params.questionId);	
	 
	userActivity.save(null, {
	  success: function(newobj) {	    
	  	response.success("success");  
	  },
	  error: function(obj, error) {	    
	  	console.log(error);
	  }
	});

});