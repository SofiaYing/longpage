
function InitAudio() {
    var arr = document.getElementsByTagName("audio");
    for (var i = 0; i < arr.length; i++) {
        AddListenerAudio(arr[i]);
    }
}

function AddListenerAudio(demo) {
    var pardiv = demo.parentNode;
    var child0 = GetChild('', pardiv, 0);
    var child1 = GetChild('', pardiv, 1);
    var jsonnode = GetChild('input', pardiv, 0);
    var isHasSpecParents = parents("div[title='PopupContent'][title='Animation']", demo);

    //超链接的音频没有input节点
    if (jsonnode === undefined) {        
        return;
    }
    var data = eval('(' + jsonnode.value + ')');

    bindEvent(pardiv, 'vmousedown', PreventDefault);

    function parentUpEvent(e) {
        PreventDefault(e);
        if (child0.style.display === 'inline') {
            child0.style.display = 'none';
            child1.style.display = 'inline';
            if (data.playOnPageTurn === "true" && isHasSpecParents.length === 0 && is_weixin() === true)
            {
                try {
                    parent.playAudio();
                }
                catch (e) {
                    demo.play();
                }
            }
            else {
                demo.play();
            }
        }
        else {
            child0.style.display = 'inline';
            child1.style.display = 'none';
            if (data.playOnPageTurn === "true" && isHasSpecParents.length === 0 && is_weixin() === true)
            {
                try {
                    parent.pauseAudio();
                }
                catch (e) {
                    demo.pause();
                }
            }
            else {
                demo.pause();
            }
        }
    }
    bindEvent(pardiv, 'vmouseup', parentUpEvent);

    function audioEndedEvent(e) {
        if (child0.style.display !== 'inline') {
            child0.style.display = 'inline';
            child1.style.display = 'none';
        }
    }
    bindEvent(demo, 'ended', audioEndedEvent);

    bindEvent(child0, 'vmousedown', PreventDefault);
    bindEvent(child0, 'vmouseup', PreventDefault);
    bindEvent(child1, 'vmousedown', PreventDefault);
    bindEvent(child1, 'vmouseup', PreventDefault);

    if (data.playOnPageTurn === "true" && isHasSpecParents.length === 0) {
        function autoPlay() {
            child0.style.display = 'none';
            child1.style.display = 'inline';
            if (is_weixin() === true) {
                try {
                    parent.autoPlayAudio(demo.src, data.loop);
                }
                catch (e) {
                    demo.play();
                }
            }
            else {
                demo.play();
            }
        }
        setTimeout(autoPlay, data.playDelay*1000);
    }
}
