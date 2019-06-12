(function() {
    FX.plugins["imageDrag"] = (function(id, option) {
        // 对象
        var ImageDrag = function(id, option) {
            this.el = document.getElementById(id);
            this.option = this.getOption();
            this.init(id, option);
        };




        // 继承接口
        FX.utils.inherit(FXInterface, ImageDrag);

        //组件初始化
        ImageDrag.prototype.init = function(id, option) {
            var self = this;
            console.info("init:", id);
            console.info("option:", option);
            addDragTabListener($(self.el), self.option.draggable);

            //判断是否为长页面
            var isLongPage = window.sizeAdjustor.jsonData.adjustType === "longPageAdjust"
            if (isLongPage) {
                longpageOption = self.option

                observeImageDrag.observe($(self.el)[0])
            }
        };

        //重置数据
        ImageDrag.prototype.reset = function(option) {
            var self = this;
            console.info("reset", option);
        };

        //数据重置
        ImageDrag.prototype.destroy = function() {
            var self = this;
            self.el.style.cssText += "width:" + self.option.originWidth + "px; height:" + self.option.originHeight +
                "px;left:" + self.option.originLeft + "px; top:" + self.option.originTop + "px; transform:" + self.option.transformData;
            console.info("destroy");
        };

        ImageDrag.prototype.getOption = function() {
            var self = this;
            var jsonstr = self.el.querySelector("input[name=json]").value;
            self.jsondata = eval("(" + jsonstr + ")");
            return {
                transformData: (function() {
                    return window.getComputedStyle(self.el).getPropertyValue("transform");
                })(),
                draggable: (function() {
                    return self.jsondata.suppressDrag === "true";
                })(),
                originLeft: (function() {
                    return self.el.offsetLeft;
                })(),
                originTop: (function() {
                    return self.el.offsetTop;
                })(),
                originWidth: (function() {
                    return self.el.clientWidth;
                })(),
                originHeight: (function() {
                    return self.el.clientHeight;
                })(),
            };
        };


        return new ImageDrag(id, option);
    });
})();

var observeImageDrag = new IntersectionObserver((entries) => {
    entries.forEach((item, index) => {

        if (item.intersectionRatio > 0) {

        } else {

            item.target.style.cssText += "width:" + longpageOption.originWidth + "px; height:" + longpageOption.originHeight +
                "px;left:" + longpageOption.originLeft + "px; top:" + longpageOption.originTop + "px; transform:" + longpageOption.transformData;
        }
    })
});

function addDragTabListener(demo, draggable) {
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
    }

    if (!is_mobile()) {
        if (draggable === true) {
            // 单指移动
            demo.on('pointerdown', function(e) {
                e.preventDefault();
                dragStart(demo, e.originalEvent.touches, e.pageX, e.pageY);
                e.stopPropagation();
            });

            $(document).on('pointerup', function(e) {
                e.preventDefault();
                dragEnd();
            });

            $(document).on('pointermove', function(e) {
                e.preventDefault();
                dragMove(e.originalEvent.touches, e.pageX, e.pageY);
            });

            demo.on(outEvent, function(e) {
                e.preventDefault();
                drag = false;
            });
        }

        demo.on('mousewheel', function(e) {
            var parent = e.target.parentNode;

            //以鼠标为中心缩放，同时进行位置调整

            var offsetX = e.offsetX; //相对位置
            var offsetY = e.offsetY;

            oldLeft = parent.offsetLeft;
            oldTop = parent.offsetTop;

            var ratio = (e.originalEvent.wheelDelta) / 1200;
            var newOffsetX = ratio * offsetX;
            var newOffsetY = ratio * offsetY;

            parent.style.left = (oldLeft - newOffsetX) + "px";
            parent.style.top = (oldTop - newOffsetY) + "px";
            parent.style.width = (parent.clientWidth * (1 + ratio)) + "px";
            parent.style.height = (parent.clientHeight * (1 + ratio)) + "px";
        });
    } else {
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
    }

    function GetAngle(costransform, sintransform) {
        var _Angle = 0;
        var cosAngle = (Math.acos(costransform) / Math.PI) * 180;
        var sinAngle = (Math.acos(sintransform) / Math.PI) * 180;

        if (costransform > 0 && sintransform > 0) {
            _Angle = cosAngle;
        } else if (costransform < 0 && sintransform > 0) {
            _Angle = cosAngle;
        } else if (costransform < 0 && sintransform < 0) {
            _Angle = 360 - cosAngle;
        } else if (costransform > 0 && sintransform < 0) {
            _Angle = 360 - cosAngle;
        } else if (costransform === 1 && sintransform === 0) {
            _Angle = 0;
        } else if (costransform === 0 && sintransform === 1) {
            _Angle = 90;
        } else if (costransform === -1 && sintransform === 0) {
            _Angle = 180;
        } else if (costransform === 0 && sintransform === -1) {
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
        } else {
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

    function dragStart(demo, touches, pageX, pageY) {

        if (fingers === 1 || fingers >= 3 || touches === undefined) {
            drag = true;
            //重新计算坐标系统，因为屏幕自适应产生的缩放会使得元素实际像素与鼠标坐标系之间的映射改变
            page_X = pageX;
            page_Y = pageY;
            oldLeft = demo[0].offsetLeft;
            oldTop = demo[0].offsetTop;
        } else if (fingers === 2) {
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
        if ((fingers === 1 || fingers >= 3 || touches === undefined) && draggable === true) {
            if (drag) {
                var newOffsetX = (pageX - page_X) / window.sizeAdjustor.scaleX;
                var newOffsetY = (pageY - page_Y) / window.sizeAdjustor.scaleY;

                parent.style.left = (oldLeft + newOffsetX) + 'px';
                parent.style.top = (oldTop + newOffsetY) + 'px';
            }
        } else if (fingers === 2) {
            if (drag) {
                var touche1X = touches[0].pageX;
                var touche1Y = touches[0].pageY;

                var touche2X = touches[1].pageX;
                var touche2Y = touches[1].pageY;

                moveDistance = Math.sqrt(Math.pow((touche1X - touche2X), 2) + Math.pow((touche1Y - touche2Y), 2));
                var ratio = moveDistance / startDistance - 1;
                if (draggable === true) {
                    var offsetX = page_X / window.sizeAdjustor.scaleX - oldLeft;
                    var offsetY = page_Y / window.sizeAdjustor.scaleY - oldTop;

                    var newOffsetX = ratio * offsetX;
                    var newOffsetY = ratio * offsetY;

                    parent.style.left = (oldLeft - newOffsetX) + "px";
                    parent.style.top = (oldTop - newOffsetY) + "px";
                    parent.style.width = (initWidth * (1 + ratio)) + "px"
                    parent.style.height = (initHeight * (1 + ratio)) + "px";
                } else {
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