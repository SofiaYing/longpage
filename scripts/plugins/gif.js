(function(window, undefined) {
    FX.plugins["gif"] = function(id, option) {
        // 对象
        var GifItem = function(id, option) {
            this.el = document.getElementById(id);
            this.src = this.el.src;
            window.gifSrc = this.src
            this.staticSrc = 'Media/arrow.png'
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, GifItem);

        //组件初始化
        GifItem.prototype.init = function(id, option) {
            var self = this;
            console.info("init:", id);
            console.info("option:", option);
        };

        //重置数据
        GifItem.prototype.reset = function(option) {

            var self = this;
            // debugger
            this.el.src = this.staticSrc
            self.el.src = self.src;
            console.log('r self.el', this.el, self.el.src)
                // console.info("reset", option);
        };

        //数据重置
        GifItem.prototype.destroy = function() {
            var self = this;

            this.el.src = this.staticSrc
            console.log('d this.el', this.el, this.el.src, this.staticSrc)

        };

        GifItem.prototype.play = function(obj) {
            var self = this;
        };

        return new GifItem(id, option);
    }
})(window);