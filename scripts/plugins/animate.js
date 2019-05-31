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
                        clickAnimationArray.push({ node: animationDiv[0], isClick: false })
                            // currentClickAnimationArray = clickAnimationArray
                        intersectionObserverClickAnimation.observe(animationDiv[0])
                        $(animationDiv[0]).on('click', function() {
                            return false
                        })

                        // intersectionObserverClickAnimation.observe(animationDiv[0])


                        clickAnimationCount += 1
                    }
                })
            })

            $('body').on('click', function() {
                console.log('click', currentClickAnimationArray, lastIndex)
                if (currentClickAnimationArray.length > lastIndex) {
                    var inputNode = $(currentClickAnimationArray[lastIndex]).parent().children('input')
                    var value = animationDataProcess(inputNode)
                    $(currentClickAnimationArray[lastIndex]).animateCss('animated fadeOut ' + 'delay-' + value.playDelay + 's')
                    lastIndex += 1
                }
                return false
            })
            console.log('clickAnimationArray', clickAnimationArray)

            if (clickAnimationArray.length > 0) {
                $('#divpar').scroll(function() {
                    // lastClickAnimationArray = currentClickAnimationArray
                    // currentClickAnimationArray = []

                    $.each(lastClickAnimationArray, function(index, item) {
                        if (lastClickAnimationArray.length > 0) {
                            if (currentClickAnimationArray[0] === lastClickAnimationArray[0]) {
                                // $(currentClickAnimationArray[lastIndex]).addClass('animated fadeOut')
                            } else {
                                // $(currentClickAnimationArray[0]).addClass('animated fadeOut')
                                lastIndex = 0
                            }
                        } else {
                            lastIndex = 0
                                // $(currentClickAnimationArray[lastIndex]).addClass('animated fadeOut')
                        }
                    })

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
                        return false
                    });
                }
            });
        })(jQuery);


        // 监听视窗：进入可视窗口单击可触发动画
        var intersectionObserverClickAnimation = new IntersectionObserver((entries) => {
            if (!observeCallFlag) {

            }
            entries.forEach((item, index) => {
                console.log('currentClickAnimationArray', currentClickAnimationArray)

                if (item.isIntersecting) {

                    console.log('item', item.target)
                    var inputNode = $(item.target).parent().children('input')
                    var value = animationDataProcess(inputNode)

                    currentClickAnimationArray.push(item.target)

                    console.log('1111111', currentClickAnimationArray)
                        // $(item.target).removeClass('animated fadeOut') // value.animations.effect
                }
            })
        });



        // 监听视窗:进入可视窗口自动触发动画
        var intersectionObserverAutoAnimation = new IntersectionObserver((entries) => {
            entries.forEach((item) => {
                // console.log(item)
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
                    // $(item.target).removeClass('animated fadeInUp')
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