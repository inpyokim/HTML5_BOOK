$(document).ready(function() {
	$.callAjax = function(apiUrl) {
		var requestUrl = '../../Common/curl.php?apiUrl=' + escape(apiUrl);
		var tweets = new Array();
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
					var twit_id = otwit.id;
					var text = otwit.text;
					var imageUrl = otwit.user.profile_image_url;
					var screen_name = otwit.user.screen_name;
					var location = otwit.user.location;
					var followers_count = otwit.user.followers_count;
					var friends_count = otwit.user.friends_count;
					
					
					tweets[resultId] = otwit;
					
					// <li><div> 만들기
					$("#tweetsList").append("<li/>")
						.find("li:last").append("<div/>");
					
					// 유저 이미지 <img> 추가
					$("#tweetsList").find("li:last > div:last").append("<img/>");
					$("#tweetsList").find("li:last > div:last > img:last").attr('src', imageUrl).attr('alt',name).attr('class', 'user-image').attr('name',name).attr('screen_name',screen_name).attr('location',location).attr('followers_count',followers_count).attr('friends_count',friends_count);
					
					//5. 이미지 클릭시 $.setProfile() 함수 연결
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

								// 트윗 내용 -> 페북 공유 텍스트 추가
								$("#tweetsList").find("li:last > div:last").append("<span/>");
								$("#tweetsList").find("li:last > div:last > span:last").attr('id',resultId);
								$("#tweetsList").find("li:last > div:last > span:last").text("Share").attr('class', 'fbshare').click(function() {
									var tmp = tweets[this.id];
									var twt_url = "https://twitter.com/"+tmp.user.screen_name+"/status/"+tmp.id_str;
									publishStory(tmp.user.screen_name,tmp.text,twt_url,tmp.user.profile_image_url);
								});
								
								// 트윗 내용 <span>
								$("#tweetsList").find("li:last > div:last").append("<span/>");
								$("#tweetsList").find("li:last > div:last > span:last").text(text).attr('class', 'message');
							}
						}
						
					});
				};
				
				// 1. 사용자 정보를 보여주는 함수 추가
				$.showProfile = function(profile_image_url,name,screen_name,location,followers_count,friends_count){
					// 모든 네비게이션 목록을 hide합니다.
					$.clearAllNavItems();
					$.setProfile(profile_image_url,name,screen_name,location,followers_count,friends_count);
				}
				
				// 2. 유저의 상세정보를 얻는 함수 추가
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
				
				// 3. 화면전환 함수 만들기
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
				
				// 4. 유저 상세정보 섹션 표시함수 추가
				$.showSectionWithId = function(sid){
					$("#"+sid).addClass('selected');
				}
				
			});
			
			$(document).ready(function() {
				var apiUrl = 'https://api.twitter.com/1.1/search/tweets.json?q=html5&lang=ko';		
				$.callAjax(apiUrl);
			});

			
			$(document).ready(function() {
				$('#navList > li').click(function(){
					// 기존에 선택된 메뉴의 스타일을 제거합니다.
					$('#navList > li').removeClass('selected');
					// 지금 선택된 메뉴에 스타일을 추가합니다.
					$(this).addClass('selected');
					
					// 모든 섹션을 hide합니다.
					$("section").removeClass('selected');
					
					// 현재 섹션만 show합니다.
					if(this.id == 'idHome'){
						$('#home').addClass('selected');
					}
				});
			});