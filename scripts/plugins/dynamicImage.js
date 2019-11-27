(function() {
    FX.plugins["dynamicImage"] = (function(id, option) {

        var startEvent;
        var endEvent;
        var moveEvent;
        var outEvent = 'vmouseout';

        var demoDynamicImage;
        var lisnerID;

        var count_of;

        var driftParentNode;
        var driftFirstnode;
        var driftOriH;
        var driftOriW;

        var regionW;
        var regionH;

        var pointPosX;
        var pointPosY;

        var scatterIdx;
        /*
        --imageCount--                 //小图个数//
        （整形数字）           1~100
        --direction--			//方向//
        从上向下               topToBottom
        从下向上               bottomToTop
        从左向右               leftToRight
        从右向左               rightToLeft
        从中心向四周           centerToEdge
        从四周向中心           从四周到中间        //此种方向定义无。（XGC）
        --speed--			//速度//
        非常快                 veryFast
        快                     fast
        中                     medium
        慢                     slow
        非常慢                 verySlow
        --scaleEnable--		//小图大小变化范围//
        true
        false
        --minScale--			//下限//
        （整形数字）百分比%	10~100
        --maxScale--			//上限//
        （整形数字）百分比%	100~500
        swingEnable                    //小图摆动范围//
        true
        false
        --swingMinLimit--              //下限//
        （整形数字）度 -180~0
        --swingMaxLimit--              //上限//
        （整形数字）度 0~180
        --swingMode--			//小图摆动方式//
        循环                   1
        反复                   0
        （整形数字）0~1
        --path--                       //小图路径方式//
        直线                   line
        曲线                   curve
        --gesture--                    //手势交互参数//
        无                     none
        打散                   scatter
        聚拢                   gather  
        */
        var filedirection = '';

        var imageCount = '';
        var direction = '';
        var speed = '';
        var scaleEnable = '';
        var minScale = '';
        var maxScale = '';
        var swingEnable = '';
        var swingMinLimit = '';
        var swingMaxLimit = '';
        var swingMode = '';
        var path = '';
        var gesture = '';

        var speedstr;

        var atbd;
        var data;

        var driftScaleMaxH;
        var driftScaleMaxW;
        var driftScaleMinH;
        var driftScaleMinW;

        var swinInc;
        var minRot = 0;
        var maxRot = 360;
        var rot;
        var scaleInc;

        var drift_W;
        var drift_H;

        var isLongPage = window.sizeAdjustor.jsonData.adjustType === "longPageAdjust";
        // 对象
        var DynamicImage = function(id, option) {
            this.$target = $("#" + id).children().eq(0);
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, DynamicImage);

        //组件初始化
        DynamicImage.prototype.init = function(id, option) {

            if (is_mobile()) {
                startEvent = 'touchstart';
                endEvent = 'touchend';
                moveEvent = 'touchmove';
            } else {
                startEvent = 'pointerdown';
                endEvent = 'pointerup';
                moveEvent = 'pointermove';
            }

            demoDynamicImage = this.$target;
            lisnerID = 0;

            count_of = demoDynamicImage.children().length;

            driftParentNode = demoDynamicImage.children().eq(1);
            driftFirstnode = driftParentNode.children().eq(0);
            driftOriH = driftFirstnode.height();
            driftOriW = driftFirstnode.width();

            regionW = demoDynamicImage.width();
            regionH = demoDynamicImage.height();

            pointPosX = -1;
            pointPosY = -1;

            scatterIdx = -1;

            // no json
            var jsonnode = demoDynamicImage.children()[count_of - 1];
            var jsonStr = jsonnode.value;
            data = eval('(' + jsonStr + ')');
            // no json

            //json
            //$.getJSON('./scripts/' + demoSlide[0].id + '.json', function (data) {
            //$.ajax({type:"GET",url:'./scripts/' + demoSlide[0].id + '.json',dataType:"json",cache:false,success:function(data){
            //json

            imageCount = Number(data.imageCount);
            filedirection = data.direction;
            direction = filedirection;
            speed = data.speed;
            scaleEnable = data.scaleEnable;
            minScale = data.minScale;
            maxScale = data.maxScale;
            swingEnable = data.swingEnable;
            swingMinLimit = data.swingMinLimit;
            swingMaxLimit = data.swingMaxLimit;
            swingMode = data.swingMode;
            path = data.path;
            gesture = data.gesture;

            switch (speed) {
                case 'veryFast':
                    speedstr = 2000;
                    break;
                case 'fast':
                    speedstr = 4000;
                    break;
                case 'medium':
                    speedstr = 9000;
                    break;
                case 'slow':
                    speedstr = 12000;
                    break;
                case 'verySlow':
                    speedstr = 15000;
                    break;
                default:
                    break;
            }

            driftScaleMaxH = driftOriH * Number(maxScale) / 100;
            driftScaleMaxW = driftOriW * Number(maxScale) / 100;
            driftScaleMinH = driftOriH * Number(minScale) / 100;
            driftScaleMinW = driftOriW * Number(minScale) / 100;

            swinInc = new Array(imageCount);
            for (var i = 0; i < imageCount; i++) {
                swinInc[i] = 1;
            }

            if (swingEnable === "true") {
                minRot = Number(swingMinLimit);
                maxRot = Number(swingMaxLimit);
            }

            rot = new Array(imageCount);
            for (var i = 0; i < imageCount; i++) {
                rot[i] = Math.random() * maxRot;
            }

            scaleInc = new Array(imageCount);
            for (var i = 0; i < imageCount; i++) {
                scaleInc[i] = 1;
            }

            drift_W = new Array(imageCount);
            drift_H = new Array(imageCount);
            for (var i = 0; i < imageCount; i++) {
                var ra_dom = Math.random();
                drift_W[i] = driftScaleMinW + (ra_dom * (driftScaleMaxW - driftScaleMinW));
                drift_H[i] = driftScaleMinH + (ra_dom * (driftScaleMaxH - driftScaleMinH));
            }

            atbd = new Array(imageCount);
            for (var i = 0; i < imageCount; i++) {
                atbd[i] = "false";
            }

            addDynamicImageListener();
        };

        //重置数据
        DynamicImage.prototype.reset = function(option) {
            $(demoDynamicImage).on(startEvent, function(e) {
                e.preventDefault();
            })
            $(demoDynamicImage).on('pointerup', function(e) {
                e.preventDefault();
            })
            $(demoDynamicImage).on(endEvent, function(e) {
                e.preventDefault();
            })

            rotatescaleImage();
            initImage();
            driftImage();
        };

        //数据重置
        DynamicImage.prototype.destroy = function() {
            var driftParentnode = demoDynamicImage.children().eq(1);
            for (var i = 0; i < imageCount; i++) {
                driftParentnode.children().eq(i).stop();
            }
        };

        function rotatescale() {
            var driftParentnode = demoDynamicImage.children().eq(1);
            for (var i = 0; i < imageCount; i++) {
                atboundary(driftParentnode.children().eq(i), i);
                if (atbd[i] === "true") {
                    initdrift(driftParentnode.children().eq(i));
                    drift(driftParentnode.children().eq(i), i);
                    if (i === scatterIdx)
                        scatterIdx = -1;
                }
                if (i === scatterIdx)
                    continue;

                driftParentnode.children().eq(i).css({ "transform": "rotate(" + rot[i] + "deg)" });
                rot[i] += swinInc[i];
                if (swingMode === "1") // 循环　
                {
                    if (rot[i] > maxRot)
                        rot[i] = minRot;
                } else // 往复
                {
                    if (rot[i] > maxRot || rot[i] < minRot)
                        swinInc[i] *= -1;
                }

                if (scaleEnable === "true") {
                    driftParentnode.children()[i].style.width = Math.floor(drift_W[i]) + 'px';
                    driftParentnode.children()[i].style.height = Math.floor(drift_H[i]) + 'px';

                    if (drift_W[i] > driftScaleMaxW || drift_W[i] < driftScaleMinW)
                        scaleInc[i] *= -1;
                }
            }
        }

        function rotatescaleImage() {
            lisnerID = setInterval(rotatescale, 10);
        }

        function atboundary(demo, idx) {
            switch (direction) {
                case 'pointGather':
                    if (pointPosX !== -1 && pointPosY !== -1) {
                        if ((demo[0].style.left === pointPosX + 'px') || (demo[0].style.top === pointPosY + 'px'))
                            atbd[idx] = "true";
                        else
                            atbd[idx] = "false";
                    }
                    break;
                case 'topToBottom':
                    if (parseInt(demo[0].style.top) === regionH)
                        atbd[idx] = "true";
                    else
                        atbd[idx] = "false";
                    break;
                case 'bottomToTop':
                    if (demo[0].style.top === '0px')
                        atbd[idx] = "true";
                    else
                        atbd[idx] = "false";
                    break;
                case 'leftToRight':
                    if (demo[0].style.left === regionW + 'px')
                        atbd[idx] = "true";
                    else
                        atbd[idx] = "false";
                    break;
                case 'rightToLeft':
                    if (parseInt(demo[0].style.left) <= -50)
                        atbd[idx] = "true";
                    else
                        atbd[idx] = "false";
                    break;
                case 'centerToEdge':
                    if ((demo[0].style.left === "0px") || (demo[0].style.left === String(regionW + 'px')) || (demo[0].style.top === "0px") || (demo[0].style.top === String(regionH + 'px')))
                        atbd[idx] = "true";
                    else
                        atbd[idx] = "false";
                    break;
                case '从四周到中间':
                    if ((demo[0].style.left === Math.floor(regionW / 2) + 'px') || (demo[0].style.top === Math.floor(regionH / 2) + 'px'))
                        atbd[idx] = "true";
                    else
                        atbd[idx] = "false";
                    break;
                default:
                    break;
            }
        }

        function initdrift(demo) {
            var randomValueH = Math.floor(Math.random() * regionH) * 2;
            var randomValueW = Math.floor(Math.random() * regionW) * 2;
            switch (direction) {
                case 'pointGather':
                    var leftRandom = Math.random();
                    var topRandom = Math.random();
                    var topPosition = Math.floor(Math.random() * regionH);
                    var leftPosition = Math.floor(Math.random() * regionW);

                    if (leftRandom > 0.5 && topRandom > 0.5) // 上
                    {
                        demo[0].style.top = '-' + randomValueH + 'px';
                        demo[0].style.left = leftPosition + 'px';
                    } else if (leftRandom > 0.5 && topRandom <= 0.5) //下
                    {
                        demo[0].style.top = String(Number(regionH) + randomValueH) + 'px';
                        demo[0].style.left = leftPosition + 'px';
                    } else if (leftRandom <= 0.5 && topRandom > 0.5) //左
                    {
                        demo[0].style.top = topPosition + 'px';
                        demo[0].style.left = '-' + randomValueW + 'px';
                    } else if (leftRandom <= 0.5 && topRandom <= 0.5) //右
                    {
                        demo[0].style.top = topPosition + 'px';
                        demo[0].style.left = String(Number(regionW) + randomValueW) + 'px';
                    }
                    break;
                case 'topToBottom':
                    var leftPosition = Math.floor(Math.random() * regionW);
                    demo[0].style.top = '-' + randomValueH + 'px';
                    demo[0].style.left = leftPosition + 'px';
                    break;
                case 'bottomToTop':
                    var leftPosition = Math.floor(Math.random() * regionW);
                    demo[0].style.top = String(Number(regionH) + randomValueH) + 'px';
                    demo[0].style.left = leftPosition + 'px';
                    break;
                case 'leftToRight':
                    var topPosition = Math.floor(Math.random() * regionH);
                    demo[0].style.top = topPosition + 'px';
                    demo[0].style.left = '-' + randomValueW + 'px';
                    break;
                case 'rightToLeft':
                    var topPosition = Math.floor(Math.random() * regionH);
                    demo[0].style.top = topPosition + 'px';
                    demo[0].style.left = String(Number(regionW) + randomValueW) + 'px';
                    break;
                case 'centerToEdge':
                    demo[0].style.top = Math.floor(regionH / 2) + 'px';
                    demo[0].style.left = Math.floor(regionW / 2) + 'px';
                    break;
                case '从四周到中间':
                    var leftRandom = Math.random();
                    var topRandom = Math.random();
                    var topPosition = Math.floor(Math.random() * regionH);
                    var leftPosition = Math.floor(Math.random() * regionW);

                    if (leftRandom > 0.5 && topRandom > 0.5) // 上
                    {
                        demo[0].style.top = '-' + randomValueH + 'px';
                        demo[0].style.left = leftPosition + 'px';
                    } else if (leftRandom > 0.5 && topRandom <= 0.5) //下
                    {
                        demo[0].style.top = String(Number(regionH) + randomValueH) + 'px';
                        demo[0].style.left = leftPosition + 'px';
                    } else if (leftRandom <= 0.5 && topRandom > 0.5) //左
                    {
                        demo[0].style.top = topPosition + 'px';
                        demo[0].style.left = '-' + randomValueW + 'px';
                    } else if (leftRandom <= 0.5 && topRandom <= 0.5) //右
                    {
                        demo[0].style.top = topPosition + 'px';
                        demo[0].style.left = String(Number(regionW) + randomValueW) + 'px';
                    }
                    break;
                default:
                    break;
            }
        }

        function initImage() {
            var driftParentnode = demoDynamicImage.children().eq(1);
            for (var i = 0; i < imageCount; i++) {
                initdrift(driftParentnode.children().eq(i));
            }
        }

        function drift(demo, idx) {
            atbd[idx] = "false";
            demo.stop();
            var jdx = Math.floor(Math.random() * idx);
            var randomAdd = jdx * (speedstr / 10);
            var randomSpeed = speedstr + randomAdd;
            switch (direction) {
                case 'pointGather':
                    if (pointPosX !== -1 && pointPosY !== -1)
                        demo.animate({ top: pointPosY + "px", left: pointPosX + "px" }, speedstr / 2, 'linear');
                    break;
                case 'topToBottom':
                    var ranLeft = parseInt(demo[0].style.left);
                    if (data.path === "curve") {
                        ranLeft += Math.floor(Math.random() * regionW) - regionW * 0.5;
                    };
                    //demo.delay(jdx * (speedstr / 10)).animate({
                    //stop无法取消delay，点击聚拢或者打散会出现延迟效果
                    demo.animate({
                        left: [ranLeft, 'swing'],
                        top: [regionH, 'linear']
                    }, randomSpeed);
                    break;
                case 'bottomToTop':
                    var ranLeft = parseInt(demo[0].style.left);
                    if (data.path === "curve") {
                        ranLeft += Math.floor(Math.random() * regionW) - regionW * 0.5;
                    };
                    //demo.delay(jdx * (speedstr / 10)).animate({
                    demo.animate({
                        left: [ranLeft, 'swing'],
                        top: [0, 'linear']
                    }, randomSpeed);
                    break;
                case 'leftToRight':
                    var ranTop = parseInt(demo[0].style.top);
                    if (data.path === "curve") {
                        ranTop += Math.floor(Math.random() * regionH) - regionH * 0.5;
                    };
                    //demo.delay(jdx * (speedstr / 10)).animate({
                    demo.animate({
                        left: [regionW, 'linear'],
                        top: [ranTop, 'swing']
                    }, randomSpeed);
                    break;
                case 'rightToLeft':
                    var ranTop = parseInt(demo[0].style.top);
                    if (data.path === "curve") {
                        ranTop += Math.floor(Math.random() * regionH) - regionH * 0.5;
                    };
                    //demo.delay(jdx * (speedstr / 10)).animate({
                    //去delay是为了防止延迟期间按下,造成demo.stop()无效,进而聚拢期间执行下方动画，造成不可期随机效果
                    demo.animate({
                        left: ['-50px', 'linear'],
                        top: [ranTop, 'swing']
                    }, randomSpeed);
                    break;
                case 'centerToEdge':
                    var leftRandom = Math.random();
                    var topRandom = Math.random();
                    var topPosition = Math.floor(Math.random() * regionH);
                    var leftPosition = Math.floor(Math.random() * regionW);
                    if (leftRandom > 0.5 && topRandom > 0.5) // 上
                    // demo.delay(jdx * (speedstr / 10)).animate({ top: "0px", left: leftPosition + "px" }, speedstr, 'linear');
                        demo.animate({ top: "0px", left: leftPosition + "px" }, randomSpeed, 'linear');
                    else if (leftRandom > 0.5 && topRandom <= 0.5) //下
                    // demo.delay(jdx * (speedstr / 10)).animate({ top: regionH + "px", left: leftPosition + "px" }, speedstr, 'linear');
                        demo.animate({ top: regionH + "px", left: leftPosition + "px" }, randomSpeed, 'linear');
                    else if (leftRandom <= 0.5 && topRandom > 0.5) //左
                    // demo.delay(jdx * (speedstr / 10)).animate({ top: topPosition + "px", left: "0px" }, speedstr, 'linear');
                        demo.animate({ top: topPosition + "px", left: "0px" }, randomSpeed, 'linear');
                    else if (leftRandom <= 0.5 && topRandom <= 0.5) //右
                    // demo.delay(jdx * (speedstr / 10)).animate({ top: topPosition + "px", left: regionW + "px" }, speedstr, 'linear');
                        demo.animate({ top: topPosition + "px", left: regionW + "px" }, randomSpeed, 'linear');
                    break;
                case '从四周到中间':
                    // demo.delay(jdx * (speedstr / 10)).animate({ top: Math.floor(regionH / 2) + "px", left: Math.floor(regionW / 2) + "px" }, speedstr, 'linear');
                    demo.delay(jdx * (speedstr / 10)).animate({ top: Math.floor(regionH / 2) + "px", left: Math.floor(regionW / 2) + "px" }, randomSpeed, 'linear');
                    break;
                default:
                    break;
            }
        }

        function driftImage() {
            var driftParentnode = demoDynamicImage.children().eq(1);
            for (var i = 0; i < imageCount; i++) {
                drift(driftParentnode.children().eq(i), i);
            }
        }

        function scatterdrift(demo, idx) {

            var drifttop = Math.floor(Number(demo[0].style.top.substring(0, demo[0].style.top.length - 2)));
            var driftleft = Math.floor(Number(demo[0].style.left.substring(0, demo[0].style.left.length - 2)));
            var driftwidth = Math.floor(Number(demo[0].style.width.substring(0, demo[0].style.width.length - 2)));
            var driftheight = Math.floor(Number(demo[0].style.height.substring(0, demo[0].style.height.length - 2)));
            var driftright = driftleft + driftwidth;
            var driftbottom = drifttop + driftheight;
            if (pointPosX > driftleft && pointPosX < driftright && pointPosY > drifttop && pointPosY > driftbottom) {
                demo.stop();
                scatterIdx = idx;

                var leftRandom = Math.random();
                var topRandom = Math.random();
                var topPosition = Math.floor(Math.random() * regionH);
                var leftPosition = Math.floor(Math.random() * regionW);
                var offsetRegion = regionH > regionW ? 2 * regionH : 2 * regionW;
                if (leftRandom > 0.5 && topRandom > 0.5) { // 上
                    demo.animate({ top: -offsetRegion + "px", left: leftPosition + "px" }, 500, 'linear');
                } else if (leftRandom > 0.5 && topRandom <= 0.5) //下
                    demo.animate({ top: offsetRegion + "px", left: leftPosition + "px" }, 500, 'linear');
                else if (leftRandom <= 0.5 && topRandom > 0.5) //左
                    demo.animate({ top: topPosition + "px", left: -offsetRegion + "px" }, 500, 'linear');
                else if (leftRandom <= 0.5 && topRandom <= 0.5) //右
                    demo.animate({ top: topPosition + "px", left: offsetRegion + "px" }, 500, 'linear');
            }
        }

        function scatterImage() {
            var driftParentnode = demoDynamicImage.children().eq(1);
            for (var i = 0; i < imageCount; i++) {
                scatterdrift(driftParentnode.children().eq(i), i);
            }
        }

        function addDynamicImageListener() {
            if (gesture === "gather" || gesture === "scatter") {
                driftParentNode.on(startEvent, function(e) {
                    e.preventDefault();
                    var point = e.originalEvent.touches ? e.originalEvent.touches[0] : e;

                    var longpagePageY = $('#longpage_container').scrollTop() + point.pageY;

                    var scaledPos = FX.utils.getScaledPos(demoDynamicImage[0], point.pageX, point.pageY);
                    if (!isLongPage) {
                        var scaledPos = FX.utils.getScaledPos(demoDynamicImage[0], point.pageX, point.pageY);
                    } else {
                        var scaledPos = FX.utils.getScaledPos(demoDynamicImage[0], point.pageX, longpagePageY);
                    }
                    pointPosX = scaledPos.x;
                    pointPosY = scaledPos.y;

                    if (gesture === "gather") {
                        direction = 'pointGather';
                        driftImage();
                    } else if (gesture === "scatter")
                        scatterImage();

                    return false
                });

                driftParentNode.on('pointerup', function(e) {
                    e.preventDefault();
                    pointPosX = -1;
                    pointPosY = -1;
                    if (gesture === "gather") {
                        direction = filedirection;
                        driftImage();
                    }

                    return false
                });

                driftParentNode.on(endEvent, function(e) {
                    e.preventDefault();
                    pointPosX = -1;
                    pointPosY = -1;
                    if (gesture === "gather") {
                        direction = filedirection;
                        driftImage();
                    }

                    return false
                });
            }
        }
        return new DynamicImage(id, option);
    });
})();