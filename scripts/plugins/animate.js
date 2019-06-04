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

            // if (clickAnimationArray.length > 0) {
            $('#divpar').on('click', function() {
                    var clickIndex = clickAnimationArray.findIndex(function(item) {
                        return !item.isClick && item.isInView
                    })

                    if (clickIndex > -1) {
                        clickAnimationArray[clickIndex].isClickAnimationEnd = false
                        clickAnimationArray[clickIndex].isClick = true

                        var value = clickAnimationArray[clickIndex].animations

                        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'

                        $(clickAnimationArray[clickIndex].node).addClass('animated ' + value.effect + ' delay-' + value.playDelay + 's').one(animationEnd, function(event) {
                            event.stopPropagation()
                            clickAnimationArray[clickIndex].isClickAnimationEnd = true
                        });

                        if (value.type.charAt(0) === 't') {
                            $(clickAnimationArray[clickIndex].node).css({ 'opacity': 0 })
                        } else {
                            $(clickAnimationArray[clickIndex].node).css({ 'opacity': 1 })
                        }
                    }

                    console.log('clickAnimationArray', clickAnimationArray)

                })
                // }

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
                        $(item.target).removeClass('animated ' + value.effect)
                        clickAnimationArray[valueIndex].isClick = false
                        clickAnimationArray[valueIndex].isInView = false

                        if (value.type.charAt(0) === 't') {
                            $(clickAnimationArray[valueIndex].node).css({ 'opacity': 1 })
                        } else {
                            $(clickAnimationArray[valueIndex].node).css({ 'opacity': 0 })
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

                if (item.intersectionRatio > 0) {
                    $(item.target).find('img').css({
                        "animatiton-duration": value.playTime + 's',
                        "-webkit-animation-duration": value.playTime + 's',
                    })

                    $(item.target).find('img').addClass('animated ' + value.effect + ' delay-' + value.playDelay + 's')

                    if (value.type.charAt(0) === 't') {
                        $(item.target).css({ 'opacity': 0 })
                    } else {
                        $(item.target).css({ 'opacity': 1 })
                    }
                } else {
                    var index = clickAnimationArray.findIndex(function(ele) {
                        return ele.node === item.target
                    })
                    if (index > -1) {
                        if (clickAnimationArray[index].isClickAnimationEnd) {
                            $(item.target).find('img').removeClass('animated ' + value.effect + ' delay-' + value.playDelay + 's')
                        }
                    } else {
                        $(item.target).find('img').removeClass('animated ' + value.effect + ' delay-' + value.playDelay + 's')

                    }
                }
            })
        });

        function animationDataProcess(node) {
            var valueObject = {};
            var valueTemp = JSON.parse(node[0].value)
            var animations = valueTemp.states[0].animations
            $.each(animations, function(index, item) {
                    valueObject.animations = item
                })
                // direction: "bottom"
                // effect: "fall"
                // playDelay: "0"
                // playTime: "4"
                // type: "toAppearance-0"
                // uid: "0-0"
            return valueObject
        }

        return new Animate(id, option);
    });
})();