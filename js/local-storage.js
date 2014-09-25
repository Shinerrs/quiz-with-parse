var LocalStorageStore = {};
LocalStorageStore.getUserId = function() {
	var localUserId = window.localStorage.getItem("local_user_id");
	if (!localUserId) {
		localUserId = getUID();
		window.localStorage.setItem("local_user_id", localUserId);
	}
	return localUserId;
}


function getUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}