var map;
var db;

$(document).ready(function() {
	$.callAjax = function(apiUrl) {
		var requestUrl = '../../Common/curl.php?apiUrl=' + escape(apiUrl);

		$.ajax({
			url:requestUrl,
			type:'GET',
			error: function(){
				alert("Ajax Loading Error");
			},
			success: function(data){
				var results = $.parseJSON(data);
				for(var resultId in results.statuses) {
					var otwit = results.statuses[resultId];
					
					// 유저 정보 얻기
					var name = otwit.user.screen_name;
					var id = otwit.user.id;
					var text = otwit.text;
					var imageUrl = otwit.user.profile_image_url;
					var screen_name = otwit.user.screen_name;
					var location = otwit.user.location;
					var followers_count = otwit.user.followers_count;
					var friends_count = otwit.user.friends_count;
					// 2. 트윗 로드시 캐시하도록 변경
					//$.addTweetToList(name, imageUrl, text, screen_name,location,followers_count,friends_count);
					$.cacheTweetIfUnique(id	, name	, imageUrl, text, screen_name,location,followers_count,friends_count);
				}
				
				//3. $.loadCachedTweets() 함수 호출
				$.loadCachedTweets();

			}
			
		});
	};
	
	// 타임라인에 트윗을 추가하는 함수
	$.addTweetToList = function(name, imageUrl, text, screen_name,location,followers_count,friends_count) {
		// 유저 이미지 <img> 추가
		$("#tweetsList").find("li:last > div:last").append("<img/>");
		$("#tweetsList").find("li:last > div:last > img:last").attr('src', imageUrl).attr('alt',name).attr('class', 'user-image').attr('name',name).attr('screen_name',screen_name).attr('location',location).attr('followers_count',followers_count).attr('friends_count',friends_count);
					
		//이미지 클릭시 $.setProfile() 함수 연결
		$("#tweetsList").find("li:last > div:last > img:last").click(function() {
			$.showProfile(
				this.src,
				this.name,
				this.attributes[4].value,
				this.attributes[5].value,
				this.attributes[6].value,
				this.attributes[7].value
			);
		});
		
		// 유저 이름 <span> 추가
		$("#tweetsList").find("li:last > div:last").append("<span/>");
		$("#tweetsList").find("li:last > div:last > span:last").text(name).attr('class', 'username');

		
		// 트윗 내용 <span>
		$("#tweetsList").find("li:last > div:last").append("<span/>");
		$("#tweetsList").find("li:last > div:last > span:last").text(text).attr('class', 'message');
		
		// <li><div> 만들기
		$("#tweetsList").append("<li/>")
			.find("li:last").append("<div/>");
	}
	
	// 사용자 정보를 보여주는 함수 추가
	$.showProfile = function(profile_image_url,name,screen_name,location,followers_count,friends_count){
		// 모든 네비게이션 목록을 hide합니다.
		$.clearAllNavItems();
		$.setProfile(profile_image_url,name,screen_name,location,followers_count,friends_count);
	}
	
	// 유저의 상세정보를 얻는 함수 추가
	$.setProfile = function(profile_image_url,name,screen_name,location,followers_count,friends_count) {
		// 프로필 이미지 추가
		$("#profileImage").attr('src',profile_image_url).attr('alt',name);
		
		// 이름 추가
		$("#name").text(name);
		
		// ID 추가
		$("#screenName").text('@' + screen_name);
		
		// 위치정보 추가
		$("#location").text(location);
		
		// 팔로워 수 추가
		$("#followersCount").text('팔로워 :'+followers_count);
		
		// 팔로잉 수 추가
		$("#friendsCount").text('팔로잉 :'+friends_count);
		
		// 프로필 화면으로 전환
		$.switchToSectionWithId('profile');
	}
	
	// 화면전환 함수
	$.switchToSectionWithId = function(sid){
		$.hideAllSections();
		$.showSectionWithId(sid);
	}
	
	$.hideAllSections = function(){
		$("section").removeClass('selected');
	}
	
	$.clearAllNavItems = function() {
		$("#navList > li").removeClass('selected');
	}
	
	// 유저 상세정보 섹션 표시함수
	$.showSectionWithId = function(sid){
		$("#"+sid).addClass('selected');
	}
	
	$.getTweets = function() {
		// 1. 온/오프라인 감지 처리
		if (navigator.onLine == false) {
			loadCachedTweets();
			return;
		}
		var apiUrl = 'https://api.twitter.com/1.1/search/tweets.json?q=html5&lang=ko';		
		$.callAjax(apiUrl);
	}
	
});
// 데이터베이스 관련 함수 모음
$(document).ready(function() {
	$.prepDB = function() {
		if (window.openDatabase) {
			try {
				db = openDatabase('tweetline',											// DB 이름
				 				  '1.0',												// DB 버전
								  '오프라인 트윗라인을 위한 캐싱 데이터베이스입니다.',	// DB 설명
								  5 * 1024 * 1024);										// DB 크기 (5MB)
				if (db) {
					db.transaction(function(tx) {
						tx.executeSql('CREATE TABLE IF NOT EXISTS tweets \
										(tweetId TEXT PRIMARY KEY,\
										 username TEXT,\
										 text TEXT,\
										 userImageURL TEXT,\
										 location TEXT,\
										 followers_count INTEGER,\
										 friends_count INTEGER,\
										 createdAt TEXT)');
					});
				}
			}
			catch (e) {
				console.log(e);
			}
			
		}
	}
	// 1.	트윗 저장/로드 함수 제작
	$.cacheTweetIfUnique = function(id, username, imgUrl, text, screen_name,location,followers_count,friends_count) {
		if (db) {
			db.transaction(function(tx) {
				var sql = 'SELECT COUNT(tweetId) AS c FROM tweets WHERE tweetId = "' + id + '"';
				tx.executeSql(sql, [], function(tx, results) {
					if (results.rows.item(0).c == 0) {
						var nowString = $.stringFromDate(new Date());
						tx.executeSql('INSERT INTO tweets ("tweetId", username, text, userImageURL, location, followers_count, friends_count, createdAt) values (?, ?, ?, ?, ?, ?, ?, ?)',
							[id,
							username,
							text,
							imgUrl,
							location,
							followers_count,
							friends_count,
							nowString]);
					}
				});
			});
		}
		else {
			console.log('트윗 캐싱 에러');
		}
	}
	
	$.loadCachedTweets = function() {
		if (db) {
			db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM tweets ORDER BY tweetId DESC', [], function(tx, results) {
					var len = results.rows.length;
					if (len > 0) {
						// 트윗을 캐싱할 준비가 되었으면, 먼저 트윗라인을 초기화 해준 다음 캐싱된 트윗을 넣어줍니다.
						$("#tweetsList").html('');
						
						for (var i = 0; i < len; i++) {
							var tweet = results.rows.item(i);
							
							$.addTweetToList(tweet.username, tweet.userImageURL, tweet.text,tweet.username, tweet.location, tweet.followers_count, tweet.friends_count);
						}
					}
				});
			});
		}
		else {
			console.log('캐싱된 트윗 로딩 에러');
		}
	}
	
	$.stringFromDate = function(date) {
		
		var fullYear =  date.getFullYear().toString();
		var month = date.getMonth() < 10 ? '0' + date.getMonth().toString() : date.getMonth().toString();
		var day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString();
		var hours = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString();
		var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
		var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
		
		var dateArray = [fullYear, month, day];
		var timeArray = [hours, minutes, seconds];
		
		var dateString = dateArray.join('-') + ' ' + timeArray.join(':');
		
		return dateString;
	}
});
// 프로그램 시작시 실행할 함수 모음
$(document).ready(function() {

	$.prepDB();
	$.getTweets();
});

// 이벤트 함수 모음
$(document).ready(function() {
	$('#navList > li').click(function(){
		// 기존에 선택된 메뉴의 스타일을 제거
		$('#navList > li').removeClass('selected');
		// 지금 선택된 메뉴에 스타일을 추가
		$(this).addClass('selected');
		
		// 모든 섹션을 hide
		$("section").removeClass('selected');
		
		// 현재 섹션만 show
		if(this.id == 'idHome'){
			$('#home').addClass('selected');
		}
	});
});