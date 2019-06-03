(function() {
    FX.plugins["animate"] = (function(id, option) {
        console.log(id, option)
        var Animate = function(id, option) {
            this.$target = $("#" + id);
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, Animate);

        var clickAnimationArray = []
        var currentClickAnimationArray = []
        var lastClickAnimationArray = []
        var lastIndex = 0
        var observeCallFlag = false

        //组件初始化
        Animate.prototype.init = function(id, option) {
            var animationNodes = $("div[title='Animation']")

            var firstAniId = animationNodes.attr("id");
            if (firstAniId !== id)
                return;

            $(animationNodes).each(function(index, item) {
                var dataInput = $(item).children('input')
                var animationDiv = $(item).children('div')
                    // var valueTemp = eval('(' + dataInput[0].value + ')')
                var valueTemp = JSON.parse(dataInput[0].value)
                var animations = valueTemp.states[0].animations

                $.each(animations, function(index, item) {
                    var autoAnimationCount = 0
                    var clickAnimationCount = 0
                    if (item.type.charAt(item.type.length - 1) === '0' && autoAnimationCount === 0) {
                        //载入页面动画 绑定视窗监听事件
                        intersectionObserverAutoAnimation.observe(animationDiv[0])
                        autoAnimationCount += 1
                    } else if (item.type.charAt(item.type.length - 1) === '1' && clickAnimationCount === 0) {
                        //单击动画 绑定单击事件
                        // $(animationDiv[0]).on('click', function() {
                        //         $(this).addClass('animated fadeOut ' + 'delay-' + item.playDelay + 's')
                        //     })
                        clickAnimationArray.push({ node: animationDiv[0], isClickAnimationEnd: true, isClick: false, isInView: false })
                            // currentClickAnimationArray = clickAnimationArray
                        intersectionObserverClickAnimation.observe(animationDiv[0])

                        clickAnimationCount += 1
                    }
                })
            })

            $('body').on('click', function() {
                var clickIndex = clickAnimationArray.findIndex(function(item) {
                    return !item.isClick && item.isInView
                })

                if (clickIndex > -1) {
                    clickAnimationArray[clickIndex].isClickAnimationEnd = false
                    clickAnimationArray[clickIndex].isClick = true

                    var inputNode = $(clickAnimationArray[clickIndex].node).parent().children('input')
                    var value = animationDataProcess(inputNode)

                    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'

                    $(clickAnimationArray[clickIndex].node).addClass('animated bounceInUp ' + 'delay-' + value.playDelay + 's').one(animationEnd, function(event) {
                        event.stopPropagation()
                        clickAnimationArray[clickIndex].isClickAnimationEnd = true
                    });
                }

                console.log('clickAnimationArray', clickAnimationArray)

            })

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
                    $(this).addClass('animated ' + animationName).one(animationEnd, function(event) {
                        $(this).removeClass('animated ' + animationName);

                        event.stopPropagation() // alert(event.isPropagationStopped())
                    });
                }
            });
        })(jQuery);


        // 监听视窗：进入可视窗口单击可触发动画
        var intersectionObserverClickAnimation = new IntersectionObserver((entries) => {

            entries.forEach((item, index) => {
                var inputNode = $(item.target).parent().children('input')
                var value = animationDataProcess(inputNode)

                if (item.intersectionRatio > 0) {
                    console.log('ratio', item.intersectionRatio)
                    var inIndex = clickAnimationArray.findIndex(function(arrItem) {
                        return arrItem.node === item.target
                    })
                    if (clickAnimationArray[inIndex].isClickAnimationEnd) {
                        clickAnimationArray[inIndex].isInView = true
                    }

                    // value.animations.effect
                } else {
                    var outIndex = clickAnimationArray.findIndex(function(arrItem) {
                        return arrItem.node === item.target
                    })
                    if (clickAnimationArray[outIndex].isClickAnimationEnd) {
                        $(item.target).removeClass('animated bounceInUp')
                        clickAnimationArray[outIndex].isClick = false
                        clickAnimationArray[outIndex].isInView = false
                    }
                }
            })
        });



        // 监听视窗:进入可视窗口自动触发动画
        var intersectionObserverAutoAnimation = new IntersectionObserver((entries) => {
            entries.forEach((item) => {
                if (item.intersectionRatio > 0) {
                    var inputNode = $(item.target).parent().children('input')
                    var value = animationDataProcess(inputNode)
                    console.log('inputValue', value)

                    $(item.target).find('img').css({
                        "animatiton-duration": value.animations.playTime + 's',
                        "-webkit-animation-duration": value.animations.playTime + 's',
                    })

                    // $(item.target).parent().addClass('animated fadeInUp ' + 'delay-' + value.animations.playDelay + 's')
                    // $(item.target).addClass('animated fadeInUpBig ' + 'delay-' + value.animations.playDelay + 's')
                    $(item.target).find('img').animateCss('fadeInUpBig ' + 'delay-' + value.animations.playDelay + 's')

                } else {

                }
            })
        });

        function animationDataProcess(node) {
            var valueObject = {};
            // var valueTemp = eval('(' + node[0].value + ')')
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