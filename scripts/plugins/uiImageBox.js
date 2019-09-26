(function () {
	FX.plugins["uiImageBox"] = (function (id, option) {
		// 对象
		var uiImageBox = function (id, option) {
			this.el = document.getElementById(id);
			this.img = this.el.querySelector("img");
			this.input = this.el.querySelector("input[type=file]");
			this.applyBtn = document.querySelector("#apply");
			this.cancelBtn = document.querySelector("#cancel");
			this.cropperContainer = document.getElementById("cropper_container");
			this.cropperImg = this.cropperContainer.querySelector("img");
			this.option = this.getOption();
			this.imgOversize = false;
			this.isRequired = this.option.required;
			this.relatedMode = this.option.relatedMode;
			this.relatedId = this.option.relatedUIControl;
			this.init();
		};

		//组件初始化
		uiImageBox.prototype.init = function () {
			console.info("init:", id);
			console.info("option:", option);
			var self = this;
			var vertion = navigator.userAgent;
			if (vertion.indexOf("Android") > -1) {
				if (vertion.indexOf("MicroMessenger") > -1) {
					self.input.accept = "image/*";
				}
			}
			if (self.relatedMode === "history" || self.relatedMode === "current") {
				this.input.style.display = "none";
				return;
			}
			self.addListener();
		};

		//重置数据
		uiImageBox.prototype.reset = function (option) {
			console.info("reset", option);
			var self = this;
			if(self.relatedMode === "history") {
                window.dataController.getRelatedValue(self.el.id);
            }
            else if(self.relatedMode === "current"){
                if(self.relatedId === "si_0")
                    return;
				var curItem = window.fx.getItemById(self.relatedId);
				self.img.src = curItem.getRelatedValue();
            }
		};

		//数据重置
		uiImageBox.prototype.destroy = function () {
			console.info("destroy");
			var self = this;
		};

		uiImageBox.prototype.getOption = function () {
			var self = this;
			var jsonstr = self.el.querySelector("input[type=hidden]").value;
			var jsondata = eval("(" + jsonstr + ")");
			return jsondata;
		}

		uiImageBox.prototype.excuteLoad = function () {
			var self = this;
			if (typeof FileReader === undefined) {
				fileDiv.innerHTML = "当前浏览器不支持照片预览";
				return;
			}
			var file = self.input.files[0];
			if (file === void 0) return;
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				self.imgOversize = file.size > 1025 * 1024 ? true : false;
				if (self.option.display === true) {
					self.cropperImg.src = this.result;
					self.showButton();
					self.cropper = new Cropper(self.cropperImg, {
						initiaAspectRatio : 1,
						aspectRatio : self.el.offsetWidth/self.el.offsetHeight,
					});
				} else {
					var imgRatio = self.imgOversize === true ? 0.2 : 1;
					self.cropperImg.src = this.result;
					self.cropperImg.onload = function () {
						var base64 = self.getBase64(self.cropperImg, self.cropperImg.naturalWidth, self.cropperImg.naturalHeight, imgRatio);
						self.img.setAttribute("data-base64", base64);
					}
				}
			}
		}

		uiImageBox.prototype.addListener = function () {
			var self = this;
			self.input.onchange = function () {
				self.excuteLoad();
			};
			var startEvent = is_mobile() ? "touchstart" : "pointerdown";
			self.el.addEventListener(startEvent, function (e) {
				if (e.stopPropagation) e.stopPropagation();
				else window.event.cancelBubble = true;
			}, false);
			self.applyBtn.addEventListener("click", function (e) {
				var canvas = self.cropper.getCroppedCanvas();
				var imgRatio = self.imgOversize === true ? 0.2 : 1;
				var baseURL = canvas.toDataURL("image/jpeg", imgRatio);
				self.img.src = baseURL;
				self.img.setAttribute("data-base64", baseURL);
				self.cropper.destroy();
				self.hideButton();
			}, false);
			self.cancelBtn.addEventListener("click", function (e) {
				self.cropper.destroy();
				self.hideButton();
			}, false);
		}

		uiImageBox.prototype.showButton = function () {
			var self = this;
			self.applyBtn.style.display = "block";
			self.cancelBtn.style.display = "block";
			self.cropperContainer.style.display = "block";
		}

		uiImageBox.prototype.hideButton = function () {
			var self = this;
			self.applyBtn.style.display = "none";
			self.cancelBtn.style.display = "none";
			self.cropperContainer.style.display = "none";
		}

		uiImageBox.prototype.getBase64 = function (img, width, height, ratio) {
			var canvas, ctx, img64;

			canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width, height);

			img64 = canvas.toDataURL("image/jpeg", ratio);

			return img64;
		}

		uiImageBox.prototype.getCurValue = function () {
			var self = this;
			var isRequired = self.isRequired || false;
			var img = self.el.querySelector("img");
			if (img === void 0 || img.src === void 0) return null;
			var imgSrc = img.getAttribute("data-base64") || "";
			var reg = /data:image\/\w+;base64/i;
			return !imgSrc && isRequired ? null : {
				"picdata": imgSrc
			};
		}

		uiImageBox.prototype.getRelatedValue = function () {
			var self = this;
			return self.el.querySelector("img").getAttribute("src");
		}

		uiImageBox.prototype.setRelatedValue = function(submittedData) {
            var self = this;
            var name = document.getElementById(self.relatedId).getAttribute("name");
            if(submittedData[name] === undefined)
                return;
            var curItem = window.fx.getItemById(self.relatedId);
            self.img.src = "http://47.93.36.77:5080/TQMS/" + submittedData[name];
        }

		return new uiImageBox(id, option);
	});
})();