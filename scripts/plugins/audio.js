(function() {
    FX.plugins["audio"] = (function(id, option) {
        var Audio = function(id) {
            this.$target = $("#" + id);
            this.init(id, option);
        };

        FX.utils.inherit(FXInterface, Audio);

        Audio.prototype.init = function() {
            console.log("init");
            var demo = $("#" + id)[0];
            demo.preload = "auto";
            AddListenerAudio(demo, this);
        };

        Audio.prototype.reset = function(option) {
            console.log("reset");
            //判断是否为长页面
            var isLongPage = window.sizeAdjustor.jsonData.adjustType === "longPageAdjust"

            var demo = this.$target[0];
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
            this.data = data;
            if (isLongPage) {
                observeAudioAutoPlay.observe($(demo).parent()[0])
            } else if (data.playOnPageTurn === "true" && isHasSpecParents.length === 0) {
                function autoPlay() {
                    var playRes = window.playAgentAudio(demo);
                    if (!playRes) return;
                    child0.style.display = 'none';
                    child1.style.display = 'inline';
                }
                setTimeout(autoPlay, data.playDelay * 1000);
            }

        };

        Audio.prototype.destroy = function(option) {
            console.log("destroy");
            var demo = this.$target[0];
            var data = dataProcess(demo)
            var isHasSpecParents = parents("div[title='PopupContent'][title='Animation']", demo);
            if (isHasSpecParents.length === 0 && data.playOnPageTurn === "true") {
                window.pauseAgentAudio(demo);
            } else {
                demo.pause();
            }
            demo.currentTime = 0;
        };

        return new Audio(id);
    });

    function AddListenerAudio(demo, Audio) {
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

        //bindEvent(pardiv, 'vmousedown', PreventDefault);
        //bindEvent(pardiv, 'vmouseup', parentClickEvent);
        bindEvent(pardiv, 'vpointerdown', childClickEvent);

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
    }

    function childClickEvent(event) {
        PreventDefault(event);

        var pardiv = event.target.parentNode;

        var child0 = GetChild('', pardiv, 0);
        var child1 = GetChild('', pardiv, 1);
        var demo = GetChild('', pardiv, 2);
        var jsonnode = GetChild('input', pardiv, 0);
        var isHasSpecParents = parents("div[title='PopupContent'][title='Animation']", demo);

        //超链接的音频没有input节点
        if (jsonnode === undefined) {
            return;
        }

        var data = eval('(' + jsonnode.value + ')');

        if (child0.style.display === 'inline') {
            if (isHasSpecParents.length === 0 && data.playOnPageTurn === "true") {
                var playRes = window.playAgentAudio(demo);
                if (!playRes) return;
            } else {
                demo.play();
                if (demo.paused) return;
            }

            child0.style.display = 'none';
            child1.style.display = 'inline';
        } else {
            child0.style.display = 'inline';
            child1.style.display = 'none';
            if (isHasSpecParents.length === 0 && data.playOnPageTurn === "true") {
                window.pauseAgentAudio(demo);
            } else {
                demo.pause();
            }

        }
    }

    var observeAudioAutoPlay = new IntersectionObserver((entries) => {
        entries.forEach((item, index) => {
            var demo = $(item.target).children('audio')[0]

            var data = dataProcess(demo)
            var child0 = GetChild('', item.target, 0);
            var child1 = GetChild('', item.target, 1);
            var isHasSpecParents = parents("div[title='PopupContent'][title='Animation']", demo);

            if (item.isIntersecting) {
                if (data.playOnPageTurn === "true" && isHasSpecParents.length === 0) {
                    // function autoPlay() {
                    var playRes = window.playAgentAudio(demo);
                    if (!playRes) return;
                    child0.style.display = 'none';
                    child1.style.display = 'inline';
                    // }
                    // if (data.playDelay > 0) {
                    //     setTimeout(autoPlay, data.playDelay);
                    // } else {
                    //     autoPlay()
                    // }
                }
            } else {
                window.pauseAgentAudio(demo);
                // 下一次重新开始播放
                demo.currentTime = 0;
                child0.style.display = 'inline';
                child1.style.display = 'none';
            }
        })
    });

    function dataProcess(node) {
        var inputNode = $(node).parent().children('input')
        var value = JSON.parse(inputNode[0].value)
        return value
    }

})();