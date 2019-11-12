<<<<<<< HEAD
﻿function GetChild(selector, parent, index) {
    var indexElement = 0;
    var children = parent.childNodes;
    var len = children.length;
    for (var i = 0; i < len; i++) {
        if (children[i].nodeName.toLowerCase() === "#text")
            continue;
        if (selector !== '' && selector !== undefined && selector !== children[i].nodeName.toLowerCase())
            continue;
        if (indexElement === index)
            return children[i];
        else
            indexElement++;
    }
}

function PreventDefault(e) {
    //阻止默认浏览器动作(W3C) 
    if (e && e.preventDefault)
        e.preventDefault();
    //IE中阻止函数器默认动作的方式 
    else
        window.event.returnValue = false;
    return false;
}

function bindEvent(node, type, func) {
    if (node === undefined) {
        return;
    }
    type.toLowerCase();
    if (is_mobile()) {
        if (type === 'vmousedown') {
            addDefaultEvent(node, 'mousedown');
            type = "touchstart";
        } else if (type === 'vmousemove') {
            addDefaultEvent(node, 'mousemove');
            type = "touchmove";
        } else if (type === 'vmouseover') {
            addDefaultEvent(node, 'mouseover');
            type = "touch";
        } else if (type === 'vmouseup') {
            addDefaultEvent(node, 'mouseup');
            type = "touchend";
        } else if (type === 'vpointerdown') {
            addDefaultEvent(node, 'pointerdown');
            type = "touchstart";
        } else if (type === 'vpointermove') {
            addDefaultEvent(node, 'pointermove');
            type = "touchmove";
        } else if (type === 'vpointerup') {
            addDefaultEvent(node, 'pointerup');
            type = "touchend";
        }
    } else {
        if (type === 'vmousedown') {
            type = "mousedown";
        } else if (type === 'vmousemove') {
            type = "mousemove";
        } else if (type === 'vmouseover') {
            type = "mouseover";
        } else if (type === 'vmouseup') {
            type = "mouseup";
        } else if (type === 'vpointerdown') {
            type = "pointerdown";
        } else if (type === 'vpointermove') {
            type = "pointermove";
        } else if (type === 'vpointerup') {
            type = "pointerup";
        }
    }
    if (node.addEventListener) {
        node.addEventListener(type, func, false);
    } else if (node.attachEvent) {
        node.attachEvent("on" + type, func);
    } else {
        node["on" + type] = func;
    }
}

function addDefaultEvent(node, type) {
    node.addEventListener(type, function(e) {
        e.preventDefault();
    }, false);
}

function bindEvent1(node, type, func, para1) {
    var eventCallBack = func;
    eventCallBack = function(event) {
        func(para1);
    }
    bindEvent(node, type, eventCallBack);
}

function is_mobile() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    if (sUserAgent.match(/(iphone|ipod|ipad|ios|android|windows phone|phone|backerry|webos|symbian)/i))
        return true;
    else
        return false;
}

function is_weixin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

function is_ios() {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
}

function is_android() {
    return /(Android)/i.test(navigator.userAgent)
}

/*
 * 取得对应类和标签的HTML元素
 * clsName:给定类名
 * tagName：给定的HTML元素，如果为任意 tagName='*'
 */
function getElementsByClassName(clsName, tagName) {
    var ClassElements = [];
    selElements = document.getElementsByTagName(tagName);
    for (var i = 0; i < selElements.length; i++) {
        if (selElements[i].className == clsName) {
            ClassElements[ClassElements.length] = selElements[i];
        }
    }
    return ClassElements;
}

function parents(selector, node) {
    var matched = [];
    var cur = node.parentNode;
    var splits = getsplit(selector);
    for (; 1; cur = cur.parentNode) {
        if (cur.nodeType === 9)
            break;
        if (isMatch(splits, cur) === false) {
            continue;
        }
        if (cur.nodeType === 1) {
            matched.push(cur);
        }
    }
    return matched;
}

function getsplit(selector) {
    //example1: "div[title='PopupContent']"    
    var matched = [];
    if (selector === '' || selector === undefined)
        return matched;
    var splits1 = selector.split(/[\[\]]/);

    for (var i = 0; i < splits1.length; i++) {
        if (splits1[i] === "")
            continue;
        var splits2 = splits1[i].split(/[=']/);
        if (splits2.length === 1) {
            matched.push(splits2[0]);
            matched.push("");
        } else if (splits2.length >= 2) {
            for (var j = 0; j < splits2.length; j++) {
                if (splits2[j] === "")
                    continue;
                matched.push(splits2[j]);
            }
        }
    }
    return matched;
}

function isMatch(matched, node) {
    if (matched.length > 0) {
        if (matched[0] !== node.nodeName.toLowerCase())
            return false;
    }
    for (var i = 2; i < matched.length; i += 2) {
        if (node.getAttribute(matched[i]) === matched[i + 1])
            return true;
    }
    if (matched.length > 2) {
        //有属性且都不匹配
        return false;
    } else
        return true;
}

function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

function getUserZoom() {
    if (top === self)
        return 1;
    else
        return parent.document.getElementById("ifr1").getAttribute("userzoom");
}

function getUserZoomY() {
    if (top === self)
        return 1;
    else
        return parent.document.getElementById("ifr1").getAttribute("userzoomY");
=======
﻿function GetChild(selector, parent, index) {
    var indexElement = 0;
    var children = parent.childNodes;
    var len = children.length;
    for (var i = 0; i < len; i++) {
        if (children[i].nodeName.toLowerCase() === "#text")
            continue;
        if (selector !== '' && selector !== undefined && selector !== children[i].nodeName.toLowerCase())
            continue;
        if (indexElement === index)
            return children[i];
        else
            indexElement++;
    }
}

function PreventDefault(e) {
    //阻止默认浏览器动作(W3C) 
    if (e && e.preventDefault)
        e.preventDefault();
    //IE中阻止函数器默认动作的方式 
    else
        window.event.returnValue = false;
    return false;
}

function bindEvent(node, type, func) {
    if (node === undefined) {
        return;
    }
    type.toLowerCase();
    if (is_mobile()) {
        if (type === 'vmousedown') {
            addDefaultEvent(node, 'mousedown');
            type = "touchstart";
        } else if (type === 'vmousemove') {
            addDefaultEvent(node, 'mousemove');
            type = "touchmove";
        } else if (type === 'vmouseover') {
            addDefaultEvent(node, 'mouseover');
            type = "touch";
        } else if (type === 'vmouseup') {
            addDefaultEvent(node, 'mouseup');
            type = "touchend";
        } else if (type === 'vpointerdown') {
            addDefaultEvent(node, 'pointerdown');
            type = "touchstart";
        } else if (type === 'vpointermove') {
            addDefaultEvent(node, 'pointermove');
            type = "touchmove";
        } else if (type === 'vpointerup') {
            addDefaultEvent(node, 'pointerup');
            type = "touchend";
        }
    } else {
        if (type === 'vmousedown') {
            type = "mousedown";
        } else if (type === 'vmousemove') {
            type = "mousemove";
        } else if (type === 'vmouseover') {
            type = "mouseover";
        } else if (type === 'vmouseup') {
            type = "mouseup";
        } else if (type === 'vpointerdown') {
            type = "pointerdown";
        } else if (type === 'vpointermove') {
            type = "pointermove";
        } else if (type === 'vpointerup') {
            type = "pointerup";
        }
    }
    if (node.addEventListener) {
        node.addEventListener(type, func, false);
    } else if (node.attachEvent) {
        node.attachEvent("on" + type, func);
    } else {
        node["on" + type] = func;
    }
}

function addDefaultEvent(node, type) {
    node.addEventListener(type, function(e) {
        e.preventDefault();
    }, false);
}

function bindEvent1(node, type, func, para1) {
    var eventCallBack = func;
    eventCallBack = function(event) {
        func(para1);
    }
    bindEvent(node, type, eventCallBack);
}

function is_mobile() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    if (sUserAgent.match(/(iphone|ipod|ipad|ios|android|windows phone|phone|backerry|webos|symbian)/i))
        return true;
    else
        return false;
}

function is_weixin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

function is_ios() {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
}

function is_android() {
    return /(Android)/i.test(navigator.userAgent)
}

/*
 * 取得对应类和标签的HTML元素
 * clsName:给定类名
 * tagName：给定的HTML元素，如果为任意 tagName='*'
 */
function getElementsByClassName(clsName, tagName) {
    var ClassElements = [];
    selElements = document.getElementsByTagName(tagName);
    for (var i = 0; i < selElements.length; i++) {
        if (selElements[i].className == clsName) {
            ClassElements[ClassElements.length] = selElements[i];
        }
    }
    return ClassElements;
}

function parents(selector, node) {
    var matched = [];
    var cur = node.parentNode;
    var splits = getsplit(selector);
    for (; 1; cur = cur.parentNode) {
        if (cur.nodeType === 9)
            break;
        if (isMatch(splits, cur) === false) {
            continue;
        }
        if (cur.nodeType === 1) {
            matched.push(cur);
        }
    }
    return matched;
}

function getsplit(selector) {
    //example1: "div[title='PopupContent']"    
    var matched = [];
    if (selector === '' || selector === undefined)
        return matched;
    var splits1 = selector.split(/[\[\]]/);

    for (var i = 0; i < splits1.length; i++) {
        if (splits1[i] === "")
            continue;
        var splits2 = splits1[i].split(/[=']/);
        if (splits2.length === 1) {
            matched.push(splits2[0]);
            matched.push("");
        } else if (splits2.length >= 2) {
            for (var j = 0; j < splits2.length; j++) {
                if (splits2[j] === "")
                    continue;
                matched.push(splits2[j]);
            }
        }
    }
    return matched;
}

function isMatch(matched, node) {
    if (matched.length > 0) {
        if (matched[0] !== node.nodeName.toLowerCase())
            return false;
    }
    for (var i = 2; i < matched.length; i += 2) {
        if (node.getAttribute(matched[i]) === matched[i + 1])
            return true;
    }
    if (matched.length > 2) {
        //有属性且都不匹配
        return false;
    } else
        return true;
}

function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

function getUserZoom() {
    if (top === self)
        return 1;
    else
        return parent.document.getElementById("ifr1").getAttribute("userzoom");
}

function getUserZoomY() {
    if (top === self)
        return 1;
    else
        return parent.document.getElementById("ifr1").getAttribute("userzoomY");
>>>>>>> 25fc0efb25765ad31d4ca9bb598db198a07048a2
}