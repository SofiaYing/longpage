(function(window, undefined) {
    window.sizeAdjustor = new SizeAdjustor();
    window.isPageLoad = window.isLoadingbarOver = false;
    window.onload = function() {
        window.isPageLoad = true;
    }
    var isLongPage = window.sizeAdjustor.jsonData.adjustType === "longPageAdjust";

    var finalH = window.sizeAdjustor.finalSize.height;
    var finalW = window.sizeAdjustor.finalSize.width;
    var jsonstr = document.getElementById("json").value;
    var jsondata = eval('(' + jsonstr + ')');
    if (jsondata.loadingbar) {
        var barFgColor = jsondata.loadingbar.barfgcolor;
        var barBgColor = jsondata.loadingbar.barbgcolor;
        var fgPic = jsondata.loadingbar.fgpic;
        var bgPic = jsondata.loadingbar.bgpic;
        var bgColor = jsondata.loadingbar.bgcolor;
        var loadPic = jsondata.loadingbar.loadpic || '';
        var direction = jsondata.loadingbar.direction || '';
    }
    var loadingBox = document.getElementById("loadingBox");

    var clientH = document.documentElement.clientHeight;
    var clientW = document.documentElement.clientWidth;

    if (!is_mobile()) {
        if (!(!isLongPage && clientW < finalW)) {
            clientW = finalW;
        }
    }

    if (!isLongPage) {
        $(loadingBox).css({
            'display': 'flex',
            'justify-content': 'center',
            'height': finalH + 'px',
            'width': finalW + 'px',
            'margin': '0 auto',
            'align-items': 'center',
        })
        loadingBox.style.marginTop = clientH / 2 - finalH / 2 + "px";
        clientW = finalW;
        clientH = finalH;
    } else {
        $(loadingBox).css({
            'display': 'flex',
            'justify-content': 'center',
            'height': clientH + 'px',
            'width': clientW + 'px',
            'margin': '0 auto',
            'align-items': 'center',
        })
    }

    //要操作的进度条
    var loadingBarBox = document.getElementById("loadingBarBox");
    var loadingBar = document.getElementById("loadingBar");
    var logo = document.getElementById("logo");

    var outerWidth = parseInt($(loadingBarBox).css('width')); //default进度条宽度
    var imgW = 0.4 * clientW; //pie/imgbar加载图片宽度
    var imgH; //imgbar加载图片高度
    var canvas; //pie/imgbar加载
    var newImg; //pie/imgbar加载
    var rotateTimer; //rotate 匀速无限旋转
    var rotateDeg = 0; //rotate 旋转角度
    var marginBottom = parseInt($(loadingBarBox).css('height')) / 2 + 20;

    var process = typePrcess(jsondata.loadingbar.bartype);

    //jsondata.type default:进度条 ring:环形 pie：饼形 bar:条状 rotate:旋转
    if (jsondata.loadingbar) {

        //设置背景图/颜色
        loadingBox.style.background = jsondata.loadingbar.bgtype === "color" ? bgColor : "url(" + bgPic + ") no-repeat"; //背景图
        loadingBox.style.backgroundSize = "100% 100%";

        switch (jsondata.loadingbar.bartype) {
            case 'ring':
                if (fgPic !== "") {
                    $('#logo').attr('xlink:href', fgPic); //前景图

                    var w = toPoint($('svg').attr('width')) * clientW; //svg宽度

                    var r = toPoint($(loadingBar).attr('r')) * w;
                    var c = Math.PI * (r * 2); //周长

                    marginBottom = clientH / 4 + 20;
                    $('svg').css({
                        'height': w,
                        'width': w,
                        'margin-bottom': marginBottom + 'px',
                    })

                    $(loadingBarBox).css({ //环形进度条背景色
                        'stroke': barBgColor || '#222222',
                        'stroke-width': '7px',
                    });
                    $(loadingBar).css({ //环形进度条
                        'stroke': barFgColor || '#f76317',
                        'stroke-width': '8px',
                        'stroke-dasharray': c,
                        'stroke-dashoffset': c,
                        'transform': 'rotate(-90deg)',
                        'transform-origin': 'center',
                    });

                    startLoading();
                }

                break;
            case 'imgbar':
                if (fgPic === "") {
                    if (loadPic) {
                        var img = new Image();
                        img.src = loadPic;

                        img.onload = function() {
                            imgH = (this.height / this.width) * imgW;

                            canvas = document.getElementById("canvasLoad");
                            canvas.setAttribute('height', imgH);
                            canvas.setAttribute('width', imgW);

                            drawCanvas(canvas, 'bar', loadPic, 0);

                            startLoading();
                        }
                    } else {
                        loadingBarBox.style.opacity = "0.0";
                    }
                } else {
                    $(loadingBarBox).css({
                        'display': 'none',
                        'background-image': 'url(' + fgPic + ')',
                        'background-size': '100% 100%',
                    })

                    var fgImg = new Image();
                    fgImg.src = fgPic;
                    fgImg.onload = function() {
                        if (loadPic) {
                            var img = new Image();
                            img.src = loadPic;

                            img.onload = function() {
                                imgH = (this.height / this.width) * imgW;

                                $(loadingBarBox).css({
                                    'width': parseInt(imgW),
                                    'height': parseInt(imgH),
                                    'display': 'block',
                                    // 'margin-bottom': marginBottom + 'px',
                                })

                                canvas = document.getElementById("canvasLoad");
                                canvas.setAttribute('height', imgH);
                                canvas.setAttribute('width', imgW);

                                drawCanvas(canvas, 'bar', loadPic, 0);

                                startLoading();
                            }
                        } else {
                            imgH = (this.height / this.width) * imgW;
                            $(loadingBarBox).css({
                                'width': parseInt(imgW),
                                'height': parseInt(imgH),
                                'display': 'block',
                                // 'margin-bottom': marginBottom + 'px',
                            })
                        }
                    }
                }
                break;
            case 'pie':
                if (fgPic === "") {
                    if (loadPic) {
                        var img = new Image();
                        img.src = loadPic;
                        img.onload = function() {
                            canvas = document.getElementById("canvasLoad");
                            canvas.setAttribute('height', parseInt(imgW) + 1 + 'px');
                            canvas.setAttribute('width', parseInt(imgW));

                            drawCanvas(canvas, 'pie', loadPic, 0);

                            startLoading();
                        }
                    } else {
                        loadingBarBox.style.opacity = "0.0";
                    }
                } else {
                    $(loadingBarBox).css({
                        'display': 'none',
                        'background-image': 'url(' + fgPic + ')',
                        'background-size': '100% 100%',
                    })

                    var fgImg = new Image();
                    fgImg.src = fgPic;
                    fgImg.onload = function() {

                        $(loadingBarBox).css({
                            'display': 'block',
                            'width': parseInt(imgW),
                            'height': parseInt(imgW),
                            'border-radius': '50%',
                            'margin-bottom': marginBottom + 'px',
                        })

                        if (loadPic) {
                            var img = new Image();
                            img.src = loadPic;
                            img.onload = function() {
                                canvas = document.getElementById("canvasLoad");
                                canvas.setAttribute('height', parseInt(loadingBarBox.style.height) + 1 + 'px');
                                canvas.setAttribute('width', loadingBarBox.style.width);

                                drawCanvas(canvas, 'pie', loadPic, 0);

                                startLoading();
                            }
                        }
                    }
                }
                break;
            case 'rotate':
                if (fgPic === "") {
                    logo.style.opacity = "0.0";
                } else {
                    logo.src = fgPic;
                    $(loadingBox).css({ 'align-items': 'center' });
                }

                startLoading();
                break;
            default:
                if (fgPic === "") {
                    logo.style.opacity = "0.0";
                } else {
                    logo.src = fgPic;
                }

                marginBottom = clientH / 4 + 20;

                $(loadingBox).css({ 'flex-direction': 'column', 'justify-content': 'flex-end' });
                $(loadingBar).css({ 'background': barFgColor });
                $(loadingBarBox).css({
                    'background': barBgColor,
                    'margin-bottom': clientH / 2 - 5 + 'px',
                    'margin-top': '20px',
                });

                startLoading();
        }
    }

    //根据加载选项确定渲染函数
    function typePrcess(type) {
        switch (type) {
            case 'ring':
                var w = toPoint($('svg').attr('width')) * clientW; //svg宽度
                var r = toPoint($(loadingBar).attr('r')) * w;
                var c = Math.PI * (2 * r);

                return function(percent) {
                    var p = c * (100 - percent) / 100;
                    $(loadingBar).css({ 'stroke-dashoffset': p });
                }
            case 'rotate': //clockwise/anticlockwise

                if (direction && direction === 'anticlockwise') {
                    rotateTimer = setInterval(function() {
                        if (window.isLoadingbarOver) {
                            clearInterval(rotateTimer);
                            return;
                        }
                        rotateDeg--;
                        $(logo).css({ "transform": "rotate(" + rotateDeg + "deg)" });
                    }, 8);
                } else {
                    rotateTimer = setInterval(function() {
                        if (window.isLoadingbarOver) {
                            clearInterval(rotateTimer);
                            return;
                        }
                        rotateDeg++;
                        $(logo).css({ "transform": "rotate(" + rotateDeg + "deg)" });
                    }, 8);

                }
                return function() {};

            case 'imgbar': //leftToRight/bottomToTop
                return function(percent) {
                    drawCanvas(canvas, 'bar', fgPic, percent);
                }
            case 'pie': //clockwise/anticlockwise
                return function(percent) {
                    drawCanvas(canvas, 'pie', fgPic, percent);
                }
            default:
                return function(percent) {
                    loadingBar.style.width = (outerWidth * percent / 100) + "px";
                }
        }
    }

    //进度条效果
    var firstTimer, slowerTimer, slowestTimer, finalTimer, percent = 0;

    function startLoading() {
        firstTimer = setInterval(function() {
            process(percent);
            if (window.isPageLoad) {
                clearInterval(firstTimer);
                goStraightToEnd();
                return;
            }
            percent++;
            if (percent === 50) {
                clearInterval(firstTimer);
                slowerTimer = setInterval(function() {
                    process(percent);
                    percent++;
                    if (window.isPageLoad) {
                        clearInterval(slowerTimer);
                        goStraightToEnd();
                        return;
                    }
                    if (percent === 80) {
                        clearInterval(slowerTimer);
                        slowestTimer = setInterval(function() {
                            process(percent);
                            percent++;
                            if (window.isPageLoad) {
                                clearInterval(slowestTimer);
                                goStraightToEnd();
                                return;
                            }

                            if (percent === 95) {
                                clearInterval(slowestTimer);
                                finalTimer = setInterval(function() {
                                    if (window.isPageLoad) {
                                        clearInterval(finalTimer);
                                        goStraightToEnd();
                                        return;
                                    }
                                }, 20);
                            }
                        }, 240);
                    }
                }, 160);
            }
        }, 80);
    }

    function goStraightToEnd() {
        var endTimer = setInterval(function() {
            process(percent);
            if (percent === 100) {
                clearInterval(endTimer);
                window.isLoadingbarOver = true;
                window.onloadOver();
                document.getElementById("loadingBox").style.display = "none";
                console.log("加载完成，进度条结束");
            }
            percent++;
        }, 5);
    }

    function toPoint(percent) {
        var str = percent.replace("%", "");
        str = str / 100;
        return str;
    }

    function drawCanvas(canvas, type, src, percent) {
        canvas.width = imgW;

        var context = canvas.getContext("2d");

        if (!newImg) {
            newImg = new Image(); //使用Image()构造函数创建图像对象
            newImg.src = src;

            newImg.onload = function() {
                if (type === 'pie') {
                    //设置一个圆形的裁剪区域
                    clipPie(context, percent);
                } else if (type === 'bar') {
                    clipBar(context, percent)
                }
            }
        } else {
            if (type === 'pie') {
                //设置一个圆形的裁剪区域
                clipPie(context, percent);
            } else if (type === 'bar') {
                clipBar(context, percent)
            }
        }
    }

    function clipPie(context, percent) {
        var startPoint = -Math.PI * 2 * 0.25
        var r = imgW * 0.5;

        context.beginPath();
        context.moveTo(r, r);

        if (direction && direction === 'anticlockwise') {
            percent = (-percent - 25) / 100;

            context.arc(r, r, r, startPoint, Math.PI * 2 * percent, true);
        } else {
            if (percent <= 25) {
                percent = (percent - 25) / 100;
            } else {
                percent = (percent - 25) / 75;
            }

            context.arc(r, r, r, startPoint, Math.PI * 2 * percent, false);
        }

        context.clip();
        //从左上角开始绘制图像
        context.drawImage(newImg, 0, 0, imgW, imgW);
    }

    function clipBar(context, percent) {
        context.beginPath();
        context.moveTo(r, r);

        if (direction && direction === 'bottomToTop') {
            context.rect(0, imgH, imgW, -imgH * (percent / 100));
        } else {
            context.rect(0, 0, imgW * (percent / 100), imgH);
        }

        context.clip();
        //从左上角开始绘制图像
        context.drawImage(newImg, 0, 0, imgW, imgH);
    }
})(this);