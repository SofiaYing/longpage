function PlayInteractiveInAnimation(showNode) {
    PlayAudioInAnimation(showNode);
}

function PlayAudioInAnimation(showNode) {
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
        audionodes[i].play();
    }
}

function animation()
{
    var timePlus = 1000;
    var animation_list = [];
    function fade(demo, type, playDelay, playTime) {
        var opacity = demo.css("opacity");
        var desOpacity;
        if (type.search("fromAppearance") !== -1)
        {
            if (opacity === "0")
                demo.animate({ opacity: 1.0 }, { duration: 0.1, easing: "linear", queue: "x1" });
            desOpacity = 0.0;
        }
        else if (type.search("toAppearance") !== -1)
        {
            if (opacity === "1")
                demo.animate({ opacity: 0.0 }, { duration: 0.1, easing: "linear", queue: "x1" });
            desOpacity = 1.0;
        }
        demo.animate({ opacity: desOpacity }, { duration: playTime * timePlus, easing: "linear", queue: "x1",
            callback: PlayInteractiveInAnimation(demo)
        });
    }

    function slideTo(demo, data, direction, playDelay, playTime) {
        switch (direction)
        {
            case "bottom":  //自底部
                demo[0].style.top = data.winH + 'px';
                demo.animate({top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo) });               
                break;
            case "left":    //自左侧
                demo[0].style.left = "-" + data.spaceW + 'px';
                demo.animate({left: data.itemLeft + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo) });
                break;
            case "right":   //自右侧
                demo[0].style.left = data.winW + 'px';
                demo.animate({left: data.itemLeft + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo) });
                break;
            case "top":     //自顶部
                demo[0].style.top = "-" + data.spaceH + 'px';
                demo.animate({top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo) });
                break;
            case "leftBottom":  //自左下部
                demo[0].style.left = "-" + data.spaceW + 'px';
                demo[0].style.top = data.winH + 'px';
                demo.animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo) });
                break;
            case "rightBottom": //自右下部
                demo[0].style.left = data.winW + 'px';
                demo[0].style.top = data.winH + 'px';
                demo.animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo) });
                break;
            case "leftTop":     //自左上部
                demo[0].style.left = "-" + data.spaceW + 'px';
                demo[0].style.top = "-" + data.spaceH + 'px';
                demo.animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo) });
                break;
            case "rightTop":    //自右上部
                demo[0].style.left = data.winW + 'px';
                demo[0].style.top = "-" + data.spaceH + 'px';
                demo.animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo) });
                break;
            default:
                break;
        }
    }

    function slideFrom(demo, data, direction, playDelay, playTime) {
        switch (direction)
        {
            case "bottom":  //向底部
                demo.animate({top: data.winH + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "left":    //向左侧
                demo.animate({left: "-" + data.spaceW + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "right":   //向右侧
                demo.animate({ left: document.body.clientWidth + "px" }, { duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "top":     //向顶部
                demo.animate({top: "-" + data.spaceH + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "leftBottom":  //向左下部
                demo.animate({left: "-" + data.spaceW + "px", top: data.winH + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "rightBottom": //向右下部
                //+5像素防止出现边界线
                demo.animate({left: data.winW + "px", top: (document.body.clientHeight+5) + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "leftTop":     //向左上部
                demo.animate({left: "-" + data.spaceW + "px", top: "-" + (data.spaceH+5) + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "rightTop":    //向右上部
                demo.animate({left: data.winW + "px", top: "-" + (data.spaceH+5) + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            default:
                break;
        }
    }

    function slide(demo, data, type, direction, playDelay, playTime) {
        if (type.search("toAppearance") !== -1) {
            slideTo(demo, data, direction, playDelay, playTime);
        }
        else if (type.search("fromAppearance") !== -1) {
            slideFrom(demo, data, direction, playDelay, playTime);
        }
    }

    function backTo(demo, data, direction, playDelay, playTime) {
        var backLength = data.spaceH > data.spaceW ? (data.spaceW / 5) : (data.spaceH / 5);
        switch (direction)
        {
            case "bottom":  //自底部
                demo[0].style.top = data.winH + 'px';
                demo.animate({top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({top: data.itemTop + backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({top: data.itemTop + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "left":    //自左侧
                demo[0].style.left = "-" + data.spaceW + 'px';
                demo.animate({ left: data.itemLeft + "px" }, { duration: playTime * timePlus, easing: "swing", queue: "x1" }).animate({ left: data.itemLeft - backLength + "px" }, { duration: playTime * timePlus / 2, easing: "swing", queue: "x1" }).animate({ left: data.itemLeft + "px" }, { duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo) });
                break;
            case "right":   //自右侧
                demo[0].style.left = data.winW + 'px';
                demo.animate({left: data.itemLeft + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({left: data.itemLeft + backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({left: data.itemLeft + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "top":     //自顶部
                demo[0].style.top = "-" + data.spaceH + 'px';
                demo.animate({top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({top: data.itemTop - backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({top: data.itemTop + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "leftBottom":  //自左下部
                demo[0].style.left = "-" + data.spaceW + 'px';
                demo[0].style.top = data.winH + 'px';
                demo.animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"});
                demo.animate({ left: data.itemLeft - backLength + "px", top: data.itemTop + backLength + "px" }, { duration: playTime * timePlus / 4, easing: "swing", queue: "x1" });
                demo.animate({ left: data.itemLeft + "px", top: data.itemTop + "px" }, { duration: playTime * timePlus / 4, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "rightBottom": //自右下部
                demo[0].style.left = data.winW + 'px';
                demo[0].style.top = data.winH + 'px';
                demo.animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({left: data.itemLeft + backLength + "px", top: data.itemTop + backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "leftTop":     //自左上部
                demo[0].style.left = "-" + data.spaceW + 'px';
                demo[0].style.top = "-" + data.spaceH + 'px';
                demo.animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({left: data.itemLeft - backLength + "px", top: data.itemTop - backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "rightTop":    //自右上部
                demo[0].style.left = data.winW + 'px';
                demo[0].style.top = "-" + data.spaceH + 'px';
                demo.animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({left: data.itemLeft + backLength + "px", top: data.itemTop - backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({left: data.itemLeft + "px", top: data.itemTop + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            default:
                break;
        }
    }

    function backFrom(demo, data, direction, playDelay, playTime) {
        var backLength = data.winH > data.winW ? (data.winW / 5) : (data.winH / 5);
        switch (direction)
        {
            case "bottom":  //向底部
                demo.animate({top: data.winH + "px"}, {duration: playTime * timePlus, easing: 'swing', queue: "x1"}).animate({top: data.winH - backLength + "px"}, {duration: playTime * timePlus / 2, easing: 'swing', queue: "x1"}).animate({top: data.winH + "px"}, {duration: playTime * timePlus / 2, easing: 'swing', queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "left":    //向左侧
                demo.animate({left: "-" + data.spaceW + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({left: backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({left: "-" + data.spaceW + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "right":   //向右侧
                demo.animate({left: data.winW + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({left: data.winW - backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({left: data.winW + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "top":     //向顶部
                demo.animate({top: "-" + data.spaceH + "px"}, {duration: playTime * timePlus, easing: "linear", queue: "x1"}).animate({top: backLength + "px"}, {duration: playTime * timePlus / 2, easing: "linear", queue: "x1"}).animate({top: "-" + data.spaceH + "px"}, {duration: playTime * timePlus / 2, easing: "linear", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "leftBottom":  //向左下部
                var l1 = data.itemLeft - data.spaceW / 5;
                var t1 = data.itemTop + data.spaceH / 5;
                demo.animate({ left: l1 + "px", top: t1 + "px" }, { duration: playTime * timePlus / 3, easing: "swing", queue: "x1" });
                demo.animate({ left: data.itemLeft + "px", top: data.itemTop + "px" }, { duration: playTime * timePlus / 3, easing: "swing", queue: "x1" });
                demo.animate({ left: "-" + data.spaceW + "px", top: document.body.clientHeight + "px" }, { duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "rightBottom": //向右下部
                demo.animate({left: data.winW + "px", top: data.winH + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({left: data.winW - backLength + "px", top: data.winH - backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({left: data.winW + "px", top: data.winH + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "leftTop":     //向左上部
                demo.animate({left: "-" + data.spaceW + "px", top: "-" + data.spaceH + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({left: backLength + "px", top: backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({left: "-" + data.spaceW + "px", top: "-" + data.spaceH + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            case "rightTop":    //向右上部
                demo.animate({left: data.winW + "px", top: "-" + data.spaceH + "px"}, {duration: playTime * timePlus, easing: "swing", queue: "x1"}).animate({left: data.winW - backLength + "px", top: backLength + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1"}).animate({left: data.winW + "px", top: "-" + data.spaceH + "px"}, {duration: playTime * timePlus / 2, easing: "swing", queue: "x1",
                    callback: PlayInteractiveInAnimation(demo)
                });
                break;
            default:
                break;
        }
    }

    function back(demo, data, type, direction, playDelay, playTime) {
        if (type.search("toAppearance") !== -1)
        {
            backTo(demo, data, direction, playDelay, playTime);
        }
        else if (type.search("fromAppearance") !== -1)
        {
            backFrom(demo, data, direction, playDelay, playTime);
        }
    }

    function fall(demo, data, type, playDelay, playTime) {
        var fallRadio = 3;
        var t = 0;
        var l = 0;
        var w = 0;
        var h = 0;
        var t1 = 0;
        var l1 = 0;
        var w1 = 0;
        var h1 = 0;
        if (type.search("fromAppearance") !== -1)
        {
            w = data.spaceW;
            h = data.spaceH;
            l = data.itemLeft;
            t = data.itemTop;
            w1 = 0;
            h1 = 0;
            l1 = data.itemLeft + data.spaceW / 2;
            t1 = data.itemTop + data.spaceH / 2;
            demo.animate({left: l + "px", top: t + "px", width: w + "px", height: h + "px", opacity: 1.0}, {duration: 1, easing: "linear", queue: "x1"});
            demo.animate({left: l1 + "px", top: t1 + "px", width: w1 + "px", height: h1 + "px", opacity: 0.0}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                callback: PlayInteractiveInAnimation(demo) });
        }
        else if (type.search("toAppearance") !== -1)
        {
            w = data.spaceW * fallRadio;
            h = data.spaceH * fallRadio;
            l = data.itemLeft - data.spaceW * (fallRadio - 1) / 2;
            t = data.itemTop - data.spaceH * (fallRadio - 1) / 2;
            w1 = data.spaceW;
            h1 = data.spaceH;
            l1 = data.itemLeft;
            t1 = data.itemTop;
            demo.animate({left: l + "px", top: t + "px", width: w + "px", height: h + "px", opacity: 0.0}, {duration: 1, easing: "linear", queue: "x1"});
            demo.animate({ left: l1 + "px", top: t1 + "px", width: w1 + "px", height: h1 + "px", opacity: 1.0 }, { duration: playTime * timePlus, easing: "linear", queue: "x1", 
                callback: PlayInteractiveInAnimation(demo) });
        }
    }

    function fly(demo, data, type, playDelay, playTime) {
        var t = 0;
        var l = 0;
        var w = 0;
        var h = 0;
        var t1 = 0;
        var l1 = 0;
        var w1 = 0;
        var h1 = 0;
        var rate = 1.2;
        if (type.search("toAppearance") !== -1)
        {
            w = 0;
            h = 0;
            l = data.itemLeft + data.spaceW / 2;
            t = data.itemTop + data.spaceH / 2;
            w1 = data.spaceW;
            h1 = data.spaceH;
            l1 = data.itemLeft;
            t1 = data.itemTop;
            demo.animate({left: l + "px", top: t + "px", width: w + "px", height: h + "px", opacity: 0.0}, {duration: 1, easing: "linear", queue: "x1"});
            demo.animate({left: l1 + "px", top: t1 + "px", width: w1 + "px", height: h1 + "px", opacity: 1.0}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                callback: PlayInteractiveInAnimation(demo) });
        }
        else if (type.search("fromAppearance") !== -1)
        {
            w = data.spaceW;
            h = data.spaceH;
            l = data.itemLeft;
            t = data.itemTop;
            w1 = data.spaceW * rate;
            h1 = data.spaceH * rate;
//            if ((data.spaceW / data.spaceH) > (data.winW / data.winH))
//            {
//                w1 = data.winH * data.spaceW / data.spaceH;
//                h1 = data.winH;
//            }
//            else
//            {
//                h1 = data.winW * data.spaceH / data.spaceW;
//                w1 = data.winW;
//            }

            l1 = data.itemLeft - (w1 - data.spaceW) / 2;
            t1 = data.itemTop - (h1 - data.spaceH) / 2;
            demo.animate({left: l + "px", top: t + "px", width: w + "px", height: h + "px"}, {duration: 1, easing: "linear", queue: "x1"});
            demo.animate({left: l1 + "px", top: t1 + "px", width: w1 + "px", height: h1 + "px", opacity: 0.0}, {duration: playTime * timePlus, easing: "linear", queue: "x1",
                callback: PlayInteractiveInAnimation(demo) });
        }
    }

    function pop(demo, data, type, playDelay, playTime) {
        var popRadio = 1.1;
        var t = 0;
        var l = 0;
        var w = 0;
        var h = 0;
        var w1 = 0;
        var h1 = 0;
        var w2 = 0;
        var h2 = 0;
        var w3 = 0;
        var h3 = 0;
        var offl1 = -data.spaceW * (popRadio - 1) / 2;
        var offt1 = -data.spaceH * (popRadio - 1) / 2;
        var offl2 = 0;
        var offt2 = 0;
        var offl3 = 0;
        var offt3 = 0;
        if (type.search("toAppearance") !== -1)
        {
            w = 0;
            h = 0;
            l = data.itemLeft + data.spaceW / 2;
            t = data.itemTop + data.spaceH / 2;
            w1 = data.spaceW * popRadio;
            h1 = data.spaceH * popRadio;
            w2 = data.spaceW / popRadio;
            h2 = data.spaceH / popRadio;
            w3 = data.spaceW;
            h3 = data.spaceH;
            offl2 = data.spaceW * (popRadio - 1 / popRadio) / 2;
            offt2 = data.spaceH * (popRadio - 1 / popRadio) / 2;
            offl3 = -data.spaceW * (1 - 1 / popRadio) / 2;
            offt3 = -data.spaceH * (1 - 1 / popRadio) / 2;
            //jquery的animate在执行时候会设置overflow为hidden,这里通过step解决
            //参考样张:粤语音乐第10页,小人在弹出的过程中“脚”会被隐藏掉。
            demo.animate({ left: "+=" + offl1 + "px", top: "+=" + offt1 + "px", width: w1 + "px", height: h1 + "px", overflow: 'visible' },
                { duration: (playTime / 3) * timePlus, easing: "swing", queue: "x1", step: function () {demo.css("overflow", "visible");}});
            demo.animate({ left: "+=" + offl2 + "px", top: "+=" + offt2 + "px", width: w2 + "px", height: h2 + "px" },
                { duration: (playTime / 3) * timePlus, easing: "swing", queue: "x1", step: function () { demo.css("overflow", "visible"); } });
            demo.animate({ left: "+=" + offl3 + "px", top: "+=" + offt3 + "px", width: w3 + "px", height: h3 + "px" }, 
                { duration: (playTime / 3) * timePlus, easing: "swing", queue: "x1", step: function () { demo.css("overflow", "visible"); },
                callback: PlayInteractiveInAnimation(demo)
            });
        }
        else if (type.search("fromAppearance") !== -1) {
            w = data.spaceW;
            h = data.spaceH;
            l = data.itemLeft;
            t = data.itemTop;
            w1 = data.spaceW * popRadio;
            h1 = data.spaceH * popRadio;
            w2 = data.spaceW / popRadio;
            h2 = data.spaceH / popRadio;
            w3 = 0;
            h3 = 0;
            offl2 = data.spaceW * (popRadio - 1 / popRadio) / 2;
            offt2 = data.spaceH * (popRadio - 1 / popRadio) / 2;
            offl3 = -data.spaceW / 2;
            offt3 = -data.spaceH / 2;
            demo.animate({ left: "+=" + offl1 + "px", top: "+=" + offt1 + "px", width: w1 + "px", height: h1 + "px", overflow: 'visible' },
                { duration: (playTime / 2) * timePlus, easing: "swing", queue: "x1", step: function () {demo.css("overflow", "visible");}});
            demo.animate({ left: "+=" + offl2 + "px", top: "+=" + offt2 + "px", width: w2 + "px", height: h2 + "px", opacity: 0.0 },
                { duration: (playTime / 2) * timePlus, easing: "swing", queue: "x1", step: function () { demo.css("overflow", "visible"); },
                callback: PlayInteractiveInAnimation(demo) });
        }

    }

    function flip(demo, data, type, playDelay, playTime) {
        var w = data.spaceW;
        var h = data.spaceH;
        var w1 = 0;
        var h1 = data.spaceH;
        var l, t, l1, t1;
        if (data.itemLeft === undefined) {
            //点击翻转隐藏的元素，需得显示之后才能获取offset().left
            l = demo.offset().left;
            t = demo.offset().top;
        }
        else {
            l = data.itemLeft;
            t = data.itemTop;
        }
        l1 = l + data.spaceW / 2;
        t1 = t;

        demo.animate({left: l1 + "px", top: t1 + "px", width: w1 + "px", height: h1 + "px"}, {duration: playTime * timePlus / 3, easing: "linear", queue: "x1"});
        demo.queue('x1', function (next) {
            demo.css({"transform": "scaleX(-1)"});
            next();
        });
        demo.animate({left: l + "px", top: t + "px", width: w + "px", height: h + "px"}, {duration: playTime * timePlus / 3, easing: "linear", queue: "x1",
            callback: PlayInteractiveInAnimation(demo)
        });
        if (type.search("fromAppearance") !== -1)
        {
            demo.fadeOut({duration: playTime * timePlus / 3, queue: "x1"});
        }
        else
        {
            demo.queue('x1', function (next) {
                demo.css({"transform": "scaleX(1)"});
                next();
            });
        }
    }

    function Animation(demo, data, type, effect, direction, playDelay, playTime) {
        //进入时渐隐
        if (type.search("fromAppearance") !== -1 && effect === "fade"){
            demo.css({ 'display': 'block', 'opacity': 1 });
        }
        if (playDelay > 0)
        {
            setTimeout(function () {
                if ((type.search("toAppearance") !== -1 && effect == "fall" && direction == "bottom") ||
                        (type.search("toAppearance") !== -1 && effect == "fly" && direction == "bottom") ||
                        (type.search("toAppearance") !== -1 && effect == "fade" && direction == "bottom"))
                {
                    demo.css({'display': 'block', 'opacity': 0});
                }
                else
                {
                    demo.css({'display': 'block', 'opacity': 1});
                }
                switch (effect)
                {
                    case "none":
                        break;
                    case "fade":    //渐隐 
                        fade(demo, type, playDelay, playTime);
                        break;
                    case "slide":   //滑动
                        slide(demo, data, type, direction, playDelay, playTime);
                        break;
                    case "back":    //回弹
                        back(demo, data, type, direction, playDelay, playTime);
                        break;
                    case "fall":    //跌落
                        fall(demo, data, type, playDelay, playTime);
                        break;
                    case "fly":     //飞升
                        fly(demo, data, type, playDelay, playTime);
                        break;
                    case "pop":     //冒泡
                        pop(demo, data, type, playDelay, playTime);
                        break;
                    case "flip":    //翻转
                        flip(demo, data, type, playDelay, playTime);
                        break;
                    default:
                        break;
                }
                demo.dequeue("x1");
            }, playDelay * timePlus);
        }
        else
        {
            if ((type.search("toAppearance") !== -1 && effect == "fall" && direction == "bottom") ||
                    (type.search("toAppearance") !== -1 && effect == "fly" && direction == "bottom") ||
                    (type.search("toAppearance") !== -1 && effect == "fade" && direction == "bottom"))
            {
                demo.css({'display': 'block', 'opacity': 0});
            }
            else
            {
                demo.css({'display': 'block', 'opacity': 1});
            }
            switch (effect)
            {
                case "none":
                    break;
                case "fade":    //渐隐 
                    fade(demo, type, playDelay, playTime);
                    break;
                case "slide":   //滑动
                    slide(demo, data, type, direction, playDelay, playTime);
                    break;
                case "back":    //回弹
                    back(demo, data, type, direction, playDelay, playTime);
                    break;
                case "fall":    //跌落
                    fall(demo, data, type, playDelay, playTime);
                    break;
                case "fly":     //飞升
                    fly(demo, data, type, playDelay, playTime);
                    break;
                case "pop":     //冒泡
                    pop(demo, data, type, playDelay, playTime);
                    break;
                case "flip":    //翻转
                    flip(demo, data, type, playDelay, playTime);
                    break;
                default:
                    break;
            }
            demo.dequeue("x1");
        }
    }

    $("div[title='Animation']").each(function () {
        var client = $(this);
        var winW = client.width();
        var winH = client.height();
        var idx_Animation = 0;
        var iLenth = client.children().length;
        for (var idx = 0; idx < iLenth; idx++) {
            var jsonnode = client.children()[idx];
            if (jsonnode.nodeName.toLowerCase() === 'input') {
                var demoAnimation = client.children()[idx_Animation];
                var itemTop = demoAnimation.offsetTop;
                var itemLeft = demoAnimation.offsetLeft;
                var spaceW = demoAnimation.offsetWidth;
                var spaceH = demoAnimation.offsetHeight;
                // no json
                var jsonStr = jsonnode.value;
                var data = eval('(' + jsonStr + ')');
                for (var i = idx_Animation; i < (idx_Animation + data.states.length); i++) {
                    var demo = client.children().eq(i);
                    var ctPopup = demo.parents("div[title='PopupContent']").length;
                    var iUid;
                    for (var j = 0; j < data.states[i - idx_Animation].animations.length; j++) {
                        var uid = data.states[i - idx_Animation].animations[j].uid;
                        var triggerEvent = data.states[i - idx_Animation].animations[j].type.charAt(data.states[i - idx_Animation].animations[j].type.length - 1);
                        var Adata = { 'Demo': demo, 'winW': winW, 'winH': winH, 'itemTop': itemTop, 'itemLeft': itemLeft,
                            'spaceW': spaceW, 'spaceH': spaceH, 'animate': data.states[i - idx_Animation].animations[j],
                            'triggerEvent': triggerEvent, 'ctPopup': ctPopup
                        };
                        iUid = parseInt(uid);
                        if (j === 0 && animation_list[iUid] === undefined) {
                            animation_list[iUid] = [];
                        }
                        else if (j === 0 && animation_list[iUid] !== undefined) {
                        }
                        else if (j > 0 && triggerEvent === '1') {//单击
                            iUid = parseInt(data.states[i - idx_Animation].animations[0].uid);
                        }
                        else if (j > 0 && triggerEvent === '0') {
                            // 飞翔动画样张,第三页,[进入,滑动;退出,回弹]
                            // 如果该元素上的第一个动画是载入页面时加载,第二个动画也是载入页面时加载,忽略第二个动画
                            var iUid0 = parseInt(data.states[i - idx_Animation].animations[0].uid);
                            if (animation_list[iUid0][0].triggerEvent === "0") {
                                iUid = iUid0;
                            }
                            // 动画7.9.pdml
                            else if (animation_list[iUid] === undefined) {
                                animation_list[iUid] = [];
                            }
                        }
                        else if (j > 0 && triggerEvent !== '0' && triggerEvent !== '1' && animation_list[iUid] === undefined) {
                            animation_list[iUid] = [];
                        }
                        else if (j > 0 && triggerEvent !== '0' && triggerEvent !== '1' && animation_list[iUid] !== undefined) {
                        }
                        animation_list[iUid].push(Adata);
                    }
                }
                idx_Animation = idx + 1;
            }
        }

        //自定义方法
        $.fn.displayAnimate = function () {
            var winW = $(this).width();
            var winH = $(this).height();
            var len = $(this).children().length;
            //在hide前记录原来坐标，防止丢失
            var szOrgLeft = [];
            var szOrgTop = [];
            for (var i = 0; i < len; i += 2) {
                var divItem = $(this).children().eq(i);
                szOrgLeft[(i - 1) / 2] = parseInt(divItem.css("left"));
                szOrgTop[(i - 1) / 2] = parseInt(divItem.css("top"));
            }
            //1div+1input组成动画
            $(this).children().hide();
            for (var i = 0; i < len; i += 2) {
                var divItem = $(this).children().eq(i);
                var inpItem = $(this).children().eq(i + 1);
                var itemLeft = szOrgLeft[(i - 1) / 2];
                var itemTop = szOrgTop[(i - 1) / 2];
                var spaceW = divItem.width();
                var spaceH = divItem.height();
                var jsonStr = inpItem[0].value;
                var data = eval('(' + jsonStr + ')');

                var uid = data.states[0].animations[0].uid;
                var Adata = { 'Demo': divItem, 'winW': winW, 'winH': winH, 'itemTop': itemTop, 'itemLeft': itemLeft, 'spaceW': spaceW, 'spaceH': spaceH, 'animate': data.states[0].animations[0] };
                Animation(Adata.Demo, Adata, Adata.animate.type, Adata.animate.effect, Adata.animate.direction, Adata.animate.playDelay, Adata.animate.playTime);
            }
        }

        //提升非buttonItem的z-index
        //样张:风能工程第1页
        var isHasBtnItem = false;
        for (var idx = 0; idx < iLenth; idx++) {
            var item = client.children().eq(idx);
            var btnNodes = item.find("div[title='Button']");
            if (btnNodes.length !== 0) {
                isHasBtnItem = true;
            }

            if (isHasBtnItem === true && btnNodes.length === 0) {
                item.css("zIndex", 80);
            }
        }
    });

    //进入,单击
    for (var i = 0; i < animation_list.length; i++) {
        if (!animation_list[i])
            continue;
        for (var j = 0; j < 1; j++) {
            var data = animation_list[i][j];
            var triggerEvent = data.animate.type.charAt(data.animate.type.length - 1);
            //var btnNodes = data.Demo.find("div[title='Button']");
            var parentNodes = data.Demo.parents("div[title='PopupContent']");
            //生物进化第3页
            if (triggerEvent === '1'/* && btnNodes.length===0 */&& parentNodes.length===0) {
                data.Demo.on('vmousedown', function (e) {
                    e.preventDefault();
                    if ($(this).attr('mousedownCount') === '0') {
                        $(this).attr('mousedownCount', '1');
                        var pos = parseInt($(this).attr('arrayposi'));
                        playAnimation(pos, 0.0, -1);
                    }
                });
                data.Demo.attr('mousedownCount', '0'); //只会播放一次动画
                data.Demo.attr('arrayposi', i);
                data.Demo.attr('arrayposj', 0);
                data.Demo.css('pointer-events', 'auto');
                if (data.animate.type.indexOf('toAppearance') >= 0) {//进入
                    data.Demo.css( 'opacity', '0.0');
                }                
            }
            else if (triggerEvent !== '1' && data.animate.type.indexOf('toAppearance') >= 0) {
            	if (data.animate.effect === 'fade' ||
					data.animate.effect === 'slide' ||
					data.animate.effect === 'back' ||
					data.animate.effect === 'fly' ||
					data.animate.effect === 'pop'
					) {
            		data.Demo.css('display', 'none');
            	}
            }
        }
    }

    var waitTime = 0;
    var lasti = -1, lastj = -1;
    var lastType;
    var firstAnimationDelay = 0;    //网页加载动画延迟时间,防止移动设备硬件问题造成第一个动画无法看到
    var nLastSynWithFirstAni = -1;  //上一个与网页加载动画同步的动画
    var nFirstNonPageLoadAni = -1;  //第一个非网页加载动画
    var ismobile = is_mobile();
    for (var i = 0; i < animation_list.length; i++)
    {
        if (!animation_list[i])
            continue;
        for (var j = 0; j < animation_list[i].length; j++)
        {
            var data = animation_list[i][j];
            //触发事件:0--网页加载时;1--单击;2--与上一动画同时;3--在上一动画之后
            var triggerEvent = data.animate.type.charAt(data.animate.type.length - 1);
            //1.(网页加载时)动画
            //2.弹出内容的(带单击事件)触发动画
            //3.第一个动画,即使动画触发事件设置为与上一动画同时或者在上一动画之后,也立即执行
            if ((triggerEvent === '0' && j===0) || (i === 0 && j === 0 && (triggerEvent === '2' || triggerEvent === '3'))) {
                //移动设备可能打开网页较慢，跳过第一个动画
                if (data.animate.playTime < 2.0 && i === 0 && ismobile === true) {
                    data.animate.playTime = 2.0;
                }
                var mobileDelay = firstAnimationDelay + parseFloat(data.animate.playDelay);
                Animation(data.Demo, data, data.animate.type, data.animate.effect, data.animate.direction, mobileDelay, data.animate.playTime);
                waitTime = Number(mobileDelay) + Number(data.animate.playTime);
                lasti = i;
                lastj = j;
            }
            //如果上一个动画是在网页加载开始,并且当前动画与上一动画同时进行,并且是第一个同步的
            else if (((i === lasti && j === lastj + 1) || (i === lasti + 1 && j === 0)) && triggerEvent === '2') {
                nLastSynWithFirstAni = lasti;
                waitTime = 0;
            }

            if (triggerEvent !== '0' && nFirstNonPageLoadAni === -1 && data.ctPopup === 0) {
                nFirstNonPageLoadAni = i;
            }
        }
    }

    function playAnimation(i, waitTime, nSynWithFirstAni) {
        if (i<0 || i>=animation_list.length)
            return;
        if (animation_list[i] === undefined) {
            playAnimation(i + 1, 0);
            return;
        }
        var data = animation_list[i][0];
        var timei = Number(data.animate.playDelay) + Number(data.animate.playTime);
        var triggerEvent = data.animate.type.charAt(data.animate.type.length - 1);
        var mousedownCount = data.Demo.attr('mousedownCount');
        var arrayposj = parseInt(data.Demo.attr('arrayposj'));
        if (triggerEvent === '1' && mousedownCount === '1') {
            data.Demo.attr('mousedownCount', '0');
            if (arrayposj >= animation_list[i].length)
                return;
            data.Demo.attr('arrayposj', arrayposj + 1);
            var dataDown = animation_list[i][arrayposj];
            var mobileDelay = parseFloat(dataDown.animate.playDelay);
            Animation(dataDown.Demo, dataDown, dataDown.animate.type, dataDown.animate.effect, dataDown.animate.direction, dataDown.animate.playDelay, dataDown.animate.playTime);
            playAnimation(i + 1, timei);
        }
        else if (triggerEvent === '2') {
            var mobileDelay = parseFloat(data.animate.playDelay);
            //是否和第一个动画同时加载(不计入动画延迟)
            if (i === nLastSynWithFirstAni + 1) {
                if (data.animate.playTime < 2.0 && ismobile === true && nLastSynWithFirstAni === 0) {
                    data.animate.playTime = 2.0;
                }
                mobileDelay += firstAnimationDelay;
                nLastSynWithFirstAni += 1;
            }
            Animation(data.Demo, data, data.animate.type, data.animate.effect, data.animate.direction, mobileDelay, data.animate.playTime);
            playAnimation(i + 1, timei);
        }
        else if (triggerEvent === '3') {
            //在上一动画之后开始
            setTimeout(function () {
                Animation(data.Demo, data, data.animate.type, data.animate.effect, data.animate.direction, data.animate.playDelay, data.animate.playTime);
                var timei = Number(data.animate.playDelay) + Number(data.animate.playTime);
                playAnimation(i + 1, timei, nLastSynWithFirstAni);
            }, waitTime * timePlus + 20); //给连续两个动画之间增加20/1000秒时间,用于缓冲(animate和setTimeout可能时间上有轻微差异)
        }
    }

    playAnimation(nFirstNonPageLoadAni, waitTime, nLastSynWithFirstAni);

    $("div[title='PopupContent']").each(function () {
        var jsonnode = $(this).children('input')[0];
        var jsonStr = jsonnode.value;
        var data = eval('(' + jsonStr + ')');

        //show the first image in the all popupcontents
        if (data.displayFirstImage !== "true")
            return;
        var div0 = $(this).children().eq(0);
        var div0Anis = div0.find("div[title='Animation']");
        for (var i = 0; i < div0Anis.length; i++) {
            var div0Ani = div0.find("div[title='Animation']").eq(i);
            div0Ani.children().css("opacity", '1.0');
        }
    });
}