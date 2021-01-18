


SPA_RESOLVE_INIT = function (transition) {
    if (localStorage.getItem('userId') == undefined || localStorage.getItem('userId') == '') {
        information()
    }
    setyear()
    $('#mainHtml').children().remove();
    var htmlList = '';
        htmlList = `<div id="header"><span class="back"></span><span id="title"></span> <span class="yearSelect Select"></span></div>
        <a class="opinion"></a><div id="trialContent"><div id="mescroll2" class="mescroll1" style="width:100%;height:90%;margin-top: 0.4rem;">
        <ul id="newsList1" class="news-list option_L commentList"></ul></div></div>`
   $('#mainHtml').prepend(htmlList);

    $(function () {
        $('.opinion').unbind("click").click(function (e) {
            option('option');   //提交意见
            e.preventDefault()
        })
        $('#title').text(localStorage.getItem('specialTeam'));
        // $('#header').css({ 'background': 'url(images/headbg.png) no-repeat', 'background-size': '100% 100%', 'height': '1.8rem' })
        //在线意见列表
        superviseFn();
        function superviseFn() {
		if(localStorage.getItem('menuData')){
            setListData()
            /*设置列表数据 提交的意见列表*/
            function setListData() {
                if(getQueryString('categoryid')){
                    var linkUrl= url() + `api/exam/online-advice?page=0&size=100&categoryId=${getQueryString('categoryid')}`;
                }else if(localStorage.getItem('specialTeam')){
                    var linkUrl= url() + `api/exam/online-advice?page=0&size=100&categoryId=${getQueryString('categoryid')}&team=${localStorage.getItem('specialTeam')}`;
                }else{
                    var linkUrl= url() + `api/exam/online-advice?page=0&size=100`;
                }
                $.ajax({
                    type: 'GET',
                    url: linkUrl,
                    accept: 'application/json;charset=UTF-8',
                    async: false,
                    data: {},   //请求的数据
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
                    dataType: 'JSON',
                    timeout: 3000,
                    success: function (data) {
                        if(data.data && data.data.length){
                            var data = data.data;
                            console.log(data,'--提交的意见列表数据--');
                            var result = '';
                            for (var i = 0; i < data.length; i++) {
                              result +=`<li class="optionBtn" data-name="${data[i].title}" data-id="${data[i].id}">
                                          <div class="optionuser clearfix">
                                             <img src="images/optionico1.png">
                                             <span class="publisher">${data[i].name ? data[i].name : data[i].category.name}</span><span>|</span>
                                             <span class="datatime">${data[i].createdTime}</span>
                                          </div>
                                          <div class="ophead">${data[i].title}</div>
                                          <div class="opconment">${data[i].content}</div>
                                          <div class="oplabel clearfix">
                                             <ul><li>${data[i].category.name ? data[i].category.name : data[i].name}</li></ul></div>
                                        </li>`
                            }
                            $('#newsList1').append(result);
                            //点击跳转页面(报表)
                            $('#mescroll2 li').click(function () {
                                var optionId = $(this).attr('data-id');
                                var optionName = $(this).attr('data-name');
                                var link = `optionDatile.html?opinionid=${optionId}&name=${optionName}`
                                forward(htmlUrl(link));
                            });
                        };
                        
                    },
                    error: function (status) {
                       
                    },
                   
                });
                var slideEle = $("#newsList").slideEle({ //绑定插件所需要的作用域
                    parentBox: $("ul"),//被编辑标签的直接父元素标签
                    slideBars: $(".optionBtn"),//需要滑动删除、编辑的标签组
                    alterTag: $(".t"),//需要修改内容的标签，必须单独用一个标签包裹
                    tagWidth: 80,//右侧按钮宽度,默认80
                    editBtn: false,//是否需要编辑按钮 true/false
                });
            }
            
            
            
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