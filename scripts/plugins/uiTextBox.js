(function () {
	FX.plugins["uiTextBox"] = (function (id, option) {
		// 对象
		var UITextBox = function (id, option) {
			this.el = document.getElementById(id);
			this.textInput = this.el.querySelector("input[type=text],input[type=date],textarea");
			this.option = this.getOption();
			this.isRequired = this.option.required;
			this.relatedMode = this.option.relatedMode;
			this.relatedId = this.option.relatedUIControl;
			this.init(id, option);
		};

		// 继承接口
		FX.utils.inherit(FXInterface, UITextBox);

		//组件初始化
		UITextBox.prototype.init = function (id, option) {
			var self = this;
			console.info("init:", id);
			console.info("option:", option);

			//判断版本
			var version = navigator.userAgent;
			console.info("version:", version);
			if (version.indexOf("Windows NT 5.1") === -1 && version.indexOf("Windows XP") === -1) {
				console.info("Not Xp");
				//self.textInput.style.border = "1px solid #666666";
				self.textInput.style.background = "rgba(0,0,0,0.0)";
			} else {
				console.info("XP");
				if (self.option.inputType === "date") {
					if (self.textInput.style.border !== "none")
						self.textInput.style.border = "2px solid #a9a9a9";
					self.textInput.style.boxSizing = "";
				}
			}
			if (self.relatedMode === "history" || self.relatedMode === "current") {
				self.textInput.readOnly = true;
			}

			self.addListener();
		};

		//重置数据
		UITextBox.prototype.reset = function (option) {
			var self = this;
			if (self.relatedMode === "history") {
				window.dataController.getRelatedValue(self.el.id);
			} else if (self.relatedMode === "current") {
				if (self.relatedId === "si_0")
					return;
				var curItem = window.fx.getItemById(self.relatedId);
				self.textInput.value = curItem.getRelatedValue();
			}
			console.info("reset", option);
		};

		//数据重置
		UITextBox.prototype.destroy = function () {
			var self = this;
		};

		UITextBox.prototype.getOption = function () {
			var self = this;
			var jsonstr = self.el.querySelector("input[name=json]").value;
			var jsondata = eval("(" + jsonstr + ")");
			return jsondata;
		};

		UITextBox.prototype.addListener = function () {
			var self = this;
			var flag = false;

			self.textInput.onblur = function () {
				setTimeout(function () {
					var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
					window.scrollTo(0, Math.max(scrollHeight - 1, 0));
					if (top !== self) {
						window.parent.postMessage("scrollTo", '*');
					}
				}, 100);
			};

			if (self.option.inputType === "date")
				return;

			if (self.option.inputType === "num" || self.option.inputType === "eng" || self.option.inputType === "chi") {
				self.textInput.oninput = function () {
					window.setTimeout(function () {
						var res = self.checkTypeLegal();
						if (!res) {
							window.setTimeout(function () {
								var curValue = self.textInput.value;
								var fnlValue = self.getLeagalText(curValue);
								self.textInput.value = fnlValue;
							}, 0);
						}
					}, 0);
				}
			}

			//阻止鼠标事件冒泡
			self.textInput.addEventListener("pointerdown", function (e) { e.stopPropagation() }, false);
		};

		UITextBox.prototype.checkTypeLegal = function () {
			var self = this;
			var curText = self.textInput.value;
			var option = self.option;
			var regs = [
                /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])+$/,
                /^[A-Za-z]+$/,
                /^\d+$/,
                /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
            ]
			if (option.inputType === "any") return true;
			else if (option.inputType === "chi") {
				return regs[0].test(curText) || curText === "";
			} else if (option.inputType === "eng") {
				return regs[1].test(curText) || curText === "";
			} else if (option.inputType === "num") {
				return regs[2].test(curText) || curText === "";
			} else if (option.inputType === "email") {
				return regs[3].test(curText) || curText === "";
			}
		}

		UITextBox.prototype.getLeagalText = function (curText) {
			var self = this;
			var option = self.option;
			var regs = [
                /[^\u4E00-\u9FA5]/g, //非中文字符
                /[^A-Za-z]/g, //非英文字符
                /[^(\d)]/g //非数字字符
            ]
			if (option.inputType === "chi") return curText.replace(regs[0], "");
			else if (option.inputType === "eng") return curText.replace(regs[1], "");
			else if (option.inputType === "num") return curText.replace(regs[2], "");
		}

		UITextBox.prototype.getCurValue = function () {
			var self = this;
			if (self.option.inputType === "email" && !self.checkTypeLegal()) return false;
			var isRequired = self.isRequired || false;
			var textItem = self.el.querySelector("input[type=text],input[type=date],textarea");
			return textItem.value === "" && isRequired ? null : {
				"text": textItem.value
			};
		}

		UITextBox.prototype.getRelatedValue = function () {
			var self = this;
			return self.textInput.value;
		}

		UITextBox.prototype.setRelatedValue = function (submittedData) {
			var self = this;
			var name = document.getElementById(self.relatedId).getAttribute("name");
			if (submittedData[name] === undefined)
				return;
			self.textInput.value = submittedData[name];
		}

		return new UITextBox(id, option);
	});
})();