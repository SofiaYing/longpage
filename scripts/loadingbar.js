(function(window, undefined) {
    window.sizeAdjustor = new SizeAdjustor();
    window.loadingResize = function() {
        if (!isFirstLoad) {
            isFirstLoad = false
            setTimeout(function() {
                loading();
            }, 0)
        }
    }
    window.isPageLoad = false;
    window.onload = function() {
        window.isPageLoad = true;
    }

    var isLongPage = window.sizeAdjustor.jsonData.adjustType === "longPageAdjust";
    //进度条效果
    var percent = 0;
    var marginBottom = 0;
    var newImg, imgW, imgH;
    var rotateTimer; //rotate 匀速无限旋转
    var rotateDeg = 0; //rotate 旋转角度
    var loadingAdd = 0.3;

    var process;
    var canvas; //pie/imgbar加载

    var clientH = document.documentElement.clientHeight;
    var clientW = document.documentElement.clientWidth;

    //加载页整体适配相关参数
    var isFirstLoad = true;
    var screenState = 'portrait';
    var longpageBgPic;
    var longpageBgPicScale;

    if (isFirstLoad) {
        loading();
    }

    function loading() {
        clientH = document.documentElement.clientHeight;
        clientW = document.documentElement.clientWidth;
        window.sizeAdjustor.update();
        var originSize = window.sizeAdjustor.originSize;
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

        if (!is_mobile()) {
            if (!(!isLongPage && clientW < finalW)) {
                clientW = finalW;
            }
        }

        if (originSize.width > originSize.height && jsondata.adjustType === 'heightAdjust') {
            finalW = clientW;
        }

        if (!isLongPage) {
            loadingBox.style.height = finalH + "px";
            loadingBox.style.width = finalW + "px";
            loadingBox.style.marginTop = clientH / 2 - finalH / 2 + "px";
            if (is_mobile()) {
                loadingBox.style.marginLeft = clientW / 2 - finalW / 2 + "px";
            }
            clientW = finalW;
            clientH = finalH;
            loadingBox.style.display = 'flex';

            initStyle();
        } else {
            if (bgPic) {
                longpageBgPic = new Image();
                longpageBgPic.src = bgPic;

                if (isFirstLoad) {
                    longpageBgPic.onload = function() {
                        var scale = this.width / this.height;
                        longpageBgPicScale = scale;
                        setLongpageStyle(longpageBgPicScale);
                    }
                } else {
                    setLongpageStyle(longpageBgPicScale)
                }
            } else {
                loadingBox.style.height = clientH + "px";
                loadingBox.style.width = clientW + "px";
                loadingBox.style.display = 'flex';

                initStyle();
            }
        }

        function setLongpageStyle(scale) {

            if (screenState === 'portrait' || !is_mobile()) {
                var actualH = clientW / scale;
                var top = (clientH - actualH) / 2;
                loadingBox.style.width = clientW + "px";
                loadingBox.style.height = actualH + "px";
                loadingBox.style.marginTop = top + 'px';
                loadingBox.style.marginLeft = 'auto';
            } else {
                var actualW = clientH * scale;
                var left = (clientW - actualW) / 2;
                loadingBox.style.width = actualW + "px";
                loadingBox.style.height = clientH + "px";
                loadingBox.style.marginLeft = left + 'px';
                loadingBox.style.marginTop = 0 + 'px';
            }
            loadingBox.style.display = 'flex';

            initStyle();
        }


        function initStyle() {
            var loadingBarBox = document.getElementById("loadingBarBox");
            var loadingBar = document.getElementById("loadingBar");
            var logo = document.getElementById("logo");
            var loadingProgress = document.getElementById("loadingProgress");


            var progressUpdate;

            if (clientW < clientH) {
                marginBottom = clientH / 4 + 20;
                imgW = 0.4 * clientW; //pie/imgbar加载图片宽度
            } else {
                imgW = 0.4 * clientH;
            }

            if (loadingProgress) {
                var textSpan = loadingProgress.querySelectorAll('span')[0];
                if (!textSpan.innerHTML) {
                    textSpan.style.marginRight = 0;
                }
                var loadingProgressSpan = loadingProgress.querySelectorAll('span')[1];
                progressUpdate = function(percent) {
                    loadingProgressSpan.innerHTML = percent.toFixed(2);
                }
            }

            //jsondata.type default:进度条 ring:环形 pie：饼形 bar:条状 rotate:旋转 percent:百分比
            if (jsondata.loadingbar) {

                var opacity = barFgColor.substring(5, barFgColor.length - 1).split(',')[3];
                if (loadingProgress) { loadingProgress.style.opacity = opacity }
                if (loadingBarBox) { loadingBarBox.style.opacity = opacity }
                if (logo) { logo.style.opacity = opacity }

                switch (jsondata.loadingbar.bartype) {
                    case 'ring':
                        var ringSvg = document.querySelector('svg');
                        if (fgPic !== "") {
                            document.querySelector('#logo').setAttribute('xlink:href', fgPic)
                        }

                        var w = toPoint(ringSvg.getAttribute('width')) * clientW; //svg宽度
                        var r = toPoint(loadingBar.getAttribute('r')) * w;
                        var c = Math.PI * (r * 2); //周长

                        ringSvg.style.height = w;
                        ringSvg.style.width = w;

                        setMarginBottom(loadingProgress, ringSvg, marginBottom);

                        loadingBarBox.style.visibility = 'visible';

                        loadingBarBox.style.stroke = barBgColor || '#222';
                        loadingBarBox.style.strokeWidth = '7px';
                        barFgColor ? barFgColor = barFgColor : barFgColor = '#f76317';
                        loadingBar.style.cssText += 'stroke:' + barFgColor + ';stroke-width:8px;stroke-dasharray:' + c +
                            ';stroke-dashoffset:' + c + ';transform:rotate(-90deg);transform-origin:center';

                        if (loadingProgress) { loadingProgress.style.visibility = 'visible'; }

                        if (isFirstLoad) { loadImg() };

                        break;
                    case 'imgbar':
                        setMarginBottom(loadingProgress, loadingBarBox, 0);

                        if (loadPic) {
                            var img = new Image();
                            img.src = loadPic;

                            img.onload = function() {
                                imgH = (this.height / this.width) * imgW

                                loadingBarBox.style.cssText += "visibility:visible;width:" +
                                    parseInt(imgW) + "px;height: " + parseInt(imgH) + 'px';

                                canvas = document.getElementById("canvasLoad");
                                canvas.setAttribute('height', imgH);
                                canvas.setAttribute('width', imgW);

                                if (isFirstLoad) {
                                    drawCanvas(canvas, 'bar', loadPic, 0);
                                    loadImg()
                                };
                            }
                        } else if (fgPic) {
                            var fgImg = new Image();
                            fgImg.src = fgPic;
                            fgImg.onload = function() {
                                imgH = (this.height / this.width) * imgW;
                                loadingBarBox.style.cssText += "visibility:visible;width:" +
                                    parseInt(imgW) + "px;height: " + parseInt(imgH) + 'px';

                                if (isFirstLoad) {
                                    loadImg()
                                };
                            }
                        } else if (loadingProgress) {
                            if (isFirstLoad) {
                                loadImg()
                            };
                        }

                        break;
                    case 'pie':
                        if (loadingProgress) {
                            setMarginBottom(loadingProgress, loadingBarBox, 0)
                        } else {
                            setMarginBottom(loadingProgress, loadingBarBox, marginBottom)
                        }

                        //修改后border-radius可去掉
                        loadingBarBox.style.cssText += "visibility:visible;width:" +
                            parseInt(imgW) + "px;height: " + parseInt(imgW) + "px;border-radius:50%";
                        if (loadPic) {
                            var img = new Image();
                            img.src = loadPic;
                            img.onload = function() {
                                canvas = document.getElementById("canvasLoad");
                                canvas.setAttribute('height', parseInt(imgW) + 1);
                                canvas.setAttribute('width', parseInt(imgW));

                                if (isFirstLoad) {
                                    drawCanvas(canvas, 'pie', loadPic, 0);
                                    loadImg()
                                }
                            }
                        } else if (fgPic) {
                            var fgImg = new Image();
                            fgImg.src = fgPic;
                            fgImg.onload = function() {
                                loadingBarBox.style.cssText += "visibility:visible;width:" +
                                    parseInt(imgW) + "px;height: " + parseInt(imgW) + 'px';

                                if (isFirstLoad) {
                                    loadImg()
                                };
                            }
                        } else if (loadingProgress) {
                            if (isFirstLoad) {
                                loadImg()
                            };
                        }

                        break;
                    case 'rotate':
                        if (loadingProgress) {
                            logo.setAttribute('width', '100%');
                            var logoContainer = document.querySelector('.logoContainer');
                            var finalH = Math.sqrt(Math.pow(parseInt(getStyle(logo, 'height')), 2) +
                                Math.pow(parseInt(getStyle(logo, 'width')), 2))
                            logoContainer.style.height = finalH + 'px';
                            loadingProgress.style.visibility = 'visible';
                        }

                        if (isFirstLoad) { loadImg() };
                        break;

                    case 'percentage':
                        loadingProgress.style.visibility = 'visible';

                        if (isFirstLoad) { loadImg() };
                        break;
                    default:
                        loadingBarBox.style.visibility = 'visible';

                        if (loadingProgress) {
                            loadingProgress.style.visibility = 'visible';
                        }

                        if (isFirstLoad) { loadImg() };
                }
            }

            process = typePrcess(jsondata.loadingbar.bartype, progressUpdate); //加载动作
        }

        //根据加载选项确定渲染函数
        function typePrcess(type, render) {
            switch (type) {
                case 'ring':
                    var ringSvg = document.querySelector('svg')
                    var w = toPoint(ringSvg.getAttribute('width')) * clientW; //svg宽度
                    var r = toPoint(loadingBar.getAttribute('r')) * w;
                    var c = Math.PI * (2 * r);

                    return function(percent) {
                        var p = c * (100 - percent) / 100;
                        loadingBar.style.strokeDashoffset = p;
                        render && render(percent);
                    }
                case 'rotate': //clockwise/anticlockwise
                    if (direction && direction === 'anticlockwise') {
                        rotateTimer = requestAnimationFrame(function rotate() {
                            if (window.isPageLoad && percent >= 100) {
                                cancelAnimationFrame(rotateTimer);
                                return;
                            }
                            rotateDeg--;
                            logo.style.transform = "rotate(" + rotateDeg + "deg)";
                            requestAnimationFrame(rotate);
                        });
                    } else {
                        rotateTimer = requestAnimationFrame(function rotate() {
                            if (window.isPageLoad && percent >= 100) {
                                cancelAnimationFrame(rotateTimer);
                                return;
                            }
                            rotateDeg++;
                            logo.style.transform = "rotate(" + rotateDeg + "deg)";
                            requestAnimationFrame(rotate);
                        });

                    }
                    return function(percent) {
                        render && render(percent);
                    };

                case 'imgbar': //leftToRight/bottomToTop
                    return function(percent) {
                        if (loadPic) {
                            drawCanvas(canvas, 'bar', fgPic, percent);
                        }
                        render && render(percent);
                    }
                case 'pie': //clockwise/anticlockwise
                    return function(percent) {
                        if (loadPic) {
                            drawCanvas(canvas, 'pie', fgPic, percent);
                        }
                        render && render(percent);
                    }
                case 'percentage':
                    return function(percent) {
                        render && render(percent);
                    }
                default:
                    return function(percent) {
                        loadingBar.style.width = percent + '%';
                        render && render(percent);
                    }
            }
        }

        function loadImg() {
            var loadImgTimer = setInterval(() => {
                var imgSign = document.querySelector('#loadImgSign');
                if (imgSign) {
                    clearInterval(loadImgTimer);
                    percent = 1;
                    process(percent);
                    var imgArray = document.querySelectorAll('img');
                    var length = imgArray.length;
                    Array.from(imgArray).forEach(function(item, index) {
                        var src = item.getAttribute('_src')
                        if (src) {
                            item.setAttribute('src', src)
                        }
                        if (index >= length - 1) {
                            loadPage()
                        }
                    })
                }
            }, 10)
        }

        function loadPage() {
            if (isFirstLoad) {
                isFirstLoad = false;
                loadingTimer = requestAnimationFrame(function update() {
                    percent += loadingAdd;
                    process(percent);
                    if (is_mobile()) {
                        if (parseInt(percent) >= 10 && parseInt(percent) < 96 && window.isPageLoad) {
                            loadingAdd = 1.5;
                            requestAnimationFrame(update);
                        } else if (parseInt(percent) >= 96) {
                            cancelAnimationFrame(loadingTimer)
                            finalTimer = setInterval(function() {
                                if (window.isPageLoad) {
                                    clearInterval(finalTimer);
                                    percent = 100;

                                    process(percent);

                                    setTimeout(function() {
                                        goStraightToEnd();
                                    }, 100)
                                }
                            }, 1);
                        } else {
                            requestAnimationFrame(update);
                        }
                    } else {
                        if (parseInt(percent) < 96 && window.isPageLoad) {
                            loadingAdd = 3;
                            requestAnimationFrame(update);
                        } else if (parseInt(percent) >= 96) {
                            cancelAnimationFrame(loadingTimer)
                            finalTimer = setInterval(function() {
                                if (window.isPageLoad) {
                                    clearInterval(finalTimer);
                                    percent = 100;
                                    process(percent);
                                    setTimeout(function() {
                                        goStraightToEnd();
                                    }, 100)
                                }
                            }, 1);
                        } else {
                            requestAnimationFrame(update);
                        }
                    }
                })

            }
        }

        function goStraightToEnd() {
            window.onloadOver();
            mql.removeListener(onMatchMeidaChange);
        }

        function toPoint(percent) {
            var str = percent.replace("%", "");
            str = str / 100;
            return str;
        }

        function drawCanvas(canvas, type, src, percent) {
            canvas.setAttribute('width', imgW);

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
                    percent = (percent - 25) / 100;
                }

                context.arc(r, r, r, startPoint, Math.PI * 2 * percent, false);
            }

            context.clip();
            //从左上角开始绘制图像
            context.drawImage(newImg, 0, 0, imgW, imgW);
        }

        function clipBar(context, percent) {
            context.beginPath();
            // context.moveTo(r, r);

            if (direction && direction === 'bottomToTop') {
                context.rect(0, imgH, imgW, -imgH * (percent / 100));
            } else {
                context.rect(0, 0, imgW * (percent / 100), imgH);
            }

            context.clip();
            //从左上角开始绘制图像
            context.drawImage(newImg, 0, 0, imgW, imgH);
        }
    }

    function setMarginBottom(dom1, dom2, marginBottom) {
        if (dom1) {
            dom1.style.marginBottom = marginBottom + 'px';
            dom1.style.visibility = 'visible';
        } else {
            dom2.style.marginBottom = marginBottom + 'px';
        }
    }

    function getStyle(element, attr) {         
        return window.getComputedStyle ? window.getComputedStyle(element, null)[attr] : element.currentStyle[attr];      
    }

})(this);