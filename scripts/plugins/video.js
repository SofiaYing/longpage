(function(global) {
    function Video(id) {
        this.el = document.getElementById(id);
        this.video = this.el.querySelector("video");
        this.imgplay = this.el.querySelectorAll("img");
        this.isFirstAutoPlay = false; //判断当前的播放是否属于开始时候的自动播放
        this.option = this.getOption();
        this.needGoOnBgm = false; //来表示切换视频从播放到暂停状态时，背景音乐是否要开启
        this.init();
        this.addListener();
    }

    Video.prototype.getOption = function() {
        var self = this;
        var jsonstr = self.el.querySelector("input[name=json]").value;
        var jsondata = eval("(" + jsonstr + ")");
        if (self.video === null) {
            self.iframe = this.el.querySelector("iframe");
            return;
        }
        return {
            autoPlay: jsondata.playOnPageTurn === "true",
            showControls: self.video.controls,
            floatingWin: jsondata.floatingWin === "true",
            playDelay: jsondata.playDelay,
        };
    }

    Video.prototype.init = function() {
        var self = this;
        self.process();
    }

    Video.prototype.process = function() {
        var self = this;
        if (self.video === null) {
            if (self.iframe !== null) {
                self.iframe.style.width = '100%';
                self.iframe.style.height = '100%';
            }
            return;
        }
        if (self.option.floatingWin === false) {
            self.video.setAttribute("webkit-playsinline", "");
            self.video.setAttribute("playsinline", "");
        }
        if (is_mobile()) {
            var u = navigator.userAgent;
            if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
                //安卓手机
                var scaleX = global.sizeAdjustor.scaleX,
                    scaleY = global.sizeAdjustor.scaleY;
                self.video.style.width = String(scaleX * 100) + "%";
                self.video.style.height = String(scaleY * 100) + "%";
                self.video.style.cssText += "; transform-origin: left top; transform: scale(" + (1 / scaleX) + "," + (1 / scaleY) + ");";
            } else if (u.indexOf('iPad') > -1 || u.indexOf('iPhone') > -1) {
                //ipad
                var scaleX = global.sizeAdjustor.scaleX,
                    scaleY = global.sizeAdjustor.scaleY;
                self.video.style.width = String(scaleX * 100) + "%";
                self.video.style.height = String(scaleY * 100) + "%";
                self.video.style.cssText += "; transform-origin: left top; transform: scale(" + (1 / scaleX) + "," + (1 / scaleY) + ");";
            }

        }
    }

    Video.prototype.reset = function() {
        var self = this;
        if (self.video === null) {
            return;
        }
        self.video.style.display = "block";
        var isHasSpecParents = parents("div[title='PopupContent'][title='Animation']", self.el);
        if (self.option.autoPlay && isHasSpecParents.length === 0) {
            self.isFirstAutoPlay = true;
            if(is_android()) {
                setTimeout(function() {
                    self.playWithBgm();
                }, 160);
                setTimeout(function() {
                    self.pauseWithBgm();
                }, 320);
                setTimeout(function() {
                    self.playWithBgm();
                }, 480 + self.option.playDelay*1000);

            }
            else{
                setTimeout(function() {
                    self.playWithBgm();
                }, 160 + self.option.playDelay*1000);
            }
        }

        var n = self.imgplay.length - 1;
        if (n >= 0 && !self.video.controls) {
            setTimeout(function() {
                self.imgplay[n].style.display = self.video.paused === true ? "block" : "none";
            }, 170 + self.option.playDelay*1000);
        }
    }

    Video.prototype.destroy = function() {
        var self = this;
        if (self.video === null) {
            if (self.iframe !== null) {
                self.iframe.src = self.iframe.src;
            }
            return;
        }
        self.video.pause();
        self.video.currentTime = 0;
        //修复视频在部分安卓设备打开视频再关闭后，视频框架脱离文档流，不随页面滚动而滚动问题
        self.video.style.display = "none";
    }

    Video.prototype.pauseWithBgm = function(pauseVideo) {
        var self = this;
        if (self.video === null)
            return;
        if (pauseVideo === undefined) var pauseVideo = true;
        if (pauseVideo) self.video.pause();
        if (self.needGoOnBgm) {
            global.bgmController.playBgm();
        }
    }

    Video.prototype.playWithBgm = function(playVideo) {
        var self = this;
        if (self.video === null)
            return;
        if (playVideo === undefined) var playVideo = true;
        if (playVideo) self.video.play();
        if (global.bgmController && global.bgmController.bgmState) {
            self.needGoOnBgm = true;
            global.bgmController.pauseBgm();
        } else self.needGoOnBgm = false;
    }

    Video.prototype.addListener = function() {
        var self = this;
        if (self.video === null)
            return;
        var n = self.imgplay.length - 1;

        self.video.addEventListener("play", function(e) {
            e.preventDefault();
            if (self.isFirstAutoPlay) {
                self.isFirstAutoPlay = false;
                return;
            }
            if (n > 0 && !self.video.controls) self.imgplay[n].style.display = "none";
            self.playWithBgm(false);
        }, false);

        self.video.addEventListener("pause", function(e) {
            e.preventDefault();
            if (n > 0 && !self.video.controls) self.imgplay[n].style.display = "block";
            self.pauseWithBgm(false);
        }, false);
        if (!self.video.controls) {
            self.el.addEventListener("click", function(e) {
                e.preventDefault();
                if (self.video.paused) {
                    self.video.play();
                } else {
                    self.video.pause();
                }
            }, false);
        }
    }

    //按钮控制动态组件
    Video.prototype.controlDynamicObject = function(control) {
        if (control === 'play') {
            this.video.play();
        } else if (control === 'pause') {
            this.video.pause();
        } else if (control === 'stop') {
            this.video.currentTime = 0;
            this.video.pause();
        }
    }

    global.FX.plugins["video"] = function(id, option) {
        return new Video(id, option);
    }

})(this);