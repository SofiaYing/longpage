/**
 * Created by codingnuts on 2018/5/22.
 */

(function (global) {
	var _FXInterface = function () {

	};
	_FXInterface.prototype = {
		init: function () {
			throw new Error("init 方法需要在子类中重写！");
		},
		reset: function () {
			throw new Error("reset 方法需要在子类中重写！");
		},
		destroy: function () {
			throw new Error("destroy 方法需要在子类中重写！");
		}
	};
	global.FXInterface = _FXInterface;
})(this, undefined);