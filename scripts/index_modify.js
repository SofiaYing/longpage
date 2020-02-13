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
            if (jsonData.adjustType !== "longPageAdjust") {
                //swiper在loop=true模式下,页面索引会加1
                if (isLoop) index++;
                mySwiper.slideTo(index, 0);
            } else {
                fx.destroy(String(data.currentPage));
                offLongpageObserver(data.currentPage - 1);
                initLongpageObserver(index);
                fx.reset(String(index + 1));

                $('#page' + data.currentPage).css('display', 'none');
                $('#page' + (index + 1)).css('display', 'block');
                // $('#longpage_container').scrollTop(0);
                $('body,html').scrollTop(0);
            }
        } else if (data.act === 'gyroscope') {
            window.deviceOrientation = data.val;
        }
    }

    window.fx = new FXH5(fx_options);

    if (jsonData.adjustType !== "longPageAdjust") {
        fx.reset("0");
        // 实力化一个swiper对象并初始化
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
        window.addEventListener(evt, function() {
            window.sizeAdjustor.update();
            window.sizeAdjustor.adjustContainer();
            var scale = window.sizeAdjustor.scale;
            mySwiper.touchRatio = 1 / scale;
            bgmDiv.style.left = (sizeAdjustor.finalLeft + sizeAdjustor.finalSize.width - 50) + "px";
            var videoItems = window.fx.getItemsByCtrlName("video");
            if (videoItems !== null) {
                videoItems.forEach(function(curItem) {
                    curItem.process();
                })
            }
        });
        var pageIndexSet = parseInt(sessionStorage.getItem("pageIndex")); //从缓存中读取点击超链接时所在页面
        if (!isNaN(pageIndexSet)) {
            mySwiper.slideTo(pageIndexSet, 0, false); //跳转到该页面
            sessionStorage.removeItem('pageIndex'); //删除该缓存，防止刷新时仍跳转到该页
        }　　

        (function() {
            var arrow = document.getElementById("floatArrow");
            if (showSwipIcon) {
                addArrowClickListener(arrow);
                arrow.style.display = "block";
            } else {
                arrow.style.display = "none";
            }
            if (noSwiping) removeSwiping();
            removeAttrInSwiperDuplicate();
        })();
    } else { //如果是长页面
        if (is_ios()) {
            var throttle = function(func, delay) {
                var timer = null;
                var startTime = Date.now();
                return function() {
                    var curTime = Date.now();
                    var remaining = delay - (curTime - startTime);
                    var context = this;
                    var args = arguments;
                    clearTimeout(timer);
                    if (remaining <= 0) {
                        func.apply(context, args);
                        startTime = Date.now();
                    } else {
                        timer = setTimeout(func, remaining);
                    }
                }
            }

            var overscroll = function(el) {
                el.addEventListener('touchstart', throttle(function() {
                    var top = el.scrollTop,
                        totalScroll = el.scrollHeight,
                        currentScroll = top + el.offsetHeight;
                    if (top === 0) {
                        el.scrollTop = 1;
                    } else if (currentScroll === totalScroll) {
                        el.scrollTop = top - 1;
                    }
                }, 1000));
            }
            overscroll(document.querySelector('#longpage_container'));
        }

        var offsetTop = sessionStorage.getItem("offsetTop"); //从缓存中获取点击链接时滚动条所在位置
        if (offsetTop !== null && offsetTop !== 0) {
            $(longpage_container).scrollTop(offsetTop);
            sessionStorage.removeItem('offsetTop');
        }

        var observeOptions = new IntersectionObserver((entries) => {
            entries.forEach((item, index) => {

                var curItem = window.fx.getItemById(item.target.id);
                if (item.intersectionRatio >= 0.75) {
                    curItem.reset()
                } else {
                    curItem.destroy()
                }
            })
        }, {
            threshold: [0.75]
        });
        //给每一页长页面添加视窗监听
        function initLongpageObserver(index) {
            var indexStr = index.toString();
            if (fx_options[indexStr]) {
                fx_options[indexStr].forEach(function(item, optionsIndex) {
                    if (item.plugin !== 'animate' && item.plugin !== 'audio' && item.plugin !== 'jigsaw' && item.plugin !== 'imageDrag') {
                        observeOptions.observe(document.getElementById(item.container));
                    } else {
                        if (item.plugin === 'audio' || item.plugin === 'animate') {
                            var curItem = window.fx.getItemById(item.container);
                            curItem.onObserver();
                        }
                    }
                })
            }
        }

        //首次加载，自动添加第一页视窗监听
        initLongpageObserver(0);

        //解除视窗监听
        function offLongpageObserver(index) {
            var indexStr = index.toString();
            if (typeof(fx_options[indexStr]) !== 'undefined') {
                fx_options[indexStr].forEach(function(item) {
                    if (item.plugin !== 'animate' && item.plugin !== 'audio' && item.plugin !== 'jigsaw' && item.plugin !== 'imageDrag') {
                        observeOptions.unobserve(document.getElementById(item.container));
                    } else {
                        if (item.plugin === 'audio' || item.plugin === 'animate') {
                            var curItem = window.fx.getItemById(item.container);
                            curItem.offObserver();
                        }
                    }
                })
            }
        }
    }
};

(function(global, undefined) {
    if (is_weixin()) {
        if (top === global) {
            var bgmAudio, audio, isReady = false;
            var playAudioFlag = false;
            document.addEventListener("WeixinJSBridgeReady", function() {
                bgmAudio = document.getElementById("aubgm");
                audio = document.getElementById("au1");
                bgmAudio.load();
                audio.load();
                var videoItems = document.querySelectorAll("video[data-autoplay='true']");
                videoItems.forEach(function(curItem) {
                    curItem.load();
                });
                isReady = true;
            }, false);
            global.isReady = function() {
                var timer = setInterval(function() {
                    if (isReady) {
                        clearInterval(timer);
                        return true;
                    }
                }, 100);
            }
            global.playAgentAudio = function(localAudio) {
                playAudioFlag = true;
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
                playAudioFlag = false;
            }
            global.isAgentAudioEnded = function(localAudio) {
                if (playAudioFlag) {
                    var timer = setInterval(function() {
                        if (isReady) {
                            clearInterval(timer);
                            playAudioFlag = false;
                            return localAudio ? audio.ended || audio.paused : true;
                        }
                    }, 100);
                } else {
                    return localAudio ? audio.ended || audio.paused : true;
                }
            }
            global.playBgmAudio = function(bgmAudio) {
                if (!isReady) {
                    var count = 0;
                    var timer = setInterval(function() {
                        if (isReady) {
                            clearInterval(timer);
                            if (count < 100) bgmAudio.play();
                        }
                        count++;
                    }, 100);
                } else {
                    bgmAudio.play();
                }
                return true;
            }
            global.pauseBgmAudio = function(bgmAudio, delay) {
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