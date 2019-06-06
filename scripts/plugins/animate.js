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
                        intersectionObserverAutoAnimation.observe(animationDiv[0])
                        autoAnimationCount += 1
                    } else if (item.type.charAt(item.type.length - 1) === '1' && clickAnimationCount === 0) {
                        clickAnimationArray.push({ node: animationDiv[0], isClickAnimationEnd: true, isClick: false, isInView: false, animations: item })

                        intersectionObserverClickAnimation.observe(animationDiv[0])

                        clickAnimationCount += 1
                    }
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
                var index = autoAnimationArray.findIndex(function(arrItem) {
                    return arrItem.node === item.target
                })
                var value = autoAnimationArray[index].animations
                var effect = effectDataProcess(value)

                if (item.intersectionRatio > 0) {
                    $(item.target).find('img').css({
                        "animatiton-duration": value.playTime + 's',
                        "-webkit-animation-duration": value.playTime + 's',
                    })
                    var effect = effectDataProcess(value)
                    $(item.target).find('img').addClass('animated ' + effect + ' delay-' + value.playDelay + 's')

                    if (value.type.charAt(0) === 't') {
                        $(item.target).css({ 'opacity': 1 })
                    } else {
                        $(item.target).css({ 'opacity': 0 })
                    }
                } else {
                    var index = clickAnimationArray.findIndex(function(ele) {
                        return ele.node === item.target
                    })
                    if (index > -1) {
                        if (clickAnimationArray[index].isClickAnimationEnd) {
                            $(item.target).find('img').removeClass('animated ' + effect + ' delay-' + value.playDelay + 's')
                        }
                    } else {
                        $(item.target).find('img').removeClass('animated ' + effect + ' delay-' + value.playDelay + 's')

                    }
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
                'slide-top': 'fadeInUpBig',
                'slide-bottom': 'fadeInDownBig',
                'slide-left': 'fadeInLeftBig',
                'slide-right': 'fadeInRightBig',
                'slide-leftTop': 'fadeInUpBig',
                'slide-rightTop': 'fadeInUpBig',
                'slide-leftBottom': 'fadeInUpBig',
                'slide-leftBottom': 'fadeInUpBig',
                'back-top': 'bounceInUp',
                'back-bottom': 'bounceInDown',
                'back-left': 'bounceInLeft',
                'back-right': 'bounceInRight',
                'back-leftTop': 'bounceInUp',
                'back-rightTop': 'bounceInUp',
                'back-leftBottom': 'bounceInUp',
                'back-leftBottom': 'bounceInUp',
                'fall': 'fall',
                'fly': 'zoomIn',
                'pop': 'bounceIn',
                'flip': 'flipInY',
            }
            var outEffectObj = {
                'fade': 'fadeOut',
                'slide-top': 'fadeOutUpBig',
                'slide-bottom': 'fadeOutDownBig',
                'slide-left': 'fadeOutLeftBig',
                'slide-right': 'fadeOutRightBig',
                'slide-leftTop': 'fadeOutUpBig',
                'slide-rightTop': 'fadeOutUpBig',
                'slide-leftBottom': 'fadeOutUpBig',
                'slide-leftBottom': 'fadeOutUpBig',
                'back-top': 'bounceOutUp',
                'back-bottom': 'bounceOutDown',
                'back-left': 'bounceOutLeft',
                'back-right': 'bounceOutRight',
                'back-leftTop': 'bounceOutUp',
                'back-rightTop': 'bounceOutUp',
                'back-leftBottom': 'bounceOutUp',
                'back-leftBottom': 'bounceOutUp',
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