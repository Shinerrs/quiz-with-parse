function randomBetween(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
//get req param using request.params.xxx

Parse.Cloud.define("nextRandomQuestion", function(request, response) {
  var query = new Parse.Query("UserActivity");
  query.equalTo("userId", request.params.localuserid);
  query.find({
    success: function(results) {
    	getQuestion(results);
    	//console.log(results);
    	if (results.length == 0) {
    		//createUserActivity(getQuestion);
    	} else {
    		//getQuestion(results);
    	}
    },
    error: function(error) {
		console.log("0Error: " + error.code + " " + error.message);
    }
  });

  function getQuestion(userActivities) {
	var doneQuesIds = [];
	if (userActivities && userActivities.length > 0) {
		for (var i=0; i<userActivities.length; i++) {
			doneQuesIds.push(userActivities[i].get('questionId'));
		}
	}

	//console.log(doneQuesIds);

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
	userActivity.set("score", ''+request.params.score);

	userActivity.save(null, {
	  success: function(newobj) {
	  	response.success("success");
	  },
	  error: function(obj, error) {
	  	console.log(error);
	  	response.error(error.code);
	  }
	});

});


Parse.Cloud.define("fetchUserActivity", function(request, response) {
	var query = new Parse.Query("UserActivity");
	  query.equalTo("userId", request.params.localuserid);
	  query.find({
	    success: function(results) {
	    	var obj = {right: 0, wrong: 0, perc: 0};
	    	var tot = 0;
	    	if (results && results.length > 0) {
			  for (var i=0; i< results.length; i++) {
			  	if (results[i].get("questionId") !== '') {
					if (results[i].get('score') == 0) {
					    obj.wrong ++;
					} else {
						obj.right ++;
					}
					tot ++;
			  	}
			  }
	    	}
	    	if (tot != 0) obj.perc = Math.round(obj.right*100/tot, 2);
	    	response.success(obj);
	    },
	    error: function() {
	      response.error("Profile lookup failed");
	    }
    });
});