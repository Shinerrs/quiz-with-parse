function randomBetween(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
//get req param using request.params.xxx

Parse.Cloud.define("fetchUserScore", function(request, response) {
  var query = new Parse.Query("UserScore");
  query.equalTo("userId", request.params.localuserid);
  query.find({
    success: function(results) {
    	response.success(results);
    },
    error: function(error) {
		console.log("Error: " + error.code + " " + error.message);
    }
  });
});

function getUserActivity(userId, callback) {
	var userActQuery = new Parse.Query("UserActivity");
	userActQuery.equalTo("userId", userId);
	userActQuery.first({
		success: function(object) {
		    if (object) {
				callback(object.get('lastRow'));
		    } else {
				callback(0);
		    }
		},
		error: function(error) {
			console.log("Error " + error);
		}
	});
}
function updateUserActivity(userId, length, callback) {
	var UserActivity = Parse.Object.extend("UserActivity");
	var userActQuery = new Parse.Query(UserActivity);
	userActQuery.equalTo("userId", userId);
	userActQuery.first({
		success: function(object) {
		    if (object) {
		    	object.set('lastRow', parseInt(object.get('lastRow')) +  length);
		    	object.save(null, {success: callback});
		    } else {
		    	console.log("not found");
				var v = new UserActivity();
				v.set('userId', userId);
				v.set('lastRow', length+'');
				v.save(null, {success: function(d) { console.log("saved"); callback();} });
		    }
		},
		error: function(error) {
			console.log("Error " + error);
		}
	});
}


Parse.Cloud.define("fetchQuestionSet", function(request, response) {
	getUserActivity(request.params.localuserid, function(skip) {
		var quesQuery = new Parse.Query("IndiaQuiz");
		quesQuery.limit(10);
		quesQuery.skip(skip);
		quesQuery.find({
		  success: function(object) {
			//console.log(object);
			updateUserActivity(request.params.localuserid, object.length, function() {
				response.success(object);
			});
		  },
		  error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		  }
		});
	});
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

Parse.Cloud.define("updateUserScore", function(request, response) {
	var UserScore = Parse.Object.extend("UserScore");
	var userScore = new UserScore();

	userScore.set("userId", request.params.localuserid);
	userScore.set("questionId", request.params.questionId);
	userScore.set("score", ''+request.params.score);

	userScore.save(null, {
	  success: function(newobj) {
	  	response.success("success");
	  },
	  error: function(obj, error) {
	  	//console.log(error);
	  	response.error(error.code);
	  }
	});

});


Parse.Cloud.define("fetchUserProfile", function(request, response) {
	var query = new Parse.Query("UserScore");
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