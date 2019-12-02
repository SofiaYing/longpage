(function() {
    var isLongPage = window.sizeAdjustor.jsonData.adjustType === "longPageAdjust";
    // 对象
    var ImagePan = function(id, option) {
        this.el = document.getElementById(id);
        this.option = this.getOption();
        this.init(id, option);
    };

    //组件初始化
    ImagePan.prototype.init = function(id, option) {
        console.info("init:", id);
        console.info("option:", option);
        var self = this;
        //防止动画里的pointer-events:none属性影响到这里，使得不能接受鼠标事件
        self.el.style.pointerEvents = "auto";
        //imapgePan目前丢失类名，没有设置css样式，没有宽高及position属性，需要及时添加
        var computedStyle = getComputedStyle(self.el);
        var height = computedStyle.height;
        var width = computedStyle.width;
        self.el.style.height = height === "0px" ? "100%" : height;
        self.el.style.width = width === "0px" ? "100%" : width;
        self.el.style.position = "absolute";

        if (self.el.title === "imagePan") imagePan($(self.el), self.option.gestureZoom, self.option.showScrollBar);
        else if (self.el.title === "imagePanShot") imagePanShot($(self.el), self.option.gestureZoom, self.option.showScrollBar);

        if (this.option.showScrollBar) {
            var VscrollNode = document.createElement("div");
            self.el.append(VscrollNode);
            VscrollNode.style = "width: 8.5px; position: absolute; left: 98%; top: 6.8px; z-index: 1;background-color:transparent;overflow:auto;border-radius:10px;display: inline; height: 50%;";

            var HscrollNode = document.createElement("div");
            self.el.append(HscrollNode);
            HscrollNode.style = "width:50%; position: absolute; left: 2%; top: 97%; z-index: 1;background-color:transparent;overflow:auto;border-radius:10px;display: inline; height: 8.5px;";

        }


    };

    //重置数据
    ImagePan.prototype.reset = function(option) {
        console.info("reset", option);
        var self = this;
        if (self.el.title === "imagePanShot") {
            var imgContainer = self.option.imgContainer;
            $(imgContainer).animate({
                width: self.option.finalWidth + "px",
                height: self.option.finalHeight + "px",
                top: self.option.yoffset + "px",
                left: self.option.xoffset + "px"
            }, self.option.speed, 'linear');
        } else if (self.el.title === "imagePan") {
            var imgNode = self.option.imgNode;
            var h = self.option.originHeight;

            function resetImage1() {
                imgNode.style.top = 0 + "px";
            }

            function resetImage2() {
                imgNode.style.top = h + "px";
            }

            function scrollImage() {
                if (self.option.isLoop) {
                    $(imgNode).animate({ top: "-" + h + "px" }, self.option.speed / 2, 'linear', resetImage2);
                    setTimeout(function() {
                        $(imgNode).animate({ top: "-" + h + "px" }, self.option.speed, 'linear', resetImage2);
                    }, self.option.speed / 2)

                    self.timer = setInterval(function() {
                        $(imgNode).animate({ top: "-" + h + "px" }, self.option.speed, 'linear', resetImage2);
                    }, self.option.speed);
                } else $(imgNode).animate({ top: "-" + h + "px" }, self.option.speed, 'linear', resetImage1);
            }
            if (self.option.autoScroll) scrollImage();
        }
    };

    //数据重置
    ImagePan.prototype.destroy = function() {
        console.info("destroy");
        var self = this;
        if (self.el.title === "imagePanShot") {
            var imgContainer = self.option.imgContainer;
            $(imgContainer).stop(true, false);
            imgContainer.style.cssText += ";width:" + self.option.originWidth + "px; height:" + self.option.originHeight +
                "px; left:" + self.option.imgOffsetLeft + "px; top:" + self.option.imgOffsetTop + "px;";
        } else if (self.el.title === "imagePan") {
            var imgNode = self.option.imgNode;
            if (self.timer !== void 0) {
                clearInterval(self.timer);
            }
            $(imgNode).stop(true, false);
            imgNode.style.cssText += ";width:" + self.option.originWidth + "px; height:" + self.option.originHeight +
                "px; left:" + self.option.imgOffsetLeft + "px; top:" + self.option.imgOffsetTop + "px;";
        }
    };

    ImagePan.prototype.getOption = function() {
        var self = this;
        if (self.el.title === "imagePanShot") {
            var arr = new Array();
            var imgContainer = self.el.firstElementChild;
            var temp = imgContainer;
            for (var i = 0; i <= 4; i++) {
                temp = temp.nextElementSibling;
                arr.push(temp);
            }
            return {
                imgContainer: imgContainer,
                originWidth: parseInt(imgContainer.style.width),
                originHeight: parseInt(imgContainer.style.height),
                imgOffsetLeft: parseInt(imgContainer.style.left),
                imgOffsetTop: parseInt(imgContainer.style.top),
                finalWidth: arr[0].value,
                finalHeight: arr[1].value,
                yoffset: arr[2].value,
                xoffset: arr[3].value,
                speed: (function() {
                    if (arr[4].value === "veryFast") return 1000;
                    if (arr[4].value === "fast") return 1500;
                    if (arr[4].value === "medium") return 2500;
                    if (arr[4].value === "slow") return 3500;
                    if (arr[4].value === "verySlow") return 4500;
                })(),
                gestureZoom: self.el.querySelector("input[name=gestureZoom]").value === "true",
                showScrollBar: self.el.querySelector("input[name=showScrollBar]").value === "true"
            }
        } else if (self.el.title === "imagePan") {
            var children = self.el.children;
            return {
                imgNode: children[0],
                originWidth: parseInt(children[0].style.width),
                originHeight: parseInt(children[0].style.height),
                imgOffsetLeft: parseInt(children[0].style.left),
                imgOffsetTop: parseInt(children[0].style.top),
                autoScroll: (function() {
                    var t = self.el.querySelector("input[name=autoscroll]");
                    return t.value === "true";
                })(),
                isLoop: (function() {
                    var t = self.el.querySelector("input[name=loop]");
                    return t.value === "true";
                })(),
                speed: (function() {
                    var t = self.el.querySelector("input[name=speed]");
                    if (t.value === "fast") return 2000;
                    if (t.value === "medium") return 3000;
                    if (t.value === "slow") return 4000;
                })(),
                gestureZoom: self.el.querySelector("input[name=gestureZoom]").value === "true",
                showScrollBar: self.el.querySelector("input[name=showScrollBar]").value === "true"
            }
        }
    }

    FX.plugins["imagePan"] = function(id, option) {
        return new ImagePan(id, option);
    };


    function imagePan(el, gestureZoom, showScrollBar) {
        function EmptyCallback() {
            return;
        }
        var demo = el;
        var demo1 = demo.children().eq(0);
        var demoX = demo.children()[0];
        var loop = demo.children()[1];
        var speed = demo.children()[2];
        var autoscroll = demo.children()[3];
        var divLeft = demo.children().eq(4);
        var divRight = demo.children().eq(5);

        var demoWidth = demo.width();
        if (demoWidth < document.body.clientWidth) {
            divRight.css("display", "none");
            divLeft.css("display", "none");
        }
        var h = demo1.height();
        var deviceH = $(window).height();
        if (h < deviceH / 2) {
            divRight.hide();
        }
        addTapListener(demo1, demo, gestureZoom, showScrollBar, EmptyCallback);
    }

    function imagePanShot(el, gestureZoom, showScrollBar) {
        function EmptyCallback() {
            return;
        }
        var demoT = el;
        var demo1 = el.children().eq(0);

        addTapListener(demo1, demoT, gestureZoom, showScrollBar, EmptyCallback);
    }

    function addTapListener(imgnode, divnode, gestureZoom, showScrollBar, callback) {
        var drag = false;

        var initImgW = imgnode.width();
        var initImgH = imgnode.height();
        var divW = divnode.width();
        var divH = divnode.height();
        var page_X;
        var page_Y;
        var startDistance;
		var middleX;
		var middleY;

        var imgOldLeft = imgnode[0].offsetLeft;
        var imgOldTop = imgnode[0].offsetTop;
        var scaleX = window.sizeAdjustor.scaleX;
        var scaleY = window.sizeAdjustor.scaleY;

        var nodelen;

        if (!is_mobile()) {
            imgnode.on('pointerdown', function(e) {
                e.preventDefault();
                panStart(e.pageX, e.pageY);
                return false;
            });

            imgnode.on('pointerup', function(e) {
                e.preventDefault();
                panEnd();
            });

            imgnode.on('pointermove', function(e) {
                e.preventDefault();
                panMove(e.pageX, e.pageY);
            });
            $(document).on('pointerup', function(e) {
                drag = false;
                callback();
            });
        } else {
            var distanceRatio = 1;
            var imgWHRatio = initImgW / initImgH;
            $(document).on('touchend', function(e) {
                drag = false;
                callback();
            });

            imgnode.on('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var touches = e.originalEvent.touches;
                page_X = e.originalEvent.targetTouches[0].pageX;
                page_Y = e.originalEvent.targetTouches[0].pageY;
                imgOldLeft = imgnode[0].offsetLeft;
                imgOldTop = imgnode[0].offsetTop;
                initImgW = imgnode[0].offsetWidth;
                initImgH = imgnode[0].offsetHeight;
                if (touches.length === 1) {
                    panStart(e.originalEvent.targetTouches[0].pageX, e.originalEvent.targetTouches[0].pageY);
                } else if (touches.length === 2 && gestureZoom) {
                    drag = true;
                    var touche1X = touches[0].pageX;
                    var touche1Y = touches[0].pageY;
                    var touche2X = touches[1].pageX;
                    var touche2Y = touches[1].pageY;
                    middleX = (touche1X + touche2X) / 2;
                    if(isLongPage){
                        var y1 = $('#longpage_container').scrollTop() + touches[0].pageY;
                        var y2 = $('#longpage_container').scrollTop() + touches[1].pageY;
                        middleY = (y1 + y2) / 2;
                    }else{
					    middleY = (touche1Y + touche2Y) / 2;
                    }				
                    startDistance = Math.sqrt(Math.pow((touche1X - touche2X), 2) + Math.pow((touche1Y - touche2Y), 2));
                    distanceRatio = imgnode.width() / startDistance;
                }
                return false;
            });

            imgnode.on('touchend', function(e) {
                e.preventDefault();
                panEnd();
                e.stopPropagation();
            });

            imgnode.on('touchmove', function(e) {
                e.preventDefault();
                e.stopPropagation();


                var touches = e.originalEvent.touches;
                var targetTouches = e.originalEvent.targetTouches;
                if (touches.length === 1) {
                    panMove(e.originalEvent.targetTouches[0].pageX, e.originalEvent.targetTouches[0].pageY);
                } else if (targetTouches.length === 2 && gestureZoom) {
                    var touche1X = touches[0].pageX;
                    var touche1Y = touches[0].pageY;

                    var touche2X = touches[1].pageX;
                    var touche2Y = touches[1].pageY;                                  

                    moveDistance = Math.sqrt(Math.pow((touche1X - touche2X), 2) + Math.pow((touche1Y - touche2Y), 2));
                    var ratio = moveDistance / startDistance - 1; 

                    translationX1 = parseInt($("."+imgnode.parent()[0].className).css("left"));
                    translationX2 = imgnode.parents(".divshow").children()[0].offsetLeft;
                    translationY1 = parseInt($("."+imgnode.parent()[0].className).css("top"));
                    translationY2 = imgnode.parents(".divshow").children()[0].offsetTop;         
            
					var offsetX = (middleX - window.sizeAdjustor.finalLeft) / window.sizeAdjustor.scaleX  - (imgOldLeft + translationX1 + translationX2);
                    var offsetY = (middleY - window.sizeAdjustor.finalTop) / window.sizeAdjustor.scaleY  - (imgOldTop + translationY1 + translationY2);               
                    
                    var newOffsetX = ratio * offsetX;
                    var newOffsetY = ratio * offsetY;

                    imgnode[0].style.left = (imgOldLeft - newOffsetX) + "px";
                    imgnode[0].style.top = (imgOldTop - newOffsetY) + "px";
                    imgnode[0].style.width = (initImgW * (1 + ratio)) + "px";
                    imgnode[0].style.height = (initImgH * (1 + ratio)) + "px";
                }

            });
        }


        function panStart(pageX, pageY) {
            $(this).stop();
            drag = true;
            pageX /= scaleX;
            pageY /= scaleY;
            page_X = pageX;
            page_Y = pageY;

            imgOldLeft = imgnode[0].offsetLeft;
            imgOldTop = imgnode[0].offsetTop;

            nodelen = divnode.children().length;
            if (showScrollBar) {
                divnode.children()[nodelen - 2].style.backgroundColor = '#D6D6D6';
                divnode.children()[nodelen - 1].style.backgroundColor = '#D6D6D6';
            }

        }

        function panEnd() {
            drag = false;

            if (showScrollBar) {
                divnode.children()[nodelen - 2].style.backgroundColor = 'transparent';
                divnode.children()[nodelen - 1].style.backgroundColor = 'transparent';
            }

            callback();
        }

        function panMove(pageX, pageY) {
            if (drag) {
                pageX /= scaleX;
                pageY /= scaleY;
                var spaceW = divnode.width();
                var spaceH = divnode.height();

                var currentPosX;
                var currentPosY;

                currentPosX = pageX;
                currentPosY = pageY;

                var IMGcurrentPosX = imgOldLeft + (currentPosX - page_X);
                var IMGcurrentPosY = imgOldTop + (currentPosY - page_Y);

                if (((spaceW - IMGcurrentPosX) < imgnode.width()) && (IMGcurrentPosX <= 0))
                    imgnode[0].style.left = IMGcurrentPosX + 'px';

                if (((spaceH - IMGcurrentPosY) < imgnode.height()) && (IMGcurrentPosY <= 0))
                    imgnode[0].style.top = IMGcurrentPosY + 'px';

                if (showScrollBar) {

                    divnode.children()[nodelen - 2].style.backgroundColor = '#D6D6D6';
                    divnode.children()[nodelen - 1].style.backgroundColor = '#D6D6D6';

                    var VscrollContent = divnode.children()[nodelen - 2];
                    var HscrollContent = divnode.children()[nodelen - 1];


                    VscrollContent.style.top = -IMGcurrentPosY + 'px';
                    HscrollContent.style.left = -IMGcurrentPosX + 'px';
                }

            }
        }
    }


})();