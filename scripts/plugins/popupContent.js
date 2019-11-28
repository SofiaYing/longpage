(function(window, undefined) {
    FX.plugins["popupContent"] = function(id, option) {
        var isLongPage = window.sizeAdjustor.jsonData.adjustType === "longPageAdjust"; //判断是否为长页面
        var posLeft = 0; //closeButtonPos 位置标记
        var posTop = 0; //closeButtonPos 位置标记
        var translateX = '-50%'; //closeButtonPos 位置标记
        var translateY = '-50%'; //closeButtonPos 位置标记
        // var scaleX = window.sizeAdjustor.scaleX; //用于按钮大小适配
        // var scaleY = window.sizeAdjustor.scaleY; //用于按钮大小适配

        // 对象
        var PopupContentItem = function(id, option) {
            this.el = document.getElementById(id);
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, PopupContentItem);

        //组件初始化
        PopupContentItem.prototype.init = function(id, option) {};

        //重置数据
        PopupContentItem.prototype.reset = function(option) {
            console.log('reset')
            var value = this.getOption();

            if (value.displayFirstImage === 'true') {
                var firstChild = $(this.el).children()[0];
                var animations = $(firstChild).find("div[title=Animation]");
                firstChild.style.display = 'inline';

                if (value.displayCloseButton === 'true') {
                    setCloseButtonPos($(this.el).children().eq(0));
                    // setCloseButtonPos($(this.el));
                }
                firstChild.style.opacity = '1';

                if (animations.length > 0) {
                    var animation = window.fx.getItemById(animations[0].id);
                    animation.popupAnimationsPlay(this.el);
                }
            }
        };

        //数据重置
        PopupContentItem.prototype.destroy = function() {
            var self = this;
            var state_count = self.el.children.length - 1;
            for (var i = 0; i < state_count; i++) {
                self.el.children[i].style.display = "none";
            }
            if (isLongPage) {
                var animations = $(this.el).find("div[title=Animation]");
                if (animations.length > 0) {
                    var animation = window.fx.getItemById(animations[0].id);
                    animation.popupAnimationsStop(this.el);
                }
            }
        };

        PopupContentItem.prototype.getOption = function() {
            var l = $(this.el).children().length;
            var jsonData = JSON.parse($(this.el).children()[l - 1].value);
            return jsonData;
        };

        PopupContentItem.prototype.play = function(obj) {
            var self = this;
            var state = self.el.children[obj];
            state.style.display = "inline";
            var interacts = state.querySelectorAll("div[title=SlideShow]");
            for (var j = 0; j < interacts.length; j++) {
                var curItem = window.fx.getItemById(interacts[j].parentNode.id);
                curItem.play(state);
            }
        };

        PopupContentItem.prototype.unplay = function(obj) {
            var self = this;
            var state = self.el.children[obj];
            state.style.display = "none";
            var interacts = state.querySelectorAll("div[title=SlideShow]");
            for (var j = 0; j < interacts.length; j++) {
                var curItem = window.fx.getItemById(interacts[j].parentNode.id);
                curItem.destroy();
            }
        };

        PopupContentItem.prototype.playAnimation = function(obj) {
            var interacts = $(obj[0]).find("div[title=Animation]");
            if (interacts.length > 0) {
                var animation = window.fx.getItemById(interacts[0].id);
                animation.popupAnimationsPlay(obj[0]);
            }
        };

        PopupContentItem.prototype.stopAnimation = function(obj) {
            var interacts = $(obj[0]).find("div[title=Animation]");
            if (interacts.length > 0) {
                var animation = window.fx.getItemById(interacts[0].id);
                animation.popupAnimationsStop(obj[0]);
            }
        };

        //设置关闭按钮位置
        PopupContentItem.prototype.setCloseButtonPos = function(node, parentIndex) {
            setCloseButtonPos(node, parentIndex);
        }

        //获取每个画面宽高，计算按钮位置
        function GetPicturePos(content, pos) {
            var grpItemLenth = content.length;
            for (var i = 0; i < grpItemLenth; i++) {
                if (content.children()[i].title === "groupItem")
                    GetPicturePos(content.children().eq(i), pos);
                else {
                    var posNode = content.children()[i];
                    var animationLeft = 0;
                    var animationTop = 0;

                    //动画元素,外有一层全页面大小的div
                    if ($(posNode).attr('title') === 'Animation') {
                        var animationLeft = parseInt($(posNode).css('left'));
                        var animationTop = parseInt($(posNode).css('top'));
                        posNode = $(posNode).children()[0];
                    }

                    var transX = 1;
                    var transY = 1;
                    var transformStr = $(posNode).css("transform");
                    if (transformStr !== "" && transformStr !== "none") {
                        var _transformStr = transformStr.substring(7);
                        _transformStr = _transformStr.substring(0, _transformStr.length - 1);
                        var transformArray = _transformStr.split(',');
                        if (transformArray.length === 6) {
                            transX = Number(transformArray[0]);
                            transY = Number(transformArray[3]);
                        }
                    }

                    var posCenterLeft = posNode.offsetLeft + posNode.offsetWidth / 2 + animationLeft;
                    var posCenterTop = posNode.offsetTop + posNode.offsetHeight / 2 + animationTop;
                    var posInitLeft = posCenterLeft - (posNode.offsetWidth * transX) / 2;
                    var posInitTop = posCenterTop - (posNode.offsetHeight * transY) / 2;
                    var posWidthLeft = posCenterLeft + (posNode.offsetWidth * transX) / 2;
                    var posHeightTop = posCenterTop + (posNode.offsetHeight * transY) / 2;


                    switch (pos) {
                        case 'CloseImgTop': // 顶
                            posLeft = posCenterLeft;
                            posTop = posInitTop;
                            translateY = 0;
                            break;
                        case 'CloseImgRightUpCorner': //右上
                            posLeft = posWidthLeft;
                            posTop = posInitTop;
                            translateX = '-100%';
                            translateY = 0;
                            break;
                        case 'CloseImgLeft': //左
                            posLeft = posInitLeft;
                            posTop = posCenterTop;
                            translateX = 0;
                            break;
                        case 'CloseImgCenter': //中
                            posLeft = posCenterLeft;
                            posTop = posCenterTop;
                            translateX = '-50%';
                            translateY = '-50%';
                            break;
                        case 'CloseImgRight': //右
                            posLeft = posWidthLeft;
                            posTop = posCenterTop;
                            translateX = '-100%';
                            break;
                        case 'CloseImgLeftLowCorner': //左下
                            posLeft = posInitLeft;
                            posTop = posHeightTop;
                            translateX = 0;
                            translateY = '-100%';
                            break;
                        case 'CloseImgBottom': //底
                            posLeft = posCenterLeft;
                            posTop = posHeightTop;
                            translateY = '-100%';
                            break;
                        case 'CloseImgRightLowCorner': //右下
                            posLeft = posWidthLeft;
                            posTop = posHeightTop;
                            translateX = '-100%';
                            translateY = '-100%';
                            break;
                        default: //CloseImgLeftUpCorner  左上
                            posLeft = posInitLeft;
                            posTop = posInitTop;
                            translateX = 0;
                            translateY = 0;

                    }
                }
            }

        }

        function setCloseButtonPos(node, parentIndex) {
            var parentIndex = parentIndex ? parentIndex : 0;

            var contentLength = node.children().length;
            if (contentLength === 2) {
                var value = JSON.parse($(node).siblings('input[name=json]')[0].value);
                var pos = value.closeButtonPos || 'default';
                GetPicturePos($(node).children().eq(0), pos);

                // var w = $(node).children().eq(1).css('width');
                // var h = $(node).children().eq(1).css('height');
                // var finalW = scaleX >= 0.5 ? 30 : parseFloat(w) * scaleX;
                // var finalH = scaleY >= 0.5 ? 30 : parseFloat(h) * scaleY;
                var curIndex = $(node).children().eq(1).css('z-index');

                $(node).children().eq(1).css({
                    "left": posLeft + "px",
                    'top': posTop + "px",
                    'transform': 'translate(' + translateX + ',' + translateY + ')',
                    'opacity': 1,
                    'width': '30px',
                    'height': '30px',
                    'z-index': parseInt(curIndex) + parseInt(parentIndex),
                });
            }
        }

        return new PopupContentItem(id, option);
    }
})(window);