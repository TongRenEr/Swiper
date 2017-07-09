/**
 * Created by zhangda on 2017/7/8.
 */

var Swiper = {

    duration: 0, // 动画时长

    nextBtn: undefined,
    preBtn: undefined,
    wrapper: undefined,
    itemWidth: 0,

    index: 1,
    curIndex: 1,
    count: 0,

    offsetLeft: 0, // 偏移量
    startX: 0,
    durationX: 0,

    /**
     * 初始化
     */
    init: function (duration) {

        // 自定义bind方法
        if (!Function.prototype.bind) {
            Function.prototype.bind = function (oThis) {
                if (typeof this !== "function") {
                    // closest thing possible to the ECMAScript 5
                    // internal IsCallable function
                    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                }

                var aArgs = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    fNOP = function () {},
                    fBound = function () {
                        return fToBind.apply(this instanceof fNOP
                                ? this
                                : oThis || this,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                    };

                fNOP.prototype = this.prototype;
                fBound.prototype = new fNOP();

                return fBound;
            };
        }

        // 初始化数据
        this.duration = duration || 0;
        this.wrapper = document.querySelector('.wrapper');
        this.count = this.wrapper.children.length;

        var width = document.querySelector('.item').style.width;

        if(!width){
            throw new Error('...');
        }
        // 计算item宽度
        this.itemWidth = parseInt(width.slice(0, width.length-2));

        if(this.count == 1){

            this.initTouchEvent();

        } else if(this.count == 2){

            // 复制节点
            var cloneNode1 = this.wrapper.children[this.count-1].cloneNode(true);
            var cloneNode2 = this.wrapper.children[0].cloneNode(true);

            this.wrapper.insertBefore(cloneNode1, this.wrapper.children[0]);
            this.wrapper.appendChild(cloneNode2);

            this.index = 2;
            this.count = 4;
            // 调整偏移量
            this.wrapper.style.width = this.count * this.itemWidth + 'px';

            this.wrapper.style.left = this.wrapper.offsetLeft - this.itemWidth + 'px';

            //
            this.nextBtn = document.querySelector('.nextBtn');
            this.preBtn = document.querySelector('.preBtn');

            this.initClickEvent();
            this.initTouchEvent();

        } else if(this.count > 2){

            var cloneNode = this.wrapper.children[this.count-1].cloneNode(true);

            this.wrapper.removeChild(this.wrapper.children[this.count-1]);
            this.wrapper.insertBefore(cloneNode, this.wrapper.children[0]);

            this.index = 2;
            // 调整偏移量
            this.wrapper.style.width = this.count * this.itemWidth + 'px';
            this.wrapper.style.left = this.wrapper.offsetLeft - this.itemWidth + 'px';

            this.nextBtn = document.querySelector('.nextBtn');
            this.preBtn = document.querySelector('.preBtn');

            this.initClickEvent();
            this.initTouchEvent();
        }
    },

    /**
     * 初始化点击事件
     */
    initClickEvent: function () {
        if(!this.nextBtn || !this.preBtn){
            throw new Error('please check nextBtn or preBtn...');
        }

        // 绑定事件
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.preBtn.addEventListener('click', this.pre.bind(this));
    },

    /**
     * 初始化touch事件
     */
    initTouchEvent: function () {

        if(!this.wrapper){
            throw new Error('the wrapper is undefined...');
        }

        this.wrapper.addEventListener('touchstart', this.touchStart.bind(this));
        this.wrapper.addEventListener('touchmove', this.touchMove.bind(this));
        this.wrapper.addEventListener('touchend', this.touchEnd.bind(this));
    },

    /**
     * 向左滑动
     */
    next: function () {

        this.index++;

        if(this.duration){

            // 移动速度
            var speed = this.itemWidth/this.duration;
            // 快速点击时 **
            var timer = setInterval(function () {
                // 计算偏移量
                var oleft = this.wrapper.offsetLeft - speed * 50;
                // 当偏移量大于标准值时，移动完成并停止轮询
                if(oleft < -this.itemWidth * (this.index-1)){ //
                    oleft = -this.itemWidth * (this.index-1);
                    clearInterval(timer);
                }
                // 获取偏移量，相对于父节点
                //console.log(this.wrapper.offsetLeft);
                this.wrapper.style.left = oleft + 'px'
            }.bind(this), 30);

        } else {

            this.wrapper.style.left = this.wrapper.offsetLeft - this.itemWidth + 'px';
        }


        if(this.index%this.count === 0){ // 判断是否为最后一个

            // 复制第一个节点
            var cloneNode = this.wrapper.children[0].cloneNode(true);

            // 将第一个节点移到最后
            this.wrapper.removeChild(this.wrapper.children[0]);
            this.wrapper.appendChild(cloneNode);
            // 因为原有的第一个节点被删除，所以应向右偏移对应的像素
            this.wrapper.style.left = this.wrapper.offsetLeft + this.itemWidth + 'px';

            this.index--;
        }
    },
    
    /**
     * 向右滑动
     */
    pre: function () {

        this.index--;

        if(this.duration){

            // 移动速度
            var speed = this.itemWidth/this.duration;
            // 快速点击时 **
            var timer = setInterval(function () {
                // 计算偏移量

                var oright = this.wrapper.offsetLeft + speed * 50;
                // 当偏移量大于标准值时，移动完成并停止轮询
                if(oright > -this.itemWidth * (this.index-1)){ //
                    oright = -this.itemWidth * (this.index-1);
                    clearInterval(timer);
                }

                // 获取偏移量，相对于父节点
                this.wrapper.style.left = oright + 'px'
            }.bind(this), 30);

        } else {

            this.wrapper.style.left = this.wrapper.offsetLeft + this.itemWidth + 'px';
        }

        if(this.index%this.count === 1){ // 判断是否为第一个

            // 复制第一个节点
            var cloneNode = this.wrapper.children[this.count-1].cloneNode(true);
            // 将第一个节点移到最后
            this.wrapper.removeChild(this.wrapper.children[this.count-1]);
            this.wrapper.insertBefore(cloneNode, this.wrapper.children[0]);
            // 因为原有的第一个节点被删除，所以应向右偏移对应的像素
            this.wrapper.style.left = this.wrapper.offsetLeft - this.itemWidth + 'px';

            this.index++
        }
    },

    /**
     * 手指触摸时
     * @param event
     */
    touchStart: function (event) {

        // 如果这个元素的位置内只有一个手指的话
        if(event.targetTouches.length === 1){

            // 阻止浏览器默认事件，重要
            event.preventDefault();
            var touch = event.targetTouches[0];
            // 记录手指按下时的x轴坐标
            this.startX =touch.clientX;
            this.offsetLeft = this.wrapper.offsetLeft;

        }
    },

    /**
     * 手指滑动时
     * @param event
     */
    touchMove: function (event) {
        // 计算偏移量，移动
        if(event.targetTouches.length === 1){
            // 阻止浏览器默认事件，重要
            event.preventDefault();
            var touch = event.targetTouches[0];

            // 绝对值下雨等于itemWidth
            this.durationX = touch.clientX - this.startX;

            this.wrapper.style.left = this.offsetLeft + this.durationX + 'px';
        }
    },

    /**
     * 手指离开时
     * @param event
     */
    touchEnd: function (event) {


        if(this.count === 1){

            this.wrapper.style.left = this.offsetLeft + 'px';

        } else {

            if(this.durationX > 0) { //向手指向右滑动



                if(this.durationX > 0.3*this.itemWidth){
                    this.pre();
                } else {
                    this.wrapper.style.left = this.offsetLeft + 'px';
                }

            }

            if(this.durationX < 0) { //向手指向左滑动

                if(this.durationX < -(0.3*this.itemWidth)){
                    this.next();
                } else {
                    this.wrapper.style.left = this.offsetLeft + 'px';
                }
            }
        }
    }
};
