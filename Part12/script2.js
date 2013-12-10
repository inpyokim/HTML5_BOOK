

function preInit()
{
    // Browser check
    // Look for iPhone OS
    if (navigator.appVersion.indexOf('iPhone') < 0 && navigator.appVersion.indexOf('iPad') < 0)
    {
        document.getElementById('game').style.display = 'none';
        document.getElementById('desktop').style.display = 'block';
    }
    else
    {
        // We have an iPhone!
        document.getElementById('desktop').style.display = 'none';

        // Event handlers
        document.body.ontouchstart = function(e) { e.preventDefault(); };
		
        if (!window.navigator.standalone && navigator.appVersion.indexOf('iPad') < 0)
        {           
            // Not an iPad, not running as an installed app                 
            document.getElementById('game').style.display = 'none';
            //document.getElementById('install').style.display = 'block';
            addToHome.show();
        }
        else
        {   
            // iPad or standalone
            window.onorientationchange = updateOrientation;

            // preload images
            GameInitialize();
            
            
            
        }
    }   

}

function updateOrientation()
{
    var orientation = window.orientation;

    if (navigator.appVersion.indexOf('iPad') < 0)
    {
    	
        switch (orientation)
        {   
            case 0:

            	gamePause();      
                if (gameState == 'launch' || gameState == 'launchCleared')
                {
                    showRotateNotice(gameState == 'launch'); // on launch, we need to set this because iPhone assumes all web app slaunch portrait
                }
                else
                {
                    showRotateNotice(false);
                }   
                break;
            case -90:

                if (gameState == 'launch')
                    gameState = 'launchCleared';
                hideRotateNotice();
                gameStart();
                break;
            case 90:

                if (gameState == 'launch')
                    gameState = 'launchCleared';
                hideRotateNotice();
                gameStart();
                break;
        }
    }
    else
    {
        // iPad!
        gameStart();
        switch (orientation)
        {   
            case 0:
                document.getElementById('all').style.webkitTransform = 'scale(1.6) translateY(152px)';
                break;
            case 180:
                document.getElementById('all').style.webkitTransform = 'scale(1.6) translateY(152px)';
                break;
            case 90:
                document.getElementById('all').style.webkitTransform = 'scale(2) translate(16px, 22px)';
                break;
            case -90:
                document.getElementById('all').style.webkitTransform = 'scale(2) translate(16px, 22px)';
                break;
        }       
    }
}

function showRotateNotice(isLaunch)
{
	var noticeRotate = document.getElementById('noticeRotate');
    if (isLaunch)
    {
        noticeRotate.style.width = '320px';
        noticeRotate.style.height = '460px';
    }   
    else
    {
        noticeRotate.style.width = '480px';
        noticeRotate.style.height = '460px';
    }
    noticeRotate.style.display = 'block';
    setTimeout("noticeRotate.style.opacity = 1;", 1);   
}

function hideRotateNotice()
{
	var noticeRotate = document.getElementById('noticeRotate');
    noticeRotate.style.opacity = 0;
    setTimeout("noticeRotate.style.display = 'none'; ", 300);
}