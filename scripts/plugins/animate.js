(function() {
    FX.plugins["animate"] = (function(id, option) {
        console.log(id, option)
        var Animate = function(id, option) {
            this.$target = $("#" + id);
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, Animate);

        var clickAnimationArray = [] //维护单击动画列表
        var autoAnimationArray = []

        //组件初始化
        Animate.prototype.init = function(id, option) {
            var animationNodes = $("div[title='Animation']")

            var firstAniId = animationNodes.attr("id");
            if (firstAniId !== id)
                return;

            $(animationNodes).each(function(index, item) {
                var dataInput = $(item).children('input')
                var animationDiv = $(item).children('div')
                var valueTemp = JSON.parse(dataInput[0].value)
                var animations = valueTemp.states[0].animations

                $.each(animations, function(index, item) {
                    var autoAnimationCount = 0
                    var clickAnimationCount = 0
                    if (item.type.charAt(item.type.length - 1) === '0' && autoAnimationCount === 0) {
                        autoAnimationArray.push({ node: animationDiv[0], animations: item })
                            //载入页面动画 绑定视窗监听事件

                        // intersectionObserverAutoAnimation.observe(animationDiv[0])
                        autoAnimationCount += 1
                    } else if (item.type.charAt(item.type.length - 1) === '1' && clickAnimationCount === 0) {
                        clickAnimationArray.push({ node: animationDiv[0], isClickAnimationEnd: true, isClick: false, isInView: false, animations: item })

                        intersectionObserverClickAnimation.observe(animationDiv[0])

                        clickAnimationCount += 1
                    }
                })
            })

            $('#divpar').on('scrollstart', function() {
                $.each(autoAnimationArray, function(index, item) {
                    intersectionObserverAutoAnimation.unobserve(item.node)
                })
            })

            $('#divpar').on('scrollstop', function() {
                alert('stop')
                $.each(autoAnimationArray, function(index, item) {
                    intersectionObserverAutoAnimation.observe(item.node)
                })
            })

            if (clickAnimationArray.length > 0) {
                $('.swiper-container').on('click', function() {
                    var clickIndex = clickAnimationArray.findIndex(function(item) {
                        return !item.isClick && item.isInView
                    })

                    if (clickIndex > -1) {
                        clickAnimationArray[clickIndex].isClickAnimationEnd = false
                        clickAnimationArray[clickIndex].isClick = true

                        var value = clickAnimationArray[clickIndex].animations

                        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'

                        $(clickAnimationArray[clickIndex].node).css({
                            "animatiton-duration": value.playTime + 's',
                            "-webkit-animation-duration": value.playTime + 's',
                        })
                        var effect = effectDataProcess(value)

                        $(clickAnimationArray[clickIndex].node).addClass('animated ' + effect + ' delay-' + value.playDelay + 's').one(animationEnd, function(event) {
                            event.stopPropagation()
                            clickAnimationArray[clickIndex].isClickAnimationEnd = true
                        });

                        if (value.type.charAt(0) === 't') {
                            $(clickAnimationArray[clickIndex].node).css({ 'opacity': 1 })
                        } else {
                            $(clickAnimationArray[clickIndex].node).css({ 'opacity': 0 })
                        }
                    }

                    console.log('clickAnimationArray', clickAnimationArray)

                })
            }

        };

        //重置数据
        Animate.prototype.reset = function(option) {

        };

        //数据重置
        Animate.prototype.destroy = function() {

        };

        (function($) {
            $.fn.extend({
                animateCss: function(animationName) {
                    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                    $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                        $(this).removeClass('animated ' + animationName);
                    });
                }
            });
        })(jQuery);

        // 监听视窗：进入可视窗口单击可触发动画
        var intersectionObserverClickAnimation = new IntersectionObserver((entries) => {

            entries.forEach((item, index) => {
                var valueIndex = clickAnimationArray.findIndex(function(arrItem) {
                    return arrItem.node === item.target
                })
                var value = clickAnimationArray[valueIndex].animations

                if (item.intersectionRatio > 0) {
                    if (clickAnimationArray[valueIndex].isClickAnimationEnd) {
                        clickAnimationArray[valueIndex].isInView = true
                    }
                } else {
                    if (clickAnimationArray[valueIndex].isClickAnimationEnd) {
                        var effect = effectDataProcess(value)
                        $(item.target).removeClass('animated ' + effect)
                        clickAnimationArray[valueIndex].isClick = false
                        clickAnimationArray[valueIndex].isInView = false

                        if (value.type.charAt(0) === 't') {
                            $(clickAnimationArray[valueIndex].node).css({ 'opacity': 0 })
                        } else {
                            $(clickAnimationArray[valueIndex].node).css({ 'opacity': 1 })
                        }
                    }
                }
            })
        });


        // 监听视窗:进入可视窗口自动触发动画
        var intersectionObserverAutoAnimation = new IntersectionObserver((entries) => {
            entries.forEach((item) => {
                var autoIndex = autoAnimationArray.findIndex(function(arrItem) {
                    return arrItem.node === item.target
                })
                var value = autoAnimationArray[autoIndex].animations
                var effect = effectDataProcess(value)

                var clickIndex = clickAnimationArray.findIndex(function(ele) {
                    return ele.node === item.target
                })

                if (item.intersectionRatio > 0) {
                    console.log('111')
                    $(item.target).find('img').css({
                        "animatiton-duration": value.playTime + 's',
                        "-webkit-animation-duration": value.playTime + 's',
                    })
                    var effect = effectDataProcess(value)
                        // $(item.target).find('img').addClass('animated ' + effect + ' delay-' + value.playDelay + 's')
                    if (clickIndex > -1) {
                        if (clickAnimationArray[index].isClickAnimationEnd) {
                            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                            $(item.target).find('img').addClass('animated ' + effect).one(animationEnd, function() {
                                $(this).removeClass('animated ' + effect);
                            });

                            if (value.type.charAt(0) === 't') {
                                $(item.target).css({ 'opacity': 1 })
                            } else {
                                $(item.target).css({ 'opacity': 0 })
                            }
                        }
                    } else {

                        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                        $(item.target).find('img').addClass('animated ' + effect).one(animationEnd, function() {
                            $(this).removeClass('animated ' + effect);
                        });

                        if (value.type.charAt(0) === 't') {
                            $(item.target).css({ 'opacity': 1 })
                        } else {
                            $(item.target).css({ 'opacity': 0 })
                        }

                    }

                } else {
                    console.log('222')
                        // var index = clickAnimationArray.findIndex(function(ele) {
                        //     return ele.node === item.target
                        // })
                        // if (index > -1) {
                        //     if (clickAnimationArray[index].isClickAnimationEnd) {
                        //         $(item.target).find('img').removeClass('animated ' + effect + ' delay-' + value.playDelay + 's')
                        //     }
                        // } else {
                        //     $(item.target).find('img').removeClass('animated ' + effect + ' delay-' + value.playDelay + 's')

                    // }
                }
            })
        });

        function effectDataProcess(value) {
            var name
            if (value.effect === 'slide' || value.effect === 'back') {
                name = value.effect + '-' + value.direction
            } else {
                name = value.effect
            }

            var inEffectObj = {
                'fade': 'fadeIn',
                'slide-top': 'fadeInUp',
                'slide-bottom': 'fadeInDown',
                'slide-left': 'fadeInLeft',
                'slide-right': 'fadeInRight',
                'slide-leftTop': 'fadeInLeftTop',
                'slide-rightTop': 'fadeInRightTop',
                'slide-leftBottom': 'fadeInLeftBottom',
                'slide-rightBottom': 'fadeInRightBottom',
                'back-top': 'bounceInUp',
                'back-bottom': 'bounceInDown',
                'back-left': 'bounceInLeft',
                'back-right': 'bounceInRight',
                'back-leftTop': 'bounceInLeftTop',
                'back-rightTop': 'bounceInRightTop',
                'back-leftBottom': 'bounceInLeftBottom',
                'back-rightBottom': 'bounceInRightBottom',
                'fall': 'fall',
                'fly': 'zoomIn',
                'pop': 'bounceIn',
                'flip': 'flipInY',
            }
            var outEffectObj = {
                'fade': 'fadeOut',
                'slide-top': 'fadeOutUp',
                'slide-bottom': 'fadeOutDown',
                'slide-left': 'fadeOutLeft',
                'slide-right': 'fadeOutRight',
                'slide-leftTop': 'fadeOutLeftTop',
                'slide-rightTop': 'fadeOutRightTop',
                'slide-leftBottom': 'fadeOutLeftBottom',
                'slide-rightBottom': 'fadeOutRightBottom',
                'back-top': 'bounceOutUp',
                'back-bottom': 'bounceOutDown',
                'back-left': 'bounceOutLeft',
                'back-right': 'bounceOutRight',
                'back-leftTop': 'bounceOutLeftTop',
                'back-rightTop': 'bounceOutRightTop',
                'back-leftBottom': 'bounceOutLeftBottom',
                'back-rightBottom': 'bounceOutRightBottom',
                'fall': 'zoomOut',
                'fly': 'fly',
                'pop': 'bounceOut',
                'flip': 'flipOutY',
            }
            if (value.type.charAt(0) === 't') {
                return inEffectObj[name]
            } else {
                return outEffectObj[name]
            }
        }
        return new Animate(id, option);
    });
})();