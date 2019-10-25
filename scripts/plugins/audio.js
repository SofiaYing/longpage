(function() {
    FX.plugins["audio"] = (function(id, option) {
        var isLongPage = window.sizeAdjustor.jsonData.adjustType === "longPageAdjust";
        var endTimer = null;

        var Audio = function(id) {
            this.needGoOnBgm = false;
            this.needControlBgm = false;
            this.$target = $("#" + id);
            this.init(id, option);
        };

        FX.utils.inherit(FXInterface, Audio);

        Audio.prototype.init = function() {
            var demo = $("#" + id)[0];
            var self = this;
            //判断是否为长页面
            demo.preload = "auto";
            this.AddListenerAudio(demo, this);

            var data = dataProcess(demo);
            this.needControlBgm = data.muteBGM;

            if (isLongPage) {
                var observeAudioAutoPlay = new IntersectionObserver((entries) => {
                    entries.forEach((item, index) => {
                        var demo = $(item.target).children('audio')[0];
                        var data = dataProcess(demo);
                        if (item.isIntersecting) {
                            if (data.playOnPageTurn === 'true') {
                                self.playAudio(data, demo);
                            }
                        } else {
                            self.pauseAudio(data, demo);
                        }
                    })
                });

                observeAudioAutoPlay.observe($(demo).parent()[0]);
            }
        };

        Audio.prototype.reset = function(option) {

            var demo = this.$target[0];
            var pardiv = demo.parentNode;
            var jsonnode = GetChild('input', pardiv, 0);

            //超链接的音频没有input节点
            if (jsonnode === undefined) {
                return;
            }
            var data = eval('(' + jsonnode.value + ')');
            this.data = data;
            if (data.playOnPageTurn === 'true') {
                this.playAudio(data, demo);
            }

        };

        Audio.prototype.destroy = function(option) {
            if (endTimer) {
                clearInterval(endTimer);
            }

            var demo = this.$target[0];
            var data = dataProcess(demo);
            this.pauseAudio(data, demo);
        };

        Audio.prototype.playAudio = function(data, demo) {
            var self = this;
            var child0 = $(demo).siblings('img')[0];
            var child1 = $(demo).siblings('img')[1];
            // var isHasSpecParents = parents("div[title='PopupContent'][title='Animation']", demo);
            var isHasSpecParents = parents("div[title='PopupContent']", demo);

            if (isHasSpecParents.length === 0) {
                function autoPlay() {
                    var playRes = window.playAgentAudio(demo);
                    if (!playRes) return;
                    child0.style.display = 'none';
                    child1.style.display = 'inline';

                    if (self.needControlBgm) {
                        self.pauseBgm();
                    }

                    if (!data.loop) {
                        if (endTimer) {
                            clearInterval(endTimer);
                        }
                        endTimer = setInterval(function() {
                            if (window.isAgentAudioEnded(demo)) {
                                clearInterval(endTimer);
                                if (child0.style.display !== 'inline') {
                                    child0.style.display = 'inline';
                                    child1.style.display = 'none';
                                }
                                self.playBgm(demo);
                            }
                        }, 100)
                    }
                }

                data.playDelay === 0 ? autoPlay() : setTimeout(autoPlay, data.playDelay * 1000);
            }
        }

        Audio.prototype.pauseAudio = function(data, demo) {
            var child0 = $(demo).siblings('img')[0];
            var child1 = $(demo).siblings('img')[1];
            // var isHasSpecParents = parents("div[title='PopupContent'][title='Animation']", demo);
            var isHasSpecParents = parents("div[title='PopupContent']", demo);

            if (isHasSpecParents.length === 0 && data.playOnPageTurn === "true") {
                window.pauseAgentAudio(demo);
            } else {
                demo.pause();
            }

            if (this.needGoOnBgm) {
                this.playBgm();
            }
            // 下一次重新开始播放
            demo.currentTime = 0;
            child0.style.display = 'inline';
            child1.style.display = 'none';
        }

        Audio.prototype.pauseBgm = function() {
            if (window.bgmController && window.bgmController.bgmState) {
                this.needGoOnBgm = true;
                window.bgmController.pauseBgm();
            } else { this.needGoOnBgm = false; }
        }

        Audio.prototype.playBgm = function() {
            if (this.needControlBgm && this.needGoOnBgm) {
                window.bgmController.playBgm();
            }
        }

        Audio.prototype.AddListenerAudio = function(demo, Audio) {
            var self = this;
            var pardiv = demo.parentNode;
            var child0 = GetChild('', pardiv, 0);
            var child1 = GetChild('', pardiv, 1);
            var jsonnode = GetChild('input', pardiv, 0);

            //超链接的音频没有input节点
            if (jsonnode === undefined) {
                return;
            }

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

            function childClickEvent(event) {
                PreventDefault(event);

                var pardiv = event.target.parentNode;

                var child0 = GetChild('', pardiv, 0);
                var child1 = GetChild('', pardiv, 1);
                var demo = GetChild('', pardiv, 2);
                var jsonnode = GetChild('input', pardiv, 0);
                // var isHasSpecParents = parents("div[title='PopupContent'][title='Animation']", demo);
                var isHasSpecParents = parents("div[title='PopupContent']", demo);

                //超链接的音频没有input节点
                if (jsonnode === undefined) {
                    return;
                }

                var data = eval('(' + jsonnode.value + ')');

                if (child0.style.display === 'inline') {
                    child0.style.display = 'none';
                    child1.style.display = 'inline';
                    if (isHasSpecParents.length === 0) {
                        var playRes = window.playAgentAudio(demo);

                        if (!playRes) return;
                    } else {
                        demo.play();
                        if (demo.paused) return;
                    }

                    if (self.needControlBgm) {
                        self.pauseBgm();
                    }

                    if (!data.loop) {
                        if (endTimer) {
                            clearInterval(endTimer);
                        }
                        endTimer = setInterval(function() {
                            if (isAgentAudioEnded(demo)) {
                                clearInterval(endTimer);
                                if (child0.style.display !== 'inline') {
                                    child0.style.display = 'inline';
                                    child1.style.display = 'none';
                                }
                                self.playBgm(demo);
                            }
                        }, 100)
                    }


                } else {
                    child0.style.display = 'inline';
                    child1.style.display = 'none';
                    if (isHasSpecParents.length === 0) {
                        window.pauseAgentAudio(demo);
                    } else {
                        demo.pause();
                    }

                    if (self.needControlBgm && self.needGoOnBgm) {
                        window.bgmController.playBgm();
                    }
                }
            }
        }

        function dataProcess(node) {
            var inputNode = $(node).parent().children('input');
            var value = JSON.parse(inputNode[0].value);
            return value;
        }

        return new Audio(id);
    });

})();