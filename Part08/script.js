var db = null;
		
			
$(document).ready(function() {
	// 초기 로드 함수
	$(window).load(function() {
		$.addEventListeners();
		$.prepDB();
		//$.loadContacts();
	});

	$.addEventListeners = function(){
		// 검색
		$("#sf").bind('submit',function(event){
			$.searchFormSubmitted(event);
		});
		
		// 주소록 추가 폼 보이기
		$("#addContactItem").click(function() {
			$.showContactForm();
		});
		
		// 주소록 추가
		$("#cf").bind('submit',function(event){
			$.addContact(event);
		});

		// 주소록 추가 취소
		$("#cancelButton").click(function(event){
			$.showList(event);
		});

	}
	
	$.prepDB = function() {
		if (window.openDatabase) {
			try {
				db = openDatabase('Todo',										// DB명
				 				  '1.0',												// DB버전
								  ' 저장공간',									// DB설명
								  5 * 1024 * 1024);										// DB크기 (5MB)
				if (db) {
					db.transaction(function(tx) {
						tx.executeSql('CREATE TABLE IF NOT EXISTS contacts \
										(contactId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
										 fullName TEXT,\
										 twitterUserName TEXT,\
										 twitterImagePath TEXT,\
										 phoneNumber TEXT,\
										 age TEXT,\
										 email TEXT,\
										 url TEXT)');
					});
				}
			}
			catch (e) {
				console.log(e);
			}
			
		}
	}
	
	$.showContactForm = function() {
		// 주소록 리스트 숨기기
		$("#list").attr('class','');
		
		// 주소록 입력 폼 보이기
		$("#contactForm").attr('class','selected');
		
		$("form").each(function(index) {
		  if(this.id == "sf")	this.reset();
		});
		
	}
	
	$.searchFormSubmitted = function(event) {
		event.preventDefault();
		$.clearList();
		$.findContact();
	
		return false;
	}
	
	$.clearList = function() {
		$("#contactsList").html('');
	}
	
	$.loadContacts = function() {
		$.clearList();
		
		if (db) {
			db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM contacts ORDER BY fullName ASC', [], function(tx, results) {
					var len = results.rows.length;
					if (len > 0) {
						for (var i = 0; i < len; i++) {
							var contact = results.rows.item(i);
							$.addRowToList(
								contact.contactId,
								contact.fullName, 
								contact.twitterUserName,
								contact.twitterImagePath,
								contact.phoneNumber,
								contact.age,
								contact.email,
								contact.url);
						}
					}
				});
			});
		}
		else {
			console.log('주소록 로딩 오류')
		}
	}
	
	$.addRowToList = function(contactId, fullName, twitterUserName, twitterImagePath, phoneNumber, age, email, url) {
		$('#contactsList').append('<li/>').find("#contactsList > li:last").attr('id', 'c' + contactId).attr('class', 'contact');
		
		
		$(document).find("#contactsList > li:last").append('<header/>').attr('contactId',contactId).bind('click',function() {
			$.toggleDetails("c" + this.contactId);
		});
		
		$(document).find('#contactsList > li:last > header:last').append('<img/>');
		$(document).find('#contactsList > li:last > header:last > img:last').attr('src', twitterImagePath).attr('alt', twitterUserName);
		
		$(document).find('#contactsList > li:last > header:last').append('<span/>');
		$(document).find('#contactsList > li:last > header:last > span:last').attr('class','fullName').text(fullName);
		
		$(document).find("#contactsList > li:last").append('<div/>');
		$(document).find("#contactsList > li:last > div:last").attr('class','details');
		
		$(document).find("#contactsList > li:last > div:last").append('<span/>');
		$(document).find("#contactsList > li:last > div:last > span:last").text('Twitter: ' + twitterUserName);
		
		$(document).find("#contactsList > li:last > div:last").append('<span/>');
		$(document).find("#contactsList > li:last > div:last > span:last").text('Phone Number: ' + phoneNumber);
		
		$(document).find("#contactsList > li:last > div:last").append('<span/>');
		$(document).find("#contactsList > li:last > div:last > span:last").text('Age: ' + age);
		
		$(document).find("#contactsList > li:last > div:last").append('<span/>');
		$(document).find("#contactsList > li:last > div:last > span:last").text('Email: ' + email);
		
		$(document).find("#contactsList > li:last > div:last").append('<span/>');
		$(document).find("#contactsList > li:last > div:last > span:last").text('URL: ' + url);
	}
	
	$.addContact = function(event) {
		event.preventDefault();
		document.activeElement.blur();
		
		var fullName = $("#fullName").val();
		var twitterUserName = $("#twitterUserName").val();
		var twitterImagePath = null;
		var phoneNumber = $("#phoneNumber").val();
		var age = $("#age").val();
		var email = $("#email").val();
		var url = $("#url").val();
		
		var apiCall = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + twitterUserName;
		var requestString = '../../Common/curl.php?apiUrl=' + escape(apiCall);
		
		$.ajax({
			url:requestString,
			type:'GET',
			error: function(){
				alert("Ajax Loading Error");
			},
			success: function(data){
				var profile = data;
				twitterImagePath = profile.profile_image_url;
				
				$.insertContactInDB(fullName, twitterUserName, twitterImagePath, phoneNumber, age, email, url);
			}
			
		});
	}
	
	$.showList = function(event) {
		if (event) {
			event.preventDefault();
		}
		
		// Show List
		$('#list').attr('class','selected');
		
		// Hide Contact Form
		$('#contactForm').attr('class','');
		
		$.loadContacts();
	}
	
	$.insertContactInDB = function(fullName, twitterUserName, twitterImagePath, phoneNumber, age, email, url) {
		if (db) {
			db.transaction(function(tx) {
				tx.executeSql('INSERT INTO contacts (fullName, twitterUserName, twitterImagePath, phoneNumber, age, email, url) values (?, ?, ?, ?, ?, ?, ?)',
					[fullName,
					twitterUserName,
					twitterImagePath,
					phoneNumber,
					age,
					email,
					url]);
			});
			$.showList(null);
		}
		else {
			console.log('Error adding contact.');
		}
	}
	
	$.hideAllDetails = function() {
		$(".contact").each(function(index) {
		  $(".contact").children(0).addClass('contact');
		  
		});
	}
	
	$.toggleDetails = function(contactId) {

		if ($("#"+contactId).attr('class') == 'contact selected') {
			$("#"+contactId).attr('class','contact');
		}
		else {
			$.hideAllDetails();
			$("#"+contactId).attr('class','contact selected');
		}
	}
	
	$.findContact = function() {
		$("#searchField").blur();
		
		if (db) {
			db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM contacts WHERE fullName LIKE "%' + searchField.value + '%"', [], function(tx, results) {
					var len = results.rows.length;
					if (len > 0) {
						// Add results to list.
						for (var i = 0; i < len; i++) {
							// addTweetToList(username, userImageURL, text)
							var contact = results.rows.item(i);
							$.addRowToList(
								contact.contactId,
								contact.fullName, 
								contact.twitterUserName,
								contact.twitterImagePath,
								contact.phoneNumber,
								contact.age,
								contact.email,
								contact.url);
						}
					}
				});
			})
		}
	}
});