

function index(){
    if (localStorage.getItem('userId') == undefined || localStorage.getItem('userId') == '') {
        information()
    }
    if(GetRequest('token')){ information() } 
    
    // $('body').css({ 'background': 'url() no-repeat', 'background-size': 'cover', })
    htmlList='';
    htmlList=`<ul class="zlImg"></ul></div><div id="menuContent"></div>`;
    $('#mainHtml').prepend(htmlList);
    
    $(function(){
        $('.menuLi li').click(function(){  //菜单点击事件
            track=$(this).attr('track')
            trackArray = track.split('&');
            localStorage.setItem('track',trackArray)
            localStorage.setItem('year','')
            var name= $(this).attr('name');
            var link_url=$(this).attr('link')
            var id = $(this).attr('id');
            if(link_url.indexOf('trial')>-1||link_url.indexOf('lateralMenus')>-1 ){
                var id=$(this).attr('id')
            }else{
                var id=$(this).attr('id')
            }
            localStorage.setItem('trial','0')
            if(link_url.indexOf('?')>-1){
                var link= htmlUrl(link_url+ '&childrenname=' +name+ '&childrenid=' +id+ '&id='+$(this).attr('id'))
                 forward(link)
            }else{
                var link=htmlUrl(link_url+ '?childrenname=' +name+ '&childrenid=' +id+ '&id='+$(this).attr('id'))        
                forward(link)       
            }
        })
      
    });
    document.body.className='';
    $('.budget:last').css('border','none');

    function menuChoice() {
        $.ajax({
            url: url()+'api/base/configurations/all',
            type: 'GET',
            async: false,
            accept: 'application/json;charset=UTF-8',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            timeout: 100000,
            dataType: "json",
            success: function (data) {
                // console.log(data, '---');
                if(data != ''){
                var menuName='';
                var menuValue='';
                var menuAvailable='';
                for(var i=0;i<data.length;i++){
                    menuName += data[i].name;
                    menuValue += data[i].value;
                    menuAvailable += data[i].available;
                }
                menuList(menuName,menuValue,menuAvailable);
                }else{
                    menuList();
                }
            },
            error: function () {
                localStorage.clear(); 
                var test = setTimeout(function(){
                    layer.open({
                        content: '没有足够的权限访问，也许是token失效，请重新登录！', 
                        btn: ['确定'],
                        yes: function (index) {
                            if (equipment('iphone')) {
                                logout();
                            } else if (equipment("ipad")) {
                                logout();
                            }else{
                            JsBridge.call('JSBridge', 'logout', {}, function (res) {})
                            }
                        }
                    });
                    clearTimeout(test);
                },2000)  
            },
        })

    }

    menuChoice();   
    var data=[];
    function menuList(menuName,menuValue,menuAvailable){  //APP系统菜单
        var url_link='';
        if(menuName !== 'APP_MENU_THEME'|| menuValue == '' || menuAvailable == false){
            var url_link=url()+"api/menus/all?name=APP%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95";
        }else if(menuName == 'APP_MENU_THEME' && menuValue !== ''){
            var url_link =url()+"api/menus/"+menuValue;
        }else{
            var url_link='';
        }
       $.ajax({
        type:'GET',
        url:url_link,
        accept:'application/json;charset=UTF-8',
        headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`,'Working-Organization':1},
        data:{},
        async: false,
           success: function (msg) {
               //console.log(msg)
                for(var j=0;j<msg[0].children.length;j++){
                    if(msg[0].children[j].name == "标准版本"){
                        data=msg[0].children[j].children[0].children
                    }
                }
                localStorage.setItem('menuData',JSON.stringify(msg));
                var menuHtml='';
                var menuUL='';
                var menuDocument= '';
                var menuObject= new Object();
                filterArray(data);//用户权限管传值
                 //console.log(data)

                 var menuObject2= new Object();
                for(var k=0;k<4; k++){ //汶川首页上面四个菜单数据
                    var menuId2 = data[k].id;
                    menuObject2[menuId2] = data[k].children;
                    menuDocument+='<li data-link="'+data[k].link+'"data-name="'+data[k].name+'"data-id="'+data[k].id+'"><img src=" '+url()+data[k].iconValue+' " />'+'<span>'+data[k].name+'</span></li>'
                    
                }
                $('.zlImg').append(menuDocument);

                for (a = 5; a < data.length; a++) {
                    //console.log(data[a])
                    if(data[a].children && data[a].skipMode === "DROPDOWN"){
                      // console.log(data[a].children,'--children--');

                        for(var b=0;b<data[a].children.length;b++){
                            var menuId = data[a].children[b].id;
                            // console.log(menuId);
                            menuObject[menuId] = data[a].children[b];
                           // console.log(data[a].children[b].aclTrue,'---aclTrue---');
                            if(!data[a].children[b].hide && data[a].children[b].aclTrue){//判断用户权限
                                menuUL+='<li style="background: url('+url()+data[a].children[b].iconValue+') no-repeat;" class="trackClick" track='+a+'&'+b+' id=' +data[a].children[b].id+ ' name=' +data[a].children[b].name+ ' link='+data[a].children[b].link+'>'+'<span>'+data[a].children[b].name+'</span>'+'</li>'
                            }
                        
                        };
                        if(data[a].aclTrue){//判断用户权限
                            menuHtml+='<div class="menuItem" id=menu'+a+'>'+
                            '<div class="menuCont">'+'<div class="menuTitle">'+'<div>'+data[a].name+'</div>'+'</div>'+
                            '<ul class="menuLi">'+menuUL+'</ul>'+'</div>'+'</div>'
                        }
                    }
                
                    $('#menuContent').append(menuHtml)
                    menuHtml='';
                    menuUL='';
                };
                
                setData(menuObject, 'menu')
                setData(menuObject2, 'menu2')
               $('.zlImg li').click(function(){  //会议文件 分析报告 审查情况 发表意见点击事件
                var name= $(this).attr('data-name');
                var link = $(this).attr('data-link');
                var id = $(this).attr('data-id');
                if(link.indexOf('?')>-1){
                    var likUrl=link+'&commentTitle='+name+'&parentId='+id;
                }else{
                    var likUrl=link+'?commentTitle='+name+'&parentId='+id;
                }
               // console.log(htmlUrl(likUrl))
                forward(htmlUrl(likUrl))
               })
           }
       })
    }
    function setData(a, menu){
        // window.location.href=data[a].link || "/";
        localStorage.setItem(menu,JSON.stringify(a));
    }
    $(".menuTitle_R").on('click',function(){
        $(this).parent().next('div').find('.menuLi').css({'height':'auto','overflow':'visible'});
    })
    // $('#mainHtml').scrollTop(localStorage.getItem('Indexheight'))
    // $('#mainHtml').scroll(function() {  
    //     var yheight=$('#mainHtml').scrollTop(); //滚动条距顶端的距离                   
    //     localStorage.setItem('Indexheight',yheight)
    // })
    $('body').addClass('iosIndex');

}
SPA_RESOLVE_INIT = function(transition) { 
     $('#mainHtml').children().remove();
     index()
 }