


SPA_RESOLVE_INIT = function (transition) {
    if (localStorage.getItem('userId') == undefined || localStorage.getItem('userId') == '') {
        information()
    }
    setyear()
    $('#mainHtml').children().remove();
    var htmlList = '';
        htmlList = `<div id="header" style="position: fixed;top: 0;height:1rem;line-height: 1rem;"><span class="back"></span><span id="title"></span> <span class="yearSelect Select"></span></div>
        <a class="opinion"></a><div id="trialContent" style="height:100%;top:1rem;">
        <div id="mescroll2" class="mescroll1" style="height:90%;margin-top:1.7rem;padding: 0 0.36rem;">
        <ul id="newsList1" class="news-list option_L "></ul></div></div>`
   $('#mainHtml').prepend(htmlList);

    $(function () {
        $('.opinion').unbind("click").click(function (e) {
            option('option');   //提交意见
            e.preventDefault()
        })
        $('#title').text(localStorage.getItem('specialTeam'));
        $('#trialContent').css({ 'background': 'url(images/list_headbg.png) no-repeat', 'background-size': '100% 100%',});
        //在线意见列表
        superviseFn();
        function superviseFn() {
		if(localStorage.getItem('menuData')){
            setListData()
            /*设置列表数据 提交的意见列表*/
            function setListData() {
                if(getQueryString('categoryid')){
                    console.log(getQueryString('categoryid'))
                    var linkUrl= url() + `api/exam/online-advice?page=0&size=100&categoryId=${getQueryString('categoryid')}`;
                }else if(localStorage.getItem('specialTeam')){
                    var linkUrl= url()+`api/exam/online-advice?page=0&size=100&team=${localStorage.getItem('specialTeam')}`;
                }
                    // }else{
                //     var linkUrl= url()+`api/exam/online-advice?page=0&size=100`;
                // }
                $.ajax({
                    type: 'GET',
                    url: linkUrl,
                    accept: 'application/json;charset=UTF-8',
                    async: false,
                    data: {},   //请求的数据
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
                    dataType: 'JSON',
                    success: function (data) {
                        if(data.data && data.data.length){
                            var data = data.data;
                            var dateTime = new Date;
                            var yearTime = dateTime.getFullYear();
                            var month = dateTime.getMonth() + 1
                            var date = dateTime.getDate(); 
                            var ymd = yearTime+'-0'+month+'-'+date
                            // console.log(ymd)
                            console.log(data,'--提交的意见列表数据--');
                            var result = '';
                            for (var i = 0; i < data.length; i++) {
                              result +=`<div class="commentList"><div class="${data[i].createdTime.substring(0,10) == ymd ? "newBg" : "" }"></div>
                                        <li class="optionBtn" data-name="${data[i].title}" data-id="${data[i].id}">
                                          <div class="optionuser clearfix">
                                             <img src="images/optionico1.png">
                                             <span class="publisher">${data[i].name ? data[i].name : data[i].category.name}</span><span>|</span>
                                             <span class="datatime">${data[i].createdTime}</span>
                                          </div>
                                          <div class="ophead">${data[i].title ? data[i].title : ''}</div>
                                          <div class="opconment">${data[i].content}</div>
                                          <div class="oplabel clearfix">
                                             <ul style="width:98%;"><li>${data[i].category.name ? data[i].category.name : data[i].name}</li><div class="totalRecords"><span>${data.length}</span></div></ul></div>
                                        </li></div>`;
                                        // console.log(data[i].createdTime.substring(0,10),'截取的时间')
                                        // console.log(data[i].createdTime.substring(0,10) == ymd)
                                        // console.log(ymd)
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