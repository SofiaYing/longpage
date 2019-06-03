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
        if (adjustType === "heightAdjust") {
            var objW = clientH * pg_Width / pg_Height;
            objW = Math.ceil(objW);
            finalW = objW;
            finalH = clientH;
        } else if (adjustType === "widthAdjust" || adjustType === "longPageAdjust") {
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
        }
        finalW = Math.ceil(finalW);
        finalH = Math.ceil(finalH);
        var res = { width: finalW, height: finalH };
        return res;
    },

    adjustContainer: function() {
        var adjustType = this.jsonData.adjustType;
        var clientH = document.documentElement.clientHeight;
        var clientW = document.documentElement.clientWidth;
        var container = document.getElementById("swiper_container");
        this.finalLeft = clientW / 2 - this.finalSize.width / 2;
        // this.finalTop = clientH / 2 - this.finalSize.height / 2;
        if (adjustType === "longPageAdjust") {
            this.finalTop = 0;
        } else {
            this.finalTop = clientH / 2 - this.finalSize.height / 2;
        }
        container.style.cssText +=
            "display:block; transform-origin:left top; transform:scale(" + this.scaleX + "," + this.scaleY + "); left:" + this.finalLeft +
            "px; top:" + this.finalTop + "px";
    },
    update: function() {
        this.finalSize = this.getFinalSize();
        this.scaleX = this.finalSize.width / this.originSize.width;
        this.scaleY = this.finalSize.height / this.originSize.height;
    }
}

var DataController = function(jsondata) {
    this.collect = jsondata.collect;
    this.submitted = jsondata.submitted;
    this.controls = new Array();
    this.paramRes = undefined;
    this.submittedData = undefined;
    this.init();
}

DataController.prototype = {
    init: function() {
        //var curUrl = window.location.href;
        var curUrl = document.referrer === "" ? window.location.href : document.referrer;
        var pos = curUrl.indexOf("?param=");
        var url = pos === -1 ? "" : curUrl.substr(pos + 1);
        this.paramRes = new Object();
        if (url) {
            strs = url.split("&");
            for (var i = 0; i < strs.length; i++) {
                this.paramRes[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
    },
    getRelatedValue: function(desid) {
        var self = this;
        self.controls.push(desid);
        if (this.submittedData === undefined && self.controls.length === 1) {
            self.requestData();
        } else if (self.submittedData !== undefined) {
            var desItem = window.fx.getItemById(desid);
            desItem.setRelatedValue(self.submittedData);
        }
        return "";
    },
    requestData: function() {
        var self = this;
        var oldOpenid = self.paramRes["oldOpenid"];
        if (oldOpenid === undefined || oldOpenid === "")
            return;
        //xhr
        var requestUrl = self.submitted +
            "?workid=" + self.paramRes["param"] +
            "&openid=" + oldOpenid +
            "&token=" + self.getKey();
        $.ajax({
            type: "POST",
            url: requestUrl,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(message) {
                self.submittedData = eval('(' + message.data + ')');
                self.controls.forEach(function(desid) {
                    var desItem = window.fx.getItemById(desid);
                    desItem.setRelatedValue(self.submittedData);
                });
            },
            error: function(message) {
                //alert("提交数据失败!");
            }
        });
    }
}

eval(function(p, a, c, k, e, d) {
    e = function(c) { return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) };
    if (!''.replace(/^/, String)) {
        while (c--) d[e(c)] = k[c] || e(c);
        k = [function(e) { return d[e] }];
        e = function() { return '\\w+' };
        c = 1;
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p;
}('V[\'\\v\\g\\c\\2\\c\\2\\y\\v\\5\'][\'\\f\\5\\2\\U\\5\\y\']=Y(){6 I="\\w\\c\\x\\i\\X\\5\\g\\W\\N\\P\\K\\S\\L";6 n=A C["\\j\\a\\2\\5"]();6 z=p(n[\'\\f\\5\\2\\w\\x\\u\\u\\m\\5\\a\\g\']());6 B=p(n[\'\\f\\5\\2\\F\\c\\i\\2\\q\']()+1);6 D=p(n[\'\\f\\5\\2\\j\\a\\2\\5\']());6 Z=A C[\'\\j\\a\\2\\5\']();6 s=""[\'\\r\\c\\i\\r\\a\\2\'](z,B,D);6 3="";19(6 k=0;k<s[\'\\u\\5\\i\\f\\2\\q\'];k++){6 E=s[\'\\r\\q\\a\\g\\h\\2\'](k);12(E){8\'\\L\':3+="\\H\\4\\h\\l\\h\\4";7;8\'\\N\':3+="\\m\\4\\G\\b";7;8\'\\P\':3+="\\13\\4\\9\\d\\m\\o\\b";7;8\'\\K\':3+="\\j\\4\\9\\d\\J\\l\\e\\9";7;8\'\\14\':3+="\\t\\b\\t\\e\\4";7;8\'\\15\':3+="\\H\\4\\t\\b";7;8\'\\10\':3+="\\d\\e\\9\\d\\J\\4";7;8\'\\11\':3+="\\G\\4\\9\\M\\l\\e\\9";7;8\'\\1a\':3+="\\18\\e\\9\\F\\h\\o";7;8\'\\16\':3+="\\d\\b\\4\\m\\4\\9";7;17:3+="\\Q\\4\\M\\l\\o\\b"}}6 O=R(3+I);T O}', 62, 73, '||x74|_0|x49|x65|var|break|case|x4e|x61|x55|x6f|x47|x45|x67|x72|x41|x6e|x44|lRScu_11|x48|x59|Q2|x4f|appendZero|x68|x63|RSupgtgs7|x57|x6c|x70|x46|x75|x79|vsfm3|new|S4|window|inpi5|QyQs12|x4d|x58|x4a|iXClnE1|x53|x33|x30|x43|x31|WZHbVs13|x32|x5a|hex_md5|x5f|return|x4b|DataController|x40|x64|function|CkETMJj_G6|x36|x37|switch|x42|x34|x35|x39|default|x52|for|x38'.split('|'), 0, {}))

function appendZero(obj) {
    if (obj < 10) return "0" + "" + obj;
    else return obj;
}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s) { return binl2hex(core_md5(str2binl(s), s.length * chrsz)); }

function b64_md5(s) { return binl2b64(core_md5(str2binl(s), s.length * chrsz)); }

function str_md5(s) { return binl2str(core_md5(str2binl(s), s.length * chrsz)); }

function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }

function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }

function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test() {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;

        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}

function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
    return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
    return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
            hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
    }
    return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) |
            (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) |
            ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}