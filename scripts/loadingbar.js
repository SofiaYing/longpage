(function(window, undefined) {
    window.sizeAdjustor = new SizeAdjustor();
    window.isPageLoad = window.isLoadingbarOver = false;
    window.onload = function() {
        window.isPageLoad = true;
    }

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
        var loadPic = jsondata.loadingbar.loadpic;
        var direction = jsondata.loadingbar.direction || '';
    }
    var loadingBox = document.getElementById("loadingBox");

    var clientH = document.documentElement.clientHeight;
    var clientW = document.documentElement.clientWidth;

    $(loadingBox).css({
        'display': 'flex',
        'justify-content': 'center',
        'height': clientH + 'px',
        'width': clientW + 'px',
    })

    // if (jsondata.adjustType !== "longPageAdjust") {
    //     loadingBox.style.width = finalW + "px";
    //     loadingBox.style.height = finalH + "px";
    //     loadingBox.style.display = "block";
    //     loadingBox.style.top = clientH / 2 - finalH / 2 + "px";
    //     loadingBox.style.left = clientW / 2 - finalW / 2 + "px";
    // } else {
    //     $(loadingBox).css({
    //         'display':'block',
    //         'height': clientH + 'px',
    //         'width': clientW + 'px',  
    //     })
    // }

    //要操作的进度条
    var loadingBarBox = document.getElementById("loadingBarBox");
    var loadingBar = document.getElementById("loadingBar");
    var logo = document.getElementById("logo");

    var outerWidth = finalW / 2; //记录原先的宽度
    var imgW = 0.4 * clientW; //pie/imgbar加载图片宽度
    var imgH; //imgbar加载图片高度
    var canvas; //pie/imgbar加载
    var newImg; //pie/imgbar加载

    //获取图片原始尺寸
    var imgReady = (function() {  
        var list = [],
            intervalId = null,
               // 用来执行队列
              tick = function() {    
                var i = 0;    
                for (; i < list.length; i++) {      
                    list[i].end ? list.splice(i--, 1) : list[i]();    
                };    
                !list.length && stop();  
            },
               // 停止所有定时器队列
              stop = function() {    
                clearInterval(intervalId);    
                intervalId = null;  
            };  
        return function(url, ready, load, error) {    
            var onready, width, height, newWidth, newHeight,     img = new Image();    
            img.src = url;    
            if (img.complete) {      
                ready.call(img);      
                load && load.call(img);      
                return;    
            };    
            width = img.width;    
            height = img.height;     
            img.onerror = function() {      
                error && error.call(img);      
                onready.end = true;      
                img = img.onload = img.onerror = null;    
            };      
            onready = function() {      
                newWidth = img.width;      
                newHeight = img.height;      
                if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {          
                    ready.call(img);        
                    onready.end = true;      
                };    
            };    
            onready();    
            img.onload = function() {  
                !onready.end && onready();      
                load && load.call(img);            
                img = img.onload = img.onerror = null;    
            };       
            if (!onready.end) {      
                list.push(onready);   
                if (intervalId === null) intervalId = setInterval(tick, 40);    
            };  
        };
    })();

    //jsondata.type default:进度条 ring:环形 pie：饼形 bar:条状 rotate:旋转
    if (jsondata.loadingbar) {

        switch (jsondata.loadingbar.bartype) {
            case 'ring':
                if (fgPic !== "") {
                    $('#logo').attr('xlink:href', fgPic); //前景图

                    var w = toPoint($('svg').attr('width')) * clientW; //svg宽度
                    var r = toPoint($(loadingBar).attr('r')) * w;
                    var c = Math.PI * (r * 2); //周长

                    $('svg').css({ 'height': w });

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

                    if (parseInt(loadingBox.style.width) > 980) {
                        $(loadingBox).css({ 'align-items': 'center' });
                        $('.logo_fx_white').css({ 'position': 'static' });
                    }
                }

                break;
            case 'imgbar':
                if (fgPic === "") {
                    loadingBarBox.style.opacity = "0.0";
                } else {
                    if (loadPic) {
                        loadingBarBox.style.backgroundImage = 'url(' + loadPic + ')';
                        $(loadingBarBox).css({
                            'background-image': 'url(' + loadPic + ')',
                            'background-size': '100% 100%',
                        })
                    }
                    var src = fgPic;
                    imgReady(src, function() {
                        imgH = (this.height / this.width) * imgW;

                        $(loadingBarBox).css({
                            'width': parseInt(imgW),
                            'height': parseInt(imgH),
                        })

                        canvas = document.getElementById("canvasImgbar");
                        canvas.setAttribute('height', imgH);
                        canvas.setAttribute('width', imgW);

                        drawCanvas(canvas, 'bar', fgPic, 0);
                    })

                    if (parseInt(loadingBox.style.width) > 980) {
                        $(loadingBox).css({ 'align-items': 'center' });
                    } else {
                        $(loadingBarBox).addClass('logo_fx_white');
                    }
                }

                break;
            case 'pie':
                if (fgPic === "") {
                    loadingBarBox.style.opacity = "0.0";
                } else {
                    $(loadingBarBox).css({
                        'width': parseInt(imgW),
                        'height': parseInt(imgW) - 1,
                        'border-radius': '50%',
                    })
                    if (loadPic) {
                        loadingBarBox.style.backgroundImage = 'url(' + loadPic + ')';
                        $(loadingBarBox).css({
                            'background-image': 'url(' + loadPic + ')',
                            'background-size': '100% 100%',
                        })
                    }

                    canvas = document.getElementById("canvasPie");
                    canvas.style.marginTop = '-1px';
                    canvas.setAttribute('height', loadingBarBox.style.height);
                    canvas.setAttribute('width', loadingBarBox.style.width);

                    drawCanvas(canvas, 'pie', fgPic, 0);
                }

                if (parseInt(loadingBox.style.width) > 980) {
                    $(loadingBox).css({ 'align-items': 'center' });
                } else {
                    $(loadingBarBox).addClass('logo_fx_white');
                }

                break;
            case 'rotate':
                if (fgPic === "") {
                    logo.style.opacity = "0.0";
                } else {
                    logo.src = fgPic;

                    $(loadingBox).css({ 'align-items': 'center' });
                }

                break;
            default:
                if (fgPic === "") logo.style.opacity = "0.0";
                else logo.src = fgPic;

                if (parseInt(loadingBox.style.width) > 980) {
                    logo.style.width = clientH * 0.3 + 'px';
                }

                loadingBar.style.background = barFgColor;
                loadingBarBox.style.background = barBgColor;
        }

        //设置背景图/颜色
        loadingBox.style.background = jsondata.loadingbar.bgtype === "color" ? bgColor : "url(" + bgPic + ") no-repeat"; //背景图
        loadingBox.style.backgroundSize = "100% 100%";
    }

    //根据加载选项确定渲染函数
    function typePrcess(type) {
        switch (type) {
            case 'ring':
                var r = toPoint($(loadingBar).attr('r')) * $('svg').width();
                var c = Math.PI * (2 * r);

                return function(percent) {
                    var p = c * (100 - percent) / 100;
                    $(loadingBar).css({ 'stroke-dashoffset': p });
                }
            case 'rotate': //clockwise/anticlockwise
                if (direction && direction === 'clockwise') {
                    return function(percent) {
                        var d = 360 * (percent / 100) + 'deg';
                        $(logo).css({ "transform": "rotate(" + d + ")" });
                    }
                } else {
                    return function(percent) {
                        var d = -360 * (percent / 100) + 'deg';
                        $(logo).css({ "transform": "rotate(" + d + ")" });
                    }
                }
            case 'imgbar': //fromleft/frombottom
                return function(percent) {
                    drawCanvas(canvas, 'bar', fgPic, percent);
                }
            case 'pie':
                return function(percent) {
                    drawCanvas(canvas, 'pie', fgPic, percent);
                }
            default:
                return function(percent) {
                    loadingBar.style.width = (outerWidth * percent / 100) + "px";
                }
        }
    }
    var process = typePrcess(jsondata.loadingbar.bartype);

    startLoading();

    //进度条效果
    var firstTimer, slowerTimer, slowestTimer, finalTimer, percent = 0;

    function startLoading() {
        firstTimer = setInterval(function() {
            process(percent)
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
                // document.getElementById("loadingBox").style.display = "none";
                clearInterval(endTimer);
                window.isLoadingbarOver = true;
                // window.onloadOver();
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

        if (percent <= 25) {
            percent = (percent - 25) / 100;
        } else {
            percent = (percent - 25) / 75;
        }

        context.beginPath();
        context.moveTo(r, r);

        context.arc(r, r, r, startPoint, Math.PI * 2 * percent, false);

        context.clip();
        //从左上角开始绘制图像
        context.drawImage(newImg, 0, 0, imgW, imgW);
    }

    function clipBar(context, percent) {
        context.beginPath();
        context.moveTo(r, r);

        if (direction && direction === 'frombottom') {
            context.rect(0, imgH, imgW, -imgH * (percent / 100));
        } else {
            context.rect(0, 0, imgW * (percent / 100), imgH);
        }

        context.clip();
        //从左上角开始绘制图像
        context.drawImage(newImg, 0, 0, imgW, imgH);
    }
})(this);