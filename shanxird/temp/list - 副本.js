


SPA_RESOLVE_INIT = function (transition) {
    if (localStorage.getItem('userId') == undefined || localStorage.getItem('userId') == '') {
        information()
    }
    setyear()
    $('#mainHtml').children().remove();
    var htmlList = '';
    htmlList = '<div class="curtain">'+'</div>'+'<div id="header"></div>'+'<div id="trialContent">'+'<div class="tabMenu opt">'+'<ul id="tabUl">'+'</ul>'+'</div>'+'<div id="pu_content">'+'<div id="iosHeight">'+'</div>'+'</div>'+'</div>'
   
   
    $('#mainHtml').prepend(htmlList);

    $(function () {
        tabUl = '';
        page = '';
        pageLi = '';
        pageCol = ''
      
        $('#header').css({ 'background': 'url(images/headbg.png) no-repeat', 'background-size': '100% 100%', 'height': '1.8rem' })
      
        // menuName = getQueryString('menuName');
        var id = getQueryString('id');
        var token = localStorage.getItem('token');
        var userId = localStorage.getItem('userId');

        //在线意见列表
        superviseFn()
        function superviseFn() {
		if(localStorage.getItem('menuData')){

            var msg = JSON.parse(localStorage.getItem('menuData'));
            for(var j=0;j<msg[0].children.length;j++){
                if(msg[0].children[j].name == "标准版本"){
                    data=msg[0].children[j].children[1].children
                }
            }
            //console.log(data);
            for (var a = 0; a < data.length; a++) {
                if (data[a].children != undefined) {
                    var opChild_li = ''
                    for (var i = 0; i < data[a].children.length; i++) {
                        opChild_li += '<div data-id="' + data[a].children[i].id + '">' + data[a].children[i].name + '</div>'
                    }
                    opChild = '<ul class="opShow childAren">' + opChild_li + '</ul>'

                    pageLi += '<li class="optionBtn"   data-show="1">' + '<a class="filetab"><div><i>' + data[a].name + '</i></div>' + opChild + '</a></li>'
                } else {
                    if(!data[a].hide){
                        
                        pageLi += '<li class="optionBtn"  data-id=' + data[a].id + ' data-link='+data[a].link+'>' + '<a class="filetab"><div><i>' + data[a].name + '</i></div>' + '</a></li>'
                    }
                
                }
            }
            
            page = '<div class="page">' + '<div id="trialMun">' + '<ul class="option_L">' + pageLi +'</ul>' + '</div>' + '</div>';

            $('#pu_content').prepend(page);
            // $('#title').text(menuName);
            $('.tabMenu').remove();
            $('#trialMun').css('top', '0.8rem');
            document.body.className = '';
            $(".optionBtn").on("click", function (e) {
                if ($(this).attr('data-id') != '') {
                    e.preventDefault();
                    var url_link = $(this).attr('data-link')
                   // var link = url_link + '?userId=' + userId + '&token=' + token + '&id=' + $(this).attr('data-id') + '&commentTitle=' + $(this).find('i').text()
                    if(url_link.indexOf('?')>-1){
						var link = url_link + '&userId=' + userId + '&token=' + token + '&id=' + $(this).attr('data-id') + '&commentTitle=' + $(this).find('i').text()
					}else{
						var link = url_link + '?userId=' + userId + '&token=' + token + '&id=' + $(this).attr('data-id') + '&commentTitle=' + $(this).find('i').text()
					}
					forward(htmlUrl(link))
                } else {
                    // $('.opShow').css('display','block')
                    $(this).find('.opShow').css('display', 'block')
                    $('.opShow div').click(function () {
                        var subtype = $(this).index() + 1
                        var link = 'optionList.html?' + 'userId=' + userId + '&token=' + token + '&id=' + $(this).attr('data-id') + '&commentTitle=' + $(this).text();
                        forward(htmlUrl(link))
                    })
                }
            });
		}else{
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
			 },3000) 
		}
       }
    })
}