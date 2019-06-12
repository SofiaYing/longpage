function addDragTabListener(demo) {
    var drag = false;

    var outEvent = 'vmouseout';

    var oldLeft;
    var oldTop;
    var startDistance;

    var fingers = 0;

    var startAngle = 0;

    var distance = 0;
    var angle = 0;

    var touch1X = 0;
    var touch1Y = 0;
    var touch2X = 0;
    var touch2Y = 0;
    var page_X;
    var page_Y;

    var touchcX = 0;
    var touchcY = 0;

    var touche1X = 0;
    var touche1Y = 0;
    var touche2X = 0;
    var touche2Y = 0;

    var touchecX = 0;
    var touchecY = 0;

    var distanceC = 0;
    var angleC = 0;

    var initWidth = 0;
    var initHeight = 0;

    var jsonStr = demo.children('input').eq(0)[0].value;
    var dataObj = eval('(' + jsonStr + ')');
    var suppressDrag = dataObj.suppressDrag;
    var draggable = (suppressDrag === "true");

    function transformImg() {
        //变换中心点
        var xpos = touchcX - demo[0].offsetLeft;
        var ypos = touchcY - demo[0].offsetTop;
        //demo.eq(0).css({"transform-origin": xpos + "px " + ypos + "px"});
        //平移
        var incX = touchecX - touchcX;
        var incY = touchecY - touchcY;

        demo.eq(0).css({ "transform": "translate(" + incX + "," + incY + ")" });

        //旋转
        var rotate = startAngle + (angleC - angle);
        demo.eq(0).css({ "transform": "rotate(" + rotate + "deg)" });
        //var MathSinDeg = Math.sin(rotate);
        //var MathCosDeg = Math.cos(rotate);
        //demo.eq(0).css({"transform": "matrix("+MathCosDeg+","+MathSinDeg+",-"+MathSinDeg+","+MathCosDeg+",0,0)"});   

        //缩放
        var scale = distanceC / distance;
        var scaleX = scale;
        var scaleY = scale; 

        demo[0].style.width = initWidth * scaleX + 'px';
        demo[0].style.height = initHeight * scaleY + 'px';
    }

    if (!is_mobile()) {
        // 单指移动
        demo.on('mousedown', function(e) {
            e.preventDefault();
            dragStart(demo, e.originalEvent.touches, e.pageX, e.pageY);
            e.stopPropagation();
        });

        demo.on('mouseup', function(e) {
            e.preventDefault();
            dragEnd();
        });

        demo.on('mousemove', function(e) {
            e.preventDefault();
            dragMove(e.originalEvent.touches, e.pageX, e.pageY);
        });

        demo.on(outEvent, function(e) {
            e.preventDefault();
            drag = false;
        });
    }
    else {
        //touchStart 记录的是最后一根手指落下时的状态
        demo.on('touchstart', function(e) {
            e.preventDefault();

            getStartTouches(e.originalEvent.touches);

            dragStart(demo, e.originalEvent.touches, e.originalEvent.targetTouches[0].pageX, e.originalEvent.targetTouches[0].pageY);

            e.stopPropagation();
        });

        //双指动作抬起则会触发两次touchend事件 
        demo.on('touchend', function(e) {
            e.preventDefault();

            getStartTouches(e.originalEvent.touches);

            if (fingers === 1 || fingers >= 3) {
                drag = true;

                var xpos = demo[0].offsetLeft;
                var ypos = demo[0].offsetTop;

                oldLeft = e.originalEvent.targetTouches[0].pageX - xpos;
                oldTop = e.originalEvent.targetTouches[0].pageY - ypos;
            }

            dragEnd();
            e.stopPropagation();
        });

        //滑动过程中 任何时候的触摸状态curentTouch与初始状态进行比较 
        demo.on('touchmove', function(e) {
            e.preventDefault();
            var touches = e.originalEvent.touches;
            if (touches.length === fingers) {
                if (fingers === 2) {
                    getCurrentTouches(touches);
                    if (draggable === true) {
                        transformImg();
                    }
                }
            }
            dragMove(e.originalEvent.touches, e.originalEvent.targetTouches[0].pageX, e.originalEvent.targetTouches[0].pageY);
            e.stopPropagation();
        });
    }



    function GetAngle(costransform, sintransform) {
        var _Angle = 0;
        var cosAngle = (Math.acos(costransform) / Math.PI) * 180;
        var sinAngle = (Math.acos(sintransform) / Math.PI) * 180;

        if (costransform > 0 && sintransform > 0) {
            _Angle = cosAngle;
        }
        else if (costransform < 0 && sintransform > 0) {
            _Angle = cosAngle;
        }
        else if (costransform < 0 && sintransform < 0) {
            _Angle = 360 - cosAngle;
        }
        else if (costransform > 0 && sintransform < 0) {
            _Angle = 360 - cosAngle;
        }
        else if (costransform === 1 && sintransform === 0) {
            _Angle = 0;
        }
        else if (costransform === 0 && sintransform === 1) {
            _Angle = 90;
        }
        else if (costransform === -1 && sintransform === 0) {
            _Angle = 180;
        }
        else if (costransform === 0 && sintransform === -1) {
            _Angle = 270;
        }

        return _Angle;
    }

    // 双指缩放、移动、旋转
    function getStartTouches(touches) {
        fingers = touches.length
        touche1X = 0;
        touche1Y = 0;
        touche2X = 0;
        touche2Y = 0;

        touchecX = 0;
        touchecY = 0;

        distanceC = 0;
        angleC = 0;

        // 当前初始旋转角度
        var transformStr = demo.eq(0).css("transform");
        if (transformStr !== "none") {
            var idx = transformStr.search(",");
            var costransformStr = transformStr.substring(7, idx);
            transformStr = transformStr.substring(idx + 1);
            idx = transformStr.search(",");
            var sintransformStr = transformStr.substring(1, idx);

            var costransform = Number(costransformStr);
            var sintransform = Number(sintransformStr);

            startAngle = GetAngle(costransform, sintransform);
        }

        if (touches.length === 2) {
            touch1X = touches[0].pageX;
            touch1Y = touches[0].pageY;

            touch2X = touches[1].pageX;
            touch2Y = touches[1].pageY;

            var distanceX = Math.abs(touch1X - touch2X);
            var distanceY = Math.abs(touch1Y - touch2Y);
            distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            var cosNum = (touch2X - touch1X) / distance;
            var sinNum = (touch2Y - touch1Y) / distance;
            angle = GetAngle(cosNum, sinNum);

            if (touch1X < touch2X)
                touchcX = touch1X + distanceX / 2;
            else
                touchcX = touch2X + distanceX / 2;

            if (touch1Y < touch2Y)
                touchcY = touch1Y + distanceY / 2;
            else
                touchcY = touch2Y + distanceY / 2;

            initWidth = demo[0].offsetWidth;
            initHeight = demo[0].offsetHeight;
        }
        else {
            touch1X = 0;
            touch1Y = 0;
            touch2X = 0;
            touch2Y = 0;

            touchcX = 0;
            touchcY = 0;

            distance = 0;
            angle = 0;

            initWidth = 0;
            initHeight = 0;
        }
    }

    function getCurrentTouches(touches) {
        touche1X = touches[0].pageX;
        touche1Y = touches[0].pageY;

        touche2X = touches[1].pageX;
        touche2Y = touches[1].pageY;

        var distanceX = Math.abs(touche1X - touche2X);
        var distanceY = Math.abs(touche1Y - touche2Y);
        distanceC = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        var cosNum = (touche2X - touche1X) / distanceC;
        var sinNum = (touche2Y - touche1Y) / distanceC;
        angleC = GetAngle(cosNum, sinNum);

        if (touche1X < touche2X)
            touchecX = touche1X + distanceX / 2;
        else
            touchecX = touche2X + distanceX / 2;

        if (touche1Y < touche2Y)
            touchecY = touche1Y + distanceY / 2;
        else
            touchecY = touche2Y + distanceY / 2;
    }

    function updateStartTouches() {
        distance = distanceC;
        angle = angleC;

        touch1X = touche1X;
        touch1Y = touche1Y;
        touch2X = touche2X;
        touch2Y = touche2Y;

        touchcX = touchecX;
        touchcY = touchecY;
    }

    demo.on('touchcancel', function(e) {
        e.preventDefault();
        var ori = e.originalEvent;
        getStartTouches(touches);

        if (fingers === 1 || fingers >= 3) {
            drag = true;

            oldLeft = e.pageX - demo[0].offsetLeft;
            oldTop = e.pageY - demo[0].offsetTop;
        }
    });

    demo.on('mousewheel', function(e) {
        var parent = e.target.parentNode;

        //以鼠标为中心缩放，同时进行位置调整

        var offsetX = e.offsetX; //相对位置
        var offsetY = e.offsetY;

        var oldLeft = parent.offsetLeft;
        var oldTop = parent.offsetTop;

        var ratio = (e.originalEvent.wheelDelta) / 1200;
        var ratioX = ratio * offsetX;
        var ratioY = ratio * offsetY;

        parent.style.left = (oldLeft - ratioX) + "px";
        parent.style.top = (oldTop - ratioY) + "px";
        parent.style.width = (parent.clientWidth * (1 + ratio)) + "px";
        parent.style.height = (parent.clientHeight * (1 + ratio)) + "px";
    });

    function dragStart(demo, touches, pageX, pageY) {

        if (fingers === 1 || fingers >= 3|| touches === undefined) {
            drag = true;
            //重新计算坐标系统，因为屏幕自适应产生的缩放会使得元素实际像素与鼠标坐标系之间的映射改变
            page_X = pageX;
            page_Y = pageY;
            oldLeft = demo[0].offsetLeft;
            oldTop = demo[0].offsetTop;
        }
        else if (fingers === 2) {
            drag = true;
            var touche1X = touches[0].pageX;
            var touche1Y = touches[0].pageY;
            var touche2X = touches[1].pageX;
            var touche2Y = touches[1].pageY;

            startDistance = Math.sqrt(Math.pow((touche1X - touche2X), 2) + Math.pow((touche1Y - touche2Y), 2));

            page_X = pageX;
            page_Y = pageY;
            oldLeft = demo[0].offsetLeft;
            oldTop = demo[0].offsetTop;
        }
    }

    function dragEnd() {
        drag = false;
    }

    function dragMove(touches, pageX, pageY) {
        var parent = demo[0];
        var jsonStr = demo.children('input').eq(0)[0].value;
        var dataObj = eval('(' + jsonStr + ')');
        if ((fingers === 1 || fingers >= 3|| touches === undefined) && draggable === true) {
            if (drag) {
                var newOffsetX = (pageX - page_X) / 1;
                var newOffsetY = (pageY - page_Y) / 1;

                parent.style.left = (oldLeft + newOffsetX) + 'px';
                parent.style.top = (oldTop + newOffsetY) + 'px';
            }
        }
        else if (fingers === 2) {
            if (drag) {
                var touche1X = touches[0].pageX;
                var touche1Y = touches[0].pageY;

                var touche2X = touches[1].pageX;
                var touche2Y = touches[1].pageY;

                moveDistance = Math.sqrt(Math.pow((touche1X - touche2X), 2) + Math.pow((touche1Y - touche2Y), 2));
                var ratio = moveDistance / startDistance - 1;
                if (draggable === true) {
                    var offsetX = page_X / 1 - oldLeft;
                    var offsetY = page_Y / 1 - oldTop;

                    var newOffsetX = ratio * offsetX;
                    var newOffsetY = ratio * offsetY;

                    parent.style.left = (oldLeft - newOffsetX) + "px";
                    parent.style.top = (oldTop - newOffsetY) + "px";
                    parent.style.width = (initWidth * (1 + ratio)) + "px"
                    parent.style.height = (initHeight * (1 + ratio)) + "px";
                }
                else {
                    // 如果不允许拖拽，以图片中心点放大
                    var offsetX = initWidth / 2;
                    var offsetY = initHeight / 2;

                    var newOffsetX = ratio * offsetX;
                    var newOffsetY = ratio * offsetY;

                    parent.style.left = (oldLeft - newOffsetX) + "px";
                    parent.style.top = (oldTop - newOffsetY) + "px";
                    parent.style.width = (initWidth * (1 + ratio)) + "px"
                    parent.style.height = (initHeight * (1 + ratio)) + "px";
                }
            }
        }
    }
}

function ImageDrag() {
    $("div[title='imageDrag']").each(function() {

        var demo = $(this);
        addDragTabListener(demo);
    });
}