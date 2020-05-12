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
        var viewport = GetChild('meta', head, 0);
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

        var fontScale = clientW / pg_Width; //适配屏幕


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

            var maxFontScale = clientH / pg_Height;
            var finalFontScale = fontScale < maxFontScale ? fontScale : maxFontScale;
            var finalW = pg_Width * finalFontScale;
            var finalH = pg_Height * finalFontScale;
            var contents = document.querySelectorAll('.contentEl');
            var htmlFontSize = 100 * finalFontScale;

            document.querySelector('html').style.fontSize = htmlFontSize + 'px';
            if (clientW > finalW) {
                contents.forEach((content, index) => {
                    // px 与 rem的差别会不会有影响？
                    // content.style.height = '100%';
                    content.style.top = 0;
                    content.style.left = ((clientW - finalW) / 2) / htmlFontSize + 'rem'
                })
            } else {
                contents.forEach((content, index) => {
                    // content.style.width = '100%';
                    content.style.left = 0;
                    content.style.top = ((clientH - finalH) / 2) / htmlFontSize + 'rem'
                })
            }
        } else if (adjustType === "longPageAdjust") {
            // if (pg_Height < pg_Width) {
            //     $('body').css({ 'transform': 'rotate(90deg)', 'transform-origin': 'right' });
            //     $('#divpar').css({ 'overflow-x': 'scroll', 'height': '100%', 'width': '100vh' });
            //     finalH = clientW;
            //     finalW = pg_Width * pg_Height / clientW;
            // }
            if (!is_mobile()) {
                var outerWidth = document.getElementById('divpar').offsetWidth;
                var innerWidth = document.getElementById('divpar').clientWidth;
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

        if (this.jsonData.adjustType === "longPageAdjust") {
            this.finalTop = 0;
            this.finalLeft = clientW / 2 - this.finalSize.width / 2;
            // this.finalLeft = 0;
            var outerWidth = document.getElementById('divpar').style.offsetWidth;
            if (!is_mobile() && outerWidth < 320) {
                this.finalLeft = 0;
            }

            var pages = document.querySelectorAll('.divshow');
            if (pages.length > 1) {
                document.querySelector('#longpage_container').className = ''
                document.querySelector('body').style.position = 'static'
                document.querySelector('body').style.overflow = 'auto'
                pages.forEach(function(page, index) {
                    if (index === 0) {
                        page.style.display = 'block'
                    } else {
                        page.style.display = 'none'
                    }
                })
            }


        } else {
            this.finalTop = clientH / 2 - this.finalSize.height / 2;
            this.finalLeft = clientW / 2 - this.finalSize.width / 2;
        }

        // container.style.cssText +=
        //     "display:block; transform-origin:left top; transform:scale(" + this.scaleX + "," + this.scaleY + "); left:" + this.finalLeft +
        //     "px; top:" + this.finalTop + "px";

        //计算font-size
        container.style.cssText +=
            "display:block;";

        setTimeout(function() {
            document.getElementById("loadingBox").style.display = "none";
        }, 0)
    },
    update: function() {
        this.finalSize = this.getFinalSize();
        this.scaleX = this.finalSize.width / this.originSize.width;
        this.scaleY = this.finalSize.height / this.originSize.height;
        // this.scaleY = this.finalSize.width / this.originSize.height;
        // this.scaleX = this.finalSize.height / this.originSize.width;
    }
}