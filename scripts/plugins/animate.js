(function() {
    FX.plugins["animate"] = (function(id, option) {
        var timerObject = {};
        var clickAnimationArray = []; //缓存单击动画列表 -1
        var autoAnimationArray = []; //缓存自动载入页面动画列表 -0
        var animationEndObject = {}; //缓存所有动画元素的动画结束状态
        var clickAnimationEndObject = {}; //缓存单击动画元素的动画结束状态
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        var Animate = function(id, option) {
            this.$target = $("#" + id);
            this.pageObj = this.getAnimations();
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, Animate);

        //组件初始化
        Animate.prototype.init = function(id, option) {
            var page = this.$target.parents(".divshow");
            var aniInPage = page.find("div[title='Animation']");
            var firstAniInPage = aniInPage.eq(0);
            var firstAniId = firstAniInPage.attr("id");
            if (firstAniId !== id)
                return;

            clickAnimationArray = this.pageObj.clickAnimationArray;
            autoAnimationArray = this.pageObj.autoAnimationArray;

            $.each(aniInPage, function(index, demo) {
                if ($(demo).parents("div[title='PopupContent']").length === 0) {

                    var dataInput = $(demo).children('input');
                    var animationDiv = $(demo).children('div');
                    var valueTemp = JSON.parse(dataInput[0].value);
                    var animations = valueTemp.states[0].animations;
                    var animationId = demo.id;

                    animationEndObject[animationId] = true;

                    $.each(animations, function(index, item) {
                        var autoAnimationCount = 0;
                        var clickAnimationCount = 0;

                        if (item.event === 'auto' && autoAnimationCount === 0) {
                            //载入页面动画 绑定视窗监听事件
                            intersectionObserverAutoAnimation.observe(animationDiv[0]);
                            autoAnimationCount += 1;
                        } else if (item.event === 'click' && clickAnimationCount === 0) {
                            clickAnimationEndObject[animationId] = true;
                            intersectionObserverClickAnimation.observe(animationDiv[0]);
                            clickAnimationCount += 1;
                        }
                    })
                }
            })


            if (clickAnimationArray.length > 0) {
                $(this.$target.parents(".divshow")).on('click', function() {
                    var clickIndex = clickAnimationArray.findIndex(function(item) {
                        return !item.isClick && item.isInView;
                    })

                    if (clickIndex > -1) {
                        var node = clickAnimationArray[clickIndex].node;
                        var animationId = clickAnimationArray[clickIndex].id;
                        var value = clickAnimationArray[clickIndex].animations;

                        clickAnimationArray[clickIndex].isClick = true;
                        clickAnimationEndObject[animationId] = false;

                        $(node).attr('class', ''); //此时如打断自动动画，自动动画效果会立即打断，但是自动动画的animationEnd不会再触发

                        stopComplexAnimation(animationId, node);

                        $(node).css({
                            "animatiton-duration": value.playTime + 's',
                            "-webkit-animation-duration": value.playTime + 's',
                            "animation-delay": value.playDelay + 's',
                            "webkit-animation-delay": value.playDelay + 's',
                        })

                        var timer = setInterval(function() { //添加轮询，防止清空class操作还未完成就添加新动画，导致点击动画不触发
                            if (!$(node).attr('class')) {
                                $(node).addClass('animated ' + value.effect).one(animationEnd, function(event) {
                                    event.stopPropagation();
                                    var animationId = $(node).parent().attr('id');

                                    animationEndObject[animationId] = true;

                                    $(node).attr('class', '');

                                    if (value.type.charAt(0) === 't' || value.type.charAt(0) === 's') {
                                        $(node).css({ 'opacity': 1 });
                                    } else if (value.type.charAt(0) === 'f') {
                                        $(node).css({ 'opacity': 0 });
                                    }

                                    //会出画面的动画结束后，不要立刻触发检验是否出画面，会因为异步原因无法获得真实结果
                                    setTimeout(function() {
                                        clickAnimationEndObject[animationId] = true;

                                        if (!clickAnimationArray[clickIndex].isInView) {
                                            clickAnimationArray[clickIndex].isClick = false;

                                            if (value.type.charAt(0) === 't' || value.type.charAt(0) === 's') {
                                                $(node).css({ 'opacity': 0 });
                                            } else if (value.type.charAt(0) === 'f') {
                                                $(node).css({ 'opacity': 1 });
                                            }
                                        }
                                    }, 200)

                                });
                                clearInterval(timer);
                            }
                        }, 1)

                        playComplexAnimation(animationId, node, value.playTime, value.effect);
                    }

                    return false
                })
            }


        };


        //重置数据
        Animate.prototype.reset = function(option) {

        };

        //数据重置
        Animate.prototype.destroy = function() {

        };

        Animate.prototype.popupAnimationsPlay = function(obj) {
            var popPageObj = getPopAnimations(obj);
            //弹出内容 -0 -1动画相同处理


            if (popPageObj.autoAnimationArray.length > 0) {
                $.each(popPageObj.autoAnimationArray, function(index, item) {
                    var animationId = $(item.node).attr('id');

                    if (popPageObj.groupAutoAnimationObj[animationId][2].length > 0) {
                        $.each(popPageObj.groupAutoAnimationObj[animationId][2], function(groupIndex, groupItem) {
                            playAnimation(groupItem);
                        })
                    }

                    if (popPageObj.groupAutoAnimationObj[animationId][3].length > 0) {
                        playAnimation(item, popPageObj.groupAutoAnimationObj[animationId][3], -1);
                    } else {
                        playAnimation(item);
                    }
                })
            }

            if (popPageObj.clickAnimationArray.length > 0) {
                $.each(popPageObj.clickAnimationArray, function(index, item) {
                    var animationId = $(item.node).attr('id');

                    if (popPageObj.groupClickAnimationObj[animationId][2].length > 0) {
                        $.each(popPageObj.groupClickAnimationObj[animationId][2], function(groupIndex, groupItem) {
                            playAnimation(groupItem);
                        })
                    }

                    if (popPageObj.groupClickAnimationObj[animationId][3].length > 0) {
                        playAnimation(item, popPageObj.groupClickAnimationObj[animationId][3], -1);
                    } else {
                        playAnimation(item);
                    }
                })
            }
        };

        Animate.prototype.popupAnimationsStop = function(obj) {
            var aniInPage = $(obj).find("div[title='Animation']");

            $.each(aniInPage, function(index, item) {
                var demo = $(item).children('div')[0];
                var dataInput = $(item).children('input');
                var value = JSON.parse(dataInput[0].value);
                var animations = value.states[0].animations;
                $(demo).attr('class', '');

                $.each(animations, function(animationIndex, animationItem) {
                    if ((animationItem.type.charAt(0) === 't')) {
                        $(demo).css('opacity', 0);
                        return
                    }
                })
            })
        };

        //弹出内容动画组
        function getPopAnimations(obj) {
            var aniInPage = $(obj).find("div[title='Animation']");

            var pageObj = {};
            var lastGroupId; //用于处理2/3类动画组
            var lastGroupNodeId; //用于处理2/3类动画组
            var lastGroupNodeType; //用于处理2/3类动画组
            var originalAnimationArray = [];
            var orderArray = []; //以用户添加顺序排列的动画组
            var clickAnimationArray = []; //维护单击动画列表
            var autoAnimationArray = []; //维护载入动画
            var groupClickAnimationObj = {}; //以单击为标准的2/3类动画组
            var groupAutoAnimationObj = {}; //以载入为标准的2/3类动画组  

            $.each(aniInPage, function(index, item) {
                var dataInput = $(item).children('input');
                var valueTemp = JSON.parse(dataInput[0].value);
                var animations = valueTemp.states[0].animations;

                $.each(animations, function(animationIndex, animationItem) {
                    var uidArray = animationItem.uid.split('-')
                    var i = uidArray[0];
                    var gid = uidArray[uidArray.length - 1];
                    var event = animationItem.event;
                    var type = eventToNum(event);
                    var opacity = $(item).children('div').css('opacity');

                    if (originalAnimationArray instanceof Array) {
                        originalAnimationArray.push({ node: item, id: $(item).attr('id'), animations: animationItem, uId: animationItem.uid, order: i, groupId: gid, type: type, opacity: opacity });
                    } else {
                        originalAnimationArray = [{ node: item, id: $(item).attr('id'), animations: animationItem, uId: animationItem.uid, order: i, groupId: gid, type: type, opacity: opacity }];
                    }
                })
            })

            var orderArray = new Array(originalAnimationArray.length); //以用户添加顺序排列的动画组

            $.each(originalAnimationArray, function(originalIndex, originalItem) {
                orderArray[originalItem.order] = originalItem;
            })
            orderArray = orderArray.filter(function(item) {
                return !!item
            })

            $.each(orderArray, function(orderIndex, orderItem) {
                var autoAnimationCount = 0;
                var clickAnimationCount = 0;
                var groupId = orderItem.groupId;
                var type = orderItem.type;

                //创建载入页面/点击播放动画数组
                if (orderIndex === 0 && type !== '1') {
                    autoAnimationArray.push(orderItem);
                    autoAnimationCount += 1;
                }
                if (type === '0' && autoAnimationCount === 0) {
                    autoAnimationArray.push(orderItem);
                    autoAnimationCount += 1;
                } else if (type === '1' && clickAnimationCount === 0) {
                    clickAnimationArray.push(orderItem);
                    clickAnimationCount += 1;
                }

                if (typeof(lastGroupId) === 'undefined') {
                    lastGroupId = groupId;
                    lastGroupNodeId = orderItem.id;
                    type === '1' ? lastGroupNodeType = type : lastGroupNodeType = '0';
                    lastGroupNodeType === '0' ? groupAutoAnimationObj[lastGroupNodeId] = { "2": [], "3": [] } : groupClickAnimationObj[lastGroupNodeId] = { "2": [], "3": [] };
                } else {
                    if (lastGroupId === groupId && type !== '0' && type !== '1') {

                        if (lastGroupNodeType === '0') {
                            groupAutoAnimationObj[lastGroupNodeId] ? groupAutoAnimationObj[lastGroupNodeId][type].push(orderItem) : groupAutoAnimationObj[lastGroupNodeId][type] = [orderItem];
                        } else {
                            groupClickAnimationObj[lastGroupNodeId] ? groupClickAnimationObj[lastGroupNodeId][type].push(orderItem) : groupClickAnimationObj[lastGroupNodeId][type] = [orderItem];
                        }
                    } else {
                        lastGroupNodeId = orderItem.id;
                        lastGroupId = groupId;
                        lastGroupNodeType = type;

                        lastGroupNodeType === '0' ? groupAutoAnimationObj[lastGroupNodeId] = { "2": [], "3": [] } : groupClickAnimationObj[lastGroupNodeId] = { "2": [], "3": [] };
                    }
                }
            })

            pageObj.autoAnimationArray = autoAnimationArray;
            pageObj.clickAnimationArray = clickAnimationArray;
            pageObj.groupClickAnimationObj = groupClickAnimationObj;
            pageObj.groupAutoAnimationObj = groupAutoAnimationObj;
            pageObj.orderArray = orderArray;

            return pageObj;
        };

        Animate.prototype.getAnimations = function(obj, type) {
            if (type !== 'pop') {
                var page = this.$target.parents(".divshow");
                var aniInPage = page.find("div[title='Animation']");
                var firstAniInPage = aniInPage.eq(0);
                var firstAniId = firstAniInPage.attr("id");
                if (firstAniId !== id)
                    return;
            } else {
                var aniInPage = $(obj).find("div[title='Animation']");
            }

            var pageObj = {};
            var originalAnimationArray = [];
            var orderArray = []; //以用户添加顺序排列的动画组
            var clickAnimationArray = []; //维护单击动画列表
            var autoAnimationArray = []; //维护载入动画

            $.each(aniInPage, function(index, item) {
                if ($(item).parents("div[title='PopupContent']").length === 0 || type === 'pop') {

                    var dataInput = $(item).children('input');
                    var valueTemp = JSON.parse(dataInput[0].value);
                    var animations = valueTemp.states[0].animations;

                    $.each(animations, function(animationIndex, animationItem) {
                        var uidArray = animationItem.uid.split('-')
                        var i = uidArray[0];
                        var gid = uidArray[uidArray.length - 1];
                        var event = animationItem.event;
                        var type = eventToNum(event);
                        var opacity = $(item).children('div').css('opacity');
                        var animationDiv = $(item).children('div');

                        if (originalAnimationArray instanceof Array) {
                            originalAnimationArray.push({ node: animationDiv[0], id: $(item).attr('id'), animations: animationItem, uId: animationItem.uid, order: i, groupId: gid, type: type, opacity: opacity, isPlay: false, isClick: false, isInView: false });
                        } else {
                            originalAnimationArray = [{ node: animationDiv[0], id: $(item).attr('id'), animations: animationItem, uId: animationItem.uid, order: i, groupId: gid, type: type, opacity: opacity, isPlay: false, isClick: false, isInView: false }];
                        }
                    })


                }
            })

            if (originalAnimationArray && originalAnimationArray.length > 0) {

                var orderArray = new Array(originalAnimationArray.length); //以用户添加顺序排列的动画组

                $.each(originalAnimationArray, function(originalIndex, originalItem) {
                    orderArray[originalItem.order] = originalItem;
                })
                orderArray = orderArray.filter(function(item) {
                    return !!item
                })

                $.each(orderArray, function(orderIndex, orderItem) {
                    var type = orderItem.type;
                    var groupId = orderItem.groupId;

                    //创建载入页面/点击播放动画数组
                    if (orderIndex === 0 && (type === '2' || type === '3')) {
                        autoAnimationArray.push(orderItem);
                    }
                    if (type === '0') {
                        autoAnimationArray.push(orderItem);
                    } else if (type === '1') {
                        clickAnimationArray.push(orderItem);
                    }
                })
            }

            pageObj.orderArray = orderArray;
            pageObj.autoAnimationArray = autoAnimationArray;
            pageObj.clickAnimationArray = clickAnimationArray;

            return pageObj;
        };

        function playAnimation(dom, playLaterArray, index) {
            var playLaterFlag = false;

            if (playLaterArray && playLaterArray.length > 0) {
                if (index < playLaterArray.length) {
                    playLaterFlag = true;
                } else {
                    return
                }
            }

            var demo = $(dom.node).children('div')[0];
            var value = dom.animations;
            var animationId = dom.id;

            $(demo).css({
                "animatiton-duration": value.playTime + 's',
                "-webkit-animation-duration": value.playTime + 's',
                "animation-delay": value.playDelay + 's',
                "webkit-animation-delay": value.playDelay + 's',
            })

            if (value.type.charAt(0) === 'f' || value.type.charAt(0) === 's') {
                $(demo).css({ 'opacity': 1 });
            }

            $(demo).addClass('animated ' + value.effect).one(animationEnd, function(event) {
                event.stopPropagation();

                $(demo).attr('class', '');

                if (value.type.charAt(0) === 't' || value.type.charAt(0) === 's') {
                    $(demo).css({ 'opacity': 1 });
                } else if (value.type.charAt(0) === 'f') {
                    $(demo).css({ 'opacity': 0 });
                }

                if (playLaterFlag) {
                    playAnimation(playLaterArray[index + 1], playLaterArray, index + 1);
                    playComplexAnimation(animationId, demo, value.playTime, value.effect);
                }
            })

            playComplexAnimation(animationId, demo, value.playTime, value.effect);

        }

        // 监听视窗：进入可视窗口单击可触发动画
        var intersectionObserverClickAnimation = new IntersectionObserver((entries) => {
            entries.forEach((item, index) => {
                var clickIndex = clickAnimationArray.findIndex(function(arrItem) {
                    return arrItem.id === $(item.target).parent('div[title="Animation"]').attr('id');
                })
                if (item.intersectionRatio > 0) {
                    clickAnimationArray[clickIndex].isInView = true;
                } else {
                    clickAnimationArray[clickIndex].isInView = false;

                    var node = clickAnimationArray[clickIndex].node;
                    var animationId = clickAnimationArray[clickIndex].id;

                    var autoIndex = autoAnimationArray.findIndex(function(arrItem) {
                        return arrItem.id === $(item.target).parent('div[title="Animation"]').attr('id');
                    })

                    if (autoIndex > -1) {
                        var value = autoAnimationArray[autoIndex].animations;
                    } else {
                        var value = clickAnimationArray[clickIndex].animations;
                    }

                    if (clickAnimationEndObject[animationId]) {
                        clickAnimationArray[clickIndex].isClick = false;

                        if (value.type.charAt(0) === 't') {
                            $(node).css({ 'opacity': 0 });
                        } else {
                            $(node).css({ 'opacity': 1 });
                        }
                    }
                }
            })
        });


        // 监听视窗:进入可视窗口自动触发动画
        var intersectionObserverAutoAnimation = new IntersectionObserver((entries) => {
            entries.forEach((item) => {
                var autoIndex = autoAnimationArray.findIndex(function(arrItem) {
                    return arrItem.node === item.target;
                })

                var animationId = autoAnimationArray[autoIndex].id;
                var value = autoAnimationArray[autoIndex].animations;

                if (item.intersectionRatio > 0) {
                    if (animationEndObject[animationId] && !autoAnimationArray[autoIndex].isPlay) {
                        if (value.type.charAt(0) === 'f' || value.type.charAt(0) === 's') {
                            $(item.target).css({ 'opacity': 1 });
                        } else if (value.type.charAt(0) === 't') {
                            $(item.target).css({ 'opacity': 0 });
                        }

                        $(item.target).css({
                            "animatiton-duration": value.playTime + 's',
                            "-webkit-animation-duration": value.playTime + 's',
                            "animation-delay": value.playDelay + 's',
                            "webkit-animation-delay": value.playDelay + 's',
                        })

                        animationEndObject[animationId] = false;
                        autoAnimationArray[autoIndex].isPlay = true;

                        $(item.target).addClass('animated ' + value.effect).one(animationEnd, function(event) {
                            event.stopPropagation();

                            animationEndObject[animationId] = true;

                            $(item.target).attr('class', '');
                            if (value.type.charAt(0) === 't' || value.type.charAt(0) === 's') {
                                $(item.target).css({ 'opacity': 1 });
                            } else if (value.type.charAt(0) === 'f') {
                                $(item.target).css({ 'opacity': 0 });
                            }
                        });
                        playComplexAnimation(animationId, item.target, value.playTime, value.effect);
                    }
                } else {
                    if (animationEndObject[animationId]) {
                        autoAnimationArray[autoIndex].isPlay = false;
                        if (value.type.charAt(0) === 't') {
                            $(item.target).css({ 'opacity': 0 });
                        } else if (value.type.charAt(0) === 'f' || value.type.charAt(0) === 's') {
                            $(item.target).css({ 'opacity': 1 });
                        }

                    }
                }
            })
        }, {
            threshold: [0]
        });

        function playComplexAnimation(id, dom, time, effect) {
            switch (effect) {
                case 'windowShades':
                    windowShades(id, dom, time);
                default:
                    break;
            }
        }

        function stopComplexAnimation(animationId, dom) {
            if (timerObject[animationId]) {
                $(dom).css({ '-webkit-mask-size': '', 'mask-size': '', '-webkit-mask-image': '', 'mask-image': '' });
                clearInterval(timerObject[animationId]);
                timerObject[animationId] = undefined;
            }
        }

        //百叶窗
        function windowShades(animationId, dom, time) {
            var i = 0;
            var diff = 1 / time;
            $(dom).css('mask-size', '100% 15%');
            $(dom).css('-webkit-mask-size', '100% 15%');

            function animate(dom, i) {
                $(dom).css('-webkit-mask-image', 'linear-gradient(to bottom,#000 ' + i.toString() + '%,transparent ' + i.toString() + '%)');
                $(dom).css('mask-image', 'linear-gradient(to bottom,#000 ' + i.toString() + '%,transparent ' + i.toString() + '%)');
            }

            var timer = setInterval(function() {
                animate(dom, i)
                i += diff
                if (i >= 101) {
                    clearInterval(timer);
                    return
                }
            }, 10);

            timerObject[animationId] = timer;
        }

        //飞翔端生成操作标识修改，以防出现新BUG，简单的进行转换
        function eventToNum(event) {
            switch (event) {
                case 'auto':
                    return '0';
                case 'click':
                    return '1';
                case 'synchro':
                    return '2';
                case 'after':
                    return '3'
            }
        }

        return new Animate(id, option);
    });
})();