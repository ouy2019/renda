(function ($) {
    // 插件定义
    $.fn.slideEle = function (_aoConfig) {
        // 默认参数
        var defaults = {
            parentBox: "",//被编辑标签的直接父元素标签
            slideBars: "",//需要滑动删除、编辑的标签组
            alterTag: "",//需要修改内容的标签，必须单独用一个标签包裹
            tagWidth: 80,//右侧按钮宽度
            editBtn: true,//是否需要编辑按钮
        };
        var pm = this
        pm.oConfig = $.extend(defaults, _aoConfig);
        var slideDel = function () {
            var current = {
                sx: null,//触摸X坐标
                sy: null,//触摸Y坐标
                mx: null,//移动X坐标
                my: null,//移动Y坐标
                ex: null,//离开X坐标
                ey: null,//离开Y坐标
                swipeX: true,//判断左右滑动
                swipeY: true,//判断上下滑动
                expansion: null,//上一个被操作元素
                twoWidth: null,//两个按钮的宽度
                isOpen: false,//是否有打开的标签 true有/false没有
            }

            var closeTimer;
            defaults.parentBox.css({ "position": "relative", "overflow": "hidden" });
            defaults.slideBars.css({ "position": "relative", "left": "0" });
            var divSpring = $('<div class="divSpring" style="position: fixed;display:none; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, .8); z-index: 99999;"><div class="divSpringBox" style="position: absolute;width: 90%;height: 260px;background: #fff;left: 5%;top: 50%;margin-top: -130px;"><div class="divSpringTitle" style="width: 100%;height: 30px;background: #666;"></div><input type="text" class="iptAlter" placeholder="请输入内容" style="width: 96%;margin: 0 2%;height: 40px;margin-top: 20px;border: 0;border-bottom: 1px solid #333;outline:none;font-size: 14px;"><div class="divSpringBtnBox" style="position: absolute;bottom: 0;height: 52px;line-height: 52px;width: 100%;text-align: center;font-size: 18px;"><a href="javascript:;" class="divSpringAbtn divSpringNo" style="display: inline-block;width: 50%;background: #d81313;height: 100%;text-decoration: none;color: #fff;">取 消</a><a href="javascript:;" class="divSpringAbtn divSpringYes" style="display: inline-block;width: 50%;background: #1f80d6;height: 100%;text-decoration: none;color: #fff;">确 定</a></div></div></div>').appendTo("body");
            if (defaults.editBtn) {
                current.twoWidth = defaults.tagWidth * 2
                $("<a class='spnbtn spnEdit' style='position: absolute;background: #ffbe00;width:" + defaults.tagWidth + "px;height: 100%;right: -" + defaults.tagWidth + "px; z-index: 99999;'>编辑</a><a class='spnbtn spnDel' style='position: absolute;background: #5b80e7;width: " + defaults.tagWidth + "px;height: 100%;right: -" + current.twoWidth + "px; z-index: 99999;'>删除</a>").appendTo(defaults.slideBars);
            } else {
                current.twoWidth = defaults.tagWidth
                $("<a class='spnbtn spnDel' style='position: absolute;background: #5b80e7;width: " + defaults.tagWidth + "px;height: 100%;right: -" + current.twoWidth + "px; z-index: 99999;color: #fff;text-align: center;display: flex;align-items: center;justify-content: center;'>删除</a>").appendTo(defaults.slideBars);
            }
            defaults.slideBars.each(function (i) {
                var $this = $(this);
                $this.find(".spnDel").on("click", function (e) {
                    //删除
                    id = $(this).parent().attr('data-id')
                    var $thisChild = $(this)
                    layer.open({
                        content: '是否删除'
                        , btn: ['确定', '取消'],
                        title: '删除意见'
                        , yes: function (index) {
                            $thisChild.parent().remove();
                            $.ajax({
                                //api/exam/app/online-advice/193645111970762752
                                type: 'DELETE',
                                url: url() + "api/exam/app/online-advice/"+ id,
                                accept: 'application/json;charset=UTF-8',
                                async: false,
                                data: {},   //请求的数据
                                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
                                dataType: 'JSON',
                                // data: {
                                //     id: id
                                // },
                                // timeout: 3000,
                                success: function (data) {
                                    //console.log(data)
                                }
                            })
                            layer.close();
                            layer.msg('删除成功', {
                                time: '1000'
                            })
                        }
                        , end: function (index) {
                            $thisChild.parent().css('left', '0')
                        }
                    })

                    return false;
                });
                $this.find(".spnEdit").on("click", function (e) {
                    //编辑
                    var iptAlter = $(".divSpring .iptAlter")
                    divSpring.show();
                    $(".divSpring .divSpringYes").on("click", function (e) {
                        //弹出框点击确定
                        $($this.find(defaults.alterTag)).html(iptAlter.val().trim());
                        divSpring.hide();
                        closeFn($this);
                        iptAlter.val("");
                        return false;
                    });
                    $(".divSpring .divSpringNo").on("click", function (e) {
                        //弹出框点击取消
                        divSpring.hide();
                        iptAlter.val("");
                        return false;
                    });
                });
                $this.on("touchstart", function (e) {
                    current.sx = e.originalEvent.targetTouches[0].pageX;
                    current.sy = e.originalEvent.targetTouches[0].pageY;
                    current.swipeX = true;
                    current.swipeY = true;
                    defaults.slideBars.each(function (i, dom) {
                        if ($(dom).position().left != 0) {
                            current.isOpen = true
                            return false;
                        } else {
                            current.isOpen = false;
                        }
                    })
                    if (current.expansion) { //判断是否展开，如果展开则收起
                        if (current.expansion.index() == $this.index()) {
                            if ($this.offset().left <= -(current.twoWidth * 2)) {
                                openFn($this);
                                current.expansion = $this;
                            }
                        } else {
                            closeFn(current.expansion);
                        }
                    }
                });
                $this.on('touchmove', function (e) {
                    current.mx = e.originalEvent.targetTouches[0].pageX;
                    current.my = e.originalEvent.targetTouches[0].pageY;
                    // 左右滑动
                    if (current.swipeX && Math.abs(current.mx - current.sx) - Math.abs(current.my - current.sy) > 0) {
                        var x = current.mx - current.sx;
                        var xl = $this.offset().left
                        if (x < -current.twoWidth) {
                            x = -current.twoWidth
                        }
                        if (x > 0) {
                            x = 0
                        }
                        if (xl <= -current.twoWidth) {
                            if ((current.mx - current.sx) < 0) {
                                x = -current.twoWidth
                            }
                        }
                        if (current.isOpen) {
                            return;
                        } else {
                            $this.css({ "position": "relative", "left": x + "px" });
                        }
                    }
                });
                $this.on('touchend', function (e) {
                    current.ex = e.originalEvent.changedTouches[0].pageX;
                    current.ey = e.originalEvent.changedTouches[0].pageY;
                    // 左右滑动
                    if (current.swipeX && Math.abs(current.mx - current.sx) - Math.abs(current.my - current.sy) > 0) {
                        // e.stopPropagation();
                        if ((current.ex - current.sx) < 0) {
                            //往左滑
                            if ((current.ex - current.sx) > -(current.twoWidth / 2)) { //右滑
                                if (!!current.expansion) {
                                    if (current.expansion.index() == $this.index()) {
                                        if ((current.ex - current.sx) > -5) {
                                            return false;
                                        }
                                    }
                                }
                                closeFn($this);
                            }
                            if ((current.ex - current.sx) < -(current.twoWidth / 2)) { //左滑
                                if (current.isOpen) {
                                    closeFn($this);
                                    return false;
                                } else {
                                    openFn($this);
                                }
                                current.expansion = $this;
                            }
                        } else if ((current.ex - current.sx) > 0) {
                            //往右滑
                            closeFn($this);
                        }
                        current.swipeY = false;
                    }
                    // 上下滑动
                    if (current.swipeY && Math.abs(current.mx - current.sx) - Math.abs(current.my - current.sy) < 0) {
                        closeFn($this);
                        current.swipeX = false;
                    }
                });
            });
            function openFn(d) {
                d.css({ "-webkit-transition": " all 0.3s ease-out", "transition": "all 0.3s ease-out", "position": "relative", "left": "-" + current.twoWidth + "px" });
            };
            function closeFn(d) {
                d.css({ "-webkit-transition": " all 0.2s ease-out", "transition": "all 0.2s ease-out", "position": "relative", "left": "0" });
            };
        }()
        return this;
    };
    // 插件结束
})(jQuery);