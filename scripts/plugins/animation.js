(function() {
    FX.plugins["animation"] = (function(id, option) {

        var clickIndex = 0; //第一个未点击的动画索引
        var timerObject = {}; //缓存js动画定时器
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        // 对象
        var Animation = function(id, option) {
            this.$target = $("#" + id);
            this.pageObj = this.getAnimations();
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, Animation);


        //组件初始化
        Animation.prototype.init = function(id, option) {};

        //重置数据
        Animation.prototype.reset = function(option) {
            //触发事件:0--网页加载时;1--单击;2--与上一动画同时;3--在上一动画之后
            var self = this;
            if (!$.isEmptyObject(this.pageObj)) {
                console.log('this.pageObj', this.pageObj);

                //处理0
                if (this.pageObj.autoAnimationTreeArray.length > 0) {
                    $.each(this.pageObj.autoAnimationTreeArray, function(autonAnimationIndex, autonAnimationItem) {
                        playAnimationTree(autonAnimationItem);
                    })
                }

                //处理1
                if (this.pageObj.clickAnimationTreeArray.length > 0) {
                    var page = this.$target.parents(".divshow");

                    $(page).on('click', function() {
                        if (clickIndex >= self.pageObj.clickAnimationTreeArray.length) {
                            return;
                        }

                        var ele = self.pageObj.clickAnimationTreeArray[clickIndex].val;
                        var demo = $(ele.node).children('div')[0];

                        $(demo).attr('class', '');
                        stopComplexAnimation(ele.id, demo);
                        playAnimationTree(self.pageObj.clickAnimationTreeArray[clickIndex]);

                        clickIndex += 1;

                        return false;
                    })
                }

            }
        };

        //数据重置
        Animation.prototype.destroy = function() {
            clickIndex = 0;

            //stopComplexAnimation 添加PPT动画之后可能需要调用该函数，待测试
            if (!$.isEmptyObject(this.pageObj)) {
                $.each(this.pageObj.orderArray, function(index, item) {
                    var demo = $(item.node).children('div')[0];
                    var opacity = item.opacity;

                    $(demo).attr('class', '');
                    $(demo).css({ 'opacity': opacity });
                })

                var page = this.$target.parents(".divshow");
                $(page).off();
            }
        };

        Animation.prototype.popupAnimationsPlay = function(obj) {
            var popPageObj = this.getAnimations(obj, 'pop');
            console.log('popPageObj', popPageObj);
            //弹出内容 -0 -1动画相同处理

            if (popPageObj.autoAnimationTreeArray.length > 0) {
                $.each(popPageObj.autoAnimationTreeArray, function(autoAnimationIndex, autoAnimationItem) {
                    playAnimationTree(autoAnimationItem);
                })
            }
            if (popPageObj.clickAnimationTreeArray.length > 0) {
                $.each(popPageObj.clickAnimationTreeArray, function(clickAnimationIndex, clickAnimationItem) {
                    playAnimationTree(clickAnimationItem);
                })
            }
        };

        Animation.prototype.popupAnimationsStop = function(obj) {
            var aniInPage = $(obj).find("div[title='Animation']");

            $.each(aniInPage, function(index, item) {
                var demo = $(item).children('div')[0];
                var dataInput = $(item).children('input');
                var value = JSON.parse(dataInput[0].value);
                var animations = value.states[0].animations;
                $(demo).attr('class', '');
                $(demo).off();

                $.each(animations, function(animationIndex, animationItem) {
                    if ((animationItem.type.charAt(0) === 't')) {
                        $(demo).css('opacity', 0);
                        return
                    }
                })
            })
        };

        Animation.prototype.getAnimations = function(obj, type) {
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
            var clickAnimationTreeArray = [];
            var autoAnimationTreeArray = [];
            var lastNode = null;

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

                        if (originalAnimationArray instanceof Array) {
                            originalAnimationArray.push({ node: item, id: $(item).attr('id'), animations: animationItem, uId: animationItem.uid, order: i, groupId: gid, type: type, opacity: opacity });
                        } else {
                            originalAnimationArray = [{ node: item, id: $(item).attr('id'), animations: animationItem, uId: animationItem.uid, order: i, groupId: gid, type: type, opacity: opacity }];
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
                    if (orderIndex === 0 && type !== '1') {
                        var tempAutoTree = new TreeNode(orderItem);
                        autoAnimationTreeArray.push(tempAutoTree);
                        lastNode = autoAnimationTreeArray[autoAnimationTreeArray.length - 1];
                    } else {
                        if (type === '0') {
                            var tempAutoTree = new TreeNode(orderItem);
                            autoAnimationTreeArray.push(tempAutoTree);
                            lastNode = autoAnimationTreeArray[autoAnimationTreeArray.length - 1];
                        } else if (type === '2') {
                            lastNode.left = new TreeNode(orderItem);
                            lastNode = lastNode.left;
                        } else if (type === '3') {
                            lastNode.right = new TreeNode(orderItem);
                            lastNode = lastNode.right;
                        } else {
                            var tempClickTree = new TreeNode(orderItem);
                            clickAnimationTreeArray.push(tempClickTree);
                            lastNode = clickAnimationTreeArray[clickAnimationTreeArray.length - 1];
                        }
                    }
                })

                pageObj.autoAnimationTreeArray = autoAnimationTreeArray;
                pageObj.clickAnimationTreeArray = clickAnimationTreeArray;
                pageObj.orderArray = orderArray;
            }

            return pageObj;
        };

        function TreeNode(val) {
            this.val = val;
            this.left = this.right = null;
        }

        function playAnimationTree(root) {
            if (!root) {
                return;
            }

            var node = root.val;
            var demo = $(node.node).children('div')[0];
            var value = node.animations;
            var animationId = node.id;

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

                var type = value.type.charAt(0);

                $(demo).attr('class', '');

                if (type === 't' || type === 's') {
                    $(demo).css({ 'opacity': 1 });
                } else {
                    $(demo).css({ 'opacity': 0 });
                }

                $(demo).css({
                    "animatiton-duration": "",
                    "-webkit-animation-duration": "",
                    "animation-delay": "",
                    "webkit-animation-delay": "",
                })

                if (root.right) {
                    playAnimationTree(root.right);
                }

            })

            playComplexAnimation(animationId, demo, value.playTime, value.effect);

            if (root.left) {
                playAnimationTree(root.left);
            }

        }

        function playComplexAnimation(animationId, dom, time, effect) {
            switch (effect) {
                case 'windowShades':
                    windowShades(animationId, dom, time);
                    break;
                default:
                    break;
            }
        }

        function stopComplexAnimation(animationId, dom) {
            if (timerObject[animationId]) {
                clearInterval(timerObject[animationId]);

                timerObject[animationId] = undefined;
                $(dom).css({ '-webkit-mask-size': '', 'mask-size': '', '-webkit-mask-image': '', 'mask-image': '' });
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

        return new Animation(id, option);
    });
})();