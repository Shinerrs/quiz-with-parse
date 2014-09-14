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
	var query = new Parse.Query(NewsItem);
	query.equalTo("objectId", id);
	query.find({success: function(item) {
		
		cb(item[0]);
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
	$('.newsitem').live('click',function() {
		var id = $(this).data('id');
		
		getItem(id, function(d) {
			var title = Mustache.render($('#titlebar-tmpl').html(), {title: d.get('title')});
			$('#titlebar').html(title);
			//console.log(d.get('title'));console.log(d.createdAt);			
			var content = Mustache.render($('#item-tmpl').html(), {desc: d.get('desc'), createdAt: d.createdAt});
			$('#mainbody').html(content);

			//console.log(title + " " + content);
		});
	});
});
