/**
 * Created by codingnuts on 2018/5/22.
 * 统一消息分发
 */
window.FX = window.FX || {};
FX.plugins = {};

(function(global) {
    var _FXH5 = function(options) {
        //key: pageNo, value: Array<Object>
        this.options = options || {};
        this.id2item = {};
        this.id2pageNo = {};
        this.name2items = {};
        this.init(options);
    };

    _FXH5.prototype = {
        init: function(options) {
            var obj = this;
            if (options) {
                Object.keys(options).forEach(function(pageNo) {
                    if (options[pageNo] instanceof Array) {
                        var listener = getListener(obj, pageNo, true);
                        options[pageNo].forEach(function(config) {
                            var curListener = FX.plugins[config.plugin](config.container, config.option);
                            obj.id2item[config.container] = curListener;
                            obj.id2pageNo[config.container] = +pageNo;
                            if (obj.name2items[config.plugin] === void 0) {
                                obj.name2items[config.plugin] = [];
                            }
                            obj.name2items[config.plugin].push(curListener);
                            listener.push(curListener);
                        });
                    }
                });
            }
        },
        on: function(types, options) {
            var obj = this;
            types = trim(types).split(/\s+/);
            for (var i = 0, ti; ti = types[i++];) {
                if (!(options instanceof Array)) {
                    var arr = [];
                    arr.push(options);
                    options = arr;
                }
                options.forEach(function(config) {
                    getListener(obj, ti, true).push(FX.plugins[config.plugin](config.container, config.option));
                });
                obj.options[ti] = obj.options[ti] || [];
                obj.options[ti] = obj.options[ti].concat(options);
            }
        },

        viewOn: function(types, options) {
            var obj = this;
            types = trim(types).split(/\s+/);
            for (var i = 0, ti; ti = types[i++];) {
                if (!(options instanceof Array)) {
                    var arr = [];
                    arr.push(options);
                    options = arr;
                }
                options.forEach(function(config) {
                    getListener(obj, ti, true).push(FX.plugins[config.plugin](config.container, config.option));
                });
                obj.options[ti] = obj.options[ti] || [];
                obj.options[ti] = options

            }
        },
        //未经测试，需要用到的时候再说吧
        off: function(types, options) {
            var obj = this
            types = trim(types).split(/\s+/);
            for (var i = 0, ti; ti = types[i++];) {
                var listeners = getListener(this, ti);
                var listenersIndex = listeners.findIndex(function(item, index) {
                    var ele = (item.$target && item.$target[0]) || item.el
                    return ele.getAttribute('id') === options.container
                })
                listeners.splice(listenersIndex, 1)

                var optionsIndex = this.options.view.findIndex(function(item, index) {
                    return item.container === options.container
                })
                this.options[ti][optionsIndex] = []
            }

        },

        reset: function() {
            var obj = this;
            var types = arguments[0];
            types = trim(types).split(' ');
            for (var i = 0, ti; ti = types[i++];) {
                var listeners = getListener(obj, ti),
                    r, t, k;
                if (listeners) {
                    k = listeners.length;
                    while (k--) {
                        if (!listeners[k]) continue;
                        t = listeners[k].reset(obj.options[ti][k].option);
                        if (t === true) {
                            return t;
                        }
                        if (t !== undefined) {
                            r = t;
                        }
                    }
                }
            }
            return r;
        },
        destroy: function() {
            var obj = this;
            var types = arguments[0];
            types = trim(types).split(' ');
            for (var i = 0, ti; ti = types[i++];) {
                var listeners = getListener(obj, ti),
                    r, t, k;
                if (listeners) {

                    k = listeners.length;
                    while (k--) {
                        if (!listeners[k]) continue;
                        t = listeners[k].destroy(obj.options[ti][k].option);
                        if (t === true) {
                            return t;
                        }
                        if (t !== undefined) {
                            r = t;
                        }
                    }
                }
            }
            return r;
        },
        getItemById: function(id) {
            var obj = this;
            return obj.id2item[id];
        },
        getPageNoById: function(id) {
            var obj = this;
            return obj.id2pageNo[id];
        },
        getItemsByCtrlName: function(ctrlName) {
            var obj = this;
            if (typeof ctrlName !== "string") return null;
            return obj.name2items[ctrlName] || null;
        }
    };

    function getListener(obj, type, force) {
        var allListeners;
        type = type.toLowerCase();
        return ((allListeners = (obj.__allListeners || force && (obj.__allListeners = {}))) &&
            (allListeners[type] || force && (allListeners[type] = [])));
    }

    function trim(str) {
        return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
    }

    global.FXH5 = _FXH5;

})(this, undefined);