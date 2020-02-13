var animationList = {
    //进入的滑动和渐入设置未非延迟渲染，一开始即在页面之外，无法点击
    //如果设置0渐变、3进入滑动，也会一开始就在页面外，看不到渐变效果

    //渐变
    'fadeIn': {
        type: 'fromTo',
        option: {
            autoAlpha: 0,
        },
        toOption: {
            autoAlpha: 1,
        },
    },
    'fadeInDown': {
        type: 'fromTo',
        option: {
            y: -800,
            autoAlpha: 0,
        },
        toOption: {
            y: 0,
            autoAlpha: 1,
        },
    },
    'fadeInUp': {
        type: 'fromTo',
        option: {
            y: 800,
            autoAlpha: 0,
        },
        toOption: {
            y: 0,
            autoAlpha: 1,
        }
    },
    'fadeInLeft': {
        type: 'fromTo',
        option: {
            x: -600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            autoAlpha: 1,
        }
    },
    'fadeInRight': {
        type: 'fromTo',
        option: {
            x: 200,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            autoAlpha: 1,
        }
    },
    'fadeOut': {
        type: 'fromTo',
        option: {
            autoAlpha: 1,
        },
        toOption: {
            autoAlpha: 0,
        },
    },
    'fadeOutUp': {
        type: 'fromTo',
        option: {
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            y: -800,
            autoAlpha: 0,
        },
    },
    'fadeOutDown': {
        type: 'fromTo',
        option: {
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            y: 800,
            autoAlpha: 0,
        },
    },
    'fadeOutLeft': {
        type: 'fromTo',
        option: {
            x: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: -600,
            autoAlpha: 0,
        },
    },
    'fadeOutRight': {
        type: 'fromTo',
        option: {
            x: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: 600,
            autoAlpha: 0,
        },
    },
    //滑动
    'slideInUp': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            y: 800,
            autoAlpha: 0,
        },
        toOption: {
            y: 0,
            autoAlpha: 1,
        }
    },
    'slideInDown': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            y: -800,
            autoAlpha: 0,
        },
        toOption: {
            y: 0,
            autoAlpha: 1,
        }
    },
    'slideInLeft': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            x: -600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            autoAlpha: 1,
        }
    },
    'slideInRight': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            x: 600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            autoAlpha: 1,
        }
    },
    'slideInUpLeft': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            x: -600,
            y: 600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        }
    },
    'slideInUpRight': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            x: 600,
            y: 600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        }
    },
    'slideInDownLeft': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            x: -600,
            y: -600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        }
    },
    'slideInDownRight': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            x: 600,
            y: -600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        }
    },
    'slideOutUp': {
        type: 'fromTo',
        option: {
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            y: -800,
            autoAlpha: 0,
        }
    },
    'slideOutDown': {
        type: 'fromTo',
        option: {
            x: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: 600,
            autoAlpha: 0,
        }
    },
    'slideOutLeft': {
        type: 'fromTo',
        option: {
            x: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: -600,
            autoAlpha: 0,
        }
    },
    'slideOutRight': {
        type: 'fromTo',
        option: {
            x: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: 600,
            autoAlpha: 0,
        }
    },
    'slideOutUpLeft': {
        type: 'fromTo',
        option: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: 600,
            y: -600,
            autoAlpha: 0,
        }
    },
    'slideOutUpRight': {
        type: 'fromTo',
        option: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: -600,
            y: -600,
            autoAlpha: 0,
        }
    },
    'slideOutDownLeft': {
        type: 'fromTo',
        option: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: 600,
            y: 600,
            autoAlpha: 0,
        }
    },
    'slideOutDownRight': {
        type: 'fromTo',
        option: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: -600,
            y: 600,
            autoAlpha: 0,
        }
    },
    //回弹
    'backInUp': {
        type: 'fromTo',
        option: {
            y: 800,
            autoAlpha: 0,
        },
        toOption: {
            y: 0,
            autoAlpha: 1,
        },
        ease: function() { return Elastic.easeOut.config(0.5, 0.3) }
    },

    'backInDown': {
        type: 'fromTo',
        option: {
            y: -800,
            autoAlpha: 0,
        },
        toOption: {
            y: 0,
            autoAlpha: 1,
        },
        ease: function() { return Elastic.easeOut.config(0.5, 0.3) }
    },
    'backInLeft': {
        type: 'fromTo',
        option: {
            x: -600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            autoAlpha: 1,
        },
        ease: function() { return Elastic.easeOut.config(0.5, 0.3) }
    },
    'backInRight': {
        type: 'fromTo',
        option: {
            x: 600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            autoAlpha: 1,
        },
        ease: function() { return Elastic.easeOut.config(1, 0.5) }
    },
    'backInUpLeft': {
        type: 'fromTo',
        option: {
            x: -600,
            y: 600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        ease: function() { return Elastic.easeOut.config(1, 0.5) }
    },
    'backInUpRight': {
        type: 'fromTo',
        option: {
            x: 600,
            y: 600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        ease: function() { return Elastic.easeOut.config(1, 0.5) }
    },
    'backInDownLeft': {
        type: 'fromTo',
        option: {
            x: -600,
            y: -600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        ease: function() { return Elastic.easeOut.config(1, 0.5) }
    },
    'backInDownRight': {
        type: 'fromTo',
        option: {
            x: 600,
            y: -600,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        ease: function() { return Elastic.easeOut.config(1, 0.5) }
    },
    'backOutUp': {
        type: 'fromTo',
        option: {
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            y: -800,
            autoAlpha: 0,
        },
        ease: function() { return Elastic.easeIn.config(1, 0.5) }
    },
    'backOutDown': {
        type: 'fromTo',
        option: {
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            y: 800,
            autoAlpha: 0,
        },
        ease: function() { return Elastic.easeIn.config(1, 0.5) }
    },
    'backOutLeft': {
        type: 'fromTo',
        option: {
            x: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: -600,
            autoAlpha: 0,
        },
        ease: function() { return Elastic.easeIn.config(1, 0.5) }
    },
    'backOutRight': {
        type: 'fromTo',
        option: {
            x: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: 600,
            autoAlpha: 0,
        },
        ease: function() { return Elastic.easeIn.config(1, 0.5) }
    },
    'backOutUpLeft': {
        type: 'fromTo',
        option: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: 600,
            y: -600,
            autoAlpha: 0,
        },
        ease: function() { return Elastic.easeIn.config(1, 0.5) }
    },
    'backOutUpRight': {
        type: 'fromTo',
        option: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: -600,
            y: -600,
            autoAlpha: 0,
        },
        ease: function() { return Elastic.easeIn.config(1, 0.5) }
    },
    'backOutDownLeft': {
        type: 'fromTo',
        option: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: 600,
            y: 600,
            autoAlpha: 0,
        },
        ease: function() { return Elastic.easeIn.config(1, 0.5) }
    },
    'backOutDownRight': {
        type: 'fromTo',
        option: {
            x: 0,
            y: 0,
            autoAlpha: 1,
        },
        toOption: {
            x: -600,
            y: 600,
            autoAlpha: 0,
        },
        ease: function() { return Elastic.easeIn.config(1, 0.5) }
    },
    //跌落
    'fallIn': {
        type: 'fromTo',
        option: {
            scale: 1.5,
            autoAlpha: 0,
        },
        toOption: {
            scale: 1,
            autoAlpha: 1,
        },
    },
    'fallOut': {
        type: 'fromTo',
        option: {
            scale: 1,
            autoAlpha: 1,
        },
        toOption: {
            scale: 0.1,
            autoAlpha: 0,
        },
    },
    //飞升
    'flyIn': {
        type: 'fromTo',
        option: {
            scale: 0.3,
            autoAlpha: 0
        },
        toOption: {
            scale: 1,
            autoAlpha: 1,
        },
    },
    'flyOut': {
        type: 'fromTo',
        option: {
            scale: 1,
            autoAlpha: 1,
        },
        toOption: {
            scale: 1.5,
            autoAlpha: 0,
        },
    },
    //冒泡
    'popIn': {
        type: 'fromTo',
        option: {
            scale: 0.3,
            autoAlpha: 0,
        },
        toOption: {
            scale: 1,
            autoAlpha: 1,
        },
        ease: function() { return Elastic.easeOut.config(0.5, 0.1) }
    },
    'popOut': {
        type: 'fromTo',
        option: {
            scale: 1,
            autoAlpha: 0,
        },
        toOption: {
            scale: 0.5,
            autoAlpha: 0,
        },
        ease: function() { return Elastic.easeOut.config(0.5, 0.1) }
    },
    //旋转
    'rotateIn': {
        type: 'fromTo',
        option: {
            rotation: -200,
            autoAlpha: 0,
        },
        toOption: {
            rotation: 0,
            autoAlpha: 1,
        },
    },
    'rotateInUpLeft': {
        type: 'fromTo',
        option: {
            rotation: 45,
            transformOrigin: "left bottom",
            autoAlpha: 0,
        },
        toOption: {
            rotation: 0,
            autoAlpha: 1,
        },
    },
    'rotateInUpRight': {
        type: 'fromTo',
        option: {
            rotation: -45,
            transformOrigin: "right bottom",
            autoAlpha: 0,
        },
        toOption: {
            rotation: 0,
            autoAlpha: 1,
        },
    },
    'rotateInDownLeft': {
        type: 'fromTo',
        option: {
            rotation: -45,
            transformOrigin: "left bottom",
            autoAlpha: 0,
        },
        toOption: {
            rotation: 0,
            autoAlpha: 1,
        },
    },
    'rotateInDownRight': {
        type: 'fromTo',
        option: {
            rotation: 45,
            transformOrigin: "right bottom",
            autoAlpha: 0,
        },
        toOption: {
            rotation: 0,
            autoAlpha: 1,
        },
    },
    'rotateOut': {
        type: 'fromTo',
        option: {
            rotation: 0,
            autoAlpha: 1,
        },
        toOption: {
            rotation: 200,
            autoAlpha: 0,
        },
    },
    'rotateOutUpLeft': {
        type: 'fromTo',
        option: {
            rotation: 0,
            transformOrigin: "left bottom",
            autoAlpha: 1,
        },
        toOption: {
            rotation: -45,
            autoAlpha: 0,
        },
    },
    'rotateOutUpRight': {
        type: 'fromTo',
        option: {
            rotation: 0,
            transformOrigin: "right bottom",
            autoAlpha: 1,
        },
        toOption: {
            rotation: 45,
            autoAlpha: 0,
        },
    },
    'rotateOutDownLeft': {
        type: 'fromTo',
        option: {
            rotation: 0,
            transformOrigin: "left bottom",
            autoAlpha: 1,
        },
        toOption: {
            rotation: 45,
            autoAlpha: 0,
        },
    },
    'rotateOutDownRight': {
        type: 'fromTo',
        option: {
            rotation: 0,
            transformOrigin: "right bottom",
            autoAlpha: 1,
        },
        toOption: {
            rotation: -45,
            autoAlpha: 0,
        },
    },
    //滑动放大
    'zoomInUp': {
        type: 'fromTo',
        option: {
            y: 80,
            scale: 0.2,
            autoAlpha: 0,
        },
        toOption: {
            y: 0,
            scale: 1,
            autoAlpha: 1,
        },
        ease: function() { return Back.easeInOut.config(2) }
    },
    'zoomInDown': {
        type: 'fromTo',
        option: {
            y: -100,
            scale: 0.2,
            autoAlpha: 0,
        },
        toOption: {
            y: 0,
            scale: 1,
            autoAlpha: 1,
        },
        ease: function() { return Back.easeInOut.config(2) }
    },
    'zoomInLeft': {
        type: 'fromTo',
        option: {
            x: -80,
            scale: 0.2,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            scale: 1,
            autoAlpha: 1,
        },
        ease: function() { return Back.easeInOut.config(2) }
    },
    'zoomInRight': {
        type: 'fromTo',
        option: {
            x: 80,
            scale: 0.2,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            scale: 1,
            autoAlpha: 1,
        },
        ease: function() { return Back.easeInOut.config(2) }
    },
    'zoomInRight': {
        type: 'fromTo',
        option: {
            x: 80,
            scale: 0.2,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            scale: 1,
            autoAlpha: 1,
        },
        ease: function() { return Back.easeInOut.config(2) }
    },
    'zoomOutOutUp': {
        type: 'fromTo',
        option: {
            y: 0,
            transformOrigin: "center",
            autoAlpha: 1,
        },
        toOption: {
            y: -200,
            scale: 0.2,
            autoAlpha: 0,
        },
        ease: 'expo.easeInOut'
    },
    'zoomOutOutDown': {
        type: 'fromTo',
        option: {
            y: 0,
            transformOrigin: "center",
            autoAlpha: 1,
        },
        toOption: {
            y: 200,
            scale: 0.2,
            autoAlpha: 0,
        },
        ease: 'circ.easeInOut'
    },
    'zoomOutOutLeft': {
        type: 'fromTo',
        option: {
            x: 0,
            transformOrigin: "center",
            autoAlpha: 1,
        },
        toOption: {
            x: 200,
            scale: 0.2,
            autoAlpha: 0,
        },
        ease: 'circ.easeInOut'
    },
    'zoomOutOutRight': {
        type: 'fromTo',
        option: {
            x: 0,
            transformOrigin: "center",
            autoAlpha: 1,
        },
        toOption: {
            x: -200,
            scale: 0.2,
            autoAlpha: 0,
        },
        ease: 'circ.easeInOut'
    },
    //翻滚
    'rollIn': {
        type: 'fromTo',
        option: {
            xPercent: '-100%',
            transformOrigin: "center",
            rotation: -120,
            autoAlpha: 0,
        },
        toOption: {
            xPercent: 0,
            rotation: 0,
            autoAlpha: 1,
        },
    },
    'rollOut': {
        type: 'fromTo',
        option: {
            transformOrigin: "center",
            autoAlpha: 1,
        },
        toOption: {
            xPercent: '100%',
            rotation: 120,
            autoAlpha: 0,
        },
    },
    //玩偶盒
    'jackInTheBoxIn': {
        isStep: true,
        steps: [{
                type: 'fromTo',
                duringPercent: 0.5,
                option: {
                    scale: 0.1,
                    rotation: 0,
                    transformOrigin: 'center',
                    autoAlpha: 0,
                },
                toOption: {
                    scale: 1,
                    rotation: -30,
                    autoAlpha: 1
                }
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    rotation: 20,
                },
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    rotation: 0
                },
            }
        ],
    },
    //铰链
    'hingeOut': {
        isStep: true,
        steps: [{
                type: 'fromTo',
                duringPercent: 0.5,
                option: {
                    transformOrigin: 'left center',
                    autoAlpha: 1,
                },
                toOption: {
                    rotation: 70,
                },
                ease: function() { return Elastic.easeOut.config(0.7, 0.2) }
            },
            {
                type: 'to',
                duringPercent: 0.5,
                option: {
                    y: 600,
                    autoAlpha: 0
                },
            },
        ],
    },
    //上下翻转
    'flipXIn': {
        type: 'fromTo',
        option: {
            rotationX: 90,
            z: 0,
            autoAlpha: 0,
        },
        toOption: {
            rotationX: 0,
            autoAlpha: 1,
        },
        perspective: true,
        ease: function() { return Elastic.easeOut.config(0.7, 0.2) }
    },
    'flipXOut': {
        type: 'fromTo',
        option: {
            rotationX: 0,
            autoAlpha: 1,
        },
        toOption: {
            rotationX: 90,
            autoAlpha: 0,
        },
        perspective: true,
        ease: function() { return Elastic.easeIn.config(0.7, 0.4) }
    },
    //左右翻转
    'flip': {
        isStep: true,
        perspective: true,
        steps: [{
                type: 'to',
                duringPercent: 0.5,
                option: {
                    scale: 1.2,
                    rotationY: 180,
                },
            },
            {
                type: 'to',
                duringPercent: 0.5,
                option: {
                    scale: 1,
                    rotationY: 360,
                },
            },
        ],
    },
    'flipIn': {
        type: 'fromTo',
        option: {
            rotationY: 90,
            autoAlpha: 0,
        },
        toOption: {
            rotationY: 0,
            autoAlpha: 1,
        },
        perspective: true,
        ease: function() { return Elastic.easeOut.config(0.7, 0.2) }
    },
    'flipOut': {
        type: 'fromTo',
        option: {
            rotationY: 0,
            autoAlpha: 1,
        },
        toOption: {
            rotationY: 90,
            autoAlpha: 0,
        },
        perspective: true,
        ease: function() { return Elastic.easeIn.config(0.7, 0.4) }
    },
    //渐入
    'fadeBigInDown': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            y: -1000,
            autoAlpha: 0,
        },
        toOption: {
            y: 0,
            autoAlpha: 1,
        },
    },
    'fadeBigInUp': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            y: 1000,
            autoAlpha: 0,
        },
        toOption: {
            y: 0,
            autoAlpha: 1,
        },
    },
    'fadeBigInLeft': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            x: -1000,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            autoAlpha: 1,
        },
    },
    'fadeBigInRight': {
        type: 'fromTo',
        immediateRender: true,
        option: {
            x: 1000,
            autoAlpha: 0,
        },
        toOption: {
            x: 0,
            autoAlpha: 1,
        },
    },
    //渐出
    'fadeBigOutDown': {
        type: 'fromTo',
        option: {
            autoAlpha: 1,
        },
        toOption: {
            y: 1000,
            autoAlpha: 0,
        },
    },
    'fadeBigOutUp': {
        type: 'fromTo',
        option: {
            autoAlpha: 1,
        },
        toOption: {
            y: -1000,
            autoAlpha: 0,
        },
    },
    'fadeBigOutLeft': {
        type: 'fromTo',
        option: {
            autoAlpha: 1,
        },
        toOption: {
            x: -1000,
            autoAlpha: 0,
        },
    },
    'fadeBigOutRight': {
        type: 'fromTo',
        option: {
            autoAlpha: 1,
        },
        toOption: {
            x: 1000,
            autoAlpha: 0,
        },
    },
    //弹跳
    'bounce': {
        type: 'fromTo',
        option: {
            y: -50,
        },
        toOption: {
            y: 0,
        },
        ease: 'Bounce.easeOut'
    },
    //闪烁
    'flash': {
        isStep: true,
        steps: [{
                type: 'to',
                duringPercent: 0.25,
                option: {
                    autoAlpha: 0,
                    startAt: { autoAlpha: 1 }
                },
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    autoAlpha: 1
                },
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    autoAlpha: 0
                },
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    autoAlpha: 1
                },
            },
        ],
    },
    //放大
    'pulse': {
        isStep: true,
        steps: [{
                type: 'to',
                duringPercent: 0.5,
                option: {
                    scale: 1.2
                },
            },
            {
                type: 'to',
                duringPercent: 0.5,
                option: {
                    scale: 1
                },
            },
        ],
    },
    //橡皮筋
    'rubberBand': {
        isStep: true,
        steps: [{
                type: 'to',
                duringPercent: 0.25,
                option: {
                    scaleX: 1.25,
                    scaleY: 0.75
                },
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    scaleX: 0.75,
                    scaleY: 1.25
                },
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    scaleX: 1.15,
                    scaleY: 0.85
                },
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    scaleX: 1,
                    scaleY: 1
                },
            },
        ],
    },
    //震动
    'shake': {
        isStep: true,
        steps: [{
                type: 'to',
                duringPercent: 0.2,
                option: {
                    x: -50,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    x: 50,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    x: -30
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    x: 30
                },

            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    x: 0
                },
            },
        ],
    },
    //摇晃
    'swing': {
        isStep: true,
        steps: [{
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: 30,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: -30,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: 15,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: -15,
                },

            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: 0,
                },
            },
        ],
    },
    //抖动
    'tada': {
        isStep: true,
        steps: [{
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: -30,
                    scale: 1.15
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: 30,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: -15,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: 15,

                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: 0,
                    scale: 1
                },
            },
        ],
    },
    //晃动
    'wobble': {
        isStep: true,
        steps: [{
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: -25,
                    x: -50
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: 25,
                    x: 50
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: -15,
                    x: -25
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: 15,
                    x: 25
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    rotation: 0,
                    x: 0
                },
            },
        ],
    },
    //果冻
    'jello': {
        isStep: true,
        steps: [{
                type: 'to',
                duringPercent: 0.2,
                option: {
                    skewY: 30,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    skewY: -30,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    skewY: 15,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    skewY: -15,
                },
            },
            {
                type: 'to',
                duringPercent: 0.2,
                option: {
                    skewY: 0,
                },
            },
        ],
    },
    //心跳
    'heartBeat': {
        isStep: true,
        steps: [{
                type: 'to',
                duringPercent: 0.25,
                option: {
                    scale: 1.2,
                },
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    scale: 1,
                },
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    scale: 1.2,
                },
            },
            {
                type: 'to',
                duringPercent: 0.25,
                option: {
                    scale: 1,
                },
            },
        ],
    },
}

function GetChild(selector, parent, index) {
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
}