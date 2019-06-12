function addArrowClickListener(arrow) {
    arrow.addEventListener("click", function() {
        mySwiper.slideNext();
    }, false);
}

function removeAttrInSwiperDuplicate() {
    $(".swiper-slide-duplicate").find("*[id], *[name], *[title]").removeAttr("id").removeAttr("name").removeAttr("title");
}

function removeSwiping() {
    var slides = mySwiper.slides;
    slides = Array.prototype.slice.call(slides);
    slides.forEach(function(el) {
        el.classList.add("swiper-no-swiping");
    });
}

var observeOptions = new IntersectionObserver((entries) => {
    entries.forEach((item, index) => {

        var node = fx_options[0].find(function(optItem) {
            return optItem.container === item.target.id
        })
        var tempOpt = { 'view': [node] }
        var viewFx = new FXH5(tempOpt);
        console.log('item.target', node)
        if (item.intersectionRatio == 1) {

            viewFx.reset("view");
        } else {
            viewFx.destroy('view')
        }
    })
}, {
    threshold: [1]
});

window.onloadOver = function() {
    window.sizeAdjustor.adjustContainer();
    var scale = window.sizeAdjustor.scaleX;
    var bgmDiv = document.getElementById("divbgm");
    bgmDiv.style.left = (sizeAdjustor.finalLeft + sizeAdjustor.finalSize.width - 50) + "px";

    var jsonData = sizeAdjustor.jsonData;
    var isLoop = jsonData.pageturning[0].pagecircle === "true";
    var direction = jsonData.pageturning[0].pagedir === "UpAndDown" ? "vertical" : "horizontal";
    var effectName = jsonData.pageturning[0].pageresult;
    var speed = parseInt(jsonData.pageturning[0].pagetime);
    var noSwiping = jsonData.pageturning[0].pagenoslide === "true";
    var showSwipIcon = jsonData.pageturning[0].pageicon === "true";
    window.dataController = new DataController(jsonData);
    window.bgmController = new BGMController(jsonData.bgmarea, jsonData.bgmhideicon);
    bgmController.controlAutoBgm(0, undefined);
    var effects = {
        "Traslation": "slide",
        "Fad": "fade",
        "CoverFlow": "coverflow",
        "Overturn": "flip",
        "3DTurn": "cube"
    };

    window.onmessage = function(event) {
            var data = eval('(' + event.data + ')');
            if (data.act === 'slidto') {
                var index = parseInt(data.val);
                //swiper在loop=true模式下,页面索引会加1
                if (isLoop) index++;
                mySwiper.slideTo(index, 0);
            } else {
                window.wxuserid = data.val;
            }
        }
        //实例化一个FXH5对象并对第一页reset
    window.fx = new FXH5(fx_options);
    fx.reset("0");
    if (jsonData.adjustType !== "longPageAdjust") {
        fx.reset("0");
        //实力化一个swiper对象并初始化
        window.mySwiper = new Swiper('.swiper-container', {
            effect: effects[effectName] ? effects[effectName] : "slide",
            direction: direction,
            speed: speed,
            loop: isLoop,
            touchRatio: 1 / scale,
        });
        mySwiper.isLoop = isLoop;
        mySwiper.realLength = mySwiper.isLoop ? mySwiper.slides.length - 2 : mySwiper.slides.length;
        mySwiper.preRealIndex = 0;
        mySwiper.on("transitionEnd", function() {
            var self = this;
            //当循环模式下页面到达最后复制的循环页，跳转到真实第一页
            if (self.isLoop && self.activeIndex === self.realLength + 1) {
                self.slideTo(1, 0);
                return;
            }
            //当循环模式下页面到达第一个复制的循环页，跳转到真实最后一页
            else if (self.isLoop && self.activeIndex === 0) {
                self.slideTo(self.realLength, 0);
                return;
            }
        });

        mySwiper.on("slideChange", function() {
            var self = this;
            if (self.isLoop && (self.activeIndex === 0 || self.activeIndex === self.realLength + 1)) return;
            bgmController.controlAutoBgm(self.realIndex, self.preRealIndex);
            fx.destroy(String(self.preRealIndex));
            fx.reset(String(self.realIndex));
            self.preRealIndex = self.realIndex;
        }, false);
        var evt = "resize";
        var isWeixin = is_weixin();
        window.addEventListener(evt, function() {
            window.sizeAdjustor.update();
            //alert(sizeAdjustor.clientW + "&&" + sizeAdjustor.clientH);
            window.sizeAdjustor.adjustContainer();
            var scale = window.sizeAdjustor.scale;
            mySwiper.touchRatio = 1 / scale;
            var videoItems = window.fx.getItemsByCtrlName("video");
            if (videoItems !== null) {
                videoItems.forEach(function(curItem) {
                    curItem.process();
                })
            }
        });

        (function() {
            var arrow = document.getElementById("floatArrow");
            if (showSwipIcon) addArrowClickListener(arrow);
            else {
                arrow.style.display = "none";
            }
            if (noSwiping) removeSwiping();
            removeAttrInSwiperDuplicate();
        })();
    } else {
        fx_options['0'].forEach(function(item, index) {
            if (item.plugin !== 'animate') {
                observeOptions.observe(document.getElementById(item.container))
            }
        })

    }

};


(function(global, undefined) {
    if (is_weixin()) {
        if (top === global) {
            var bgmAudio, audio, isReady = false;
            document.addEventListener("WeixinJSBridgeReady", function() {
                bgmAudio = document.getElementById("aubgm");
                audio = document.getElementById("au1");
                bgmAudio.load();
                audio.load();
                isReady = true;
            }, false);
            global.playAgentAudio = function(localAudio) {
                var count = 0;
                var timer = setInterval(function() {
                    if (isReady) {
                        clearInterval(timer);
                        audio.src = localAudio.src;
                        audio.loop = localAudio.loop;
                        if (count < 100) audio.play();
                    }
                    count++;
                }, 100);
                return true;
            }
            global.pauseAgentAudio = function(localAudio) {
                audio.pause();
            }
            global.isAgentAudioEnded = function(localAudio) {
                return localAudio ? audio.ended || audio.paused : true;
            }
            global.playBgmAudio = function(bgmAudio) {
                var count = 0;
                var timer = setInterval(function() {
                    if (isReady) {
                        clearInterval(timer);
                        if (count < 100) bgmAudio.play();
                    }
                    count++;
                }, 100);
                return true;
            }
            global.pauseBgmAudio = function(bgmAudio) {
                bgmAudio.pause();
            }

        } else {
            global.playAgentAudio = function(localAudio) {
                global.agentAudioEnded = false;
                doExecBgAudio("au1", "play", localAudio.src, localAudio.loop);
                return true;
            }
            global.pauseAgentAudio = function(localAudio) {
                doExecBgAudio("au1", "pause", localAudio.src, localAudio.loop);
            }
            global.isAgentAudioEnded = function(localAudio) {
                return localAudio ? global.agentAudioEnded : true;
            }
            global.playBgmAudio = function(bgmAudio) {
                global.bgmAudioEnded = false;
                doExecBgAudio("aubgm", "play", bgmAudio.src, bgmAudio.loop);
                return true;
            }
            global.pauseBgmAudio = function(bgmAudio) {
                doExecBgAudio("aubgm", "pause", bgmAudio.src, bgmAudio.loop);
            }
        }
    } else {
        global.playAgentAudio = function(localAudio) {
            localAudio.play();
            return !localAudio.paused;
        }
        global.pauseAgentAudio = function(localAudio) {
            localAudio.pause();
        }
        global.isAgentAudioEnded = function(localAudio) {
            return localAudio ? localAudio.ended || localAudio.paused : true;
        }
        global.playBgmAudio = function(bgmAudio) {
            bgmAudio.play();
            return !bgmAudio.paused;
        }
        global.pauseBgmAudio = function(bgmAudio) {
            bgmAudio.pause();
        }
    }

    /* 跨域执行 */
    var exec_frame = null;
    var exec_frame_loaded = true;
    /*
     * @param element audio元素id
     * @param operate -play 播放  -pause 暂停
     * @param src 音乐资源路径
     * @param loop  是否重复
     */
    function doExecBgAudio(element, operate, src, loop) {
        if (!exec_frame_loaded) {
            setTimeout(function() {
                console.log("loading.....");
                doExecBgAudio(element, operate, src, loop);
            }, 100);
            return;
        } else {
            src = encodeURIComponent(src);
            var param = "element=" + element + "&operate=" + operate + "&src=" + src + "&loop=" + loop;
            console.log("param===" + param);
            console.log("now time == " + new Date().getTime() + "  isloaded == " + exec_frame_loaded);
            var aimsrc = document.referrer.substring(0, document.referrer.lastIndexOf("/") + 1) + "crossDomainPage?";
            aimsrc += param;
            exec_frame = document.getElementById("exec_frame");
            if (exec_frame == null) {
                exec_frame = document.createElement('iframe');
                exec_frame.id = 'exec_frame';
                exec_frame.style.display = 'none';
                document.body.appendChild(exec_frame);
            }
            exec_frame_loaded = false;
            if (exec_frame.attachEvent) {
                exec_frame.attachEvent("onload", function() {
                    //iframe加载完成后你需要进行的操作    
                    exec_frame_loaded = true;
                    console.log("exec frame loaded!  src == " + exec_frame.src);
                });
            } else {
                exec_frame.onload = function() {
                    //iframe加载完成后你需要进行的操作    
                    exec_frame_loaded = true;
                    console.log("exec frame loaded!  src == " + exec_frame.src);
                };
                exec_frame.src = aimsrc;
            }
        }
    }
})(this);