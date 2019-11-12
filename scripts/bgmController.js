var BGMController = function(bgmData, hideIcon) {
    this.bgmState = false;
    this.bgmData = bgmData;
    this.hideIcon = hideIcon;
    this.bgmRange = this.getRangeArr();
    this.bgmDiv = document.getElementById("divbgm");
    this.bgmPlay = document.getElementById("bgmPlay");
    this.bgmPause = document.getElementById("bgmPause");
    this.bgmAudio = document.getElementById("aubgm");
    this.bgmDiv.style.display = "none";
    this.init();
}

BGMController.prototype = {
    init: function() {
        this.addListener();
    },
    getRangeArr: function() {
        var bgmRange = new Array();
        for (var i in this.bgmData) {
            var start = this.bgmData[i].start - 1,
                end = this.bgmData[i].end - 1;
            for (var j = start; j <= end; j++) {
                bgmRange[j] = i;
            }
        }
        return bgmRange;
    },
    controlAutoBgm: function(curIndex, preIndex) {
        if (-1 === preIndex) return;
        if ((preIndex === undefined || this.bgmRange[curIndex] != this.bgmRange[preIndex]) && this.bgmRange[curIndex] !== undefined) {
            if (this.hideIcon === "false") this.bgmDiv.style.display = "block";
            window.pauseBgmAudio(this.bgmAudio);
            //this.bgmAudio.pause();
            this.bgmAudio.src = this.bgmData[this.bgmRange[curIndex]].src;
            var isLoop = this.bgmData[this.bgmRange[curIndex]].loop;
            this.bgmAudio.loop = isLoop;
            var self = this;
            if (this.bgmData[this.bgmRange[curIndex]].autoplay === "true") {
                // setTimeout(function(){
                self.playBgm();
                // }, 150);
            } else this.pauseBgm();
        } else if (this.bgmRange[curIndex] === undefined) {
            if (this.hideIcon === "false") this.bgmDiv.style.display = "none";
            window.pauseBgmAudio(this.bgmAudio);
            //this.bgmAudio.pause();
            this.bgmAudio.src = "";
        }
    },
    playBgm: function() {
        var res = window.playBgmAudio(this.bgmAudio);
        //this.bgmAudio.play();
        if (!res) {
            this.pauseBgm();
            return;
        }
        this.bgmState = true;
        if (this.hideIcon === "false") {
            this.bgmPause.style.display = "block";
            this.bgmPlay.style.display = "none";
            this.bgmDiv.classList.add("animate");
        }
    },
    pauseBgm: function() {
        if (this.hideIcon === "false") {
            this.bgmPause.style.display = "none";
            this.bgmPlay.style.display = "block";
            this.bgmDiv.classList.remove("animate");
        }
        window.pauseBgmAudio(this.bgmAudio);
        //this.bgmAudio.pause();
        this.bgmState = false;
    },
    addListener: function() {
        this.draggable(this.bgmDiv, document, this, function() {
            if (this.bgmState) this.pauseBgm();
            else this.playBgm();
        });
    },
    /**
     * [draggable 使得元素可拖动]
     * @param  {[Element]} element     [需要拖动的元素]
     * @param  {[Element]} areaElement [元素拖动范围所对应的元素，如在document范围内可拖动]
     * @param  {[Object]} that        [修改callback函数内部的指针]
     * @param  {[function]} callBack    [如果检测的是点击事件，需执行的操作函数]
     * @return {[no]}             [no]
     */
    draggable: function(element, areaElement, that, callBack) {
        if (is_mobile()) {
            var eventStart = "touchstart";
            var eventMove = "touchmove";
            var eventEnd = "touchend";
        } else {
            var eventStart = "mousedown";
            var eventMove = "mousemove";
            var eventEnd = "mouseup";
        }
        var distanceX = 0,
            distanceY = 0,
            startX = 0,
            startY = 0;

        function start(e) {
            e.preventDefault();
            var point = e.touches ? e.touches[0] : e;
            startX = point.clientX;
            startY = point.clientY;
            var left = this.offsetLeft,
                top = this.offsetTop;
            distanceX = startX - left;
            distanceY = startY - top;
            areaElement.addEventListener(eventMove, move, false);
            areaElement.addEventListener(eventEnd, end, false);
        }

        function move(e) {
            e.preventDefault();
            if (e.buttons > 0 || is_mobile()) {
                var point = e.touches ? e.touches[0] : e;
                var moveX = point.clientX,
                    moveY = point.clientY;
                element.style.left = (moveX - distanceX) + "px";
                element.style.top = (moveY - distanceY) + "px";
            }
        }

        function end(e) {
            e.preventDefault();
            var point = e.changedTouches ? e.changedTouches[0] : e;
            var endX = point.clientX,
                endY = point.clientY;
            if (callBack && endX - startX < 3 && endX - startX > -3 && endY - startY < 3 && endY - startY > -3) callBack.call(that);
            areaElement.removeEventListener(eventMove, move, false);
            areaElement.removeEventListener(eventEnd, end, false);
        }
        element.addEventListener(eventStart, start, false);
    }
}