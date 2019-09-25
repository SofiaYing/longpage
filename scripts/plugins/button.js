(function() {
    FX.plugins["button"] = (function(id, option) {
        var goToPageEvent;
        if (is_mobile())
            goToPageEvent = 'touchstart'
        else
            goToPageEvent = 'click';
        var gotoStateAction;
        var gotoNextStateAction;
        var gotoPrevStateAction;
        var stateuid;
        var statetype;
        var gotoPageAction;
        var pageIndex;
        var gotoURLAction;
        var url;
        var count_of;
        var demoButton;


        // 对象
        var Button = function(id, option) {
            this.$target = $("#" + id).children().eq(0);
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, Button);

        //组件初始化
        Button.prototype.init = function(id, option) {
            //console.info("init:",id);
            demoButton = this.$target;
            var b_parentDiv = demoButton.parent();
            var btID = b_parentDiv[0].id;

            count_of = demoButton.children().length;
            var spaceW = demoButton.width();
            var spaceH = demoButton.height();
            var effect;
            var slideDirection;
            // no json
            var jsonnode = demoButton.children()[count_of - 1];
            var jsonStr = jsonnode.value;
            var data = eval('(' + jsonStr + ')');
            // no json

            gotoStateAction = data.gotoStateAction; //转至画面
            gotoNextStateAction = data.gotoNextStateAction;
            gotoPrevStateAction = data.gotoPrevStateAction;
            stateuid = data.stateuid; //关联组件
            statetype = data.statetype; //转至画面/关闭画面 0-全部 1-画面1 以此类推
            gotoPageAction = data.gotoPageAction;
            pageIndex = data.pageIndex;
            gotoURLAction = data.gotoURLAction;
            url = data.url;

            addButtonListener(demoButton, btID);
            //以下代码为了判断设置为(显示第一个弹出内容时)的情况，做特殊处理：
            //1：把z-index设置为0，为了不遮挡按钮。
            //2：对其进行标记，用jquery.data(),使得在destroy时将其display设置为inline而不是none
            var slideshowuid = "";
            var slideshowimage = 0;
            var len = stateuid.length;
            if (len > 3) {
                var strhead = stateuid.substr(0, 3);
                if (strhead === "si_") {
                    slideshowuid = stateuid;
                    slideshowimage = Number(statetype) - 1;
                } else {
                    slideshowuid = 'si_' + stateuid.substr(4);
                    slideshowimage = Number(statetype);
                }
            }

            if ((gotoStateAction === "true") || (gotoNextStateAction === "true") || (gotoPrevStateAction === "true")) {

                var demoSlide = $('div#' + slideshowuid);
                var state_count = demoSlide.children().length - 1;
                for (var i = 0; i < state_count; i++) {
                    if (demoSlide[0].title === "PopupContent") {
                        var demoX = demoSlide.children().eq(i);
                        if (demoX.css("display") === "inline") {
                            demoX.data("firstTimeShowContent", true);
                            var demo1 = demoX.children().eq(0).children().eq(0);
                            demo1.css("z-index", "0");
                        }
                    }

                }
            }
        };

        //重置数据
        Button.prototype.reset = function(option) {
            console.info("reset", option);
        };

        //数据重置
        Button.prototype.destroy = function(option) {
            var slideshowuid = "";
            var slideshowimage = 0;

            var len = stateuid.length;
            if (len > 3) {
                var strhead = stateuid.substr(0, 3);
                if (strhead === "si_") {
                    slideshowuid = stateuid;
                    slideshowimage = Number(statetype) - 1;
                } else {
                    slideshowuid = 'si_' + stateuid.substr(4);
                    slideshowimage = Number(statetype);
                }
            }

            if ((gotoNextStateAction === "true") || (gotoPrevStateAction === "true")) {}
            //ShowUpButton();
            if ((gotoStateAction === "true") || (gotoNextStateAction === "true") || (gotoPrevStateAction === "true")) {

                var demoSlide = $('div#' + slideshowuid);
                var state_count = demoSlide.children().length - 1;
                for (var i = 0; i < state_count; i++) {
                    if (demoSlide[0].title === "PopupContent") {
                        var demoX = demoSlide.children().eq(i);
                        if (demoX.data("firstTimeShowContent")) {
                            demoX.css("display", "inline");
                            continue;
                        }
                        UnTopPopupContent(demoX);
                        demoX.css("display", "none");
                        ResetInteractiveInPopupContent(demoX, slideshowimage);
                    }

                }
            }
            //GoTo(btID, parentIndex);
            else if (gotoPageAction === "true") {}
            //GotPage();
            else if (gotoURLAction === "true") {}
            //GotURL();

            ShowUpButton();
        };



        function addButtonListener(demo, btID) {
            var xpos = demo[0].offsetLeft;
            var ypos = demo[0].offsetTop;
            var divBtnIcon0 = demo.children().eq(0);
            var divBtnIcon1 = demo.children().eq(1);
            divBtnIcon1.css("display", "none");

            function GoTo(bt_ID, parentIndex, statetype) {
                var slideshowuid = "";
                var slideshowimage = 0;

                var len = stateuid.length;
                if (len > 3) {
                    var strhead = stateuid.substr(0, 3);
                    if (strhead === "si_") {
                        slideshowuid = stateuid;
                        slideshowimage = Number(statetype) - 1;
                    } else {
                        slideshowuid = 'si_' + stateuid.substr(4);
                        slideshowimage = Number(statetype);
                    }
                }

                $('div#' + slideshowuid).each(function() {

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
                                        } else if (ileft > -spaceW && ileft <= 0 && slideDirection === "rightToLeft") {
                                            slideshowimage = (i + 1 + state_count) % state_count;
                                            demoImg = demoSlide.children().eq(slideshowimage);
                                            break;
                                        }
                                    }
                                } else if (gotoPrevStateAction === "true") {
                                    for (var i = 0; i < state_count; i++) {
                                        var demoX = demoSlide.children().eq(i);
                                        var left = demoX[0].style.left;

                                        left = left.substring(0, left.indexOf("px"));
                                        var ileft = Number(left);
                                        if (ileft >= 0 && ileft < spaceW && slideDirection === "leftToRight") {
                                            slideshowimage = (i + 1 + state_count) % state_count;
                                            demoImg = demoSlide.children().eq(slideshowimage);
                                            break;
                                        } else if (ileft > -spaceW && ileft <= 0 && slideDirection === "rightToLeft") {
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

                            } else if (slideDirection === "topToBottom" || slideDirection === "bottomToTop") {
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
                                        } else if (itop > -spaceH && itop <= 0 && slideDirection === "bottomToTop") {
                                            slideshowimage = (i + 1 + state_count) % state_count;
                                            demoImg = demoSlide.children().eq(slideshowimage);
                                            break;
                                        }
                                    }
                                } else if (gotoPrevStateAction === "true") {
                                    for (var i = 0; i < state_count; i++) {
                                        var demoX = demoSlide.children().eq(i);
                                        var top = demoX[0].style.top;

                                        top = top.substring(0, top.indexOf("px"));
                                        var itop = Number(top);
                                        if (itop >= 0 && itop < spaceH && slideDirection === "topToBottom") {
                                            slideshowimage = (i + 1 + state_count) % state_count;
                                            demoImg = demoSlide.children().eq(slideshowimage);
                                            break;
                                        } else if (itop > -spaceH && itop <= 0 && slideDirection === "bottomToTop") {
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
                        } else if (effect === "fade") {
                            var fromIndex = 0;
                            var turnToIndex = 0;
                            var visibleItemIndex = [];
                            for (var i = 0; i < state_count; i++) {
                                var tempDemo = demoSlide.children().eq(i);
                                if (tempDemo.is(":visible")) {
                                    visibleItemIndex.push(i);
                                }
                            }

                            if (visibleItemIndex.length === 1) //只有一张图片正在显示,淡入淡出完成
                            {
                                if (gotoNextStateAction === "true") {
                                    if (slideDirection === "leftToRight") {
                                        turnToIndex = (visibleItemIndex[0] + state_count - 1) % state_count;
                                    } else if (slideDirection === "rightToLeft") {
                                        turnToIndex = (visibleItemIndex[0] + 1) % state_count;
                                    }
                                } else if (gotoPrevStateAction === "true") {
                                    if (slideDirection === "leftToRight") {
                                        turnToIndex = (visibleItemIndex[0] + 1) % state_count;
                                    } else if (slideDirection === "rightToLeft") {
                                        turnToIndex = (visibleItemIndex[0] + state_count - 1) % state_count;
                                    }
                                } else {
                                    turnToIndex = slideshowimage;
                                }
                                fromIndex = visibleItemIndex[0];
                                demoSlide.children().eq(fromIndex).css({ display: "none" });
                                demoSlide.children().eq(turnToIndex).css({ display: "" });
                            } else if (visibleItemIndex.length === 2) //同时有两张图片在显示，在淡入淡出的过程中
                            {
                                if ((visibleItemIndex[0] + 1) % state_count === visibleItemIndex[1]) //第一个在前，第二个在后
                                {
                                    if (gotoNextStateAction === "true") {
                                        if (slideDirection === "leftToRight") {
                                            fromIndex = visibleItemIndex[1];
                                            turnToIndex = visibleItemIndex[0];
                                        } else if (slideDirection === "rightToLeft") {
                                            fromIndex = visibleItemIndex[0];
                                            turnToIndex = visibleItemIndex[1];
                                        }
                                    } else if (gotoPrevStateAction === "true") {
                                        if (slideDirection === "leftToRight") {
                                            fromIndex = visibleItemIndex[0];
                                            turnToIndex = visibleItemIndex[1];
                                        } else if (slideDirection === "rightToLeft") {
                                            fromIndex = visibleItemIndex[1];
                                            turnToIndex = visibleItemIndex[0];
                                        }

                                    } else //点击的是第一张或者最后一张的按钮
                                    {
                                        turnToIndex = slideshowimage;
                                    }
                                } else {
                                    if (gotoNextStateAction === "true") {
                                        if (slideDirection === "leftToRight") {
                                            fromIndex = visibleItemIndex[0];
                                            turnToIndex = visibleItemIndex[1];
                                        } else if (slideDirection === "rightToLeft") {
                                            fromIndex = visibleItemIndex[1];
                                            turnToIndex = visibleItemIndex[0];
                                        }

                                    } else if (gotoPrevStateAction === "true") {
                                        if (slideDirection === "leftToRight") {
                                            fromIndex = visibleItemIndex[1];
                                            turnToIndex = visibleItemIndex[0];
                                        } else if (slideDirection === "rightToLeft") {
                                            fromIndex = visibleItemIndex[0];
                                            turnToIndex = visibleItemIndex[1];
                                        }

                                    } else {
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
                            } else if (effect === "fade") {
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

                        function getNextFadePicIndex() //更改fadePicIndex是得指向下一张图
                        {
                            slideDirection = demoSlide.attr("slideDirection");
                            if (slideDirection == "leftToRight") {
                                fadePicIndex = (fadePicIndex - 1 + state_count) % state_count;
                            } else if (slideDirection == "rightToLeft") // right
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
                            if (direction === "left") // left
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
                                } catch (e) {
                                    var msg = e.name + e.message;
                                }

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
                                demo2.animate({ left: "0px" }, speed, 'linear', Func1);
                                demo1.animate({ left: spaceW + "px" }, speed, 'linear', Func2);
                            }
                            if (direction === "top") // top
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
                            } else if (direction === "bottom") // bottom
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
                                } else if (slideDirection === "rightToLeft") {
                                    slideLeft();
                                } else if (slideDirection === "topToBottom") {
                                    slideBottom();
                                } else if (slideDirection === "bottomToTop") {
                                    slideTop();
                                }
                            } else if (effect === "fade") {
                                if (slideDirection === "leftToRight") {
                                    fadeRight();
                                } else if (slideDirection === "rightToLeft") {
                                    fadeLeft();
                                } else if (slideDirection === "topToBottom") {
                                    fadeBottom();
                                } else if (slideDirection === "bottomToTop") {
                                    fadeTop();
                                }
                            }

                            //requestAnimationFrame(PlaySlide1());
                        }
                        //幻灯片代码,end

                    } else if (demoSlide[0].title === "PopupContent") {
                        var spaceW = demoSlide.width();
                        var spaceH = demoSlide.height();
                        var state_count = slideCount - 1;
                        // no json
                        var _jsonnode = demoSlide.children()[slideCount - 1];
                        var _jsonStr = _jsonnode.value;
                        var _data = eval('(' + _jsonStr + ')');
                        // no json

                        var mutualExclusion = _data.mutualExclusion;

                        //互斥
                        if (mutualExclusion === 'true') {
                            var ShowButton = true;
                            var gotoState = false;
                            //下一画面
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
                            //上一画面 
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
                                        PlayInteractiveInPopupContent(demoX, slideshowimage);
                                    }
                                    slideshowimage = i;
                                    if (gotoStateAction === "true" && bCurentShow === false) {
                                        if (ShowButton) {
                                            ShowDownButton();
                                            ShowButton = false;
                                        }

                                        // 处理其他相关互斥按钮弹起
                                        $("div[title='Button']").each(function() {

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
                                } else {
                                    if (i === slideshowimage) {
                                        if (gotoStateAction === "true" && gotoNextStateAction === "false" && gotoPrevStateAction === "false") {
                                            if (demoX[0].style.display === "inline") {

                                                UnTopPopupContent(demoX);
                                                demoX.css("display", "none");
                                                ResetInteractiveInPopupContent(demoX, slideshowimage);

                                                ResetButtonPopupContent(demoX);
                                                if (bCurentShow === true) {
                                                    if (ShowButton) {
                                                        ShowUpButton();
                                                    }
                                                }
                                            } else {
                                                demoX.css("display", "inline");
                                                MoveCloseButton(demoX, parentIndex);
                                                if (bCurentShow === false) {
                                                    TopPopupContent(demoX, parentIndex);
                                                    PlayInteractiveInPopupContent(demoX, slideshowimage);
                                                    ShowFirstImageInPopupContent(demoX);
                                                }
                                                if (bCurentShow === false) {
                                                    if (ShowButton) {
                                                        ShowDownButton();
                                                        ShowButton = false;
                                                    }

                                                    // 处理其他相关互斥按钮弹起
                                                    $("div[title='Button']").each(function() {

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
                                        } else {
                                            // 上一个，下一个
                                            demoX.css("display", "inline");
                                            MoveCloseButton(demoX, 0);
                                            if (!bCurentShow) {
                                                TopPopupContent(demoX, 0);
                                                PlayInteractiveInPopupContent(demoX, slideshowimage);
                                            }
                                        }
                                    } else {
                                        UnTopPopupContent(demoX);
                                        demoX.css("display", "none");
                                        ResetInteractiveInPopupContent(demoX, i);
                                        if (gotoStateAction === "true" && bCurentShow === true) {
                                            if (ShowButton) {
                                                ShowUpButton();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //非互斥 
                        else {
                            var bShowSlide = false;
                            if (gotoNextStateAction === "true") {
                                for (var i = 0; i < state_count; i++) {
                                    var demoX = demoSlide.children().eq(i);
                                    if (demoX[0].style.display === "none") {
                                        TopPopupContent(demoX, 0);
                                        demoX[0].style.display = "inline";
                                        MoveCloseButton(demoX, 0);
                                        PlayInteractiveInPopupContent(demoX, slideshowimage);
                                        bShowSlide = true;
                                        break;
                                    }
                                }
                            } else if (gotoPrevStateAction === "true") {
                                for (var i = state_count - 1; i >= 0; i--) {
                                    var demoX = demoSlide.children().eq(i);
                                    if (demoX[0].style.display === "none") {
                                        TopPopupContent(demoX, 0);
                                        demoX[0].style.display = "inline";
                                        MoveCloseButton(demoX, 0);
                                        PlayInteractiveInPopupContent(demoX, slideshowimage);
                                        bShowSlide = true;
                                        break;
                                    }
                                }
                            } else if (gotoStateAction === "true") {
                                var demoX = demoSlide.children().eq(slideshowimage);
                                if (demoX[0].style.display === "none") {
                                    TopPopupContent(demoX, 0);
                                    demoX.css("display", "inline");
                                    MoveCloseButton(demoX, 0);
                                    PlayInteractiveInPopupContent(demoX, slideshowimage);
                                    bShowSlide = true;
                                    ShowDownButton();
                                }
                            }

                            if (!bShowSlide) {

                                var demoX = demoSlide.children().eq(slideshowimage);
                                UnTopPopupContent(demoX);
                                demoX[0].style.display = "none";
                                ResetInteractiveInPopupContent(demoX, slideshowimage);
                                ShowUpButton();
                            }
                        }

                        addCloseImgListener(demoSlide);
                    }
                });
            }

            //打开全部画面
            function openAllPictures(stateId) {
                var demo = $('#' + stateId);
                $.each(demo.children(), function(index, item) {
                    if ($(item).attr('title') && $(item).attr('title').substring(0, 2) === '画面') {
                        if ($(item).css('display') === 'none') {
                            TopPopupContent($(item), 0);
                            $(item).css({ 'display': 'inline' });
                            MoveCloseButton($(item), 0);
                            addCloseImgListener(demo);
                            PlayInteractiveInPopupContent($(item), 0);
                        }
                    }
                })
            }

            //关闭画面 全部/指定
            function closePictures(stateId, curState, ctState, type) {
                var demo = $('#' + stateId);
                //关闭全部画面
                if (curState == ctState) {
                    if (type === 0) {
                        $.each(demo.children(), function(index, item) {
                            if ($(item).attr('title') && $(item).attr('title').substring(0, 2) === '画面') {
                                if ($(item).css('display') !== 'none') {
                                    UnTopPopupContent($(item), 0);
                                    $(item).css({ 'display': 'none' });
                                    ResetInteractiveInPopupContent($(item), 0);
                                    // ShowUpButton();
                                }
                            }
                        })
                    } else if (type === 1) {
                        var popupContents = $('div[title="PopupContent"]');
                        $.each(popupContents, function(index, item) {
                            $.each($(item).children(), function(index, item) {
                                if ($(item).attr('title') && $(item).attr('title').substring(0, 2) === '画面') {
                                    if ($(item).css('display') !== 'none') {
                                        UnTopPopupContent($(item), 0);
                                        $(item).css({ 'display': 'none' });
                                        ResetInteractiveInPopupContent($(item), 0);
                                        // ShowUpButton();
                                    }
                                }
                            })
                        })
                    }
                }
                //关闭指定画面 
                else {
                    closeIMGButton(demo.children()[parseInt(curState) - 1]);
                }
            }

            //关闭画面 全部/指定
            function SaveImage(imgBg, imgUserParent) {
                $('.show-image-container').css('display', 'flex');
                $('.show-image-container').on('click', function(e) {
                    e.stopPropagation;
                    $('.show-image-container').css('display', 'none');
                    return false
                })

                function getRelativeDisttance(subElement, container) {
                    var distX = 0,
                        distY = 0,
                        tempEl = subElement;
                    while (tempEl && !tempEl.classList.contains(container)) {

                        distX += tempEl.offsetLeft;
                        distY += tempEl.offsetTop;
                        tempEl = tempEl.parentNode;
                    }
                    return {
                        x: distX,
                        y: distY
                    }
                }



                var imgBg = document.getElementById(imgBg);
                var imgUser = $('#' + imgUserParent).children('img')[0];
                var imgShow = document.getElementById('showImage');
                var imgUserOffsetArray = getRelativeDisttance($('#' + imgUserParent)[0], 'divshow');

                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");

                var canvasWidth = imgBg.width * window.sizeAdjustor.scaleX;
                var canvasHeight = imgBg.height * window.sizeAdjustor.scaleY;
                var imgUserLeft = imgUserOffsetArray.x * window.sizeAdjustor.scaleX;
                var imgUserTop = imgUserOffsetArray.y * window.sizeAdjustor.scaleY;
                var imgUserWidth = imgUser.width * window.sizeAdjustor.scaleX;
                var imgUserHeight = imgUser.height * window.sizeAdjustor.scaleY;

                $(canvas).css({ 'width': canvasWidth + 'px', 'height': canvasHeight + 'px' })
                canvas.width = canvasWidth * 2;
                canvas.height = canvasHeight * 2;


                context.drawImage(imgUser, 0, 0, imgUser.naturalWidth, imgUser.naturalHeight, imgUserLeft, (imgUserTop - 1), (imgUserWidth + 2), (imgUserHeight + 2));
                context.drawImage(imgBg, 0, 0, imgBg.naturalWidth, imgBg.naturalHeight, 0, 0, canvasWidth, canvasHeight);
                context.scale(2, 2)

                $(imgShow).css({ 'width': canvasWidth + 'px', 'height': canvasHeight + 'px' });
                imgShow.src = canvas.toDataURL();
            }

            function GotPage(btID) {
                var curFrmSrc = window.location.href;
                var index1 = curFrmSrc.lastIndexOf(".");
                var index2 = curFrmSrc.length;
                var fileext = curFrmSrc.substring(index1, index2);
                var nIndex = parseInt(pageIndex) - 1;
                var data = "{ act:\'slidto\', val:" + nIndex + "}";
                postMessage(data, '*');
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

            //控制动态组件播放
            function controlDynamicObject(demoId, operation) {
                //video 视频 imageSeq 图像序列 timeLineSlide 滑线动画
                var curInstance = window.fx.getItemById(demoId);
                curInstance.controlDynamicObject(operation); //播放 暂停 停止
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
                    } else {
                        slideshowuid = 'si_' + stateuid.substr(4);
                    }
                } else {
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
                    displayCloseButton = _data.displayCloseButton;
                    mutualExclusion = _data.mutualExclusion;
                }

                var iconFlickerLen = demo.children('div').length;
                if (isIconFlicker === "true" && iconFlickerLen > 0) {
                    divBtnIcon1[0].style.display = "inline";
                    var divFlicker;
                    if (iconFlickerLen === 1) {
                        //只有一个图标
                        divFlicker = divBtnIcon0;
                    } else {
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

                //默认展示画面1且添加关闭按钮，载入页面时即添加关闭按钮操作
                if (displayFirstImage === "true") {
                    var firstChild = $(demoSlide.children()[0]);
                    if (displayCloseButton === "true")
                        addCloseImgListener(demoSlide);

                    TopPopupContent(firstChild, 0);

                    PlayVideo(firstChild);
                    PlayAudio(firstChild);
                    PlayClickplay(firstChild);
                    PlaySprite(firstChild);
                    PlayPieChart(firstChild);
                    PlayWebContent(firstChild);
                }
            }

            ShowByPopupContent();

            demo.on('vpointerdown', function(event) {
                event.preventDefault();
                if ((gotoNextStateAction === "true") || (gotoPrevStateAction === "true"))
                    ShowDownButton();
                else if (gotoPageAction === "true")
                    ShowDownButton();
                event.stopPropagation();
            });
            demo.on(goToPageEvent, function(e) {
                e.preventDefault();
                var demoButton = $(e.target.parentNode.parentNode);
                var count_of = demoButton.children().length;
                var jsonnode = demoButton.children()[count_of - 1];
                var jsonStr = jsonnode.value;
                var data = eval('(' + jsonStr + ')');
                var closeStateAction = data.closeStateAction;
                var closeAllStateAction = data.closeAllStateAction;
                gotoStateAction = data.gotoStateAction;
                gotoNextStateAction = data.gotoNextStateAction;
                gotoPrevStateAction = data.gotoPrevStateAction;
                gotoPageAction = data.gotoPageAction;
                pageIndex = data.pageIndex;
                gotoURLAction = data.gotoURLAction;
                url = data.url;
                var gotoZoomAction = data.gotoZoomAction;
                stateuid = data.stateuid;
                statetype = data.statetype;

                dynamicControl = data.timeLineSlideAction; //是否为控制动态组件的按钮
                dynamicComponentId = data.timeLineSlideId;
                operation = data.operation; //按钮对动态组件的具体操作

                var imgBg = data.imgBg;
                var imgUser = data.imgUser;
                var saveImage = data.saveImage;

                if (dynamicControl === "false") {
                    var ctState = (stateuid === '') ? 0 : document.getElementById(stateuid).children.length;
                }

                var parentIndex = $(this).css('z-index');



                if ((gotoNextStateAction === "true") || (gotoPrevStateAction === "true"))
                    ShowUpButton();

                if (gotoStateAction === "true" && statetype == ctState) //打开全部画面
                    openAllPictures(stateuid);
                else if (closeStateAction === "true") //关闭画面
                    closePictures(stateuid, statetype, ctState, 0);
                else if (closeAllStateAction === "true")
                    closePictures(stateuid, ctState, ctState, 1);
                else if ((gotoStateAction === "true") || (gotoNextStateAction === "true") || (gotoPrevStateAction === "true"))
                    GoTo(btID, parentIndex, statetype);
                else if (gotoPageAction === "true")
                    GotPage();
                else if (gotoURLAction === "true")
                    GotURL();
                else if (gotoZoomAction === "fitWindow") {
                    if (self === top) {
                        toggleFullScreen();
                    } else {
                        window.parent.postMessage("fullscreen", '*');
                    }
                } else if (dynamicControl === "true") { //控制动态组件
                    controlDynamicObject(dynamicComponentId, operation);
                } else if (saveImage === "true") {
                    SaveImage(imgBg, imgUser);
                }

                return false
            });

            demo.on('vmouseout', function(e) {
                if ((gotoNextStateAction === "true") || (gotoPrevStateAction === "true"))
                    ShowUpButton();
            });
        }

        function PlayVideo(showNode) {
            var videonodes = showNode.find("div[title='video']");
            for (var i = 0; i < videonodes.length; i++) {
                var video = GetChild('video', videonodes[i], 0);
                if (video === null || video === undefined) {
                    var curItem = window.fx.getItemById(videonodes[i].id);
                    curItem.reset();
                    continue;
                }
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
            var audionodes = showNode.find("audio"); //ibooks不支持autoplay属性
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
                    lines.forEach(function(v, i, a) {
                        var time = v.match(pattern),
                            value = v.replace(pattern, '');
                        if (time == null)
                            return;
                        time.forEach(function(v1, i1, a1) {
                            //convert the [min:sec] to secs format then store into result
                            var t = v1.slice(1, -1).split(':');
                            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]) + parseInt(offset) / 1000, value]);
                        });
                    });
                    //sort the result by time
                    result.sort(function(a, b) {
                        return a[0] - b[0];
                    });
                    return result;
                }

                function getOffset(text) {
                    //Returns offset in miliseconds.
                    var offset = 0;
                    try {
                        // Pattern matches [offset:1000]
                        var offsetPattern = /\[offset:\-?\+?\d+\]/g,
                            // Get only the first match.
                            offset_line = text.match(offsetPattern)[0],
                            // Get the second part of the offset.
                            offset_str = offset_line.split(':')[1];
                        // Convert it to Int.
                        offset = parseInt(offset_str);
                    } catch (err) {
                        //alert("offset error: "+err.message);
                        offset = 0;
                    }
                    return offset;
                }
            }
        }

        function PlaySprite(showNode) {
            var spriteNodes = showNode.find("div[title='sprite']");
            for (var i = 0; i < spriteNodes.length; i++) {
                var demoSlide = spriteNodes.eq(i);
                var count_of_Slide = demoSlide.children().length;
                var demo1 = demoSlide.eq(0);

                var icur = 0;
                var clickStop = false;
                var curImg = "";
                var lastSeqImg = false;

                var imgW = demo1.width();
                var imgH = demo1.height();

                // no json
                var jsonnode = demoSlide.children()[count_of_Slide - 1];
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
                    } catch (err) {}
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
                    } else {
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

                function playAudio(demo1, audio) {
                    var parent = demo1.parent().eq(0);

                    var audionode = parent.find("audio[src='" + audio + "']")[0];
                    if (audionode)
                        audionode.play();
                }

                function PlaySlide() {
                    icur = 0;
                    clickStop = false;
                    var stop = demoSlide[0].getAttribute('userAnimationFrame');
                    if (stop !== undefined) //未选中自动播放
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

        function PlayWebContent(showNode) {
            var webContentNodes = showNode.find("iframe[title=webcontent]");
            webContentNodes.each(function() {
                this.src = this.src; //刷新网页视图
            });
        }

        function PlayInteractiveInPopupContent(showNode, slideshowimage) {
            PlayVideo(showNode);
            PlayAudio(showNode);

            PlayClickplay(showNode);
            PlaySprite(showNode);
            PlayPieChart(showNode);
            PlayWebContent(showNode);
            var curItem = window.fx.getItemById(showNode[0].parentNode.id);
            if (curItem !== undefined && slideshowimage !== -1)
                curItem.play(slideshowimage);

            curItem.playAnimation(showNode);

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
                    } else {
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
                } else {
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
                    if (iZindex === "auto")
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

            if (showchildnodes.length !== 0)
                return;
            showNode.css("zIndex", "");
        }

        function ResetInteractiveInPopupContent(showNode, slideshowimage) {

            ResetVideo(showNode);
            ResetAudio(showNode);
            // ResetButtonPopupContent(showNode);
            ResetClickplay(showNode);
            ResetSpriteContent(showNode);
            ResetReRead(showNode);
            var curItem = window.fx.getItemById(showNode[0].parentNode.id);
            if (curItem !== undefined && slideshowimage !== -1)
                curItem.unplay(slideshowimage);

            curItem.stopAnimation(showNode);
        }

        function ResetReRead(showNode) {
            var reReadNodes = showNode.find("div[title=reread]");
            reReadNodes.each(function() {
                $(this).find("audio").each(function() {
                    this.pause();
                    this.currentTime = 0;
                });
                $(this).find("img[src]").eq(0).attr("src", "Media/reread_play.png");
            });
        }

        function ResetVideo(showNode) {
            var videonodes = showNode.find("div[title='video']");
            for (var i = 0; i < videonodes.length; i++) {
                var video = GetChild('video', videonodes[i], 0);
                if (video === null || video === undefined) {
                    var curItem = window.fx.getItemById(videonodes[i].id);
                    curItem.destroy();
                    continue;
                }
                var duration = video.duration;
                if (duration)
                    video.currentTime = 0;
                video.pause();
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

                var c_stateuid = '';
                var c_statetype = '';

                // no json
                var c_jsonnode = c_demoButton.children()[c_count_of - 1];
                var c_jsonStr = c_jsonnode.value;
                var c_data = eval('(' + c_jsonStr + ')');
                // no json

                c_stateuid = c_data.stateuid;
                c_statetype = c_data.statetype;

                var c_slideshowuid = "";

                var len = c_stateuid.length;
                if (len > 3) {
                    var strhead = c_stateuid.substr(0, 3);
                    if (strhead === "si_") {
                        c_slideshowuid = c_stateuid;
                        c_slideshowimage = Number(c_statetype) - 1;
                    } else {
                        c_slideshowuid = 'si_' + c_stateuid.substr(4);
                        c_slideshowimage = Number(c_statetype);
                    }
                }
                if (c_slideshowuid !== "") {
                    $('div#' + c_slideshowuid).each(function() {
                        var c_demoSlide = $(this);
                        var d_slideCount = c_demoSlide.children().length;

                        if (c_demoSlide[0].title === "PopupContent") {
                            var d_state_count = d_slideCount - 1;
                            for (var j = 0; j < d_state_count; j++) {
                                var d_demoX = c_demoSlide.children().eq(j);

                                UnTopPopupContent(d_demoX);
                                d_demoX.css("display", "none");
                                ResetInteractiveInPopupContent(d_demoX, j);
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
                var audionode = spriteNode.find("audio")[0];
                if (audionode) {
                    audionode.pause();
                    audionode.curTime = 0;
                }
            }
        }

        function MoveCloseButton(demoX, parentIndex) {
            var demoXInstance = window.fx.getItemById($(demoX).parents('div[title="PopupContent"]')[0].id);
            demoXInstance.setCloseButtonPos(demoX, parentIndex);
        }

        function closeIMGButton(event) {
            //如果点击非关闭图标,返回
            // if (event.target.nodeName.toLowerCase() !== "img") //关闭按钮图片名不确定
            //     return;
            var contentX = event.target ? event.target.parentElement : event;
            UnTopPopupContent($(contentX));
            contentX.style.display = "none";
            ResetVideo($(contentX));
            ResetAudio($(contentX));
            ResetButtonPopupContent($(contentX));
            ResetInteractiveInPopupContent($(contentX), -1);
            var parentX = contentX.parentNode;
            var parentid = parentX.id;
            var state = 1;
            var prev = contentX.previousSibling;
            while (prev) {
                state++;
                prev = prev.previousSibling;
            }

            $("div[title='Button']").each(function() {
                var b_demoButton = $(this);
                var b_count_of = b_demoButton.children().length;

                var b_stateuid = '';
                var b_statetype = '';

                // no json
                var b_jsonnode = b_demoButton.children()[b_count_of - 1];
                var b_jsonStr = b_jsonnode.value;
                var b_data = eval('(' + b_jsonStr + ')');
                // no json

                b_stateuid = b_data.stateuid;
                b_statetype = b_data.statetype;

                //如果按钮
                if (b_stateuid === parentid && Number(b_statetype) === state && b_demoButton.children('div').length > 1) {
                    var divBtnIcon0 = b_demoButton.children().eq(0);
                    var divBtnIcon1 = b_demoButton.children().eq(1);

                    divBtnIcon0.css("display", "none");
                    divBtnIcon1.css("display", "inline");
                }
            });
        }

        function addCloseImgListener(demoSlide) {
            var startEvent, endEvent;
            if (is_mobile()) {
                startEvent = "touchstart";
                endEvent = "touchend";
            } else {
                startEvent = "pointerdown";
                endEvent = "pointerup";
            }

            var lenDemoSlide = demoSlide.children('div').length;
            for (var i = 0; i < lenDemoSlide; i++) {
                var slideItem = demoSlide.children('div').eq(i);
                slideItem.unbind();
                slideItem.on(startEvent, function(event) {
                    //当弹出内容是非全屏动画时,调用event.preventDefault会导致不能翻页,例:生物进化第3页
                    //当弹出内容是全屏图片时,点击右上角需阻止翻页,例:全球攻略第27页,10课热情服务第9页
                    var animationObject = slideItem.find("div[title='Animation']");
                    var formObject = slideItem.find("div[title='uiTextBox']") || slideItem.find("div[title='radioItem']") || slideItem.find("div[title='checkItem']") || slideItem.find("div[title='uiDropDownListBox']");
                    if (animationObject.length === 0 && formObject.length === 0)
                        event.preventDefault();
                    event.stopPropagation();

                    return false;
                });
                //点击关闭
                var lenSlideChildren = slideItem.children().length;
                var closeImg = slideItem.children().eq(lenSlideChildren - 1);
                closeImg.unbind();
                closeImg.on(startEvent, function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
                closeImg.on(endEvent, function(event) {
                    event.preventDefault();
                    closeIMGButton(event);
                    event.stopPropagation();
                });
            }
        }

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

        return new Button(id, option);
    });

})();