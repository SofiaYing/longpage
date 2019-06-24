(function() {

    FX.plugins["slideShow"] = (function(id, option) {
        var demo1, demo2;
        var demoSlide;
        var fadeID = 0;
        var slideID = 0;
        var drag = false;
        var startPosX;
        var stopPosX;

        var startPosY;
        var stopPosY;

        var touchgapLength = 50;

        var playOnPageTurn = '';
        var playDelay = '';
        var playInterval = '';
        var effect = '';
        var slideSpeed = '';
        var slideDirection = '';
        var wipeEnable = '';
        var fullScreen = '';
        var count_of;
        var state_count;
        var spaceW;
        var spaceH;
        var speed = 2000;
        var delayTime;
        var playGap;
        var picGroup = [];
        var fadePicIndex = 0;
        var fadeGap;
        var spaceGapW;
        var spaceGapH;
        var isNowFullScreen = false;
        var initSpaceW;
        var initSpaceH;
        var fullScreenWidth;
        var fullScreenHeight;
        var imgWRatio;
        var imgHRatio;
        var data;
        var audio;
        var timeCount = 0; //用来判断移动端是否为双击
        // 对象
        var SlideShow = function(id, option) {
            this.$target = $("#" + id).children(0);
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, SlideShow);

        //组件初始化
        SlideShow.prototype.init = function(id, option) {
            //console.info("SlideShow init:", id);
            demoSlide = this.$target;
            count_of = demoSlide.children().length;
            state_count = count_of - 1;
            spaceW = demoSlide.width();
            spaceH = demoSlide.height();
            // no json
            var jsonnode = demoSlide.children()[count_of - 1];
            var jsonStr = jsonnode.value;
            data = eval('(' + jsonStr + ')');
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

                for (var i = 0; i < count_of - 1; i++) {
                    if (i != 0) {
                        demoSlide.children().eq(i).css("display", "none");
                    }

                    picGroup.push(demoSlide.children().eq(i));
                }
            }

            delayTime = Number(playDelay) * 1000;
            playGap = Number(playInterval) * 1000;
            if (slideSpeed === "slow")
                speed = 4000;
            else if (slideSpeed === "normal")
                speed = 2000;
            else if (slideSpeed === "fast")
                speed = 1000;

            fadeGap = playGap + speed;
            spaceGapW = spaceW / 3;
            spaceGapH = spaceH / 3;
            if (slideDirection === "leftToRight" || slideDirection === "rightToLeft") {
                if (touchgapLength > spaceGapW)
                    touchgapLength = spaceGapW;
            } else if (slideDirection === "topToBottom" || slideDirection === "bottomToTop") {
                if (touchgapLength > spaceGapH)
                    touchgapLength = spaceGapH;
            }

            if (wipeEnable === "true")
                addSlideShowListener(demoSlide);

            if (fullScreen === "true") {
                initSpaceW = spaceW;
                initSpaceH = spaceH;
                isNowFullScreen = false;
                fullScreenWidth = $(window).width();
                fullScreenHeight = $(window).height();
                imgWRatio = fullScreenWidth / initSpaceW;
                imgHRatio = fullScreenHeight / initSpaceH;
                demoSlide.children().each(function() {
                    $(this).css({ "width": "100%", "height": "100%" });
                    $(this).children().css({ "width": "100%", "height": "100%" });
                });
                addDoubleClickListener();
            }

            //自定义方法
            $.fn.resetDemo = function(d1, d2) {
                demo1 = d1;
                demo2 = d2;
            };
        };

        //重置数据
        SlideShow.prototype.reset = function(option) {
            if (playOnPageTurn === "true") {
                if (effect === "fade") {
                    setTimeout(function() {
                        fadeShowImgAnimation();
                        AutoSlide();
                    }, delayTime);
                } else if (effect === "slide") {
                    setTimeout(function() {
                        PlaySlide();
                        AutoSlide();
                    }, delayTime);
                }
            }
            if (data.states && data.states[0].bgaudio) {
                var bgmSrc = data.states[0].bgaudio;
                audio = new Audio(bgmSrc);
                var playRes = window.playAgentAudio(audio);
                console.info("画廊音频播放" + (playRes ? "成功" : "失败"));
            }
        };

        //数据重置
        SlideShow.prototype.destroy = function() {
            if (audio) {
                window.pauseAgentAudio(audio);
            }
            if (effect === "slide") {
                clearInterval(slideID);
            } else if (effect === "fade") {
                clearInterval(fadeID);
            }

            if (demo1 !== undefined) {
                if (demo1.is(":animated"))
                    demo1.finish();
            }
            if (demo2 !== undefined) {
                if (demo2.is(":animated"))
                    demo2.finish();
            }

            if (effect === "fade") {
                fadePicIndex = 0;
                demoSlide.children().eq(0).css({ "display": "block", "opacity": "" });
                for (var i = 0; i < count_of - 1; i++) {
                    if (i != 0) {
                        demoSlide.children().eq(i).css({ "display": "none", "opacity": "" });
                    }
                }
            } else if (effect === "slide") {
                for (var i = 0; i < state_count; i++) {
                    var demoX = demoSlide.children().eq(i);
                    if (slideDirection === "leftToRight" || slideDirection === "rightToLeft") {
                        demoX[0].style.left = (i * spaceW) + 'px';
                    } else if (slideDirection === "topToBottom" || slideDirection === "bottomToTop") {
                        demoX[0].style.top = (i * spaceH) + 'px';
                    }
                }
            }
        };

        function addSlideShowListener(demo) {
            bindEvent(demo[0], 'vpointerdown', pointerDownEvent);
            bindEvent(demo[0], 'vpointerup', pointerUpEvent);
        }

        function pointerDownEvent(event) {
            event.preventDefault();

            var demo = $(this);
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

            var point = event.touches ? event.touches[0] : event;
            startPosX = point.pageX - xpos;
            startPosY = point.pageY - ypos;
            event.stopPropagation();
        }

        function pointerUpEvent(event) {
            //var demo = event.target;
            var demo = $(this);
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

            var point = event.changedTouches ? event.changedTouches[0] : event;
            stopPosX = point.pageX - xpos;
            stopPosY = point.pageY - ypos;

            var touchgapX = Math.abs(startPosX - stopPosX);
            var touchgapY = Math.abs(startPosY - stopPosY);
            var isanimate1 = false;
            if (demo1 !== undefined) {
                isanimate1 = demo1.is(":animated");
            }
            if (isanimate1 === false) {
                drag = true;
            } else {
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
                                } else {
                                    slideShowImgAnimation(demo, "left");
                                    slideDirection = "rightToLeft";
                                }

                            } else {
                                slideDirection = "rightToLeft";
                            }
                        } else if (stopPosX > startPosX) {
                            if (drag) {
                                if (playOnPageTurn === "true") {
                                    clearInterval(slideID);
                                    slideShowImgAnimation(demo, "right");
                                    slideDirection = "leftToRight";
                                    slideID = setInterval(PlaySlide, playGap);
                                    demoSlide.children().eq(0).attr("idRaf", slideID);
                                } else {
                                    slideShowImgAnimation(demo, "right");
                                    slideDirection = "leftToRight";
                                }
                            } else {
                                slideDirection = "leftToRight";
                            }
                        }
                    }
                } else if (slideDirection === "topToBottom" || slideDirection === "bottomToTop") {
                    if (touchgapY > touchgapLength) {
                        if (stopPosY < startPosY) {
                            if (drag) {
                                if (playOnPageTurn === "true") {
                                    clearInterval(slideID);
                                    slideShowImgAnimation(demo, "top");
                                    slideDirection = "bottomToTop";
                                    slideID = setInterval(PlaySlide, playGap);
                                    demoSlide.children().eq(0).attr("idRaf", slideID);
                                } else {
                                    slideShowImgAnimation(demo, "top");
                                    slideDirection = "bottomToTop";
                                }
                            } else {
                                slideDirection = "bottomToTop";
                            }
                        } else if (stopPosY > startPosY) {
                            if (drag) {
                                if (playOnPageTurn === "true") {
                                    clearInterval(slideID);
                                    slideShowImgAnimation(demo, "bottom");
                                    slideDirection = "topToBottom";
                                    slideID = setInterval(PlaySlide, playGap);
                                    demoSlide.children().eq(0).attr("idRaf", slideID);
                                } else {
                                    slideShowImgAnimation(demo, "bottom");
                                    slideDirection = "topToBottom";
                                }
                            } else {
                                slideDirection = "topToBottom";
                            }
                        }
                    }
                }
            } else if (effect === "fade") {
                if (touchgapX > touchgapLength) {
                    if (stopPosX < startPosX) {
                        if (drag) {
                            if (playOnPageTurn === "true") {
                                slideDirection = "rightToLeft";
                                clearInterval(fadeID);
                                fadeShowImgAnimation();
                                PlayFade();
                            } else {
                                slideDirection = "rightToLeft";
                                fadeShowImgAnimation();
                            }
                        } else {
                            slideDirection = "rightToLeft";
                        }
                    } else if (stopPosX > startPosX) {
                        if (drag) {
                            if (playOnPageTurn === "true") {
                                slideDirection = "leftToRight";
                                clearInterval(fadeID);
                                fadeShowImgAnimation();
                                PlayFade();
                            } else {
                                slideDirection = "leftToRight";
                                fadeShowImgAnimation();
                            }
                        } else {
                            slideDirection = "leftToRight";
                        }
                    }
                }
            }
            drag = false;
            demo.attr("slideDirection", slideDirection);
            event.stopPropagation();
        }

        function slideShowImgAnimation(demo, direction) {

            if (direction === "left") // left
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
            } else if (direction === "right") // right
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
            if (direction === "top") // top
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
            } else if (direction === "bottom") // bottom
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
            console.log('dddddddd', demo1, demo2)
        }

        function getNextFadePicIndex() //更改fadePicIndex是得指向下一张图
        {
            if (slideDirection == "rightToLeft") {
                if (fadePicIndex > 0) {
                    fadePicIndex--;
                } else {
                    fadePicIndex = count_of - 2;
                }
            } else if (slideDirection == "leftToRight") // right
            {
                if (fadePicIndex < count_of - 2) {
                    fadePicIndex++;
                } else {
                    fadePicIndex = 0;
                }
            }
        }

        function fadeShowImgAnimation() {
            //使用demo1,demo2与滑动效果保持命名统一
            demo1 = picGroup[fadePicIndex];
            demo1.fadeOut(speed);
            getNextFadePicIndex();
            demo2 = picGroup[fadePicIndex];
            demo2.fadeIn(speed);
        }

        function AutoSlide() {
            //            if (lisnerDelayID !== 0) {
            //                clearInterval(lisnerDelayID);
            //                lisnerDelayID = 0;
            // 
            if (effect == "slide") {
                clearInterval(slideID);
                slideID = setInterval(PlaySlide, playGap);
                demoSlide.children().eq(0).attr("idRaf", slideID);
            } else if (effect == "fade") {
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
                } else if (slideDirection === "rightToLeft") {
                    slideLeft();
                } else if (slideDirection === "topToBottom") {
                    slideBottom();
                } else if (slideDirection === "bottomToTop") {
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

        function getRelativeDisttance(subElement, parentElement) {
            if (parentElement === void 0) {
                parentElement = window.mySwiper.$el[0];
            }
            var distX = 0,
                distY = 0,
                tempEl = subElement;
            while (tempEl && !tempEl.classList.contains("divshow")) {
                distX += tempEl.offsetLeft;
                distY += tempEl.offsetTop;
                tempEl = tempEl.parentNode;
            }
            return {
                x: distX,
                y: distY
            }
        }

        function fullScreenEvent() {
            if (isNowFullScreen === false) {
                isNowFullScreen = true;
                var fullWidth = window.sizeAdjustor.originSize.width;
                var fullHeight = window.sizeAdjustor.originSize.height;
                var scaleX = fullWidth / demoSlide.width();
                var scaleY = fullHeight / demoSlide.height();
                var dist = getRelativeDisttance(demoSlide[0]);
                var distX = dist.x,
                    distY = dist.y;
                demoSlide.css({ "left": -distX + "px", "top": -distY + "px", "transform-origin": "left top", "transform": "scale(" + scaleX + "," + scaleY + ")" });
            } else {
                isNowFullScreen = false;
                demoSlide.css({ "left": 0, "top": 0, "transform": "scale(1, 1)" });
            }
        }

        function addDoubleClickListener() {
            demoSlide.on("dblclick", fullScreenEvent);
            if (is_mobile()) {
                demoSlide.on("touchstart", function() {
                    timeCount++;
                    setTimeout(function() {
                        timeCount = 0;
                    }, 500);
                    if (timeCount > 1) fullScreenEvent();
                });
            }

        }

        return new SlideShow(id, option);
    });
})();