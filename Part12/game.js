

var gWidth = null;
var gHeight = null;

var stage = null;
var layer = null;

// Resource
var imgBird = null;
var imgBack = null;
var imgBack2 = null;
var imgPig = null;

// Text
var txtLogo = null;
var txtStage = null;
var txtStage2 = null;
var txtScore = null;
var txtScore2 = null;
var txtEnemy = null;
var txtEnemy2 = null;
var txtLoading = null;

// Kinetic's Resource
var imagePig = null;
var imageBird = null;
var imageBack = null;

// Bird's XY
var x_bird;
var y_bird;

// 정확한 라인 출력을 위한 보정값.
var bhw	= 25;
var bhh	= 24;

// Start Point
var start_x;
var start_y;

// Prev Point
var prev_x;
var prev_y;

// Bird's Speed
var speed_x;
var speed_y;

// Gravity
var grav_x = 0;
var grav_y = 8;

// time
var prevFrameTime;
var elapsedTime;

// Line
var tLine = null;

////////// GAME DATA /////////////////
// Mode
var birdMode = 'none';
var gameState = 'launch';

// Level
var level = 1;

// Enemy's Num
var leftEnemy = 5;
var noEnemy = 5;

// Score
var score = 0;

// Enemy Status
var isPig = null;

var hitPig = 0;
	    	
function GameInitialize() {
	
	gWidth = 480;
	gHeight = 300;
	
	initFont();
	initStage();
	initLayer();
	initRes();
}

function initFont() {
	 WebFontConfig = {
	    google: { families: [ 'Eater::latin' ] }
	  };
	  (function() {
	    var wf = document.createElement('script');
	    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
	      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	    wf.type = 'text/javascript';
	    wf.async = 'true';
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(wf, s);
	  })();
}

function initMusic() {
	var audio = document.getElementsByTagName('audio')[0];
	audio.load();
	
	audio.addEventListener('load', function() {
		var audio2 = document.getElementsByTagName('audio')[1];
		audio2.load();
		
		audio2.addEventListener('load', function() {
			var audio3 = document.getElementsByTagName('audio')[2];
			audio3.load();
			
			audio3.addEventListener('load', function() {
				var audio4 = document.getElementsByTagName('audio')[2];
				audio4.load();
			}, false);
		}, false);
	}, false);
}
function initStage() {
	
				
	stage = new Kinetic.Stage({
					container:	"game",
					width:		gWidth,
					height:		gHeight
				});		
	
	stage.onFrame(function(frame){
		
		if(gameState == 'launchCleared'){
			
			if(birdMode == 'fly'){ // 새가 날라가는 모습 만들기
				if (imageBird.getPosition().x < 0 ||
					imageBird.getPosition().x > gWidth || 
					imageBird.getPosition().y > gHeight)
				{
					resetBird();
					
					if(hitPig == 0){
						score-=(3*level);
						updateScore();
					}
					hitPig = 0; // 돼지 맞춘거 초기화
					
					return;
				}
				var tmod = frame.timeDiff * 0.005;
				// 속도 만큼 움직인다.
				imageBird.setX(imageBird.getPosition().x + (speed_x * tmod));
				imageBird.setY(imageBird.getPosition().y + (speed_y * tmod));
	
				// 새의 각도 조절
				if (speed_x < 0)
					imageBird.setRotation(Math.atan(speed_y / speed_x) + 3.1415926);
				else
					imageBird.setRotation(Math.atan(speed_y / speed_x));
	
				// 속도가 중력가속도의 영향을 받는다.
				speed_x += grav_x * tmod;
				speed_y += grav_y * tmod;
				
				// 돼지랑 충돌 체크
				isCollision(imageBird.getPosition().x,imageBird.getPosition().y);
				
				// 출력
				layer.draw();
				
				// 게임 Clear여부 체크
				isGameClear();
			}
		}
	});								        
}

function initLayer() {
	layer = new Kinetic.Layer();
	// add the layer to the stage
	stage.add(layer);

}

function initRes() {
	// Background
    imgBack = new Image();
    imgBack.onload = function() {
		imageBack = new Kinetic.Image({
							x:		0,
							y:		0,
							image:	imgBack,
							width:	gWidth,
							height: gHeight
					});

		// add the shape to the layer
		layer.add(imageBack);
		
        imageBack.moveToBottom();
		layer.draw();
		setTimeout('updateOrientation()', 50);
    };
    
    imgBack.src = "./resource/images/background.png";

	// Bird
	imgBird = new Image();
    imgBird.onload = function() {
		imageBird = new Kinetic.Image({
							x:		100,
							y:		gHeight / 2,
							image:	imgBird,
							width:	95,
							height: 92,
							draggable: true
					});
		imageBird.setScale(0.4);
		imageBird.setOffset(imageBird.getWidth() / 2, imageBird.getHeight() / 2);
		x_bird = imageBird.getX();
		y_bird = imageBird.getY();

		// 시작 위치 설정
		start_x = imageBird.getX();
		start_y = imageBird.getY();
		
		prev_x = imageBird.getX();
		prev_y = imageBird.getY();

        
		imageBird.on("dragstart", function() {
			if(tLine == null){
				// 선 그리기 시작
				tLine = new Kinetic.Line({
					points:[imageBird.getPosition().x, imageBird.getPosition().y, start_x, y_bird],
					stroke:"black",
					strokeWidth:2,
					lineCap:"round",
					lineJoin:"round"	
				});						
				layer.add(tLine);
			}
			//setTimeout("playEffect(0)", 50);  // 효과음 시작
		});
		
		imageBird.on("dragmove", function() {

			speed_x = start_x - imageBird.getPosition().x;
			speed_y = start_y - imageBird.getPosition().y;
			
			var len = Math.sqrt(Math.pow(speed_x,2)+Math.pow(speed_y,2));
			var dirx = speed_x / len;
			var diry = speed_y / len;

			if(len > 100){
				imageBird.setX(start_x - dirx * 100);
				imageBird.setY(start_y - diry * 100);
			}
			
			//prev_x = image.getPosition().x;
			//prev_y = image.getPosition().y;
			
			tLine.setPosition({points:[imageBird.getPosition().x, imageBird.getPosition().y, x_bird, y_bird]});

			if (speed_x < 0)
				imageBird.setRotation(Math.atan(speed_y / speed_x) + 3.1415926);
			else
				imageBird.setRotation(Math.atan(speed_y / speed_x));

			layer.draw();
		});
		
		imageBird.on("dragend", function() {
			layer.remove(tLine);
			tLine = null;

			speed_x = start_x - imageBird.getPosition().x;
			speed_y = start_y - imageBird.getPosition().y;

			birdMode = 'fly';
		});

		// add the shape to the layer
		layer.add(imageBird);
		layer.draw();
    };
    
    imgBird.src = "./resource/images/bird.png";
    
    initEnemy();
    
}


function gameStart() {
	stage.start();
	var game = document.getElementById('game');
    game.style.opacity = 1;
    setTimeout("game.style.display = 'block'; ", 100);
    
    
	//gameState = 'launchCleared';
}

function gamePause() {
	stage.stop();
	var game = document.getElementById('game');
    game.style.opacity = 0;
    setTimeout("game.style.display = 'none'; ", 100);
    
	//gameState = 'launchCleared';
}

function playEffect(num){
	//setTimeout("playEffect(0)", 300);
	var audio = document.getElementsByTagName('audio')[num];
	if(audio.paused)
		audio.play();
}

function pauseEffect(num){
	//setTimeout("playEffect(0)", 300);
	var audio = document.getElementsByTagName('audio')[num];
	if(!audio.paused)
		audio.pause();
}