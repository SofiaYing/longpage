(function() {
    FX.plugins["animation"] = (function(id, option) {

        var clickIndex = 0;
        var pageObj = {};
        var lastGroupId;
        var lastGroupNodeId;
        var lastGroupNodeType;
        var lastGroupDelay;
        var lastGroupDuration;
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
            console.log('reset')


            //触发事件:0--网页加载时;1--单击;2--与上一动画同时;3--在上一动画之后
            var self = this;

            if (this.pageObj) {
                console.log('pageObj', this.pageObj)

                //处理0
                $.each(this.pageObj.autoAnimationArray, function(index, item) {
                    var demo = $(item.node).children('div')[0];
                    var value = item.animations;
                    var effect = effectDataProcess(value);
                    var animationId = $(item.node).attr('id');

                    if (self.pageObj.groupAutoAnimationObj[animationId].length > 0) {
                        $.each(self.pageObj.groupAutoAnimationObj[animationId], function(groupIndex, groupItem) {
                            playAnimation(groupItem);
                        })
                    }

                    $(demo).css({
                        "animatiton-duration": value.playTime + 's',
                        "-webkit-animation-duration": value.playTime + 's',
                        "animation-delay": value.playDelay + 's',
                        "webkit-animation-delay": value.playDelay + 's',
                    })

                    $(demo).addClass('animated ' + effect).one(animationEnd, function(event) {
                        event.stopPropagation();

                        if (value.type.charAt(0) === 't') {
                            $(demo).css({ 'opacity': 1 });
                        } else {
                            $(demo).css({ 'opacity': 0 });
                        }
                    });
                })

                //处理1
                var page = this.$target.parents(".swiper-slide");

                if (this.pageObj.clickAnimationArray.length > 0) {
                    $(page).on('click', function() {
                        if (clickIndex >= self.pageObj.clickAnimationArray.length) {
                            return;
                        }

                        var ele = self.pageObj.clickAnimationArray[clickIndex];
                        var demo = $(ele.node).children('div')[0];
                        var value = ele.animations;
                        var effect = effectDataProcess(value);
                        var clickAnimationId = $(ele.node).attr('id');

                        $.each(self.pageObj.groupClickAnimationObj[clickAnimationId], function(groupIndex, groupItem) {
                            playAnimation(groupItem);
                        })

                        $(demo).attr('class', '');

                        $(demo).css({
                            "animatiton-duration": value.playTime + 's',
                            "-webkit-animation-duration": value.playTime + 's',
                            "animation-delay": value.playDelay + 's',
                            "webkit-animation-delay": value.playDelay + 's',
                        })

                        $(demo).addClass('animated ' + effect).one(animationEnd, function(event) {
                            event.stopPropagation();

                            if (value.type.charAt(0) === 't') {
                                $(demo).css({ 'opacity': 1 });
                            } else {
                                $(demo).css({ 'opacity': 0 });
                            }
                        });

                        clickIndex += 1;

                        return false;
                    })
                }
            }
        };

        //数据重置
        Animation.prototype.destroy = function() {
            clickIndex = 0;

            if (this.pageObj) {
                $.each(this.pageObj.orderArray, function(index, item) {
                    var demo = $(item.node).children('div')[0];
                    var opacity = item.opacity;

                    $(demo).attr('class', '');
                    $(demo).css({ 'opacity': opacity });
                })

                var page = this.$target.parents(".swiper-slide");
                $(page).off();
            }
        };

        Animation.prototype.getAnimations = function() {
            var page = this.$target.parents(".swiper-slide");
            var aniInPage = page.find("div[title='Animation']");
            var firstAniInPage = aniInPage.eq(0);
            var firstAniId = firstAniInPage.attr("id");
            if (firstAniId !== id)
                return;

            var originalAnimationArray = [];
            var clickAnimationArray = []; //维护单击动画列表
            var autoAnimationArray = []; //维护载入动画
            var groupClickAnimationObj = {}; //以单击为标准的2/3类动画组
            var groupAutoAnimationObj = {}; //以载入为标准的2/3类动画组

            $.each(aniInPage, function(index, item) {
                var dataInput = $(item).children('input');
                var valueTemp = JSON.parse(dataInput[0].value);
                var animations = valueTemp.states[0].animations;

                $.each(animations, function(animationIndex, animationItem) {
                    var autoAnimationCount = 0;
                    var clickAnimationCount = 0;
                    var uidArray = animationItem.uid.split('-')
                    var i = uidArray[0];
                    var gid = uidArray[uidArray.length - 1];
                    var type = animationItem.type.charAt(animationItem.type.length - 1);
                    var opacity = $(item).children('div').css('opacity');

                    if (originalAnimationArray instanceof Array) {
                        originalAnimationArray.push({ node: item, id: $(item).attr('id'), animations: animationItem, uId: animationItem.uid, order: i, groupId: gid, type: type, opacity: opacity });
                    } else {
                        originalAnimationArray = [{ node: item, id: $(item).attr('id'), animations: animationItem, uId: animationItem.uid, order: i, groupId: gid, type: type, opacity: opacity }];
                    }

                    if (type === '0' && autoAnimationCount === 0) {
                        autoAnimationArray.push({ node: item, id: $(item).attr('id'), animations: animationItem });
                        autoAnimationCount += 1;
                    } else if (type === '1' && clickAnimationCount === 0) {
                        clickAnimationArray.push({ node: item, id: $(item).attr('id'), animations: animationItem });
                        clickAnimationCount += 1;
                    }
                })
            })

            var orderArray = new Array(originalAnimationArray.length); //以用户添加顺序排列的动画组
            $.each(originalAnimationArray, function(originalIndex, originalItem) {
                orderArray[originalItem.order] = originalItem;
            })

            $.each(orderArray, function(orderIndex, orderItem) {
                var groupId = orderItem.groupId;
                var type = orderItem.type;
                var delay = parseInt(orderItem.animations.playDelay);
                var duration = parseInt(orderItem.animations.playTime);

                if (typeof(lastGroupId) === 'undefined') {
                    lastGroupId = groupId;
                    lastGroupNodeId = orderItem.id;
                    type === '1' ? lastGroupNodeType = type : lastGroupNodeType = '0';

                    lastGroupDelay = delay;
                    lastGroupDuration = duration;

                    lastGroupNodeType === '0' ? groupAutoAnimationObj[lastGroupNodeId] = [] : groupClickAnimationObj[lastGroupNodeId] = [];
                } else {
                    if (lastGroupId === groupId && type !== '0' && type !== '1') {

                        if (type === '3') {
                            orderItem.animations.playDelay = lastGroupDelay + lastGroupDuration + delay;
                            lastGroupDelay = orderItem.animations.playDelay;
                            lastGroupDuration = duration;
                        } else {
                            orderItem.animations.playDelay = lastGroupDelay + delay;
                            lastGroupDuration = duration;
                        }

                        if (lastGroupNodeType === '0') {
                            groupAutoAnimationObj[lastGroupNodeId] ? groupAutoAnimationObj[lastGroupNodeId].push(orderItem) : groupAutoAnimationObj[lastGroupNodeId] = [orderItem];
                        } else {
                            groupClickAnimationObj[lastGroupNodeId] ? groupClickAnimationObj[lastGroupNodeId].push(orderItem) : groupClickAnimationObj[lastGroupNodeId] = [orderItem];
                        }
                    } else {
                        lastGroupNodeId = orderItem.id;
                        lastGroupId = groupId;
                        lastGroupNodeType = type;

                        lastGroupDelay = delay;
                        lastGroupDuration = duration;

                        lastGroupNodeType === '0' ? groupAutoAnimationObj[lastGroupNodeId] = [] : groupClickAnimationObj[lastGroupNodeId] = [];
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

        function playAnimation(item) {
            var demo = $(item.node).children('div')[0];
            var value = item.animations;
            var effect = effectDataProcess(value);

            $(demo).css({
                "animatiton-duration": value.playTime + 's',
                "-webkit-animation-duration": value.playTime + 's',
                "animation-delay": value.playDelay + 's',
                "webkit-animation-delay": value.playDelay + 's',
            })

            if (value.type.charAt(0) === 'f') {
                $(demo).css({ 'opacity': 1 });
            }

            $(demo).addClass('animated ' + effect).one(animationEnd, function(event) {
                event.stopPropagation();

                if (value.type.charAt(0) === 't') {
                    $(demo).css({ 'opacity': 1 });
                } else {
                    $(demo).css({ 'opacity': 0 });
                }
            })
        }

        function effectDataProcess(value) {
            var name;
            if (value.effect === 'slide' || value.effect === 'back') {
                name = value.effect + '-' + value.direction;
            } else {
                name = value.effect;
            }

            var inEffectObj = {
                'fade': 'fadeIn',
                'slide-top': 'mySlideInUp',
                'slide-bottom': 'mySlideInDown',
                'slide-left': 'mySlideInLeft',
                'slide-right': 'mySlideInRight',
                'slide-leftTop': 'slideInLeftTop',
                'slide-rightTop': 'slideInRightTop',
                'slide-leftBottom': 'slideInLeftBottom',
                'slide-rightBottom': 'slideInRightBottom',
                'back-top': 'backInUp',
                'back-bottom': 'backInDown',
                'back-left': 'backInLeft',
                'back-right': 'backInRight',
                'back-leftTop': 'backInLeftTop',
                'back-rightTop': 'backInRightTop',
                'back-leftBottom': 'backInLeftBottom',
                'back-rightBottom': 'backInRightBottom',
                'fall': 'fall',
                'fly': 'zoomIn',
                'pop': 'bounceIn',
                'flip': 'flipInY',
                'diamond': 'diamond',
                'radial-gradient': 'radial-gradient',
            }
            var outEffectObj = {
                'fade': 'fadeOut',
                'slide-top': 'mySlideOutUp',
                'slide-bottom': 'mySlideOutDown',
                'slide-left': 'mySlideOutLeft',
                'slide-right': 'mySlideOutRight',
                'slide-leftTop': 'slideOutLeftTop',
                'slide-rightTop': 'slideOutRightTop',
                'slide-leftBottom': 'slideOutLeftBottom',
                'slide-rightBottom': 'slideOutRightBottom',
                'back-top': 'backOutUp',
                'back-bottom': 'backOutDown',
                'back-left': 'backOutLeft',
                'back-right': 'backOutRight',
                'back-leftTop': 'backOutLeftTop',
                'back-rightTop': 'backOutRightTop',
                'back-leftBottom': 'backOutLeftBottom',
                'back-rightBottom': 'backOutRightBottom',
                'fall': 'zoomOut',
                'fly': 'fly',
                'pop': 'bounceOut',
                'flip': 'flipOutY',
                'diamond': 'diamond',
                'radial-gradient': 'radial-gradient',
            }
            if (value.type.charAt(0) === 't') {
                return inEffectObj[name];
            } else {
                return outEffectObj[name];
            }
        }

        return new Animation(id, option);
    });
})();