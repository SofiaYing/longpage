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
            if (data.playOnPageTurn === "true" && isHasSpecParents.length === 0) {
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
            var isHasSpecParents = parents("div[title='PopupContent'][title='Animation']", demo);
            if (isHasSpecParents.length === 0 && this.data.playOnPageTurn === "true") {
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

        //var pardiv = demo.parentNode;
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
                console.log(1)
                    // observeAudioAutoPlay.observe(demo)
                var playRes = window.playAgentAudio(demo);
                if (!playRes) return;
            } else {
                demo.play();
                console.log('demo', demo, demo.paused)
                if (demo.paused) return;
            }

            child0.style.display = 'none';
            child1.style.display = 'inline';
        } else {
            console.log(2)
            child0.style.display = 'inline';
            child1.style.display = 'none';
            if (isHasSpecParents.length === 0 && data.playOnPageTurn === "true") {
                console.log(3)
                window.pauseAgentAudio(demo);
            } else {
                console.log(4)
                demo.pause();
            }

        }
    }

    var observeAudioAutoPlay = new IntersectionObserver((entries) => {
        entries.forEach((item, index) => {
            if (item.isIntersecting) {
                var playRes = window.playAgentAudio(demo);
            }
        })
    });


})();