window.onload = Initvideo;
function Initvideo() {
    var arr = document.getElementsByTagName("video");
    for (var i = 0; i < arr.length; i++) {
        AddListenerVideo(arr[i]);
        arr[i].addEventListener("play", function(){playWithBGM(this)}, false);
        arr[i].addEventListener("pause", function(){pauseWithBGM(this)}, false);
    }
}
function stopAllVideo()
{
	var arr = document.getElementsByTagName('video');
	for(var i = 0; i < arr.length; i++)
	{
        //pauseWithBGM(arr[i]);
		arr[i].pause();
	}
}
function pauseBGM(bgm, bgmDiv)
{
    bgm.pause();
    var classList = bgmDiv.classList;
    if(classList.contains("animate")) classList.remove("animate");
    var bgmPlay = parent.document.getElementById("bgmPlay");
    var bgmPause = parent.document.getElementById("bgmPause");
    bgmPlay.style.display = "block";
    bgmPause.style.display = "none";
}
function playBGM(bgm, bgmDiv)
{
    bgm.play();
    bgmDiv.classList.add("animate");
    var bgmPlay = parent.document.getElementById("bgmPlay");
    var bgmPause = parent.document.getElementById("bgmPause");
    bgmPlay.style.display = "none";
    bgmPause.style.display = "block";
}
var goOnBGM = false;
function pauseWithBGM(element) //需要停止当前视频播放，同时判断index.html里的背景音乐是否需要开始播放
{
    try{
        var bgm = parent.document.getElementById("aubgm");
        var bgmDiv = parent.document.getElementById("divbgm");
        if(goOnBGM) 
            playBGM(bgm, bgmDiv);
            //bgm.play();
        element.pause();
    } 
    catch(e){}; 
}
function playWithBGM(element)   //需要开始当前视频播放，同时判断index.html里是否有背景音乐，是否需要停止播放
{
    try
    {
        var bgm = parent.document.getElementById("aubgm");
        var bgmDiv = parent.document.getElementById("divbgm");
        if(bgm == undefined || bgm.paused){
            goOnBGM = false;
        }
        else if(bgm != undefined && !bgm.paused){
            goOnBGM = true;
            //bgm.pause();
            pauseBGM(bgm, bgmDiv);
        }
        element.play();
    }
    catch(e){}
}
function AddListenerVideo(demo) {
    var parentNode = demo.parentNode;
    var svgBg = GetChild('svg:svg', parentNode, 0);
    var isHasSpecParents = parents("div[title='PopupContent'][title='Animation']", demo);
    var zoominIcon;
    var zoomoutIcon;
    var playIcon;
    if (svgBg !== undefined) {
        //fixed layout
        zoominIcon = GetChild('', parentNode, 2);
        zoomoutIcon = GetChild('', parentNode, 3);
        playIcon = GetChild('', parentNode, 4);
        var jsonnode = GetChild('input', parentNode, 0);

        bindEvent(zoomoutIcon, 'vmousedown', PreventDefault);

        bindEvent(zoomoutIcon, 'vmouseup', mouseupzoomout);

        var data = eval('(' + jsonnode.value + ')');
      /*
        if (data.floatingWin === "true") {
            function videoPlayEvent(e) {
                var pg_Width = parseInt(document.body.getAttribute('data-width'));
                var pg_Height = parseInt(document.body.getAttribute('data-height'));
                videozoomin(e.target, pg_Width, pg_Height)
            }
            bindEvent(demo, 'play', videoPlayEvent);
            bindEvent(demo, 'ended', endvideoNocontrol);
        } //end of if(data.floatingWin)
*/      

        if (data.playOnPageTurn === "true" && isHasSpecParents.length === 0) {
            function autoPlayVideo() {
                //demo.style.zIndex = 90;
                //demo.play();
                //setTimeout(function(){playWithBGM(demo)}, 200);
                var bgm = parent.document.getElementById("aubgm");
                if (is_weixin() === true && (bgm == undefined || bgm.paused == true))
                {   
                    parent.autoPlayVideoFunc(demo.src, demo.loop);
                }
                else if(!is_weixin() && (bgm == undefined || bgm.paused == true)) playWithBGM(demo);
            }
            setTimeout(autoPlayVideo, data.playDelay * 1000);
        }
    }
    else {
        //flow layout
        zoominIcon = GetChild('', parentNode, 1);
        zoomoutIcon = GetChild('', parentNode, 2);
        playIcon = GetChild('', parentNode, 3);
    }

}

function videozoomout(video)
{
    video.style.top = '0px';
    video.style.left = '0px';
    video.style.width = '100%';
    video.style.height = '100%';
}

function videozoomin(video, pg_Width, pg_Height) {
    var parentNode = video.parentNode;
    var svgBg = GetChild('svg:svg', parentNode, 0);
    video.style.zIndex = 90;
//    if (pg_Width > pg_Height)
//    {
        var xpos = video.offsetLeft;
        var ypos = video.offsetTop;
        var parentA = video.parentNode;
        while (parentA)
        {
            var name = parentA.localName;
            if (name === 'body')
                break;
            xpos += parentA.offsetLeft;
            ypos += parentA.offsetTop;
            parentA = parentA.parentNode;
        }

        if (ypos !== 0)
        {
            video.style.top = '-' + ypos + 'px';
        }
        if (xpos !== 0) {
            video.style.left = '-' + (xpos-1) + 'px';
        }
        video.style.width = pg_Width + 'px';
        video.style.height = pg_Height + 'px';
//    }
//    else
//    {
//        var xpos = video.offsetLeft;
//        var ypos = video.offsetTop;
//        var parentA = video.parentNode;
//        while (parentA)
//        {
//            var name = parentA.localName;
//            if (name === 'body')
//                break;
//            xpos += parentA.offsetLeft;
//            ypos += parentA.offsetTop;
//            parentA = parentA.parentNode;
//        }
//        if (ypos !== 0)
//        {
//            video.style.top = '-' + ypos + 'px';
//        }
//        if (xpos !== 0)
//        {
//            video.style.left = '-' + xpos + 'px';
//        }
//        video.style.width = pg_Height + 'px';
//        video.style.height = pg_Width + 'px';
//    }
    if (svgBg !== undefined) {
        svgBg.style.zIndex = "88";
        svgBg.style.display = "inline";
        svgBg.style.top = video.style.top;
        svgBg.style.left = video.style.left;
        svgBg.style.width = video.style.width;
        svgBg.style.height = video.style.height;
    }
}

function endvideo(video)
{
    var parentNode = video.parentNode;
    var svgBg = GetChild('svg:svg', parentNode, 0);
    var zoominIcon;
    var zoomoutIcon;
    var playIcon;
    if (svgBg !== undefined) {
        zoominIcon = GetChild('', parentNode, 2);
        zoomoutIcon = GetChild('', parentNode, 3);
        playIcon = GetChild('', parentNode, 4);
    }
    else {
        zoominIcon = GetChild('', parentNode, 1);
        zoomoutIcon = GetChild('', parentNode, 2);
        playIcon = GetChild('', parentNode, 3);
    }

    playIcon.style.zIndex = 89;
    playIcon.style.display = 'inline';
    playIcon.style.top = "50%";
    playIcon.style.left = "50%";
    playIcon.style.marginTop = "-40px";
    playIcon.style.marginLeft = "-40px";

    video.style.zIndex = 80;
    video.style.top = '0px';
    video.style.left = '0px';
    video.style.width = '100%';
    video.style.height = '100%';

    zoomoutIcon.style.zIndex = 89;
    zoominIcon.style.zIndex = 89;

    if (svgBg !== undefined) {
        svgBg.style.display = "none";
    }
}

function pausevideo(video)
{
    var parentNode = video.parentNode;
    var zoominIcon;
    var zoomoutIcon;
    var playIcon;
    if (svgBg !== undefined) {
        zoominIcon = GetChild('', parentNode, 2);
        zoomoutIcon = GetChild('', parentNode, 3);
        playIcon = GetChild('', parentNode, 4);
    }
    else {
        zoominIcon = GetChild('', parentNode, 1);
        zoomoutIcon = GetChild('', parentNode, 2);
        playIcon = GetChild('', parentNode, 3);
    }
    if (zoominIcon.style.display === "inline")
    {
        video.style.zIndex = 80;
        playIcon.style.zIndex = 89;
    }
    else
    {
        video.style.zIndex = 90;
        playIcon.style.zIndex = 99;
    }
    playIcon.style.display = 'inline';
}

function endvideoNocontrol(event) {
    var video = event.target;
    var parent = video.parentNode;
    var svgBg = GetChild('svg:svg', parent, 0);
    video.style.zIndex = 80;
    video.style.top = '0px';
    video.style.left = '0px';
    video.style.width = '100%';
    video.style.height = '100%';
    if (svgBg !== undefined) {
        svgBg.style.display = "none";
    }
}

function mouseupvideo(video) {
    var parent = video.parentNode;
    var svgBg = GetChild('svg:svg', parent, 0);
    var playIcon;
    if (svgBg !== undefined) {
        playIcon = GetChild('', parent, 4);
    }
    else {
        playIcon = GetChild('', parent, 3);
    }
    if (playIcon.style.display === 'none')
    {
        video.pause();
        //pauseWithBGM(video);
    }
}

function mousedownvideo(video, event)
{
    event.preventDefault();
}

function mouseupzoomin(zoominIcon, pg_Width, pg_Height) {
    var parent = zoominIcon.parentNode;
    var svgBg = GetChild('svg:svg', parent, 0);
    var video;
    var zoomoutIcon;
    var playIcon;
    if (svgBg !== undefined) {
        video = GetChild('', parent, 1);
        zoomoutIcon = GetChild('', parent, 3);
        playIcon = GetChild('', parent, 4);
    }
    else {
        video = GetChild('', parent, 0);
        zoomoutIcon = GetChild('', parent, 1);
        playIcon = GetChild('', parent, 2);
    }

    zoomoutIcon.style.zIndex = 99;
    zoomoutIcon.style.display = "inline";

    zoominIcon.style.zIndex = 90;
    zoominIcon.style.display = "none";

    var xpos = video.offsetLeft;
    var ypos = video.offsetTop;
    if (pg_Width > pg_Height)
    {
        var parentA = video.parentNode;
        while (parentA)
        {
            var name = parentA.localName;
            if (name === 'body')
                break;
            xpos += parentA.offsetLeft;
            ypos += parentA.offsetTop;
            parentA = parentA.parentNode;
        }
        if (ypos !== 0) {
            playIcon.style.top = (pg_Height / 2 - ypos) + 'px';
            zoomoutIcon.style.top = '-' + ypos + 'px';
            zoominIcon.style.top = '-' + ypos + 'px';
        }
        if (xpos !== 0) {
            playIcon.style.left = (pg_Width / 2 - xpos) + 'px';
            zoomoutIcon.style.left = (pg_Width - xpos - 42) + 'px';
            zoominIcon.style.left = (pg_Width - xpos - 42) + 'px';
        }
        zoomoutIcon.style.marginLeft = "0px";
        zoominIcon.style.marginLeft = "0px";
    }
    else
    {
        var parentA = video.parentNode;
        while (parentA)
        {
            var name = parentA.localName;
            if (name === 'body')
                break;
            xpos += parentA.offsetLeft;
            ypos += parentA.offsetTop;
            parentA = parentA.parentNode;
        }
        if (ypos !== 0) {            
            playIcon.style.top = (pg_Height / 2 - ypos) + 'px';
            zoomoutIcon.style.top = '-' + ypos + 'px';
            zoominIcon.style.top = '-' + ypos + 'px';
        }
        if (xpos !== 0) {
            playIcon.style.left = (pg_Width / 2 - xpos) + 'px';
            zoomoutIcon.style.left = (pg_Width - xpos - 42) + 'px';
            zoominIcon.style.left = (pg_Width - xpos - 42) + 'px';
        }
        zoomoutIcon.style.marginLeft = "0px";
        zoominIcon.style.marginLeft = "0px";
    }
//    if (ypos !== 0)
//        svgBg.style.top = '-' + ypos + 'px';
//    if (xpos !== 0)
//        svgBg.style.left = '-' + xpos + 'px';
//    svgBg.style.display = "inline";

    if (playIcon.style.zIndex === 89)
        playIcon.style.zIndex = 99;
    else if (playIcon.style.zIndex === 80)
        playIcon.style.zIndex = 90;
    else
        playIcon.style.zIndex = 90;

    videozoomin(video, pg_Width, pg_Height);
}

function mousedownzoomin(zoominicon, event)
{
    event.preventDefault();
}

function mouseupzoomout(event) {
    event.preventDefault();
    var zoomoutIcon = event.target;
    var parent = zoomoutIcon.parentNode;
    var svgBg = GetChild('svg:svg', parent, 0);
    var video;
    var zoomoutIcon;
    var playIcon;
    if (svgBg !== undefined) {
        video = GetChild('', parent, 1);
        zoominIcon = GetChild('', parent, 2);
        playIcon = GetChild('', parent, 4);
    }
    else {
        video = GetChild('', parent, 0);
        zoominIcon = GetChild('', parent, 1);
        playIcon = GetChild('', parent, 3);
    }

    zoomoutIcon.style.zIndex = 80;
    zoomoutIcon.style.display = "none";

    zoominIcon.style.zIndex = 89;
    zoominIcon.style.display = "inline";

    zoomoutIcon.style.top = "0px";
    zoomoutIcon.style.left = "100%";
    zoomoutIcon.style.marginLeft = "-42px";

    zoominIcon.style.top = "0px";
    zoominIcon.style.left = "100%";
    zoominIcon.style.marginLeft = "-42px";

    video.style.zIndex = 80;

    playIcon.style.top = "50%";
    playIcon.style.left = "50%";
    playIcon.style.marginLeft = "-40px";
    playIcon.style.marginTop = "-40px";
    if (playIcon.style.zIndex === 90)
        playIcon.style.zIndex = 80;
    else if (playIcon.style.zIndex === 99)
        playIcon.style.zIndex = 89;
    if (svgBg !== undefined) {
        svgBg.style.display = "none";
    }

    videozoomout(video);
}

//function mousedownzoomout(event) {
//    event.preventDefault();
//}

function mouseupplay(playIcon, pg_Width, pg_Height) {
    if (playIcon.style.display === 'inline') {
        var parent = playIcon.parentNode;
        var svgBg = GetChild('svg:svg', parent, 0);
        var video;
        var zoominIcon;
        var zoomoutIcon;
        if (svgBg !== undefined) {
            video = GetChild('', parent, 1);
            zoominIcon = GetChild('', parent, 2);
            zoomoutIcon = GetChild('', parent, 3);
        }
        else {
            video = GetChild('', parent, 0);
            zoominIcon = GetChild('', parent, 1);
            zoomoutIcon = GetChild('', parent, 2);
        }
        var jsonnode = GetChild('input', parent, 0);
        var data = eval('(' + jsonnode.value + ')');
        
        if (zoomoutIcon.style.display !== "inline" && zoominIcon.style.display !== "inline")
        {
            mouseupzoomin(zoominIcon, pg_Width, pg_Height);
        }
        else if (data.floatingWin === "true") {
            mouseupzoomin(zoominIcon, pg_Width, pg_Height);
        }
        playIcon.style.display = "none";
        video.play();
        //playWithBGM(video);
    }
}

function mousedownplay(playIcon, event) {
    //event.preventDefault();
    PreventDefault(event);
}