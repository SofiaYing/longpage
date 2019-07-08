function slideShow()
{
    var startEvent = 'vmousedown';
    var endEvent = 'vmouseup';

    $("div[title='SlideShow']").each(function () {

        var fadeID = 0;
        var slideID = 0;
        var drag = false;
        var startPosX;
        var stopPosX;

        var startPosY;
        var stopPosY;

        var touchgapLength = 50;

        var demoSlide = $(this);
        var count_of = demoSlide.children().length;
        var state_count = count_of - 1;
        var spaceW = parseInt(demoSlide[0].style.width); //demoSlide.width();
        var spaceH = parseInt(demoSlide[0].style.height); //demoSlide.height();

        var playOnPageTurn = '';
        var playDelay = '';
        var playInterval = '';
        var effect = '';
        var slideSpeed = '';
        var slideDirection = '';
        var wipeEnable = '';
        var fullScreen = '';

        // no json
        var jsonnode = demoSlide.children()[count_of - 1];
        var jsonStr = jsonnode.value;
        var data = eval('(' + jsonStr + ')');
        // no json

        playOnPageTurn = data.slideshow[0].playOnPageTurn;
        playDelay = data.slideshow[0].playDelay;
        playInterval = data.slideshow[0].playInterval;
        effect = data.slideshow[0].effect;
        slideSpeed = data.slideshow[0].slideSpeed;
        slideDirection = data.slideshow[0].slideDirection;
        wipeEnable = data.slideshow[0].wipeEnable;
        fullScreen = data.slideshow[0].fullScreen;
        demoSlide.attr("slideDirection", slideDirection);
        if (effect == "fade") {
            slideDirection = "leftToRight";
            demoSlide.children().css({ "left": "0px", "top": "0px" });
            var picGroup = [];
            var fadePicIndex = 0;
            for (var i = 0; i < count_of - 1; i++) {
                if (i != 0) {
                    demoSlide.children().eq(i).css("display", "none");
                }

                picGroup.push(demoSlide.children().eq(i));
            }
        }
        var speed = 2000;

        var delayTime = Number(playDelay) * 1000;
        var playGap = Number(playInterval) * 1000;
        if (slideSpeed === "slow")
            speed = 4000;
        else if (slideSpeed === "normal")
            speed = 2000;
        else if (slideSpeed === "fast")
            speed = 1000;

        var fadeGap = playGap + speed;
        var spaceGapW = spaceW / 3;
        var spaceGapH = spaceH / 3;
        if (slideDirection === "leftToRight" || slideDirection === "rightToLeft") {
            if (touchgapLength > spaceGapW)
                touchgapLength = spaceGapW;
        }
        else if (slideDirection === "topToBottom" || slideDirection === "bottomToTop") {
            if (touchgapLength > spaceGapH)
                touchgapLength = spaceGapH;
        }


        var demo1, demo2;

        function slideShowImgAnimation(demo, direction) {
            if (direction === "left")      // left
            {
                for (var i = 0; i < state_count; i++) {
                    var demoX = demo.children().eq(i);
                    var left = demoX[0].style.left;
                    if (left === '0px')
                        demo1 = demoX;
                    else if (left === (spaceW + 'px'))
                        demo2 = demoX;
                    else {
                        left = left.substring(0, left.indexOf("px"));
                        demoX[0].style.left = (Number(left) - spaceW) + 'px';
                    }
                }

                function ResetLeft() {
                    demo1[0].style.left = (spaceW * (state_count - 1)) + 'px';
                    
                }
                demo1.animate({ left: "-" + spaceW + "px" }, speed, 'linear', ResetLeft);
                demo2.animate({ left: "0px" }, speed, 'linear');
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
                demo2.animate({ left: "0px" }, speed, 'linear');
                demo1.animate({ left: spaceW + "px" }, speed, 'linear');
            }
            if (direction === "top")      // top
            {
                for (var i = 0; i < state_count; i++) {
                    var demoX = demo.children().eq(i);
                    var top = demoX[0].style.top;
                    if (top === '0px')
                        demo1 = demoX;
                    else if (top === (spaceH + 'px'))
                        demo2 = demoX;
                    else {
                        top = top.substring(0, top.indexOf("px"));
                        demoX[0].style.top = (Number(top) - spaceH) + 'px';
                    }
                }

                function ResetTop() {
                    demo1[0].style.top = (spaceH * (state_count - 1)) + 'px';
                }

                demo1.animate({ top: "-" + spaceH + "px" }, speed, 'linear', ResetTop);
                demo2.animate({ top: "0px" }, speed, 'linear');
            }
            else if (direction === "bottom")                // bottom
            {
                for (var i = 0; i < state_count; i++) {
                    var demoX = demo.children().eq(i);
                    var top = demoX[0].style.top;
                    if (top === '0px')
                        demo1 = demoX;
                    else if (top === (spaceH * (state_count - 1) + 'px'))
                        demo2 = demoX;
                    else {
                        top = top.substring(0, top.indexOf("px"));
                        demoX[0].style.top = (Number(top) + spaceH) + 'px';
                    }
                }

                demo2[0].style.top = '-' + spaceH + 'px';
                demo2.animate({ top: "0px" }, speed, 'linear');
                demo1.animate({ top: spaceH + "px" }, speed, 'linear');
            }
        }

        function getNextFadePicIndex()  //更改fadePicIndex是得指向下一张图
        {
            if (slideDirection == "rightToLeft") {
                if (fadePicIndex > 0) {
                    fadePicIndex--;
                }
                else {
                    fadePicIndex = count_of - 2;
                }
            }
            else if (slideDirection == "leftToRight")                // right
            {
                if (fadePicIndex < count_of - 2) {
                    fadePicIndex++;
                }
                else {
                    fadePicIndex = 0;
                }
            }
        }
        function fadeShowImgAnimation() {
            picGroup[fadePicIndex].fadeToggle(speed);
            getNextFadePicIndex();
            picGroup[fadePicIndex].fadeToggle(speed);
        }

        function addSlideShowListener(demo) {
            demo.on(startEvent, function (e) {
                e.preventDefault();

                var xpos = demo[0].offsetLeft;
                var ypos = demo[0].offsetTop;

                var parentA = demo[0].parentNode;
                while (parentA) {
                    var name = parentA.localName;
                    if (name === 'body')
                        break;
                    xpos += parentA.offsetLeft;
                    ypos += parentA.offsetTop;

                    parentA = parentA.parentNode;
                }

                startPosX = e.pageX - xpos;
                startPosY = e.pageY - ypos;

            });

            demo.on(endEvent, function (e) {

                var xpos = demo[0].offsetLeft;
                var ypos = demo[0].offsetTop;

                var parentA = demo[0].parentNode;
                while (parentA) {
                    var name = parentA.localName;
                    if (name === 'body')
                        break;
                    xpos += parentA.offsetLeft;
                    ypos += parentA.offsetTop;

                    parentA = parentA.parentNode;
                }

                stopPosX = e.pageX - xpos;
                stopPosY = e.pageY - ypos;

                var touchgapX = Math.abs(startPosX - stopPosX);
                var touchgapY = Math.abs(startPosY - stopPosY);
                var isanimate1 = false;
                if (demo1 !== undefined) {
                    isanimate1 = demo1.is(":animated");
                }
                if (isanimate1 === false) {
                    drag = true;
                }
                else {
                    drag = false;
                }
                if (effect === "slide") {
                    if (slideDirection === "leftToRight" || slideDirection === "rightToLeft") {
                        if (touchgapX > touchgapLength) {
                            if (stopPosX < startPosX) {
                                if (drag) {
                                    if (playOnPageTurn === "true") {
                                        clearInterval(slideID);
                                        var slideIDBtn = demoSlide.children().eq(0).attr("idRaf");
                                        clearInterval(slideIDBtn);
                                        slideShowImgAnimation(demo, "left");
                                        slideDirection = "rightToLeft";
                                        slideID = setInterval(PlaySlide, playGap);
                                        demoSlide.children().eq(0).attr("idRaf", slideID);
                                    }
                                    else {
                                        slideShowImgAnimation(demo, "left");
                                        slideDirection = "rightToLeft";
                                    }

                                }
                                else {
                                    slideDirection = "rightToLeft";
                                }
                            }
                            else if (stopPosX > startPosX) {
                                if (drag) {
                                    if (playOnPageTurn === "true") {
                                        clearInterval(slideID);
                                        slideShowImgAnimation(demo, "right");
                                        slideDirection = "leftToRight";
                                        slideID = setInterval(PlaySlide, playGap);
                                        demoSlide.children().eq(0).attr("idRaf", slideID);
                                    }
                                    else {
                                        slideShowImgAnimation(demo, "right");
                                        slideDirection = "leftToRight";
                                    }
                                }
                                else {
                                    slideDirection = "leftToRight";
                                }
                            }
                        }
                    }
                    else if (slideDirection === "topToBottom" || slideDirection === "bottomToTop") {
                        if (touchgapY > touchgapLength) {
                            if (stopPosY < startPosY) {
                                if (drag) {
                                    if (playOnPageTurn === "true") {
                                        clearInterval(slideID);
                                        slideShowImgAnimation(demo, "top");
                                        slideDirection = "bottomToTop";
                                        slideID = setInterval(PlaySlide, playGap);
                                        demoSlide.children().eq(0).attr("idRaf", slideID);
                                    }
                                    else {
                                        slideShowImgAnimation(demo, "top");
                                        slideDirection = "bottomToTop";
                                    }
                                }
                                else {
                                    slideDirection = "bottomToTop";
                                }
                            }
                            else if (stopPosY > startPosY) {
                                if (drag) {
                                    if (playOnPageTurn === "true") {
                                        clearInterval(slideID);
                                        slideShowImgAnimation(demo, "bottom");
                                        slideDirection = "topToBottom";
                                        slideID = setInterval(PlaySlide, playGap);
                                        demoSlide.children().eq(0).attr("idRaf", slideID);
                                    }
                                    else {
                                        slideShowImgAnimation(demo, "bottom");
                                        slideDirection = "topToBottom";
                                    }
                                }
                                else {
                                    slideDirection = "topToBottom";
                                }
                            }
                        }
                    }
                }

                else if (effect === "fade") {
                    if (touchgapX > touchgapLength) {
                        if (stopPosX < startPosX) {
                            if (drag) {
                                if (playOnPageTurn === "true") {
                                    slideDirection = "rightToLeft";
                                    clearInterval(fadeID);
                                    fadeShowImgAnimation();
                                    PlayFade();
                                }
                                else {
                                    slideDirection = "rightToLeft";
                                    fadeShowImgAnimation();
                                }
                            }
                            else {
                                slideDirection = "rightToLeft";
                            }
                        }
                        else if (stopPosX > startPosX) {
                            if (drag) {
                                if (playOnPageTurn === "true") {
                                    slideDirection = "leftToRight";
                                    clearInterval(fadeID);
                                    fadeShowImgAnimation();
                                    PlayFade();
                                }
                                else {
                                    slideDirection = "leftToRight";
                                    fadeShowImgAnimation();
                                }
                            }
                            else {
                                slideDirection = "leftToRight";
                            }
                        }
                    }
                }
                drag = false;
                demo.attr("slideDirection", slideDirection);
            });
        }

        function AutoSlide() {
            if (effect == "slide") {
                clearInterval(slideID);
                slideID = setInterval(PlaySlide, playGap);
                demoSlide.children().eq(0).attr("idRaf", slideID);
            }
            else if (effect == "fade") {
                PlayFade();
            }
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

        function PlaySlide() {
            // 如果已经从按钮点击画廊画面
            var btnID = demoSlide.children().eq(0).attr("btnID");
            if (btnID !== undefined)
                return;
            var isanimate1 = false;
            if (demo1 !== undefined) {
                isanimate1 = demo1.is(":animated");
            }
            if (isanimate1 === false) {
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

            //   var idRaf = requestAnimationFrame(PlaySlide);
            //  demo1.attr("idRaf", idRaf);
        }
        function PlayFade() {
            fadeID = setInterval(fadeShowImgAnimation, fadeGap);
            demoSlide.children().eq(0).attr("idRaf", fadeID);
        }

        if (wipeEnable === "true")
            addSlideShowListener(demoSlide);

        if (playOnPageTurn === "true") {
            //lisnerDelayID = setInterval(AutoSlide, delayTime);
            if (effect === "fade") {
                setTimeout(function () { fadeShowImgAnimation(); AutoSlide(); }, delayTime);
            }
            else if (effect === "slide") {
                setTimeout(function () { PlaySlide(); AutoSlide(); }, delayTime);
            }
        }
        function fullScreenEvent() {
            if (effect === "fade") {
                if (isNowFullScreen === false) {
                    demoSlide.css({ "width": fullScreenWidth + "px", "height": fullScreenHeight + "px", "position": "fixed", "left": "0px", "top": "0px" });
                    isNowFullScreen = true;
                }
                else {
                    demoSlide.css({ "width": spaceW + "px", "height": spaceH + "px", "position": "relative" });
                    isNowFullScreen = false;
                }
            }
            else if (effect === "slide") {
                if (isNowFullScreen === false) {
                    demoSlide.css({ "width": fullScreenWidth + "px", "height": fullScreenHeight + "px", "position": "fixed", "left": "0px", "top": "0px" });
                    if (slideDirection === "rightToLeft") {
                        spaceW = fullScreenWidth;
                        var slideItemLeft = 0;
                        var tempDemo1 = 0, tempDemo2 = 0;
                        var leftTime = 0;
                        for (var i = 0; i < state_count; i++) {
                            var tempLeft = demoSlide.children().eq(i).css("left");
                            var slideItemLeft = tempLeft.substring(0, tempLeft.indexOf("px"));
                            slideItemLeft *= imgWRatio;
                            demoSlide.children().eq(i).css("left", slideItemLeft + "px");
                            if (slideItemLeft < 0) {
                                leftTime = speed - ((-1) * slideItemLeft / spaceW) * speed;
                                tempDemo1 = demoSlide.children().eq(i);
                                tempDemo2 = demoSlide.children().eq(i + 1);
                            }
                        }
                        if (tempDemo1 != 0) {
                            tempDemo1.stop().animate({ left: "-" + spaceW + "px" }, leftTime, 'linear', function () { tempDemo1.css("left", (spaceW * (state_count - 1)) + "px") });
                            tempDemo2.stop().animate({ left: "0px" }, leftTime, 'linear');
                        }
                    }
                    else if (slideDirection === "leftToRight") {
                        spaceW = fullScreenWidth;
                        var slideItemLeft = 0;
                        var tempDemo1 = 0, tempDemo2 = 0;
                        var leftTime = 0;
                        for (var i = 0; i < state_count; i++) {
                            var tempLeft = demoSlide.children().eq(i).css("left");
                            var slideItemLeft = tempLeft.substring(0, tempLeft.indexOf("px"));
                            slideItemLeft *= imgWRatio;
                            demoSlide.children().eq(i).css("left", slideItemLeft + "px");
                            if (slideItemLeft < 0) {
                                leftTime = speed - ((spaceW + slideItemLeft) / spaceW) * speed;
                                tempDemo1 = demoSlide.children().eq(i);
                            }
                            else if (slideItemLeft < spaceW && slideItemLeft > 0) {
                                tempDemo2 = demoSlide.children().eq(i);
                            }
                        }
                        if (tempDemo1 != 0) {
                            tempDemo1.stop().animate({ left: "0px" }, leftTime, 'linear');
                            tempDemo2.stop().animate({ left: spaceW + "px" }, leftTime, 'linear');
                        }
                    }
                    else if (slideDirection === "bottomToTop") {
                        spaceH = fullScreenHeight;
                        var slideItemTop = 0;
                        var tempDemo1 = 0, tempDemo2 = 0;
                        var leftTime = 0;
                        for (var i = 0; i < state_count; i++) {
                            var tempTop = demoSlide.children().eq(i).css("top");
                            var slideItemTop = tempTop.substring(0, tempTop.indexOf("px"));
                            slideItemTop *= imgHRatio;
                            demoSlide.children().eq(i).css("top", slideItemTop + "px");
                            if (slideItemTop < 0) {
                                leftTime = speed - ((-1) * slideItemTop / spaceH) * speed;
                                tempDemo1 = demoSlide.children().eq(i);
                                tempDemo2 = demoSlide.children().eq(i + 1);
                            }
                        }
                        if (tempDemo1 != 0) {
                            tempDemo1.stop().animate({ top: "-" + spaceH + "px" }, leftTime, 'linear', function () { tempDemo1.css("top", (spaceH * (state_count - 1)) + "px") });
                            tempDemo2.stop().animate({ top: "0px" }, leftTime, 'linear');
                        }
                    }
                    else if (slideDirection === "topToBottom") {
                        spaceH = fullScreenHeight;
                        var slideItemTop = 0;
                        var tempDemo1 = 0, tempDemo2 = 0;
                        var leftTime = 0;
                        for (var i = 0; i < state_count; i++) {
                            var tempTop = demoSlide.children().eq(i).css("top");
                            var slideItemTop = tempTop.substring(0, tempTop.indexOf("px"));
                            slideItemTop *= imgHRatio;
                            demoSlide.children().eq(i).css("top", slideItemTop + "px");
                            if (slideItemTop < 0) {
                                leftTime = speed - ((spaceH + slideItemTop) / spaceH) * speed;
                                tempDemo1 = demoSlide.children().eq(i);
                            }
                            else if (slideItemTop < spaceH && slideItemTop > 0) {
                                tempDemo2 = demoSlide.children().eq(i);
                            }
                        }
                        if (tempDemo1 != 0) {
                            tempDemo1.stop().animate({ top: "0px" }, leftTime, 'linear');
                            tempDemo2.stop().animate({ top: spaceH + "px" }, leftTime, 'linear');
                        }
                    }
                    isNowFullScreen = true;
                }
                else {
                    demoSlide.css({ "width": initSpaceW + "px", "height": initSpaceH + "px", "position": "relative" });
                    if (slideDirection === "rightToLeft") {
                        spaceW = initSpaceW;
                        var slideItemLeft = 0;
                        var tempDemo1 = 0, tempDemo2 = 0;
                        var leftTime = 0;
                        for (var i = 0; i < state_count; i++) {
                            var tempLeft = demoSlide.children().eq(i).css("left");
                            var slideItemLeft = tempLeft.substring(0, tempLeft.indexOf("px"));
                            slideItemLeft /= imgWRatio;
                            demoSlide.children().eq(i).css("left", slideItemLeft + "px");
                            if (slideItemLeft < 0) {
                                leftTime = speed - ((-1) * slideItemLeft / spaceW) * speed;
                                tempDemo1 = demoSlide.children().eq(i);
                                tempDemo2 = demoSlide.children().eq(i + 1);
                            }
                        }
                        if (tempDemo1 != 0) {
                            tempDemo1.stop().animate({ left: "-" + spaceW + "px" }, leftTime, 'linear', function () { tempDemo1.css("left", (spaceW * (state_count - 1)) + "px") });
                            tempDemo2.stop().animate({ left: "0px" }, leftTime, 'linear');
                        }
                    }
                    else if (slideDirection === "leftToRight") {
                        spaceW = initSpaceW;
                        var slideItemLeft = 0;
                        var tempDemo1 = 0, tempDemo2 = 0;
                        var leftTime = 0;
                        for (var i = 0; i < state_count; i++) {
                            var tempLeft = demoSlide.children().eq(i).css("left");
                            var slideItemLeft = tempLeft.substring(0, tempLeft.indexOf("px"));
                            slideItemLeft /= imgWRatio;
                            demoSlide.children().eq(i).css("left", slideItemLeft + "px");
                            if (slideItemLeft < 0) {
                                leftTime = speed - ((spaceW + slideItemLeft) / spaceW) * speed;
                                tempDemo1 = demoSlide.children().eq(i);
                            }
                            else if (slideItemLeft < spaceW && slideItemLeft > 0) {
                                tempDemo2 = demoSlide.children().eq(i);
                            }
                        }
                        if (tempDemo1 != 0) {
                            tempDemo1.stop().animate({ left: "0px" }, leftTime, 'linear');
                            tempDemo2.stop().animate({ left: spaceW + "px" }, leftTime, 'linear');
                        }
                    }
                    else if (slideDirection === "bottomToTop") {
                        spaceH = initSpaceH;
                        var slideItemTop = 0;
                        var tempDemo1 = 0, tempDemo2 = 0;
                        var leftTime = 0;
                        for (var i = 0; i < state_count; i++) {
                            var tempTop = demoSlide.children().eq(i).css("top");
                            var slideItemTop = tempTop.substring(0, tempTop.indexOf("px"));
                            slideItemTop /= imgHRatio;
                            demoSlide.children().eq(i).css("top", slideItemTop + "px");
                            if (slideItemTop < 0) {
                                leftTime = speed - ((-1) * slideItemTop / spaceH) * speed;
                                tempDemo1 = demoSlide.children().eq(i);
                                tempDemo2 = demoSlide.children().eq(i + 1);
                            }
                        }
                        if (tempDemo1 != 0) {
                            tempDemo1.stop().animate({ top: "-" + spaceH + "px" }, leftTime, 'linear', function () { tempDemo1.css("top", (spaceH * (state_count - 1)) + "px") });
                            tempDemo2.stop().animate({ top: "0px" }, leftTime, 'linear');
                        }
                    }
                    else if (slideDirection === "topToBottom") {
                        spaceH = initSpaceH;
                        var slideItemTop = 0;
                        var tempDemo1 = 0, tempDemo2 = 0;
                        var leftTime = 0;
                        for (var i = 0; i < state_count; i++) {
                            var tempTop = demoSlide.children().eq(i).css("top");
                            var slideItemTop = tempTop.substring(0, tempTop.indexOf("px"));
                            slideItemTop /= imgHRatio;
                            demoSlide.children().eq(i).css("top", slideItemTop + "px");
                            if (slideItemTop < 0) {
                                leftTime = speed - ((spaceH + slideItemTop) / spaceH) * speed;
                                tempDemo1 = demoSlide.children().eq(i);
                            }
                            else if (slideItemTop < spaceH && slideItemTop > 0) {
                                tempDemo2 = demoSlide.children().eq(i);
                            }
                        }
                        if (tempDemo1 != 0) {
                            tempDemo1.stop().animate({ top: "0px" }, leftTime, 'linear');
                            tempDemo2.stop().animate({ top: spaceH + "px" }, leftTime, 'linear');
                        }
                    }
                    isNowFullScreen = false;
                }
            }
        }
        function addDoubleClickListener() {
            demoSlide.on("dblclick", fullScreenEvent);
            if (is_mobile()) {
                demoSlide.on("tap", function () { timeCount++; setTimeout(function () { timeCount = 0; }, 500); if (timeCount > 1) fullScreenEvent(); });
            }

        }
        if (fullScreen === "true") {
            var initSpaceW = spaceW;
            var initSpaceH = spaceH;
            var isNowFullScreen = false;
            var fullScreenWidth = $(window).width();
            var fullScreenHeight = $(window).height();
            var imgWRatio = fullScreenWidth / initSpaceW;
            var imgHRatio = fullScreenHeight / initSpaceH;
            demoSlide.children().each(function () { $(this).css({ "width": "100%", "height": "100%" }); $(this).children().css({ "width": "100%", "height": "100%" }) });
            var timeCount = 0;  //用来判断移动端是否为双击
            addDoubleClickListener();
        }

        $.fn.resetDemo = function (d1, d2) {
            demo1 = d1;
            demo2 = d2;
        }
    });
}