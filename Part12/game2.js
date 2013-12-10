

var gWidth = null;
var gHeight = null;

var stage = null;
var layer = null;

var anim = null;

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
	
	gWidth = 568;
	gHeight = 300;
	
	initFont();

	initStage();
	initLayer();
	initAnim();
	initGame();
	initRes();
	initMusic();
	stage.add(layer);
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
}

function initAnim() {
	
	anim = new Kinetic.Animation(function(frame){

		if(gameState == 'launchCleared'){
			if(birdMode == 'fly'){ // 새가 날라가는 모습 만들기

				if (imageBird.getX() < 0 ||
					imageBird.getX() > gWidth || 
					imageBird.getY() > gHeight)
				{
				
					resetBird();
					
					if(hitPig == 0){
						score-=(3*level);
						updateScore();
					}
					hitPig = 0; // 돼지 맞춘거 초기화
					
					return;
				}
				var tmod = (frame.timeDiff) * 0.005;
				
				// 속도 만큼 움직인다.
				imageBird.setX(imageBird.getX() + (speed_x * tmod));
				imageBird.setY(imageBird.getY() + (speed_y * tmod));

				// 새의 각도 조절
				if (speed_x < 0)
					imageBird.setRotation(Math.atan(speed_y / speed_x) + 3.1415926);
				else
					imageBird.setRotation(Math.atan(speed_y / speed_x));

				// 속도가 중력가속도의 영향을 받는다.
				speed_x += grav_x * tmod;
				speed_y += grav_y * tmod;
				
				// 돼지랑 충돌 체크
				isCollision(imageBird.getX(),imageBird.getY());

				// 게임 Clear여부 체크
				isGameClear();

			}
		}
	},layer);	
}

function initLayer() {
	layer = new Kinetic.Layer();
	// add the layer to the stage
	

}

function initGame() {
	//font-family: 'Eater', cursive;
	// 로고 출력

	txtLogo = new Kinetic.Text({
					          x: 10,
					          y: 10,
					          text: "ragebird",
					          fontSize: 18,
					          fontFamily: "Eater",
					          fill: "#d4012a",
					          textStroke:"#000",
					          strokeWidth:0.2,
					          shadowColor: 'black',
					          shadowBlur: 1,
					          shadowOffset: [10, 2],
					          shadowOpacity: 0.2
					        });	
    layer.add(txtLogo);
//    layer.draw();
    
    // Score 출력
	txtScore = new Kinetic.Text({
					          x: gWidth - 100,
					          y: 10,
					          text: "score : ",
					          fontSize: 10,
					          fontFamily: "tahoma",
					          fill: "black"
					        });	
    layer.add(txtScore);
    txtScore.moveToTop();
//    layer.draw();
    
    // 실제 Score 출력
	txtScore2 = new Kinetic.Text({
					          x: gWidth - 40,
					          y: 10,
					          text: "0",
					          fontSize: 10,
					          fontFamily: "tahoma",
					          fill: "red",
					          fontStyle:"bold"
					        });	
					        
					        
    layer.add(txtScore2);
    txtScore.moveToTop();
//    layer.draw();
    
    // Level 출력
	txtStage = new Kinetic.Text({
					          x: gWidth - 100,
					          y: 30,
					          text: "Level : ",
					          fontSize: 10,
					          fontFamily: "tahoma",
					          fill: "black"
					        });	
    layer.add(txtStage);
    txtStage.moveToTop();
//    layer.draw();
    
    // 실제 Level 출력
	txtStage2 = new Kinetic.Text({
					          x: gWidth - 40,
					          y: 30,
					          text: "1",
					          fontSize: 10,
					          fontFamily: "tahoma",
					          fill: "red",
					          fontStyle:"bold"
					        });	
					        
					        
    layer.add(txtStage2);
    txtStage2.moveToTop();
//    layer.draw();
    
    // Left Enemy 출력
	txtEnemy = new Kinetic.Text({
					          x: gWidth - 100,
					          y: 50,
					          text: "남은적 : ",
					          fontSize: 10,
					          fontFamily: "tahoma",
					          fill: "black"
					        });	
    layer.add(txtEnemy);
    txtEnemy.moveToTop();
//    layer.draw();
    
    // 실제 Level 출력
	txtEnemy2 = new Kinetic.Text({
					          x: gWidth - 40,
					          y: 50,
					          text: ""+leftEnemy,
					          fontSize: 10,
					          fontFamily: "tahoma",
					          fill: "red",
					          fontStyle:"bold"
					        });	
					        
					        
    layer.add(txtEnemy2);
    txtEnemy2.moveToTop();
//    layer.draw();
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
					points:[{x:imageBird.getX(), y:imageBird.getY()}, {x:start_x, y:y_bird}],
					stroke:"black",
					strokeWidth:2,
					lineCap:"round",
					lineJoin:"round"	
				});						
				layer.add(tLine);

			}
			setTimeout("playEffect(0)", 50);  // 효과음 시작
		});
		
		imageBird.on("dragmove", function() {

			speed_x = start_x - imageBird.getX();
			speed_y = start_y - imageBird.getY();
			
			var len = Math.sqrt(Math.pow(speed_x,2)+Math.pow(speed_y,2));
			var dirx = speed_x / len;
			var diry = speed_y / len;

			if(len > 100){
				imageBird.setX(start_x - dirx * 100);
				imageBird.setY(start_y - diry * 100);
			}
			
			
			tLine.setPoints([imageBird.getX(), imageBird.getY(), x_bird, y_bird]);

			if (speed_x < 0)
				imageBird.setRotation(Math.atan(speed_y / speed_x) + 3.1415926);
			else
				imageBird.setRotation(Math.atan(speed_y / speed_x));


		});
		
		imageBird.on("dragend", function() {
			tLine.remove();
			tLine = null;

			speed_x = start_x - imageBird.getX();
			speed_y = start_y - imageBird.getY();

			birdMode = 'fly';
		});

		// add the shape to the layer
		layer.add(imageBird);

    };
    
    imgBird.src = "./resource/images/bird.png";
    
    initEnemy();
    
}

function initEnemy() {
	// Pig
	imgPig = new Array();
	imagePig = new Array();
	isPig = new Array();
	
	var i = 0;
	var rand_x = 0;
	var rand_y = 0;
	for(i = 0 ; i < leftEnemy ; i++){
		rand_x = Math.floor(gWidth - ( Math.random()*100+50));
		rand_y = Math.floor(gHeight / 2 + ( Math.random()*100 * (Math.pow(-1,(i+1)))));
		setPig(i,rand_x,rand_y);
		
		isPig[i] = 0;
   }
}

function setPig(i,x,y) {
	imgPig[i] = new Image();
    imgPig[i].onload = function() {
		imagePig[i] = new Kinetic.Image({
							x:		x,
							y:		y,
							image:	imgPig[i],
							width:	30,
							height: 28
					});
		imagePig[i].setOffset(imagePig[i].getWidth() / 2, imagePig[i].getHeight() / 2);

      // add the shape to the layer
      layer.add(imagePig[i]);

	  
    };
    imgPig[i].src = "./resource/images/pig.png";
}

function isCollision(x1,y1){
	var i = 0;
	for(i = 0 ; i < noEnemy ; i++){
		var x2 = imagePig[i].getX() - (imagePig[i].getWidth() / 2+10);
		var x3 = imagePig[i].getX() + (imagePig[i].getWidth() / 2+10);
		
		var y2 = imagePig[i].getY() - (imagePig[i].getHeight() / 2+10);
		var y3 = imagePig[i].getY() + (imagePig[i].getHeight() / 2+10);
		if((x2 <= x1 && x1 <= x3) && (y2 <= y1 && y1 <= y3) && isPig[i] == 0){
			//layer.remove(imagePig[i]);
			imagePig[i].remove();

			score+=(10*level);
			leftEnemy--;
			isPig[i] = 1;
			hitPig = 1;
			updateScore();
			updateLeftEnemy();
			setTimeout("playEffect(1)", 50);  // 효과음 시작
		}
	}
	
}
   
function updateScore() {
	txtScore2.setText(""+score);
}

function updateLeftEnemy() {
	txtEnemy2.setText(""+leftEnemy);
}

function goNextLevel() {
	txtStage2.setText(""+level);
}

function isGameClear() {
	if(leftEnemy <= 0){
	setTimeout("playEffect(2)", 50);  // 효과음 시작
		alert(level+" level Clear!\n"+(level+1)+"'s level will start");
		resetBird();
		level++;
		noEnemy = 5+2*(level-1);
		leftEnemy = noEnemy;
		initEnemy();
		updateLeftEnemy();
		goNextLevel();
	}
}

function resetBird() {
	imageBird.setX(start_x);
	imageBird.setY(start_y);
	imageBird.setRotation(0);

	birdMode = 'none';
}

function updateLoadingMessage(txt) {
	txtLoading.setText(txt);
}

function gameStart() {
	anim.start();
	var game = document.getElementById('game');
    game.style.opacity = 1;
    setTimeout("game.style.display = 'block'; ", 100);
}

function gamePause() {
	anim.stop();
	var game = document.getElementById('game');
    game.style.opacity = 0;
    setTimeout("game.style.display = 'none'; ", 100);
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