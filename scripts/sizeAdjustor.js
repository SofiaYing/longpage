var SizeAdjustor = function(jsondata) {
    this.originSize = this.getOriginSize();
    this.jsonData = this.getJson();
    this.finalSize = this.getFinalSize();
    this.finalLeft = 0;
    this.finalRight = 0;
    this.scaleX = this.finalSize.width / this.originSize.width;
    this.scaleY = this.finalSize.height / this.originSize.height;
    this.clientW = document.documentElement.clientWidth;
    this.clientH = document.documentElement.clientHeight;
}
SizeAdjustor.prototype = {
    getJson: function() {
        var json;
        json = document.getElementById("json");
        if (json == undefined) return;
        var strdata = document.getElementById('json').value;
        var jsondata = eval("(" + strdata + ")");
        return jsondata;
    },

    getOriginSize: function() {
        var head = document.getElementsByTagName('head')[0];

        // function GetChild(selector, parent, index) {
        //     var indexElement = 0;
        //     var children = parent.childNodes;
        //     var len = children.length;
        //     for (var i = 0; i < len; i++) {
        //         if (children[i].nodeName.toLowerCase() === "#text")
        //             continue;
        //         if (selector !== '' && selector !== undefined && selector !== children[i].nodeName.toLowerCase())
        //             continue;
        //         if (indexElement === index)
        //             return children[i];
        //         else
        //             indexElement++;
        //     }
        // }
        var viewport = GetChild('meta', head, 0);
        console.log('vvv', viewport)
        if (viewport.name === 'viewport') {
            var content = viewport.content;
            var pos = content.indexOf('width=', 0);
            pg_Width = parseInt(content.substr(pos + 6));
            pos = content.indexOf('height=', 0);
            pg_Height = parseInt(content.substr(pos + 7));
            var res = { width: pg_Width, height: pg_Height };
            viewport.content = "width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0";
            return res;
        }
        return null;
    },

    getFinalSize: function() {
        this.clientW = document.documentElement.clientWidth;
        this.clientH = document.documentElement.clientHeight;
        var clientW = this.clientW;
        var clientH = this.clientH;
        var adjustType = this.jsonData.adjustType;
        var pg_Width = this.originSize.width,
            pg_Height = this.originSize.height;
        var finalW, finalH;
        if (adjustType === "heightAdjust") {
            var objW = clientH * pg_Width / pg_Height;
            objW = Math.ceil(objW);
            finalW = objW;
            finalH = clientH;
        } else if (adjustType === "widthAdjust") {
            var objH = clientW * pg_Height / pg_Width;
            objH = Math.ceil(objH);
            finalW = clientW;
            finalH = objH;
        } else if (adjustType === "fullAdjust") {
            finalW = clientW;
            finalH = clientH;
        } else if (adjustType === "autoAdjust") {
            var clientWHRatio = clientW / clientH;
            var pageWHRatio = pg_Width / pg_Height;
            if (clientWHRatio >= pageWHRatio) //选择高度适配
            {
                var objW = clientH * pg_Width / pg_Height;
                objW = Math.ceil(objW);
                finalW = objW;
                finalH = clientH;
            } else {
                var objH = clientW * pg_Height / pg_Width;
                objH = Math.ceil(objH);
                finalW = clientW;
                finalH = objH;
            }
        } else if (adjustType === "longPageAdjust") {
            // if (pg_Height < pg_Width) {
            //     $('body').css({ 'transform': 'rotate(90deg)', 'transform-origin': 'right' });
            //     $('#divpar').css({ 'overflow-x': 'scroll', 'height': '100%', 'width': '100vh' });
            //     finalH = clientW;
            //     finalW = pg_Width * pg_Height / clientW;
            // }
            var divpar = document.getElementById('divpar');
            if (!is_mobile()) {
                // var outerWidth = $('#divpar')[0].offsetWidth;
                // var innerWidth = $('#divpar')[0].clientWidth;
                var outerWidth = divpar.offsetWidth;
                var innerWidth = divpar.clientWidth;
                var scrollBarWidth = outerWidth - innerWidth;
                finalW = clientW - scrollBarWidth;
                if (outerWidth > 320) {
                    // finalW = 375 - scrollBarWidth;
                    finalW = 375;
                    finalH = pg_Height * 375 / pg_Width;
                } else {
                    finalW = innerWidth;
                    finalH = pg_Height * innerWidth / pg_Width;
                }
            } else {
                finalW = clientW;
                finalH = pg_Height * clientW / pg_Width;
            }

        }
        finalW = Math.ceil(finalW);
        finalH = Math.ceil(finalH);
        var res = { width: finalW, height: finalH };
        return res;
    },
    adjustContainer: function() {
        var clientH = document.documentElement.clientHeight;
        var clientW = document.documentElement.clientWidth;
        var container = document.getElementById("swiper_container");
        var divpar = document.getElementById('divpar')

        if (this.jsonData.adjustType === "longPageAdjust") {
            this.finalTop = 0;
            this.finalLeft = clientW / 2 - this.finalSize.width / 2;
            // this.finalLeft = 0;
            var outerWidth = divpar.offsetWidth;
            if (!is_mobile() && outerWidth < 320) {
                this.finalLeft = 0;
            }

        } else {
            this.finalTop = clientH / 2 - this.finalSize.height / 2;
            this.finalLeft = clientW / 2 - this.finalSize.width / 2;
        }

        container.style.cssText +=
            "display:block; transform-origin:left top; transform:scale(" + this.scaleX + "," + this.scaleY + "); left:" + this.finalLeft +
            "px; top:" + this.finalTop + "px";

        setTimeout(function() {
            document.getElementById("loadingBox").style.display = "none";
        }, 800)
    },
    update: function() {
        this.finalSize = this.getFinalSize();
        this.scaleX = this.finalSize.width / this.originSize.width;
        this.scaleY = this.finalSize.height / this.originSize.height;
        // this.scaleY = this.finalSize.width / this.originSize.height;
        // this.scaleX = this.finalSize.height / this.originSize.width;
    }
}