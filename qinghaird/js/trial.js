
$(document).ready(function () {
    //返回上一页的操作
    $('.back').click(function () {
        back();
    });
  
    //判定是否需要提交意见功能 
    if (getQueryString('menuChildName') == '2019年总预算（草案）' || getQueryString('menuChildName') == '2019年部门预算（草案）') {
        localStorage.setItem('ifoption', 'true')
    } else {
        localStorage.setItem('ifoption', 'false')
    }
    //$('body').css({'background':'url(images/indebg.png) no-repeat','background-size':'100% 100%'})
   
    tabUl = '';
    page = '';
    pageLi = '';
    var name = getQueryString('childrenname')
    var id = getQueryString('childrenid');
    var token = getQueryString('token');
    var userId = localStorage.getItem('userId');
    $('#title').text(name);

    if (id != null && name != null && getQueryString('nextPage') === null) {
        var msg = JSON.parse(localStorage.getItem('menu'));
        var data = msg[id];
        //菜单列表
        function typeSelect() {
            if (data < 0) {
                layer.open({
                    content: '登录超过有效期，请重新登录',
                    btn: ['重新登录'],
                    yes: function (index) {
                        window.location = '../login.html'
                    }
                });

            } else {
                if (data.length < 0) {
                    tip = '<div class="tip">' + '抱歉！暂时无数据' + '</div>';
                    $('#trialMun').append(tip)
                } else {
                    // localStorage.setItem('depmenuId', data[0].id)
                    $('#mescroll').css('display', 'none')
                    superviseFn(data, id, name)
                    $('#trialContent').scrollTop = (localStorage.getItem('sroll_height'))
                }
            }
        }
        typeSelect()
        //没有tab栏
        function superviseFn(data, id, name) {
           console.log(data)
            var j = 0;
            j++;
            if (data.children.length == '0') {
                
                tip = '<div class="tip">' + '抱歉！暂时无数据' + '</div>';
                $('#trialMun').append(tip)
            }
            for (a = 0; a < data.children.length; a++) {
                (function (a) {
                    pageLi += '<li  style=" background:url(' +url()+ data.children[a].iconValue + ') 20px center #fff no-repeat ;background-size:0.625rem 0.625rem   " data-id="' + data.children[a].id + '" data-name="' + data.children[a].name + '" data-link="' + data.children[a].link + '" style ="background: url(./images/1.png) 20px center no-repeat #fff; background-size: 0.825rem 0.825rem"><a  class="fileTab">' + data.children[a].name + '</a></li>'

                }(a))
            }
            page = '<div class="page" >' +
                '<div id="trialsearch" class="clearfix" style="display:none"><input id="searchinput" type="search" placeholder="请输入关键字"><div id="searchbtn">搜索</div></div>' +
                '<div id="trialMun" style="top: 2.5rem">' + pageLi + ' </div>' + '</div>';
            $('#pu_content').prepend(page);
            $('.tabMenu').remove();
            $('#trialMun').css('top', '0px');
           
            $('#trialMun li').on('click', function () {
                localStorage.setItem('id', data.id)
                localStorage.setItem('year', '')
                var name = $(this).attr('data-name')
                var id = $(this).attr('data-id')
                var link_url = $(this).attr('data-link')
                $('.loding_').show();
                setTimeout(function(){
                    $('.loding_').hide()
                },1000)
                if (link_url.indexOf('trial') > -1 || link_url.indexOf('lateralMenus') > -1) {
                    var id = $(this).attr('data-id')
                } else {
                    var id = $(this).attr('data-id')
                }
              
                if (link_url.indexOf('?') > -1 ) {
                    var link = link_url + '&childrenname=' + name + '&childrenid=' + id;
                    forward(htmlUrl(link))
                   
                } else {
                     
                    var link = link_url + '?childrenname=' + name + '&childrenid=' + id;
                   forward(htmlUrl(link));
                }
            });
            document.body.className = '';
            $('#trialContent').scrollTop(localStorage.getItem('sroll_height'))
        }

    } else {
        tip = '<div class="tip">' + '抱歉！暂时无数据' + '</div>';
        $('#trialMun').append(tip)
    }

    //部门预算
    if (getQueryString('nextPage')) {
            //选择年份
            timeTip()
            function timeTip() {
                var li = ''
                var urlyear = url() + "api/app/report/years?menuId="+getQueryString('childrenid');;
                $.ajax({
                    url: urlyear,
                    type: 'GET',
                    async: false,
                    accept: 'application/json;charset=UTF-8',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
                    // timeout: 100000,
                    dataType: "json",
                    success: function (yes) {
                        //console.log(yes, '选择年份---');
                        if (yes.length != null && yes.length != 0) {
                            localStorage.setItem("year", yes[0]);
                            $('#header .yearSelect').text(yes[0])
                            for (var i = 0; i < yes.length; i++) {
                                li += '<li class="tipList">' + yes[i] + '</li>';
                            }
                            $('.timeTip').children('ul').append(li);
                            function yearS() {
                                //选择年份事件
                                $('.yearSelect').click(function () {
                                    if ($('.timeTip').hasClass('show')) {
                                        $('.timeTip').hide();
                                        $('.timeTip').removeClass('show')
                                    } else {
                                        $('.timeTip').addClass('show')
                                    }
                                
                                });

                            }
                            yearS()
                            $('.timeZZ').click(function () {
                                $('.timeZZ').css('visibility', 'hidden')
                                $('.timeTip').hide();
                                $('.timeTip').removeClass('show')
                            })
                            //年份点击事件
                            $('.tipList').click(function () {
                                $('.tipList').removeClass('yearactive')
                                $(this).addClass('yearactive')
                                localStorage.setItem('year', $(this).text())
                                $('.yearSelect').text( $(this).text());
                                $('.timeTip').removeClass('show')
                                $('.page').remove();
                                section();
                            })
                        } else {
                            $('.yearSelect').remove()
                        
                        }
                    },
                    error: function (err) {
                        console.log(err+"请求失败")
                    }
                })

            }
            //查询报送部门信息
        section()
        function section() {
            //http://192.168.1.109:8002/exam/api/app/report/departments?menuId=188235265091964928&year=2019
            var section_url = url() + "api/app/report/departments?menuId="+getQueryString('childrenid')+"&year="+localStorage.getItem('year');
            $.ajax({
                url: section_url,
                type: 'GET',
                async: false,
                accept: 'application/json;charset=UTF-8',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
                data: { nextPage: 'nextPage' },
                dataType: "json",
                success: function (sec) {
                    //console.log(sec, '部门信息列表---');
                    //循序安小到大排列
                    // for (var j = 0; j < sec.length - 1; j++) {
                    //     for (var i = 0; i < sec.length - 1 - j; i++) {
                    //         if (sec[i].showOrder > sec[i + 1].showOrder) {
                    //             var temp = sec[i];
                    //             sec[i] = sec[i + 1];
                    //             sec[i + 1] = temp;
                    //         }
                    //     }
                    // }
                    pageLi= '';
                    if (sec.length != null && sec.length != 0) {
                        for (var i = 0; i < sec.length; i++) {
                            pageLi += '<li sec-id="'+sec[i].id+'" sec-name="'+sec[i].name+'"><a  class="fileTab">'+sec[i].name+'</a></li>'
                        }
                        page = '<div class="page" >' +
                            '<div id="trialsearch" class="clearfix" style="display:none"><input id="searchinput" type="search" placeholder="请输入关键字"><div id="searchbtn">搜索</div></div>' +
                            '<div id="trialMun" style="top: 2.5rem">' + pageLi + ' </div>' + '</div>';
                        $('#pu_content').append(page);
                        $('.tabMenu').remove();
                        $('#trialMun').css('top', '0px');
                        $('#mescroll').css('display', 'none');
                        $('#searchbtn').css('background', '#e53935');
                        $('#trialMun li').on('click', function () {
                            localStorage.setItem('trialid',sec.id)
                            var name = $(this).attr('sec-name')
                            var id = $(this).attr('sec-id')
                            var linkPage = getQueryString('nextPage');  
                            var menuid = getQueryString('id');
                            $('.loding_').show();
                            setTimeout(function(){
                                $('.loding_').hide()
                            },1000)
                            if (linkPage.indexOf('?') > -1) {
                                var link = linkPage+'&childrenname='+name+'&childrenid='+$(this).attr('sec-id')+'&id='+menuid
                                forward(htmlUrl(link))
                            } else if(getQueryString('nextPage')){
                                var link = linkPage+'?childrenname='+name+'&childrenid='+$(this).attr('sec-id')+'&id='+menuid+'&deptId='+id
                                forward(htmlUrl(link))
                            // console.log(link  );
                            }else{
                                var link = linkPage+'?childrenname='+name+'&childrenid='+$(this).attr('sec-id')+'&id='+menuid;
                                forward(htmlUrl(link))
                            }
                        });
                        document.body.className = '';
                        $('#trialContent').scrollTop(localStorage.getItem('sroll_height'))
                    } else {
                        tip = '<div class="tip">' + '抱歉！暂时无数据' + '</div>';
                        $('#pu_content').append(tip)
                    }
                },
                error: function (err) {
                console.log(err)
                },
            })
        }
    } else {
        $('.yearSelect ').hide();
    }
   
    //搜索功能实现
    if (getQueryString('childrenname').indexOf('部门') > -1) {
        $('#trialsearch').css('display', 'block')
        $('#pu_content').find('.page').each(function () {
            var pa = this;
            $(pa).find('#searchinput').eq(0).on('input propertychange', function () {
                var kw = this.value;
                var showAll = false;
                if (kw.length == 0) showAll = true; else showAll = false;
                var index = $('#tabUl li').index();
                var lis = $(pa).find('#trialMun').find('li')
                lis.each(function () {
                    var vv = $(this).attr("sec-name");
                    if (vv.indexOf(kw) > -1 || showAll) $(this).css('display', 'block')
                    else $(this).css('display', 'none');
                });
            })
        })
    } else {
        $('#trialsearch').css('display', 'none')
    }

    $('.loding_').hide(); //隐藏加载动画   
})