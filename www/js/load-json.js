Parse.initialize("h9Klv5bd9JJUz2Go267205fq5mbTU4sxz5mCd7MZ", "2IEA1cZbM6nJgRDJ5JVcWTHq6dGQFQp6Mid9vK5e");


function getList(cb) {
	var NewsItem = Parse.Object.extend("NewsItem");
	var query = new Parse.Query(NewsItem);
	query.find({success: function(list) {

		cb(list);
	}});
}

function getItem(id, cb) {
	var NewsItem = Parse.Object.extend("NewsItem");
	var Questions = Parse.Object.extend("Questions");
	var query = new Parse.Query(NewsItem);
	query.equalTo('objectId', id);
	query.find({success: function(newsItemArr) {
		var newsItem = newsItemArr[0];
		var title = newsItem.get('title');
		var childQuery = new Parse.Query(Questions);
		childQuery.equalTo("p", newsItem);
		childQuery.find({
			success: function(list) {
				cb(title, list);
			}
		});
	}});
}

$(document).ready(function(){
	//$(document).bind('deviceready', function(){
		var output = $('#list');
		getList(function(data) {
			var dd = [];
			$.each(data, function(i, v) {
				dd.push({id: v.id, title: v.get('title')});

			});
			//console.log(dd);
			var rendered = Mustache.render($('#home-tmpl').html(), {list: dd});
			$('#mainbody').html(rendered);
			//console.log(rendered);

		});
	//});
	$('.newsitem').live('click', function() {
		var id = $(this).data('id');

		getItem(id, function(title, list) {
			var len = list.length;
			var title = Mustache.render($('#titlebar-tmpl').html(), {title: len + ' Questions for '+title, backtitle: ''});
			$('#titlebar').html(title);
			//console.log(list);
			$.each(list, function(i, v) {
				v.title = v.get('title');
			});
			var content = Mustache.render($('#question-list-tmpl').html(), {list: list});
			$('#mainbody').html(content);

			//console.log(title + " " + content);
		});
	});
});
