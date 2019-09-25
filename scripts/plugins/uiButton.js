(function() {
    FX.plugins["uiButton"] = (function(id, option) {
        // 对象
        var UIButton = function(id, option) {
            this.el = document.getElementById(id);
            this.buttonDiv = this.el.firstElementChild;
            this.option = this.getOption();
            this.targetUrl = window.dataController.collect;
            this.data = {};
            this.submitOnce = false;
            this.nothingToSub = true;
            this.event = this.option.event;
            this.init(id, option);
        };

        // 继承接口
        FX.utils.inherit(FXInterface, UIButton);

        //组件初始化
        UIButton.prototype.init = function(id, option) {
            var self = this;
            console.info("init:", id);
            console.info("option:", option);
            self.addListener();
            self.paramRes = window.dataController.paramRes;
            self.paramInfo = self.paramRes === void 0 ? "" : self.paramRes["param"];
        };

        //重置数据
        UIButton.prototype.reset = function(option) {
            var self = this;
            console.info("reset", option);
        };

        //数据重置
        UIButton.prototype.destroy = function() {
            var self = this;
        };

        UIButton.prototype.getOption = function() {
            var self = this;
            var jsonstr = self.el.querySelector("input[name=json]").value;
            var jsondata = eval("(" + jsonstr + ")");
            return jsondata; //返回一个数组，包含所有应提交数据的input组件
        };

        UIButton.prototype.addListener = function() {
            var self = this;
            self.buttonDiv.addEventListener('click', function(e) {
                if ((self.submitOnce || (window.localStorage && localStorage.getItem(self.paramInfo) === "true")) && !self.option.repeatSubmit) {
                    alert("请不要重复提交!");
                    return;
                }
                self.excute();
            }, false);
        }

        UIButton.prototype.excute = function() {
            var self = this;
            self.nothingToSub = true;
            var firstElement = null;
            var idCollection = self.option.ctrlIds;
            var nameCollection = self.option.ctrlNames;
            if (!self.commitEls) {
                var formElements = document.querySelectorAll("div[title=radioItem], div[title=uiTextBox], div[title=checkItem], div[title=uiImageBox], div[title=uiDropDownListBox]");
                self.commitEls = [];
                for (var i = 0; i < formElements.length; i++) {
                    if (nameCollection.indexOf(formElements[i].getAttribute("name")) !== -1) self.commitEls.push(formElements[i]);
                }
            }

            var nameList = [];
            for (var i = 0; i < self.commitEls.length; i++) {
                var element = self.commitEls[i];
                var name = element.getAttribute("name");
                nameList.push(name);
                firstElement = firstElement || element;
                var curData = self.getData(element);
                if (!curData) {
                    self.goToIllegalPage(element);
                    if (curData === null) alert("请填写必填数据!");
                    else if (curData === false) alert("数据格式不正确，请重新输入");
                    element.style.border = "1px red solid";
                    return;
                } else if (typeof curData === "object" && self.nothingToSub === true) {
                    var keys = Object.keys(curData);
                    var key = keys[0];
                    if (curData[key]) self.nothingToSub = false;
                }
                element.style.border = "none";
                self.data[name] = curData;
            }
            //新组成的名称列表按原来顺序排列
            nameList.sort(function(name1, name2) {
                return nameCollection.indexOf(name1) - nameCollection.indexOf(name2);
            })
            
            if (firstElement === null)
                return;
            if (self.nothingToSub === true) {
                self.goToIllegalPage(firstElement);
                alert("请填写后提交!");
                firstElement.style.border = "1px red solid";
                return;
            }
            var keyStr = window.dataController.getKey();

            self.data['params'] = {
                "workid": self.paramInfo,
                "userid": window.wxuserid,
                "colnames": nameList.join(','),
                "token": keyStr
            };
            console.log(self.data);
            self.uploadData();
            self.doAction();
        }

        UIButton.prototype.getData = function(element) {
            var self = this;
            if (element === null) return null;
            var curId = element.id;
            var isRequired = false;
            var jsonstr = element.querySelector("input[name='json']") && element.querySelector("input[name='json']").value;
            if (jsonstr) {
                var jsondata = eval('(' + jsonstr + ')');
                isRequired = jsondata.required;
            }
            var curItem = window.fx.getItemById(curId);
            return curItem.getCurValue();
        }

        UIButton.prototype.goToIllegalPage = function(element) {
            var self = this;
            var pageNo = window.fx.getPageNoById(element.id);
            window.mySwiper.slideToLoop(pageNo, 0);
        }

        UIButton.prototype.uploadData = function() {
            //xhr
            var self = this;
            $.ajax({
                type: "POST",
                url: self.targetUrl,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(self.data),
                dataType: "json",
                success: function(message) {
                    if (message) {
                        if (!window.localStorage) {
                            console.log("浏览器不支持localStorage");
                        } else {
                            localStorage.setItem(self.paramInfo, "true");
                        }
                        self.submitOnce = true;
                        alert("提交数据成功!");
                    }
                },
                error: function(message) {
                    alert("提交数据失败!");
                }
            });
        }

        UIButton.prototype.doAction = function() {
            var self = this;
            if(self.option.event === "gotoPageAction") {
                window.mySwiper.slideToLoop(self.option.pageIndex - 1, 0);
            }
            else if(self.option.event === "gotoStateAction") {
                var curItem = window.fx.getItemById(self.option.stateuid);
                curItem.play(self.option.stateType - 1);
            }
        }

        UIButton.prototype.getSharedData = function(){

        }

        UIButton.prototype.showSharedData = function(){

        }

        return new UIButton(id, option);
    });
})();