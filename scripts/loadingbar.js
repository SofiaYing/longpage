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
    if(jsondata.loadingbar){
        var barFgColor = jsondata.loadingbar.barfgcolor;
        var barBgColor = jsondata.loadingbar.barbgcolor;
        var fgPic = jsondata.loadingbar.fgpic;
        var bgPic = jsondata.loadingbar.bgpic;
        var bgColor = jsondata.loadingbar.bgcolor;
    }
    var loadingBox = document.getElementById("loadingBox");
    loadingBox.style.width = finalW + "px";
    loadingBox.style.height = finalH + "px";
    loadingBox.style.display = "block";
    var clientH = document.documentElement.clientHeight;
    var clientW = document.documentElement.clientWidth;
    loadingBox.style.top = clientH / 2 - finalH / 2 + "px";
    loadingBox.style.left = clientW / 2 - finalW / 2 + "px";
    //要操作的进度条
    var loadingBarBox = document.getElementById("loadingBarBox");
    
    var loadingBar = document.getElementById("loadingBar");
    
    var outerWidth = finalW / 2; //记录原先的宽度
    if(jsondata.loadingbar){
        if(fgPic === "") logo.style.opacity = "0.0";
        else logo.src = fgPic;
        loadingBox.style.background = jsondata.loadingbar.bgtype === "color" ? bgColor : "url(" + bgPic + ") no-repeat";
        loadingBox.style.backgroundSize = "100% 100%";
        loadingBar.style.background = barFgColor;
        loadingBarBox.style.background = barBgColor;
    }
    startProgressBar();

    //进度条效果
    var firstTimer, slowerTimer, slowestTimer, finalTimer, percent = 0;

    function startProgressBar() {
        firstTimer = setInterval(function() {
            loadingBar.style.width = (outerWidth * percent / 100) + "px";
            if (window.isPageLoad) {
                clearInterval(firstTimer);
                goStraightToEnd();
                return;
            }
            percent++;
            if (percent === 50) {
                clearInterval(firstTimer);
                slowerTimer = setInterval(function() {
                    loadingBar.style.width = (outerWidth * percent / 100) + "px";
                    percent++;
                    if (window.isPageLoad) {
                        clearInterval(slowerTimer);
                        goStraightToEnd();
                        return;
                    }
                    if (percent === 80) {
                        clearInterval(slowerTimer);
                        slowestTimer = setInterval(function() {
                            loadingBar.style.width = (outerWidth * percent / 100) + "px";
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
            loadingBar.style.width = (outerWidth * percent / 100) + "px";
            if (percent === 100) {
                document.getElementById("loadingBox").style.display = "none";
                clearInterval(endTimer);
                window.isLoadingbarOver = true;
                window.onloadOver();
                console.log("加载完成，进度条结束")
            }
            percent++;
        }, 5);
    }
})(this);