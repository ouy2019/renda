$(document).ready(function () {
    // $('body').css({'background':'url(images/indebg.png) no-repeat','background-size':'100% 100%'})
     //返回上一页的操作
    $('.back').click(function () {
        localStorage.setItem('trial', '0')
        back()
    })
    tabUl = '';
    page = '';
    pageLi = '';
    pageCol = '';
    pagechild = '';
    litem = '';
    var name = getQueryString('childrenname')
    var id = getQueryString('childrenid');
    var year =localStorage.getItem('year');
    var msg = JSON.parse(localStorage.getItem('menu'));
    data = msg[id];
    console.log(data,'lateralMenus--data数据')
    var token = getQueryString('token');
    var userId = localStorage.getItem('userId');
    $('#title').text(name)
    localStorage.setItem('csTime', id);
   

if(id != null && name != null){
   //页面加载开始渲染数据
    function typeSelect() {
        if (data.length == 0) {
            $('.curtain').remove()
            $('#pu_content').children().remove('div')
            $('.tabMenu').remove()
            tip = '<div class="tip">' + '抱歉！暂时无数据' + '</div>';
            $('#pu_content').append(tip)
        } else {
            trialFn(data, id, name);
          
        }
        $('.curtain').remove()
    }
    typeSelect(id, name)
    //tab栏  数据渲染
    function trialFn(data, id, name) {
        var mid = '';
        for (var i = 0; i < data.children.length; i++) {
            if (data.children[i]) {
                tabMenuId = data.children[i].id
            }
            console.log(data.children[i].aclTrue,'chidren--数据');
            if(data.children[i].aclTrue){//判断用户权限
                tabUl = ' <li id="read" data-id=' + tabMenuId + '><span style=" background:url(' + url()+data.children[i].iconValue + ') center top / 45px #fff no-repeat  " >' + data.children[i].name + '</span></li>';
                $('#tabUl').append(tabUl);
            }
            
            if (data.children[i].children) {
                for (var a = 0; a < data.children[i].children.length; a++) {
                    if (data.children[i].children[a].children) {
                        for (var b = 0; b < data.children[i].children[a].children.length; b++) {
                            var menuId = data.children[i].children[a].children[b].id;
                            msg[menuId] = data.children[i].children[a].children[b];

                           
                            if (data.children[i].children[a].children[b].link) {
                                mid = data.children[i].children[a].children[b].id
                            } else {
                                mid = data.children[i].children[a].children[b].id
                            }
                            //console.log(data.children[i].children[a].children[b].aclTrue,'chidren--数据');
                            if(data.children[i].children[a].children[b].aclTrue){
                              pagechild += '<ul class="pagechildUl"><li class="clickTab" style=" background:url(' + url()+data.children[i].children[a].children[b].iconValue + ') 15px 12px #fff no-repeat ;background-size:0.48rem" data-id="' + mid + '"data-name="' +data.children[i].children[a].children[b].name + '" data-link="' + data.children[i].children[a].children[b].link + '"><a href="javascript:;" class="fileTab">' +data.children[i].children[a].children[b].name + '</a></li></ul>'
                            }
                        }
                        //console.log(data.children[i].children[a].aclTrue,'chidren--数据');
                        
                        pageLi += '<ul><li class="openChild" style=" background:url(' + url()+data.children[i].children[a].iconValue + ') 15px 12px #fff no-repeat;background-size:0.48rem" data-id="' + data.children[i].children[a].id + '"data-name="' + data.children[i].children[a].name + '"><div class="pagechild">' + data.children[i].children[a].name + '</div>' + pagechild + '</li></ul>'
                        pagechild = ''
                    } else {
                        var menuId = data.children[i].children[a].id;
                        msg[menuId] = data.children[i].children[a];
                        //.indexOf('lateralMenus') > -1 || data[i].children[a].link.indexOf('trial') > -1
                        if (data.children[i].children[a].link) {
                            mid = data.children[i].children[a].id
                        } else {
                            mid = data.children[i].children[a].id
                        }
                        //console.log(data.children[i].children[a].aclTrue,'chidren--数据')
                        if(data.children[i].children[a].aclTrue){
                            pageLi += '<ul><li class="clickTab" style=" background:url(' + url()+ data.children[i].children[a].iconValue + ') 15px 12px #fff no-repeat ;background-size:0.48rem" data-id="' + mid + '" data-name="' + data.children[i].children[a].name + '"data-link="' + data.children[i].children[a].link + '"   "><a href="javascript:;" class="fileTab">' + data.children[i].children[a].name + '</a></li></ul>'
                            litem = ''

                        }
                        
                    };
                }
            } else {
                pageLi = '<div class="tip"></div>'
            }
            //console.log(data.children[i].aclTrue,'chidren--数据');
            if(data.children[i].aclTrue){
                page = '<div class="page" style="display:none">'+'<div id="trialMun" style="top: 2.5rem">' + pageLi +'</div>' +'</div>';
                $('#pu_content').append(page);
                pageLi = '';
                page = '';
            }

            
        }
        $('#tabUl li').css('width', (100 / data.length) + '%');
        $('#title').text(name);
        var trial = localStorage.getItem('trial');
        $('#tabUl li').eq(trial).addClass('lateralMenusActive');
        $('#tabUl li').eq(trial).siblings('li').removeClass('lateralMenusActive')
        $('#pu_content').find('.page').eq(trial).css('display', 'block').siblings().css('display', 'none');
        document.body.className = '';
        $('#tabUl li').on('click', function () {
            var index = $(this).index();
            localStorage.setItem('trial', index);
            $('#searchinput').val('')
            $('#mescroll').css('display', 'none')
            $('.mescroll-downwarp').remove()
            $('#newsList').empty()
            $('.mescroll-upwarp').remove()
            $('.total_num').text('')
            $(this).addClass('lateralMenusActive');
            $(this).siblings('li').removeClass('lateralMenusActive')
            $('.parenUl ul').eq(index).css('display', 'block').siblings('ul').css('display', 'none')
            $('.Select li').eq(index).css('display', 'block').siblings('li').css('display', 'none')
            $('#pu_content').find('.page').eq(index).css('display', 'block').siblings().css('display', 'none');
            $('#pu_content').find('.page').eq(index).find('li').css('display', 'block')
        })
        $('.clickTab').click(function (event) {
            layer.msg('努力加载中...', {icon: 16, shade: 0.4, time:2000});
            var name = $(this).attr('data-name')
            var id = $(this).attr('data-id')
            for (var a = 0; a < $('#tabUl li').length; a++) {
                if ($('#tabUl li').eq(a).hasClass('lateralMenusActive')) {
                    localStorage.setItem('menuYear', $('.Select li').eq(a).text())
                }
            }
            var linkUrl = $(this).attr('data-link')
            localStorage.setItem('year', '')
            localStorage.setItem('month', '')
            localStorage.setItem('fileName', '')
        
            localStorage.setItem('menu',JSON.stringify(msg));
          
            var remark = $(this).attr('remark')
            if (linkUrl.indexOf('?') > -1) {
                var link = htmlUrl(linkUrl + '&childrenname=' + name + '&childrenid=' + id)
                forward(link)
            } else {
                var linkk = linkUrl + '?childrenname=' + name + '&childrenid=' + id;
                var link = htmlUrl(linkk)
                forward(link)
            }
            return;
        });
        $('.openChild').on('click', function () {
            if ($(this).children('.pagechildUl').hasClass('pagechildUlShow')) {
                $('.pagechildUl').removeClass('pagechildUlShow')
            } else {
                $(this).children('.pagechildUl').addClass('pagechildUlShow')
            }
        })
        $('#trialContent').scrollTop(localStorage.getItem('sroll_height'))
    }
}else{
    $('.curtain').remove()
    $('#pu_content').children().remove('div')
    $('.tabMenu').remove()
    tip = '<div class="tip">' + '抱歉！暂时无数据' + '</div>';
    $('#pu_content').append(tip)
}
    
})