function addTapListener(imgnode, divnode, gestureZoom, callback)
{
    var drag = false;

    var initImgW = imgnode.width();
    var initImgH = imgnode.height();
    var divW = divnode.width();
    var divH = divnode.height();
    var page_X;
    var page_Y;
    var startDistance;

    var imgOldLeft = imgnode[0].offsetLeft;
    var imgOldTop = imgnode[0].offsetTop;
    var scale;
    var scaleY;
    var stopId = setInterval(function(){
        scale = getUserZoom();
    	if(scale > 0)
    	{
    		clearInterval(stopId);
    		scaleY = getUserZoomY();
    	}
    }, 500);
    
    if(!is_mobile())
    {
        imgnode.on('mousedown', function (e) {
            e.preventDefault();
            if(scaleY)
            {
            	panStart(e.pageX / scale, e.pageY / scaleY);
            }
            else if(scale)
            {
            	panStart(e.pageX / scale, e.pageY / scale);
            }
            return false;
        });

        imgnode.on('mouseup', function (e) {
            e.preventDefault();
            panEnd();
        });

        imgnode.on('mousemove', function (e) {
            e.preventDefault();
            if(scaleY)
            {
            	panMove(e.pageX / scale, e.pageY / scaleY);
            }
            else if(scale)
            {
            	panMove(e.pageX / scale, e.pageY / scale);
            }
            
        });
        $(document).on('mouseup', function (e) {
            drag = false;
            callback();
        });
    }
    else
    {
        var distanceRatio = 1;
        var imgWHRatio = initImgW / initImgH;
        $(document).on('touchend', function (e) {
            drag = false;
            callback();
        });

        imgnode.on('touchstart', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var touches = e.originalEvent.touches;
            page_X = e.originalEvent.targetTouches[0].pageX;
            page_Y = e.originalEvent.targetTouches[0].pageY;
            imgOldLeft = imgnode[0].offsetLeft;
            imgOldTop = imgnode[0].offsetTop;
            initImgW = imgnode[0].offsetWidth;
            initImgH = imgnode[0].offsetHeight;
            if(touches.length === 1)
            {
                if(scaleY)
                {
                    panStart(e.originalEvent.targetTouches[0].pageX / scale, e.originalEvent.targetTouches[0].pageY / scaleY);
                }
                else if(scale)
                {
                    panStart(e.originalEvent.targetTouches[0].pageX / scale, e.originalEvent.targetTouches[0].pageY / scale);
                }
            }
            else if (touches.length === 2 && gestureZoom) {
                drag = true;
                var touche1X = touches[0].pageX;
                var touche1Y = touches[0].pageY;
                var touche2X = touches[1].pageX;
                var touche2Y = touches[1].pageY;
                startDistance = Math.sqrt(Math.pow((touche1X - touche2X), 2) + Math.pow((touche1Y - touche2Y), 2));
                distanceRatio = imgnode.width() / startDistance;
            }
            
            return false;
        });

        imgnode.on('touchend', function (e) {
            e.preventDefault();
            panEnd();
            e.stopPropagation();
        });

        imgnode.on('touchmove', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var touches = e.originalEvent.touches;
            if(touches.length === 1)
            {
                if(scaleY)
                {
                    panMove(e.originalEvent.targetTouches[0].pageX / scale, e.originalEvent.targetTouches[0].pageY / scaleY);
                }
                else
                {
                    panMove(e.originalEvent.targetTouches[0].pageX / scale, e.originalEvent.targetTouches[0].pageY / scale);
                }
            }
            else if (touches.length === 2 && gestureZoom) {
                var touche1X = touches[0].pageX;
                var touche1Y = touches[0].pageY;

                var touche2X = touches[1].pageX;
                var touche2Y = touches[1].pageY;

                moveDistance = Math.sqrt(Math.pow((touche1X - touche2X), 2) + Math.pow((touche1Y - touche2Y), 2));
                var ratio = moveDistance / startDistance - 1;

                var offsetX = page_X / 1 - (imgOldLeft + imgnode.parent()[0].offsetLeft);
                var offsetY = page_Y / 1 - (imgOldTop + imgnode.parent()[0].offsetTop);
                var newOffsetX = ratio * offsetX;
                var newOffsetY = ratio * offsetY;

                imgnode[0].style.left = (imgOldLeft - newOffsetX) + "px";
                imgnode[0].style.top = (imgOldTop - newOffsetY) + "px";
                imgnode[0].style.width = (initImgW * (1 + ratio)) + "px"
                imgnode[0].style.height = (initImgH * (1 + ratio)) + "px";
            }
        });
    }
    


    function panStart(pageX, pageY) {
        $(this).stop();
        drag = true;

        page_X = pageX;
        page_Y = pageY;

        imgOldLeft = imgnode[0].offsetLeft;
        imgOldTop = imgnode[0].offsetTop;
    }

    function panEnd() {
        drag = false;
        callback();
    }

    function panMove(pageX, pageY) {
        if (drag) {
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
        }
    }
}

function ImageSpan()
{
    function EmptyCallback()
    {
        return;
    }

    $("div[title='imagePan']").each(function () {

        var demo = $(this);
        var demo1 = $(this).children().eq(0);
        var demoX = $(this).children()[0];
        var loop = $(this).children()[1];
        var speed = $(this).children()[2];
        var autoscroll = $(this).children()[3];
        var gestureZoom = $(this).children()[4].value === "true" ? true : false;
//        var divLeft = $(this).children().eq(5);
//        var divRight = $(this).children().eq(6);
        
//        var demoWidth = demo.width();
//        if(demoWidth < document.body.clientWidth)
//        {
//            divRight.css("display","none");
//            divLeft.css("display","none");
//        }
//        var h = demo1.height();
//        var deviceH = $(window).height();
//        if (h < deviceH / 2) {
//            divRight.hide();
//        }

        var speedstr = 3000;

        if (speed.value === "fast")
            speedstr = 2000;
        if (speed.value === "medium")
            speedstr = 3000;
        if (speed.value === "slow")
            speedstr = 4000;

        function ResetImage() {
            demoX.style.top = 0 + "px";
        }

        function RescrollImage() {
            demoX.style.top = h + "px";
            ScrollImage();
        }

        function ScrollImage() {
            if (loop.value === "true")
                demo1.animate({ top: "-" + h + "px" }, speedstr, 'linear', RescrollImage);
            else
                demo1.animate({ top: "-" + h + "px" }, speedstr, 'linear', ResetImage);
        }
        if (loop.value === "true")
            addTapListener(demo1, demo, gestureZoom, ScrollImage);
        else
            addTapListener(demo1, demo, gestureZoom, EmptyCallback);

        if (autoscroll.value === "true")
            ScrollImage();
    });
}

function Embiggen()
{
    function EmptyCallback()
    {
        return;
    }

    $("div[title='imagePanShot']").each(function () {
        var width = $(this).children()[1];
        var height = $(this).children()[2];
        var yoffset = $(this).children()[3];
        var xoffset = $(this).children()[4];
        var speed = $(this).children()[5];
        var gestureZoom = $(this).children()[4].value === "true" ? true : false;

        var demo = $(this).children()[0];  	//img

        var demoT = $(this);
        var demo1 = $(this).children().eq(0);

        var speedstr = 2500;
        if (speed.value === "veryFast")
            speedstr = 1000;
        if (speed.value === "fast")
            speedstr = 1500;
        if (speed.value === "medium")
            speedstr = 2500;
        if (speed.value === "slow")
            speedstr = 3500;
        if (speed.value === "verySlow")
            speedstr = 4500;

        demo1.animate({ width: width.value + "px", height: height.value + "px", top: yoffset.value + "px", left: xoffset.value + "px" }, speedstr, 'linear');

        addTapListener(demo1, demoT, gestureZoom, EmptyCallback);
    });
}