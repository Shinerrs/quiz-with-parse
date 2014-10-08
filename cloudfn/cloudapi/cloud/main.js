function randomBetween(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
//get req param using request.params.xxx

Parse.Cloud.define("fetchUserScore", function(request, response) {
  var query = new Parse.Query("UserActivity");
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
		    	object.set('lastRow', object.get('lastRow') +  length);
		    	object.save(null, {success: callback});
		    } else {
		    	console.log("not found");
				var v = new UserActivity();
				v.set('userId', userId);
				v.set('lastRow', length);
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
		var quesQuery = new Parse.Query("Quiz");
		quesQuery.limit(10);
		quesQuery.skip(skip);
		quesQuery.find({
		  success: function(object) {
			//console.log(object);
			response.success(object);
		  },
		  error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
			response.error(error.code);
		  }
		});
	});
});

Parse.Cloud.define("checkAnswer", function(request, response) {
	var Quiz = Parse.Object.extend("Quiz");
	var query = new Parse.Query(Quiz);

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
	var UserActivity = Parse.Object.extend("UserActivity");
	var query = new Parse.Query(UserActivity);
	query.equalTo("userId", request.params.localuserid);
	query.first({
		success: function(object) {
			if (object) {
				if (request.params.score == 1) {
					object.set('right', object.get('right') + 1);
				} else {
					object.set('wrong', object.get('wrong') + 1);
				}
				object.set('lastRow', object.get('lastRow') + 1);
			} else {
				var object = new UserActivity();
				object.set('userId', request.params.localuserid);
				object.set('lastRow', 1);
				if (request.params.score == 1) {
					object.set('right', 1);
				} else {
					object.set('wrong', 1);
				}
			}
			object.save(null, {
				success: function(o) {
					response.success("success");
				},
				error: function(error) {
					console.log("Error: " + error);
					response.error(error.code);
				}
			});

		},
		error: function(error) {
			console.log("Error " + error);
			response.error(error.code);
		}
	});

});


Parse.Cloud.define("fetchUserProfile", function(request, response) {
	var query = new Parse.Query("UserActivity");
	  query.equalTo("userId", request.params.localuserid);
	  query.first({
	    success: function(r) {
	    	var obj = {right: r.get('right') || 0, wrong: r.get('wrong') || 0};
	    	var tot = obj.right + obj.wrong;
	    	if (tot != 0) obj.perc = Math.round(obj.right*100/tot, 2);
	    	response.success(obj);
	    },
	    error: function() {
	      response.error("Profile lookup failed");
	    }
    });
});