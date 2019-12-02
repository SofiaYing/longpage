/**
 * Created by codingnuts on 2018/5/22.
 */

window.FX = window.FX || {};
FX.utils = {
	//主要是把 sup中的prototype 给sub
	inherit: function (sup, sub) {
		var _create = Object.create || function (_prototype) {
				var f = function () {
				};
				f.prototype = _prototype;
				return new f();
			};
		sub.prototype = _create(sup.prototype);
		sub.prototype.constructor = sub;
	},
	getQueryString: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)return unescape(r[2]);
		return null;
	},
	trim: function (str) {
		return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
	},
	getScaledPos: function(element, pageX, pageY) {
        if(typeof element === "number" || element === null){
            pageY = pageX;
            pageX = element;
            element = document.getElementById("swiper_container");
        }
        var elPosX = 0, elPosY = 0, tempEl = element;
        while (tempEl && !tempEl.classList.contains("divshow")) {
            elPosX += tempEl.offsetLeft;
            elPosY += tempEl.offsetTop;
            tempEl = tempEl.parentNode;
        }
        var finalX, finalY;
        if(pageX) finalX = (pageX - window.sizeAdjustor.finalLeft) / window.sizeAdjustor.scaleX - elPosX;
        if(pageY) finalY = (pageY - window.sizeAdjustor.finalTop) / window.sizeAdjustor.scaleY - elPosY;
        if(finalX && finalY) return {x: finalX, y: finalY};
        else if(finalX) return finalX;
        else if(finalY) return finalY;
    },
};


