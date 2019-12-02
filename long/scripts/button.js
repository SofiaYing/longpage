function PlayVideo(showNode) {
	var videonodes = showNode.find("div[title='video']");
	for (var i = 0; i < videonodes.length; i++) {
		var video = GetChild('video', videonodes[i], 0);
		var duration = video.duration;
		if (duration)
			video.currentTime = 0;
		var jsonnode = GetChild('input', videonodes[i], 0);
		var data = eval('(' + jsonnode.value + ')');
		if (data.playOnPageTurn === "true") {
			function autoPlayVideo() {
				video.play();
			}
			setTimeout(autoPlayVideo, data.playDelay * 1000);
		}
	}
}

function PlayAudio(showNode) {
    var audionodes = showNode.find("audio");        //ibooks不支持autoplay属性
    for (var i = 0; i < audionodes.length; i++) {
        var inputJson = $(audionodes[i]).next('input');
        if (inputJson.length === 0)
        	continue;
		//非音频组件,待音频输出title
        var pardiv = audionodes[i].parentNode;
        var title = pardiv.getAttribute("title");
        if (title !== null)
        	continue;
        var child0 = GetChild('', pardiv, 0);
        var child1 = GetChild('', pardiv, 1);

        var jsonStr = inputJson[0].value;
        var dataObj = eval('(' + jsonStr + ')');
        if (dataObj.playOnPageTurn !== "true")
            continue;
        var duration = audionodes[i].duration;
        if (duration)
        	audionodes[i].currentTime = 0;

        child0.style.display = 'none';
        child1.style.display = 'inline';
        audionodes[i].play();
    }
}

function PlayClickplay(showNode) {
    var clickplayNodes = showNode.find("div[title='clickplay']");
    for (var i = 0; i < clickplayNodes.length; i++) {
        var demoA = clickplayNodes.eq(i);
        var divShowArea = demoA.children().eq(0);
        var divBkImg = divShowArea.children().eq(0);
        var img1 = divBkImg.children().eq(0);
        var imgNote = divBkImg.children().eq(1)[0];
        var divPlay = demoA.children().eq(1);
        var imgPlay = divPlay.children().eq(0);
        var divVari = demoA.children().eq(2);
        var divLyc = demoA.children().eq(3);
        var au1 = divLyc.children().eq(0);
        var inputJson = demoA.children().eq(4);

        var oldjsonStr = inputJson[0].value;
        var jsonStr = oldjsonStr.replace(/\n/g, "\\n");
        var dataObj = eval('(' + jsonStr + ')');

        var imgWidth = imgPlay[0].offsetHeight;
        var imgWidthPx = imgWidth + "px";
        imgPlay[0].style.width = imgWidthPx;
        imgPlay.attr("src", "Media/play.png");
        if (au1[0].autoplay = 'autoplay') {
            au1[0].play();
            imgPlay.attr("src", "Media/pause.png");
        }

        var lyric;
        if (dataObj.lrc !== "") {
            var ratioWidth;
            var ratioHeight;
            lyric = parseLyric(dataObj.lrc);
            var pos0 = lyric[0][1].indexOf('@');
            var rstr0 = lyric[0][1].substr(pos0 + 1);
            var arr0 = rstr0.split('|');
            ratioWidth = img1[0].offsetWidth / arr0[2];
            ratioHeight = img1[0].offsetHeight / arr0[3];
            imgNote.setAttribute('userRatioWidth', ratioWidth);
            imgNote.setAttribute('userRatioHeight', ratioHeight);

            //init the cursor icon's position
            for (var i = 1, l = lyric.length; i < l; i++) {
                var pos = lyric[i][1].indexOf('@');
                var rstr = lyric[i][1].substr(pos + 1);
                var arr = rstr.split(/[,|]/);
                if (arr[0] === "0" && arr[1] === "0")
                    continue;
                imgNote.style.left = arr[0] * ratioWidth + "px";
                imgNote.style.top = arr[1] * ratioHeight + "px";
                break;
            }

            //初始化点播歌词搜索下标
            demoA[0].setAttribute('userLastIndex', 1);
        }

        var left = imgWidth;
        divVari[0].style.heigth = divVari[0].style.top = imgWidthPx;
        var lendivPlay = divPlay.children().length;
        for (var j = 1; j < lendivPlay; j++) {
            var img = divPlay.children().eq(j)[0];
            img.style.left = left + "px;"
            img.style.width = imgWidthPx;
            left += imgWidth;
        }

        function parseLyric(text) {
            //get each line from the text
            var lines = text.split('\n'),
            //this regex mathes the time [00.12.78]
            pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
            result = [];
            if (lines.length <= 1)
                return;

            // Get offset from lyrics
            var offset = getOffset(text);

            //exclude the description parts or empty parts of the lyric
            while (!pattern.test(lines[0])) {
                lines = lines.slice(1);
            };
            //remove the last empty item
            lines[lines.length - 1].length === 0 && lines.pop();
            //display all content on the page
            lines.forEach(function (v, i, a) {
                var time = v.match(pattern),
            value = v.replace(pattern, '');
                if (time == null)
                    return;
                time.forEach(function (v1, i1, a1) {
                    //convert the [min:sec] to secs format then store into result
                    var t = v1.slice(1, -1).split(':');
                    result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]) + parseInt(offset) / 1000, value]);
                });
            });
            //sort the result by time
            result.sort(function (a, b) {
                return a[0] - b[0];
            });
            return result;
        }
    }
}

function PlaySprite(showNode) {
    var spriteNodes = showNode.find("div[title='sprite']");
    for (var i = 0; i < spriteNodes.length; i++) {
        var demoSlide = spriteNodes.eq(i);
        var count_of = demoSlide.children().length;
        var demo1 = demoSlide.eq(0);

        var icur = 0;
        var clickStop = false;
        var curImg = "";
        var lastSeqImg = false;

        var imgW = demo1.width();
        var imgH = demo1.height();

        // no json
        var jsonnode = demoSlide.children()[count_of - 1];
        var jsonStr = jsonnode.value;
        var data = eval('(' + jsonStr + ')');
        // no json
        var playOnPageTurn = data.playOnPageTurn;
        var imagePathfile = data.imagePathfile;
        var audioFileName = data.audioFileName;
        var playDelay = data.playDelay;
        var playSpeed = data.playSpeed;

        var speedstr = playDelay * 1000;
        var now;
        var then = Date.now();
        var interval = 1000 / playSpeed;
        var delta;
        var count = data.images.length;

        function SlideSeqImage() {
            try {
                seqImg(demo1, data.images[icur].image, imgW, imgH, false);
            }
            catch (err) {
            }
            icur++;
            if (icur === count) {
                icur = 0;
            }
        }

        function SlideDelay() {
            var stop = requestAnimationFrame(SlideDelay);
            demoSlide[0].setAttribute('userAnimationFrame', stop);
            if (clickStop) {
                window.cancelAnimationFrame(stop);
            }
            else {
                now = Date.now();
                delta = now - then;
                if (delta > interval) {
                    then = now - (delta % interval);
                    SlideSeqImage();
                }
            }
        }

        function StartPlay() {
            then = Date.now();
            SlideDelay();
        }

        function playAudio(demo1, audioFileName) {
            var parent = demo1.parent().eq(0);

            var audionode = parent.find("audio[src='" + audioFileName + "']")[0];
            if (audionode)
                audionode.play();
        }

        function PlaySlide() {
            icur = 0;
            clickStop = false;
            var stop = demoSlide[0].getAttribute('userAnimationFrame');
            if (stop !== undefined)//未选中自动播放
                window.cancelAnimationFrame(stop);
            playAudio(demo1, audioFileName);
            demo1.animate({ width: imgW + "px" }, speedstr, 'linear', StartPlay);
        }

        if (playOnPageTurn === 'true')
            PlaySlide();

        function seqImg(demo1, image, imgW, imgH, lastImg) {
            var imagenode = demo1.find("img[src='" + image + "']").eq(0);
            var divnode = imagenode.parent();
            divnode.prevAll().css("display", "none");
            divnode.nextAll().css("display", "none");
            divnode.css("display", "inline");

            lastSeqImg = lastImg;
        }
    }
}

function PlayPieChart(showNode) {
    var picchartNodes = showNode.find("div[title='pieChart']");
    for (var i = 0; i < picchartNodes.length; i++) {
        $(picchartNodes[i]).display();
    }
}

function PlayInteractiveInPopupContent(showNode) {
    PlayVideo(showNode);
    PlayAudio(showNode);

    PlayClickplay(showNode);
    PlaySprite(showNode);
    PlayPieChart(showNode);
}

function ShowFirstImageInPopupContent(showNode) {
    var buttonodes = showNode.find("div[title='Button']");
    for (var i = 0; i < buttonodes.length; i++) {
        var c_demoButton = buttonodes.eq(i);
        var c_slideCount = c_demoButton.children().length;
        var c_jsonnode = c_demoButton.children()[c_slideCount - 1];
        var c_jsonStr = c_jsonnode.value;
        var c_data = eval('(' + c_jsonStr + ')');

        var c_gotoStateAction = c_data.gotoStateAction;
        var c_gotoNextStateAction = c_data.gotoNextStateAction;
        var c_gotoPrevStateAction = c_data.gotoPrevStateAction;
        var c_stateuid = c_data.stateuid;
        var c_statetype = c_data.statetype;
        var c_gotoPageAction = c_data.gotoPageAction;
        var c_pageIndex = c_data.pageIndex;
        var c_gotoURLAction = c_data.gotoURLAction;
        var c_url = c_data.url;

        var c_slideshowuid = "";
        var c_slideshowimage = 0;

        var len = c_stateuid.length;
        if (len > 3) {
            var strhead = c_stateuid.substr(0, 3);
            if (strhead === "si_") {
                c_slideshowuid = c_stateuid;
                c_slideshowimage = Number(c_statetype) - 1;
            }
            else {
                c_slideshowuid = 'si_' + c_stateuid.substr(4);
                c_slideshowimage = Number(c_statetype);
            }
        }

        if (c_slideshowuid === "")
            continue;

        var c_demoSlide = $('div#' + c_slideshowuid);
        if (c_demoSlide[0].title !== "PopupContent")
            continue;

        var d_slideCount = c_demoSlide.children().length;
        var d_jsonnode = c_demoSlide.children()[d_slideCount - 1];
        var d_data = eval('(' + d_jsonnode.value + ')');
        var mutualExclusion = d_data.mutualExclusion;
        var displayCloseButton = d_data.displayCloseButton;
        var displayFirstImage = d_data.displayFirstImage;
        if (displayFirstImage === "false")
            continue;

        if (c_slideshowimage === 0) {
            c_demoSlide.children().eq(0)[0].style.display = 'inline';
            TopPopupContent(c_demoSlide, "auto");
            //设置弹出内容的控制按钮图片
            if (c_slideCount >= 3) {
                var divBtnIcon0 = c_demoButton.children().eq(0);
                var divBtnIcon1 = c_demoButton.children().eq(1);
                divBtnIcon0[0].style.display = "none";
                divBtnIcon1[0].style.display = "inline";
            }
        }
        else {
            if (c_slideCount >= 3) {
                var divBtnIcon0 = c_demoButton.children().eq(0);
                var divBtnIcon1 = c_demoButton.children().eq(1);
                divBtnIcon0[0].style.display = "inline";
                divBtnIcon1[0].style.display = "none";
            }
        }
    }
}

function TopPopupContent(showNode, parentIndex) {
    if (parentIndex === "auto")
        parentIndex = 0;
    var showchildnodes = showNode.find("div[title='Animation']");
    for (var i = 0; i < showchildnodes.length; i++) {
        var divchild = showchildnodes[i].children[0];
        //第一级弹出内容z-index为99,弹出内容点出的第二级弹出内容应该高于这个值
        $(divchild).css("zIndex", parseInt(parentIndex) + 99);
    }
    //如果不包含动画
    if (showchildnodes.length !== 0)
        return;

    //样张:粤语科学第10页,点击我的猜想
    //更新某一画面下各个子元素的显示z-index，防止后面元素被前面元素覆盖
    var showchild0 = showNode.children().eq(0);
    var indexMax = Number(showchild0.children().eq(0).css("zIndex"));
    for (var i = 1; i < showchild0.children().length; i++) {
        var indexi = Number(showchild0.children().eq(i).css("zIndex"));
        if (indexi > indexMax)
            indexMax = indexi;
        else
            showchild0.children().eq(i).css("zIndex", indexMax);
    }

    //样张：江苏省新闻出版学校-全球攻略,第27页,先点击第二个按钮，再点击第一个按钮    
    //css默认提供给弹出内容样式的z-index为99，为使html中前面的新弹出的内容不被后面的覆盖,需默认加100
    var totalPopupZindex = 100;
    var popupContents = $('div[title="PopupContent"]');
    for (var i = 0; i < popupContents.length; i++) {
        var children = popupContents.children('div');
        for (var j = 0; j < children.length; j++) {
            if (children.eq(i)[0].style.display !== "inline")
                continue;
            var iZindex = children.eq(i).css("zIndex");
            if(iZindex === "auto")
                iZindex = 0;
            var nZindex = parseInt(iZindex);
            if (totalPopupZindex < nZindex)
                totalPopupZindex = nZindex;
        }
    }
    if (totalPopupZindex < parseInt(parentIndex))
        totalPopupZindex = parseInt(parentIndex);
    showNode.css("position", "absolute");
    showNode.css("zIndex", totalPopupZindex + 100);
}

function UnTopPopupContent(showNode) {
    var showchildnodes = showNode.find("div[title='Animation']");
    for (var i = 0; i < showchildnodes.length; i++) {
        var divchild = $(showchildnodes[i].children[0]);
        var jsonAniNode = $(showchildnodes[i]).children('input')[0];
        divchild.css("zIndex", "");
        var dataAni = eval('(' + jsonAniNode.value + ')');
        var dataAnis0 = dataAni.states[0].animations[0];
        var triggerEvent = dataAnis0.type.charAt(dataAnis0.type.length - 1);
        if (dataAnis0.effect.indexOf("fade") >= 0 && dataAnis0.type.indexOf('toAppearance-') >= 0) {
            divchild.css("opacity", "0.0");
        }
        else if (triggerEvent !== '1' && dataAnis0.type.indexOf('toAppearance') >= 0) {
        	if (dataAnis0.effect.indexOf("fade") >= 0 ||
				dataAnis0.effect.indexOf("slide") >= 0 ||
				dataAnis0.effect.indexOf("back") >= 0 ||
				dataAnis0.effect.indexOf("fly") >= 0 ||
				dataAnis0.effect.indexOf("pop") >= 0
                ) {
                divchild.css('display', 'none');
            }
        }
    }
    if (showchildnodes.length !== 0)
        return;
    showNode.css("zIndex", "");
}

function ResetInteractiveInPopupContent(showNode){
    ResetVideo(showNode);
    ResetAudio(showNode);
    ResetButtonPopupContent(showNode);
    ResetClickplay(showNode);
    ResetSpriteContent(showNode);
}

function ResetVideo(showNode) {
    var videonodes = showNode.find("video");
    for (var i = 0; i < videonodes.length; i++) {
        var duration = videonodes[i].duration;
        if (duration)
            videonodes[i].currentTime = 0;
        videonodes[i].pause();
    }
}

function ResetAudio(showNode) {
    var audionodes = showNode.find("audio");
    for (var i = 0; i < audionodes.length; i++) {
        var inputJson = $(audionodes[i]).next('input');
        if (inputJson.length === 0)
            continue;
        var jsonStr = inputJson[0].value;
        var dataObj = eval('(' + jsonStr + ')');
        if (dataObj.playOnPageTurn !== "true")
            continue;
        var duration = audionodes[i].duration;
        if (duration)
            audionodes[i].currentTime = 0;
        audionodes[i].pause();
    }
}

function ResetButtonPopupContent(showNode) {
    var buttonodes = showNode.find("div[title='Button']");
    for (var i = 0; i < buttonodes.length; i++) {
        var c_demoButton = buttonodes.eq(i);
        var c_count_of = c_demoButton.children().length;

        var c_gotoStateAction = '';
        var c_gotoNextStateAction = '';
        var c_gotoPrevStateAction = '';
        var c_stateuid = '';
        var c_statetype = '';
        var c_gotoPageAction = '';
        var c_pageIndex = '';
        var c_gotoURLAction = '';
        var c_url = '';

        // no json
        var c_jsonnode = c_demoButton.children()[c_count_of - 1];
        var c_jsonStr = c_jsonnode.value;
        var c_data = eval('(' + c_jsonStr + ')');
        // no json

        c_gotoStateAction = c_data.gotoStateAction;
        c_gotoNextStateAction = c_data.gotoNextStateAction;
        c_gotoPrevStateAction = c_data.gotoPrevStateAction;
        c_stateuid = c_data.stateuid;
        c_statetype = c_data.statetype;
        c_gotoPageAction = c_data.gotoPageAction;
        c_pageIndex = c_data.pageIndex;
        c_gotoURLAction = c_data.gotoURLAction;
        c_url = c_data.url;

        var c_slideshowuid = "";
        var c_slideshowimage = 0;

        var len = c_stateuid.length;
        if (len > 3) {
            var strhead = c_stateuid.substr(0, 3);
            if (strhead === "si_") {
                c_slideshowuid = c_stateuid;
                c_slideshowimage = Number(c_statetype) - 1;
            }
            else {
                c_slideshowuid = 'si_' + c_stateuid.substr(4);
                c_slideshowimage = Number(c_statetype);
            }
        }
        if (c_slideshowuid !== "") {
            $('div#' + c_slideshowuid).each(function () {
                var c_demoSlide = $(this);
                var d_slideCount = c_demoSlide.children().length;

                if (c_demoSlide[0].title === "PopupContent") {
                    var d_state_count = d_slideCount - 1;
                    for (var j = 0; j < d_state_count; j++) {
                        var d_demoX = c_demoSlide.children().eq(j);

                        UnTopPopupContent(d_demoX);
                        d_demoX.css("display", "none");
                        ResetInteractiveInPopupContent(d_demoX);
                    }
                }
            });
        }
    }
}

function ResetClickplay(showNode) {
    var clickplayNodes = showNode.find("div[title='clickplay']");
    for (var i = 0; i < clickplayNodes.length; i++) {
        var demoA = clickplayNodes.eq(i);
        var divBkImg = demoA.children().eq(0);
        var img1 = divBkImg.children().eq(0);
        var imgNote = divBkImg.children().eq(1)[0];
        var divPlay = demoA.children().eq(1);
        var imgPlay = divPlay.children().eq(0);
        var divLyc = demoA.children().eq(3);
        var au1 = divLyc.children().eq(0);
        var inputJson = demoA.children().eq(4);

        var oldjsonStr = inputJson[0].value;
        var jsonStr = oldjsonStr.replace(/\n/g, "\\n");
        var dataObj = eval('(' + jsonStr + ')');

        au1.attr("src", dataObj.audioFileName);
        au1[0].currentTime = 0;
        au1[0].pause();
    }
}

function ResetSpriteContent(showNode) {
	var spriteNodes = showNode.find("div[title='sprite']");
	for (var i = 0; i < spriteNodes.length; i++) {
		var spriteNode = spriteNodes.eq(i);
		var stop = spriteNode[0].getAttribute('userAnimationFrame');
		window.cancelAnimationFrame(stop);
		var audionode = parent.find("audio")[0];
		if (audionode) {
			audionode.pause();
			audionode.curTime = 0;
		}
	}
}

function closeIMGButton(event) {
    //如果点击非关闭图标,返回
    if (event.target.nodeName.toLowerCase() !== "img" ||
        $(event.target).attr("src").indexOf("Media/close.png") < 0)
        return;

    var contentX = event.target.parentElement;
    UnTopPopupContent($(contentX));
    contentX.style.display = "none";
    ResetVideo($(contentX));
    ResetAudio($(contentX));
    ResetButtonPopupContent($(contentX));
    var parentX = contentX.parentNode;
    var parentid = parentX.id;
    var state = 1;
    var prev = contentX.previousSibling;
    while (prev) {
        state++;
        prev = prev.previousSibling;
    }

    $("div[title='Button']").each(function () {
        var b_demoButton = $(this);
        var b_count_of = b_demoButton.children().length;

        var b_gotoStateAction = '';
        var b_gotoNextStateAction = '';
        var b_gotoPrevStateAction = '';
        var b_stateuid = '';
        var b_statetype = '';
        var b_gotoPageAction = '';
        var b_pageIndex = '';
        var b_gotoURLAction = '';
        var b_url = '';

        // no json
        var b_jsonnode = b_demoButton.children()[b_count_of - 1];
        var b_jsonStr = b_jsonnode.value;
        var b_data = eval('(' + b_jsonStr + ')');
        // no json

        b_gotoStateAction = b_data.gotoStateAction;
        b_gotoNextStateAction = b_data.gotoNextStateAction;
        b_gotoPrevStateAction = b_data.gotoPrevStateAction;
        b_stateuid = b_data.stateuid;
        b_statetype = b_data.statetype;
        b_gotoPageAction = b_data.gotoPageAction;
        b_pageIndex = b_data.pageIndex;
        b_gotoURLAction = b_data.gotoURLAction;
        b_url = b_data.url;

        //如果按钮
        if (b_stateuid === parentid && Number(b_statetype) === state && b_demoButton.children('div').length > 1) {
            var divBtnIcon0 = b_demoButton.children().eq(0);
            var divBtnIcon1 = b_demoButton.children().eq(1);

            divBtnIcon0.css("display", "none");
            divBtnIcon1.css("display", "inline");
        }
    });
}

function Button() {
    var doc = $(document);

    var startEvent = 'vmousedown';
    var endEvent = 'vmouseup';
    var outEvent = 'vmouseout';
    var goToPageEvent;
    if (is_mobile())
    	goToPageEvent = 'touchstart';
    else
    	goToPageEvent = 'click';

    $("div[title='Button']").each(function () {

    	var demoButton = $(this);
    	var b_parentDiv = demoButton.parent();
    	var btID = b_parentDiv[0].id;
    	var count_of = demoButton.children().length;
    	var spaceW = demoButton.width();
    	var spaceH = demoButton.height();
    	var gotoStateAction = '';
    	var gotoNextStateAction = '';
    	var gotoPrevStateAction = '';
    	var stateuid = '';
    	var statetype = '';
    	var gotoPageAction = '';
    	var pageIndex = '';
    	var gotoURLAction = '';
    	var url = '';
    	var effect;
    	var slideDirection
    	// no json
    	var jsonnode = demoButton.children()[count_of - 1];
    	var jsonStr = jsonnode.value;
    	var data = eval('(' + jsonStr + ')');
    	// no json

    	gotoStateAction = data.gotoStateAction;
    	gotoNextStateAction = data.gotoNextStateAction;
    	gotoPrevStateAction = data.gotoPrevStateAction;
    	stateuid = data.stateuid;
    	statetype = data.statetype;
    	gotoPageAction = data.gotoPageAction;
    	pageIndex = data.pageIndex;
    	gotoURLAction = data.gotoURLAction;
    	url = data.url;
    	var gotoZoomAction = data.gotoZoomAction;
    	function addButtonListener(demo, btID) {
    		var xpos = demo[0].offsetLeft;
    		var ypos = demo[0].offsetTop;
    		var divBtnIcon0 = demo.children().eq(0);
    		var divBtnIcon1 = demo.children().eq(1);
    		divBtnIcon1.css("display", "none");

    		function ShowUpButton() {
    			if (count_of === 3) {
    				var demo_1 = demoButton.children().eq(0);
    				var demo_2 = demoButton.children().eq(1);

    				demo_1.css("display", "inline");
    				demo_2.css("display", "none");
    			}
    		}

    		function ShowDownButton() {
    			if (count_of === 3) {
    				var demo_1 = demoButton.children().eq(0);
    				var demo_2 = demoButton.children().eq(1);

    				demo_1.css("display", "none");
    				demo_2.css("display", "inline");
    			}
    		}

    		function GoTo(bt_ID, parentIndex) {
    			var slideshowuid = "";
    			var slideshowimage = 0;

    			var len = stateuid.length;
    			if (len > 3) {
    				var strhead = stateuid.substr(0, 3);
    				if (strhead === "si_") {
    					slideshowuid = stateuid;
    					slideshowimage = Number(statetype) - 1;
    				}
    				else {
    					slideshowuid = 'si_' + stateuid.substr(4);
    					slideshowimage = Number(statetype);
    				}
    			}

    			$('div#' + slideshowuid).each(function () {
    				var demoSlide = $(this);

    				var slideCount = demoSlide.children().length;
    				if (demoSlide[0].title === "SlideShow") {
    					var spaceW = parseInt(demoSlide[0].style.width); //demoSlide.width();
    					var spaceH = parseInt(demoSlide[0].style.height); //demoSlide.height();
    					// no json
    					var _jsonnode = demoSlide.children()[slideCount - 1];
    					var _jsonStr = _jsonnode.value;
    					var _data = eval('(' + _jsonStr + ')');
    					// no json

    					var playOnPageTurn = _data.slideshow[0].playOnPageTurn;
    					var playDelay = _data.slideshow[0].playDelay;
    					var playInterval = _data.slideshow[0].playInterval;
    					effect = _data.slideshow[0].effect;
    					var slideSpeed = _data.slideshow[0].slideSpeed;
    					slideDirection = _data.slideshow[0].slideDirection;

    					var wipeEnable = _data.slideshow[0].wipeEnable;
    					var fullScreen = _data.slideshow[0].fullScreen;

    					var speed = 2000;
    					if (slideSpeed === "slow")
    						speed = 4000;
    					else if (slideSpeed === "normal")
    						speed = 2000;
    					else if (slideSpeed === "fast")
    						speed = 1000;
    					var playGap = Number(playInterval) * 1000;
    					var state_count = slideCount - 1;

    					var demoImg = demoSlide.children().eq(slideshowimage);
    					if (effect == "fade") {
    						var picGroup = [];
    						var fadePicIndex = 0;
    						for (var i = 0; i < state_count; i++) {
    							picGroup.push(demoSlide.children().eq(i));
    						}
    					}
    					var newDirection = demoSlide.attr("slideDirection");
    					if (newDirection !== undefined)
    						slideDirection = newDirection;

    					//动画停止
    					for (var j = 0; j < state_count; j++) {
    						var item = demoSlide.children().eq(j);
    						item.stop();
    						//取消slidShow.js里面的interval
    						var idRaf = item.attr("idRaf");
    						window.clearInterval(idRaf);
    					}
    					if (effect === "slide") {
    						if (slideDirection === "leftToRight" || slideDirection === "rightToLeft") {
    							if (gotoNextStateAction === "true") {
    								for (var i = 0; i < state_count; i++) {
    									var demoX = demoSlide.children().eq(i);
    									var left = demoX[0].style.left;

    									left = left.substring(0, left.indexOf("px"));
    									var ileft = Number(left);
    									if (ileft >= 0 && ileft < spaceW && slideDirection === "leftToRight") {
    										slideshowimage = (i - 1 + state_count) % state_count;
    										demoImg = demoSlide.children().eq(slideshowimage);
    										break;
    									}
    									else if (ileft > -spaceW && ileft <= 0 && slideDirection === "rightToLeft") {
    										slideshowimage = (i + 1 + state_count) % state_count;
    										demoImg = demoSlide.children().eq(slideshowimage);
    										break;
    									}
    								}
    							}
    							else if (gotoPrevStateAction === "true") {
    								for (var i = 0; i < state_count; i++) {
    									var demoX = demoSlide.children().eq(i);
    									var left = demoX[0].style.left;

    									left = left.substring(0, left.indexOf("px"));
    									var ileft = Number(left);
    									if (ileft >= 0 && ileft < spaceW && slideDirection === "leftToRight") {
    										slideshowimage = (i + 1 + state_count) % state_count;
    										demoImg = demoSlide.children().eq(slideshowimage);
    										break;
    									}
    									else if (ileft > -spaceW && ileft <= 0 && slideDirection === "rightToLeft") {
    										slideshowimage = (i - 1 + state_count) % state_count;
    										demoImg = demoSlide.children().eq(slideshowimage);
    										break;
    									}
    								}
    							}
    							//计算被选中后的每个图片的左坐标
    							var leftpos = demoImg[0].style.left;
    							leftpos = leftpos.substring(0, leftpos.indexOf("px"));
    							var ileftpos = Number(leftpos);
    							if (ileftpos !== 0) {
    								for (var i = 0; i < state_count; i++) {
    									var arrpos = (i + slideshowimage) % state_count;
    									var demoX = demoSlide.children().eq(arrpos);
    									demoX[0].style.left = i * spaceW + "px";
    								}
    							}

    						}
    						else if (slideDirection === "topToBottom" || slideDirection === "bottomToTop") {
    							if (gotoNextStateAction === "true") {
    								for (var i = 0; i < state_count; i++) {
    									var demoX = demoSlide.children().eq(i);
    									var top = demoX[0].style.top;

    									top = top.substring(0, top.indexOf("px"));
    									var itop = Number(top);
    									if (itop >= 0 && itop < spaceH && slideDirection === "topToBottom") {
    										slideshowimage = (i - 1 + state_count) % state_count;
    										demoImg = demoSlide.children().eq(slideshowimage);
    										break;
    									}
    									else if (itop > -spaceH && itop <= 0 && slideDirection === "bottomToTop") {
    										slideshowimage = (i + 1 + state_count) % state_count;
    										demoImg = demoSlide.children().eq(slideshowimage);
    										break;
    									}
    								}
    							}
    							else if (gotoPrevStateAction === "true") {
    								for (var i = 0; i < state_count; i++) {
    									var demoX = demoSlide.children().eq(i);
    									var top = demoX[0].style.top;

    									top = top.substring(0, top.indexOf("px"));
    									var itop = Number(top);
    									if (itop >= 0 && itop < spaceH && slideDirection === "topToBottom") {
    										slideshowimage = (i + 1 + state_count) % state_count;
    										demoImg = demoSlide.children().eq(slideshowimage);
    										break;
    									}
    									else if (itop > -spaceH && itop <= 0 && slideDirection === "bottomToTop") {
    										slideshowimage = (i - 1 + state_count) % state_count;
    										demoImg = demoSlide.children().eq(slideshowimage);
    										break;
    									}
    								}
    							}
    							//计算被选中后的每个图片的上坐标
    							var toppos = demoImg[0].style.top;
    							toppos = toppos.substring(0, toppos.indexOf("px"));
    							var itoppos = Number(toppos);
    							if (itoppos !== 0) {
    								for (var i = 0; i < state_count; i++) {
    									var arrpos = (i + slideshowimage) % state_count;
    									var demoX = demoSlide.children().eq(arrpos);
    									demoX[0].style.top = i * spaceH + "px";
    								}
    							}
    						}
    					}
    					else if (effect === "fade") {
    						var fromIndex = 0;
    						var turnToIndex = 0;
    						var visibleItemIndex = [];
    						for (var i = 0; i < state_count; i++) {
    							var tempDemo = demoSlide.children().eq(i);
    							if (tempDemo.is(":visible")) {
    								visibleItemIndex.push(i);
    							}
    						}

    						if (visibleItemIndex.length === 1)   //只有一张图片正在显示,淡入淡出完成
    						{
    							if (gotoNextStateAction === "true") {
    								if (slideDirection === "leftToRight") {
    									turnToIndex = (visibleItemIndex[0] + state_count - 1) % state_count;
    								}
    								else if (slideDirection === "rightToLeft") {
    									turnToIndex = (visibleItemIndex[0] + 1) % state_count;
    								}
    							}
    							else if (gotoPrevStateAction === "true") {
    								if (slideDirection === "leftToRight") {
    									turnToIndex = (visibleItemIndex[0] + 1) % state_count;
    								}
    								else if (slideDirection === "rightToLeft") {
    									turnToIndex = (visibleItemIndex[0] + state_count - 1) % state_count;
    								}
    							}
    							else {
    								turnToIndex = slideshowimage;
    							}
    							fromIndex = visibleItemIndex[0];
    							demoSlide.children().eq(fromIndex).css({ display: "none" });
    							demoSlide.children().eq(turnToIndex).css({ display: "" });
    						}
    						else if (visibleItemIndex.length === 2)  //同时有两张图片在显示，在淡入淡出的过程中
    						{
    							if ((visibleItemIndex[0] + 1) % state_count === visibleItemIndex[1]) //第一个在前，第二个在后
    							{
    								if (gotoNextStateAction === "true") {
    									if (slideDirection === "leftToRight") {
    										fromIndex = visibleItemIndex[1];
    										turnToIndex = visibleItemIndex[0];
    									}
    									else if (slideDirection === "rightToLeft") {
    										fromIndex = visibleItemIndex[0];
    										turnToIndex = visibleItemIndex[1];
    									}
    								}
    								else if (gotoPrevStateAction === "true") {
    									if (slideDirection === "leftToRight") {
    										fromIndex = visibleItemIndex[0];
    										turnToIndex = visibleItemIndex[1];
    									}

    									else if (slideDirection === "rightToLeft") {
    										fromIndex = visibleItemIndex[1];
    										turnToIndex = visibleItemIndex[0];
    									}

    								}
    								else    //点击的是第一张或者最后一张的按钮
    								{
    									turnToIndex = slideshowimage;
    								}
    							}
    							else {
    								if (gotoNextStateAction === "true") {
    									if (slideDirection === "leftToRight") {
    										fromIndex = visibleItemIndex[0];
    										turnToIndex = visibleItemIndex[1];
    									}

    									else if (slideDirection === "rightToLeft") {
    										fromIndex = visibleItemIndex[1];
    										turnToIndex = visibleItemIndex[0];
    									}

    								}
    								else if (gotoPrevStateAction === "true") {
    									if (slideDirection === "leftToRight") {
    										fromIndex = visibleItemIndex[1];
    										turnToIndex = visibleItemIndex[0];
    									}

    									else if (slideDirection === "rightToLeft") {
    										fromIndex = visibleItemIndex[0];
    										turnToIndex = visibleItemIndex[1];
    									}

    								}
    								else {
    									turnToIndex = slideshowimage;
    								}
    							}
    							demoSlide.children().eq(fromIndex).stop().css({ opacity: "", display: "none" });
    							demoSlide.children().eq(turnToIndex).stop().css({ opacity: "", display: "" });
    						}
    						fadePicIndex = turnToIndex;
    						demoSlide.attr("picIndex", fadePicIndex);
    					}



    					//如果自动播放幻灯片
    					if (playOnPageTurn === "true") {
    						//动画重启,begin
    						if (effect === "slide") {
    							var slideID = setInterval(PlaySlide1, playGap + speed);
    							demoSlide.children().eq(0).attr("idRaf", slideID);
    							demoSlide.children().eq(0).attr("btnID", bt_ID);
    						}
    						else if (effect === "fade") {
    							var fadeID = setInterval(fadeShowImgAnimation, playGap + speed);
    							demoSlide.children().eq(0).attr("idRaf", fadeID);
    							demoSlide.children().eq(0).attr("btnID", bt_ID);
    						}
    						//动画重启,end
    					}

    					// 显示按下按钮
    					ShowDownButton();

    					//幻灯片代码,begin
    					function Func1() {
    						ShowUpButton();
    					}
    					function Func2() {
    						//   PlaySlide1();
    					}
    					function getNextFadePicIndex()  //更改fadePicIndex是得指向下一张图
    					{
    						slideDirection = demoSlide.attr("slideDirection");
    						if (slideDirection == "leftToRight") {
    							fadePicIndex = (fadePicIndex - 1 + state_count) % state_count;
    						}
    						else if (slideDirection == "rightToLeft")                // right
    						{
    							fadePicIndex = (fadePicIndex + 1) % state_count;
    						}
    					}
    					function setOpacity() {
    						$(this).css("opacity", "");
    					}
    					function fadeShowImgAnimation() {

    						demoSlide.children().eq(fadePicIndex).fadeOut(speed, setOpacity);
    						getNextFadePicIndex();
    						demoSlide.attr("picIndex", fadePicIndex);
    						demoSlide.children().eq(fadePicIndex).fadeIn(speed, setOpacity);
    					}
    					function slideShowImgAnimation(demo, direction) {

    						var demo1, demo2;
    						if (direction === "left")      // left
    						{
    							for (var i = 0; i < state_count; i++) {
    								var demoX = demo.children().eq(i);
    								var left = parseInt(demoX[0].style.left);

    								if (left === 0)
    									demo1 = demoX;
    								else if (left === spaceW)
    									demo2 = demoX;
    								else {
    									demoX[0].style.left = (left - spaceW) + 'px';
    								}
    							}

    							function ResetLeft() {
    								demo1[0].style.left = (spaceW * (state_count - 1)) + 'px';
    								Func1();
    							}

    							try {
    								demo1.stop().animate({ left: "-" + spaceW + "px" }, speed, 'linear', ResetLeft);
    								demo2.stop().animate({ left: "0px" }, speed, 'linear', Func2);
    							}
    							catch (e) {
    								var msg = e.name + e.message;
    							}

    						}
    						else if (direction === "right")                // right
    						{
    							for (var i = 0; i < state_count; i++) {
    								var demoX = demo.children().eq(i);
    								var left = demoX[0].style.left;
    								if (left === '0px')
    									demo1 = demoX;
    								else if (left === (spaceW * (state_count - 1) + 'px'))
    									demo2 = demoX;
    								else {
    									left = left.substring(0, left.indexOf("px"));
    									demoX[0].style.left = (Number(left) + spaceW) + 'px';
    								}
    							}

    							demo2[0].style.left = '-' + spaceW + 'px';
    							demo2.animate({ left: "0px" }, speed, 'linear', Func1);
    							demo1.animate({ left: spaceW + "px" }, speed, 'linear', Func2);
    						}
    						if (direction === "top")      // top
    						{
    							for (var i = 0; i < state_count; i++) {
    								var demoX = demo.children().eq(i);
    								var top = parseInt(demoX[0].style.top);

    								if (top === 0)
    									demo1 = demoX;
    								else if (top === (1 - state_count) * spaceH)
    									demo2 = demoX;
    								else {
    									demoX[0].style.top = (top - spaceH) + 'px';
    								}
    							}

    							function ResetTop() {
    								Func1();
    							}
    							demo2[0].style.top = spaceH + "px";
    							demo1.stop().animate({ top: "-" + spaceH + "px" }, speed, 'linear', ResetTop);
    							demo2.stop().animate({ top: "0px" }, speed, 'linear', Func2);
    						}
    						else if (direction === "bottom")                // bottom
    						{
    							for (var i = 0; i < state_count; i++) {
    								var demoX = demo.children().eq(i);
    								var top = parseInt(demoX[0].style.top);
    								if (top === 0)
    									demo1 = demoX;
    								else if (top === (state_count - 1) * spaceH)
    									demo2 = demoX;
    								else {
    									demoX[0].style.top = (top + spaceH) + 'px';
    								}
    							}
    							demo2[0].style.top = -spaceH + "px";
    							demo2.stop().animate({ top: "0px" }, speed, 'linear', ResetTop);
    							demo1.stop().animate({ top: spaceH + "px" }, speed, 'linear', Func2);
    						}
    						demoSlide.resetDemo(demo1, demo2);
    					}
    					function slideLeft() {
    						slideShowImgAnimation(demoSlide, "left");
    					}
    					function slideRight() {
    						slideShowImgAnimation(demoSlide, "right");
    					}
    					function slideTop() {
    						slideShowImgAnimation(demoSlide, "top");
    					}
    					function slideBottom() {
    						slideShowImgAnimation(demoSlide, "bottom");
    					}
    					function fadeLeft() {
    						fadeShowImgAnimation(demoSlide, "left");
    					}
    					function fadeRight() {
    						fadeShowImgAnimation(demoSlide, "right");
    					}
    					function fadeTop() {
    						fadeShowImgAnimation(demoSlide, "top");
    					}
    					function fadeBottom() {
    						fadeShowImgAnimation(demoSlide, "bottom");
    					}

    					function PlaySlide1() {
    						var newDirection = demoSlide.attr("slideDirection");
    						if (newDirection !== undefined)
    							slideDirection = newDirection;
    						if (effect === "slide") {
    							if (slideDirection === "leftToRight") {
    								slideRight();
    							}
    							else if (slideDirection === "rightToLeft") {
    								slideLeft();
    							}
    							else if (slideDirection === "topToBottom") {
    								slideBottom();
    							}
    							else if (slideDirection === "bottomToTop") {
    								slideTop();
    							}
    						}
    						else if (effect === "fade") {
    							if (slideDirection === "leftToRight") {
    								fadeRight();
    							}
    							else if (slideDirection === "rightToLeft") {
    								fadeLeft();
    							}
    							else if (slideDirection === "topToBottom") {
    								fadeBottom();
    							}
    							else if (slideDirection === "bottomToTop") {
    								fadeTop();
    							}
    						}

    						//requestAnimationFrame(PlaySlide1());
    					}
    					//幻灯片代码,end

    				}
    				else if (demoSlide[0].title === "PopupContent") {
    					var spaceW = demoSlide.width();
    					var spaceH = demoSlide.height();
    					var state_count = slideCount - 1;
    					// no json
    					var _jsonnode = demoSlide.children()[slideCount - 1];
    					var _jsonStr = _jsonnode.value;
    					var _data = eval('(' + _jsonStr + ')');
    					// no json

    					var mutualExclusion = _data.mutualExclusion;
    					var displayCloseButton = _data.displayCloseButton;

    					var posInit = true;
    					var posLeft = 0;
    					var posTop = 0;

    					function GetItemTopLeft(content) {
    						var grpItemLenth = content.length;
    						for (var i = 0; i < grpItemLenth; i++) {
    							if (content.children()[i].title === "groupItem")
    								GetItemTopLeft(content.children().eq(i));
    							else {
    								var transX = 1;
    								var transY = 1;
    								var transformStr = content.children().eq(i).css("transform");
    								if (transformStr !== "" && transformStr !== "none") {
    									var _transformStr = transformStr.substring(7);
    									_transformStr = _transformStr.substring(0, _transformStr.length - 1);
    									var transformArray = _transformStr.split(',');
    									if (transformArray.length === 6) {
    										transX = Number(transformArray[0]);
    										transY = Number(transformArray[3]);
    									}
    								}
    								var itemposLeft = (content.children()[i].offsetLeft + content.children()[i].offsetWidth / 2) + (content.children()[i].offsetWidth * transX) / 2;
    								var itemposTop = (content.children()[i].offsetTop + content.children()[i].offsetHeight / 2) - (content.children()[i].offsetHeight * transX) / 2;

    								if (posInit) {
    									posLeft = itemposLeft;
    									posTop = itemposTop;
    									posInit = false;
    								}
    								else {
    									posLeft = posLeft > itemposLeft ? posLeft : itemposLeft;
    									posTop = posTop < itemposTop ? posTop : itemposTop;
    								}
    							}
    						}
    					}
    					function MoveCloseButton(contentX) {
    						var contentLength = contentX.children().length;
    						if (contentLength === 2) {
    							GetItemTopLeft(contentX.children().eq(0));
    							if (is_mobile()) {
    								contentX.children().eq(1).css("left", (posLeft - 100) + "px");
    							}
    							else {
    								contentX.children().eq(1).css("left", (posLeft - 50) + "px");
    								contentX.children().eq(1).css({ "width": "50px", "height": "50px" });
    							}
    							contentX.children().eq(1).css("top", posTop + "px");
    						}
    					}

    					if (mutualExclusion === 'true') {

    						var ShowButton = true;

    						var gotoState = false;
    						if (gotoNextStateAction === "true") {
    							slideshowimage = -1;
    							for (var i = 0; i < state_count; i++) {
    								var demoX = demoSlide.children().eq(i);
    								if (demoX[0].style.display === "inline") {
    									slideshowimage = i + 1;
    									if (slideshowimage === state_count) {
    										slideshowimage = 0;
    									}
    									break;
    								}
    							}
    						}
    						else if (gotoPrevStateAction === "true") {
    							var gotoLast = true;
    							slideshowimage = -1;
    							for (var i = 0; i < state_count; i++) {
    								var demoX = demoSlide.children().eq(i);
    								if (demoX[0].style.display === "inline") {
    									gotoLast = false;
    									slideshowimage = i - 1;
    									if (slideshowimage < 0) {
    										slideshowimage = state_count - 1;
    									}
    									break;
    								}
    							}
    							if (gotoLast)
    								slideshowimage = state_count - 1;
    						}

    						for (var i = 0; i < state_count; i++) {
    							var demoX = demoSlide.children().eq(i);
    							var bCurentShow = false;
    							if (demoX[0].style.display === "inline")
    								bCurentShow = true;
    							if (slideshowimage === -1) {
    								demoX.css("display", "inline");
    								MoveCloseButton(demoX);
    								if (!bCurentShow) {
    									TopPopupContent(demoX, 0);
    									PlayInteractiveInPopupContent(demoX);
    								}
    								slideshowimage = i;
    								if (gotoStateAction === "true" && bCurentShow === false) {
    									if (ShowButton) {
    										ShowDownButton();
    										ShowButton = false;
    									}

    									// 处理其他相关互斥按钮弹起
    									$("div[title='Button']").each(function () {

    										var demo_Button = $(this);
    										var _count_of = demo_Button.children().length;
    										// no json
    										var _jsonnode = demo_Button.children()[count_of - 1];
    										var _jsonStr = _jsonnode.value;
    										var _data = eval('(' + _jsonStr + ')');
    										// no json

    										var _stateuid = _data.stateuid;
    										var _statetype = _data.statetype;
    										if (_stateuid === stateuid && _statetype !== statetype) {
    											if (_count_of === 3) {
    												var _demo1 = demo_Button.children().eq(0);
    												var _demo2 = demo_Button.children().eq(1);

    												_demo1.css("display", "inline");
    												_demo2.css("display", "none");
    											}
    										}
    									});
    								}
    							}
    							else {
    								if (i === slideshowimage) {
    									if (gotoStateAction === "true" && gotoNextStateAction === "false" && gotoPrevStateAction === "false") {
    										if (demoX[0].style.display === "inline") {
    											UnTopPopupContent(demoX);
    											demoX.css("display", "none");
    											ResetInteractiveInPopupContent(demoX);
    											//                                                    ResetVideo(demoX);
    											//                                                    ResetAudio(demoX);
    											//                                                    ResetButtonPopupContent(demoX);
    											if (bCurentShow === true) {
    												if (ShowButton) {
    													ShowUpButton();
    												}
    											}
    										}
    										else {
    											demoX.css("display", "inline");
    											var animateObj = demoX.find("div[title='Animation']");
    											if (animateObj !== undefined) {
    												var animation_data = [];
    												var animation_list = [];
    												var client = animateObj;
    												var winW = client.width();
    												var winH = client.height();
    												var iLenth = animateObj.length;
    												for (var idx = 0; idx < iLenth; idx++) {
    													var jsonAniNode = $(animateObj[idx]).children('input')[0];
    													var demoAnimation = $(animateObj[idx]).children()[0];
    													var itemTop = demoAnimation.offsetTop;
    													var itemLeft = demoAnimation.offsetLeft;
    													var spaceW = demoAnimation.offsetWidth;
    													var spaceH = demoAnimation.offsetHeight;
    													// no json
    													var aniJsonStr = jsonAniNode.value;
    													var dataAni = eval('(' + aniJsonStr + ')');
    													for (var iTemp = 0; iTemp < dataAni.states.length; iTemp++) {
    														var demo = $(animateObj[idx]);
    														for (var jTemp = 0; jTemp < dataAni.states[iTemp].animations.length; jTemp++) {
    															var uid = dataAni.states[iTemp].animations[jTemp].uid;
    															var firstHide = uid.charAt(uid.length - 1) === '0' ? true : false;
    															var Adata = { 'firstHide': firstHide, 'Demo': demo, 'winW': winW, 'winH': winH, 'itemTop': itemTop, 'itemLeft': itemLeft, 'spaceW': spaceW, 'spaceH': spaceH, 'animate': dataAni.states[iTemp].animations[jTemp] };
    															animation_data.push(Adata);
    														}
    													}
    												}
    												//////////////////////////////////////////////////////////////////////////
    												for (var iTemp = 0; iTemp < animation_data.length; iTemp++) {
    													var dataAni = animation_data[iTemp];
    													var uid = parseInt(dataAni.animate.uid);
    													if (animation_list[uid] === undefined)
    														animation_list[uid] = [];
    													animation_list[uid].push(dataAni);
    												}
    												//////////////////////////////////////////////////////////////////////////
    												var waitTime = 0;
    												var lasti = -1, lastj = -1;
    												var nFirstNonPageLoadAni = -1;  //第一个非网页加载动画
    												var isDisplayed = false; //是否已播放过
    												for (var iAni = 0; iAni < animation_list.length; iAni++) {
    													if (!animation_list[iAni])
    														continue;
    													for (var jTemp = 0; jTemp < animation_list[iAni].length; jTemp++) {
    														var dataAni = animation_list[iAni][jTemp];
    														//触发事件:0--网页加载时;1--单击;2--与上一动画同时;3--在上一动画之后
    														var triggerEvent = dataAni.animate.type.charAt(dataAni.animate.type.length - 1);
    														//1.(网页加载时)动画
    														//2.弹出内容的(带单击事件)触发动画
    														//3.第一个动画,即使动画触发事件设置为与上一动画同时或者在上一动画之后,也立即执行
    														if (triggerEvent === '0' || triggerEvent === '1' || (iAni === 0 && jTemp === 0 && (triggerEvent === '2' || triggerEvent === '3'))) {
    															// 弹出内容里的动画只播放第一个
    															if (isDisplayed === false) {
    																isDisplayed = true;
    																var mobileDelay = parseFloat(dataAni.animate.playDelay);
    																dataAni.Demo.displayAnimate();
    																waitTime = Number(mobileDelay) + Number(dataAni.animate.playTime);
    																lasti = iAni;
    																lastj = jTemp;
    															}
    														}
    														//如果上一个动画是在网页加载开始,并且当前动画与上一动画同时进行,并且是第一个同步的
    														else if (((iAni === lasti && jTemp === lastj + 1) || (iAni === lasti + 1 && jTemp === 0)) && triggerEvent === '2') {
    															waitTime = 0;
    														}

    														if ((triggerEvent === '2' || triggerEvent === '3') && nFirstNonPageLoadAni === -1) {
    															// 情况3
																if (iAni === 0 && jTemp === 0) {
    															}
    															else {
    																nFirstNonPageLoadAni = iAni;
    															}
    														}
    													}
    												}

    												function playAnimation(iAni, waitTime, nSynWithFirstAni) {
    													if (iAni < 0 || iAni >= animation_list.length)
    														return;
    													if (!animation_list[iAni])
    														playAnimation(iAni + 1, 0);
    													var dataAni = animation_list[iAni][0];
    													var timei = Number(dataAni.animate.playDelay) + Number(dataAni.animate.playTime);
    													if (dataAni.animate.type.charAt(dataAni.animate.type.length - 1) === '2') {
    														dataAni.Demo.displayAnimate();
    														playAnimation(iAni + 1, timei);
    													}
    													else if (dataAni.animate.type.charAt(dataAni.animate.type.length - 1) === '3') {
    														//在上一动画之后开始
    														setTimeout(function () {
    															dataAni.Demo.displayAnimate();
    															var timei = Number(dataAni.animate.playDelay) + Number(dataAni.animate.playTime);
    															playAnimation(iAni + 1, timei);
    														}, waitTime * 1000 + 10); //给连续两个动画之间增加10/1000秒时间,用于缓冲(animate和setTimeout可能时间上有轻微差异)
    													}
    												}

    												playAnimation(nFirstNonPageLoadAni, waitTime);
    											}

    											MoveCloseButton(demoX);
    											if (bCurentShow === false) {
    												TopPopupContent(demoX, parentIndex);
    												PlayInteractiveInPopupContent(demoX);
    												ShowFirstImageInPopupContent(demoX);
    											}
    											if (bCurentShow === false) {
    												if (ShowButton) {
    													ShowDownButton();
    													ShowButton = false;
    												}

    												// 处理其他相关互斥按钮弹起
    												$("div[title='Button']").each(function () {

    													var demo_Button = $(this);
    													var _count_of = demo_Button.children().length;
    													// no json
    													var _jsonnode = demo_Button.children()[_count_of - 1];
    													var _jsonStr = _jsonnode.value;
    													var _data = eval('(' + _jsonStr + ')');
    													// no json

    													var _stateuid = _data.stateuid;
    													var _statetype = _data.statetype;
    													if (_stateuid === stateuid && _statetype !== statetype) {
    														if (_count_of === 3) {
    															/*
    															alert(_stateuid + "-" + stateuid);
    															alert(_statetype + "-" + statetype);
    															*/
    															var _demo1 = demo_Button.children().eq(0);
    															var _demo2 = demo_Button.children().eq(1);

    															_demo1.css("display", "inline");
    															_demo2.css("display", "none");
    														}
    													}
    												});
    											}
    										}
    									}
    									else {
    										// 上一个，下一个
    										demoX.css("display", "inline");
    										MoveCloseButton(demoX);
    										if (!bCurentShow) {
    											TopPopupContent(demoX, 0);
    											PlayInteractiveInPopupContent(demoX);
    										}
    									}
    								}
    								else {
    									UnTopPopupContent(demoX);
    									demoX.css("display", "none");
    									ResetInteractiveInPopupContent(demoX);
    									if (gotoStateAction === "true" && bCurentShow === true) {
    										if (ShowButton) {
    											ShowUpButton();
    										}
    									}
    								}
    							}
    						}
    					}
    					else {
    						var bShowSlide = false;
    						if (gotoNextStateAction === "true") {
    							for (var i = 0; i < state_count; i++) {
    								var demoX = demoSlide.children().eq(i);
    								if (demoX[0].style.display === "none") {
    									TopPopupContent(demoX, 0);
    									demoX[0].style.display = "inline";
    									MoveCloseButton(demoX);
    									PlayInteractiveInPopupContent(demoX);
    									bShowSlide = true;
    									break;
    								}
    							}
    						}
    						else if (gotoPrevStateAction === "true") {
    							for (var i = state_count - 1; i >= 0; i--) {
    								var demoX = demoSlide.children().eq(i);
    								if (demoX[0].style.display === "none") {
    									TopPopupContent(demoX, 0);
    									demoX[0].style.display = "inline";
    									MoveCloseButton(demoX);
    									PlayInteractiveInPopupContent(demoX);
    									bShowSlide = true;
    									break;
    								}
    							}
    						}
    						else if (gotoStateAction === "true") {
    							var demoX = demoSlide.children().eq(slideshowimage);
    							if (demoX[0].style.display === "none") {
    								TopPopupContent(demoX, 0);
    								demoX.css("display", "inline");
    								MoveCloseButton(demoX);
    								PlayInteractiveInPopupContent(demoX);
    								bShowSlide = true;
    								ShowDownButton();
    							}
    						}

    						if (!bShowSlide) {

    							var demoX = demoSlide.children().eq(slideshowimage);
    							UnTopPopupContent(demoX);
    							demoX[0].style.display = "none";
    							ResetInteractiveInPopupContent(demoX);
    							//                                    ResetVideo(demoX);
    							//                                    ResetAudio(demoX);
    							//                                    ResetButtonPopupContent(demoX);
    							ShowUpButton();
    						}
    					}

    					//一个弹出内容可能有多个子节点
    					var lenDemoSlide = demoSlide.children('div').length;
    					for (var i = 0; i < lenDemoSlide; i++) {
    						var slideItem = demoSlide.children('div').eq(i);
    						slideItem.unbind();
    						slideItem.on(startEvent, function (e) {
    							//当弹出内容是非全屏动画时,调用e.preventDefault会导致不能翻页,例:生物进化第3页
    							//当弹出内容是全屏图片时,点击右上角需阻止翻页,例:全球攻略第27页,10课热情服务第9页
    							var animationObject = slideItem.find("div[title='Animation']");
    							if (animationObject.length === 0)
    								e.preventDefault();
    						});
    						//点击关闭
    						var lenSlideChildren = slideItem.children().length;
    						var closeImg = slideItem.children().eq(lenSlideChildren - 1);
    						closeImg.unbind();
    						closeImg.on(endEvent, function (event) {
    							event.preventDefault();
    							closeIMGButton(event);
    						});
    						closeImg.on(startEvent, function (event) {
    							event.preventDefault();
    						});
    					}

    				}
    			});
    		}

    		function GotPage(btID) {
    			var curFrmSrc = window.location.href;
    			var index1 = curFrmSrc.lastIndexOf(".");
    			var index2 = curFrmSrc.length;
    			var fileext = curFrmSrc.substring(index1, index2);
    			
    			if (top === self) {
    				var idxLength = pageIndex.length;
    				var url = 'chapter-';
    				if (idxLength === 1)
    					url = 'chapter-00';
    				else if (idxLength === 2)
    					url = 'chapter-0';
    				else if (idxLength === 3)
    					url = 'chapter-';
    				url += (pageIndex + fileext);
    				window.location.href = url;
    			}
    			else {
    				var nIndex = parseInt(pageIndex) - 1;
    				var data = "{ act:\'slidto\', val:" + nIndex + "}";
    				postMessage(data, '*');
    			}
    		}

    		function GotURL() {
    			window.location.href = url;
    		}

    		function toggleFullScreen() {
    			var isFull = window.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || false;
    			var de = document.documentElement;
    			if (isFull === false) {
    				if (de.requestFullscreen) {
    					de.requestFullscreen();
    				} else if (de.mozRequestFullScreen) {
    					de.mozRequestFullScreen();
    				} else if (de.webkitRequestFullScreen) {
    					de.webkitRequestFullScreen();
    				} else if (de.msRequestFullscreen) {
    					de.msRequestFullscreen();
    				}
    			} else {
    				if (document.exitFullscreen) {
    					document.exitFullscreen();
    				} else if (document.mozCancelFullScreen) {
    					document.mozCancelFullScreen();
    				} else if (document.webkitCancelFullScreen) {
    					document.webkitCancelFullScreen();
    				} else if (document.msExitFullscreen) {
    					document.msExitFullscreen();
    				}
    			}
    		}

    		function ShowByPopupContent() {
    			var isIconFlicker = "false";
    			var displayFirstImage = "false";
    			var mutualExclusion = "false";
    			var slideshowuid = "";
    			var len = stateuid.length;
    			if (len > 3) {
    				var strhead = stateuid.substr(0, 3);
    				if (strhead === "si_") {
    					slideshowuid = stateuid;
    				}
    				else {
    					slideshowuid = 'si_' + stateuid.substr(4);
    				}
    			}
    			else {
    				return;
    			}
    			var demoSlide = $('div#' + slideshowuid);
    			//弹出内容允许图标闪烁
    			if (demoSlide[0] != undefined && demoSlide[0].title === "PopupContent") {
    				var slideCount = demoSlide.children().length;
    				var _jsonnode = demoSlide.children()[slideCount - 1];
    				var _data = eval('(' + _jsonnode.value + ')');
    				isIconFlicker = _data.iconFlicker;
    				displayFirstImage = _data.displayFirstImage;
    				mutualExclusion = _data.mutualExclusion;
    			}

    			var iconFlickerLen = demo.children('div').length;
    			if (isIconFlicker === "true" && iconFlickerLen > 0) {
    				divBtnIcon1[0].style.display = "inline";
    				var divFlicker;
    				if (iconFlickerLen === 1) {
    					//只有一个图标
    					divFlicker = divBtnIcon0;
    				}
    				else {
    					//两个图标以上
    					divBtnIcon0[0].style.display = "none";
    					divFlicker = divBtnIcon1;
    				}
    				divFlicker[0].style.display = "inline";
    				function Flicker() {
    					divFlicker.animate({ opacity: 0.6 }, 1000);
    					divFlicker.animate({ opacity: 1.0 }, 1000, Flicker);
    				}
    				Flicker();
    			}

    			if (displayFirstImage === "true" && statetype === "1" && iconFlickerLen > 1) {
    				divBtnIcon0[0].style.display = "none";
    				divBtnIcon1[0].style.display = "inline";
    			}
    		}

    		ShowByPopupContent();

    		demo.on(startEvent, function (e) {
    			e.preventDefault();
    			if ((gotoNextStateAction === "true") || (gotoPrevStateAction === "true"))
    				ShowDownButton();
    			else if (gotoPageAction === "true")
    				ShowDownButton();
    		});

    		demo.on(goToPageEvent, function (e) {
    			e.preventDefault();
    			e.stopPropagation();
    			var parentIndex = $(this).css('z-index');
    			if ((gotoNextStateAction === "true") || (gotoPrevStateAction === "true"))
    				ShowUpButton();
    			if ((gotoStateAction === "true") || (gotoNextStateAction === "true") || (gotoPrevStateAction === "true"))
    				GoTo(btID, parentIndex);
    			else if (gotoPageAction === "true")
    				GotPage();
    			else if (gotoURLAction === "true")
    				GotURL();
    			else if (gotoZoomAction === "fitWindow") {
    				if (self === top) {
    					toggleFullScreen();
    				}
    				else {
    					window.parent.postMessage("fullscreen", '*');
    				}
    			}
    		});

    		demo.on(outEvent, function (e) {
    			if ((gotoNextStateAction === "true") || (gotoPrevStateAction === "true"))
    				ShowUpButton();
    		});
    	}

    	addButtonListener(demoButton, btID);
    });
}