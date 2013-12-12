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
							
							for(var resultId in results) {
								var ome2 = results[resultId];
								
								// 유저 정보 얻기
								var name = ome2.author.id;
								var text = ome2.textBody;
								var imageUrl = ome2.author.face;
								
								
								// <li><div> 만들기
								$("#tweetsList").append("<li/>")
									.find("li:last").append("<div/>");
								
								// 유저 이미지 <img> 추가
								$("#tweetsList").find("li:last > div:last").append("<img/>");
								$("#tweetsList").find("li:last > div:last > img:last").attr('src', imageUrl).attr('alt',name).attr('class', 'user-image').attr('name',name);
								
								//5. 이미지 클릭시 $.getProfileForScreenName() 함수 연결
								$("#tweetsList").find("li:last > div:last > img:last").click(function() {
									$.showProfile(this.name);
								});
								
								
								
								// 유저 이름 <span> 추가
								$("#tweetsList").find("li:last > div:last").append("<span/>");
								$("#tweetsList").find("li:last > div:last > span:last").text(name).attr('class', 'username');

								// 트윗 내용 <span>
								$("#tweetsList").find("li:last > div:last").append("<span/>");
								$("#tweetsList").find("li:last > div:last > span:last").text(text).attr('class', 'message');
							}
						}
						
					});
				};
				
				// 1. 사용자 정보를 보여주는 함수 추가
				$.showProfile = function(userName){
					// 모든 네비게이션 목록을 hide합니다.
					$.clearAllNavItems();
					$.getProfileForScreenName(userName);
				}
				
				// 2. 유저의 상세정보를 얻는 함수 추가
				$.getProfileForScreenName = function(screenName) {
					var apiCall = 'http://me2day.net/api/get_person/' + screenName + '.json';
					var requestUrl = '../../Common/curl.php?apiUrl=' + escape(apiCall);

					$.ajax({
						url:requestUrl,
						type:'GET',
						error: function(){
							alert("Ajax Loading Error");
						},
						success: function(data){
							var oprofile = $.parseJSON(data);
							// 프로필 이미지 추가
							$("#profileImage").attr('src',oprofile.face).attr('alt',oprofile.nickname);
							
							// 이름 추가
							$("#name").text(oprofile.id);
							
							// ID 추가
							$("#screenName").text('미투홈 : ' + oprofile.me2dayHome);
							
							// 위치정보 추가
							$("#location").text(oprofile.location.name);
							
							// 총 미투글 추가
							$("#followersCount").text('총 미투글 :'+oprofile.totalPosts);
							
							// 팔로잉 수 추가
							$("#friendsCount").text('미투친구 :'+oprofile.friendsCount+' 명');
							
							// 미투 최신 글 1개 가져오는 Ajax Call 
							var apiCall = 'http://me2day.net/api/get_posts/' + screenName + '.json?offset=1&count=1';
							var requestUrl = '../../Common/curl.php?apiUrl=' + escape(apiCall);
							
							$.ajax({
								url:requestUrl,
								type:'GET',
								error: function(){
									alert("Ajax Loading Error");
								},
								success: function(data){
									var me2 = $.parseJSON(data);
									// 최신글 추가
									$("#statusText").text("최근미투 :"+me2[0].textBody);
									
									// 프로필 화면으로 전환
									$.switchToSectionWithId('profile');
								}
							});
							
							
							
						}
						
					});
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
				var apiUrl = 'http://me2day.net/search.json?query=(html5)&search_at=all';		
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