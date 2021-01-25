function list(){
    if (localStorage.getItem('userId') == undefined || localStorage.getItem('userId') == '') {
        information()
    }
    if(GetRequest('token')){ information() } 
    setyear();
    $('#mainHtml').children().remove();
    var htmlList = '';
        htmlList = `<div id="header" style="position: fixed;top: 0;height:1rem;line-height: 1rem;"><span class="back"></span><span id="title"></span> <span class="yearSelect Select"></span></div>
        <a class="opinion"></a><div id="trialContent" style="height:100%;top:1rem;background-color:#F6F7F9">
           <div id="mescroll" class="mescroll1" style="width:100%;height:100%;overflow-y:auto;">
               <ul id="newsList" class="news-list option_L " style="overflow:auto !important;top: 0.5rem;padding: 0 0.36rem;margin-bottom: 2rem;"></ul>
           </div>
           <div id="iosHeight"></div>
        </div>`
    $('#mainHtml').prepend(htmlList);
    $('.opinion').unbind("click").click(function (e) {
        option('option');   //提交意见
        e.preventDefault()
    })
    $('#title').text(localStorage.getItem('specialTeam'));
    // $('#trialContent').css({ 'background': 'url(images/list_headbg.png) no-repeat', 'background-size': '100% 100%',});
    // $('#trialContent').attr("style" ,'background:#F6F7F9;');
        //在线意见列表
    var mescroll = new MeScroll("mescroll",{
        up:{
            callback: upCallback, //上拉加载的回调
            empty: {
                tip: "暂无相关数据~" //提示
            },
            noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;			
            
        }
    })
    var dataL = [];
    if(dataL == ''){ $('.mescroll-upwarp').remove(); }

    // setListData()
    /*设置列表数据 提交的意见列表*/
    function upCallback(page) {
        var pageNum = page.num-1; // 页码, 默认从1开始 如何修改从0开始 ?
        var pageSize = page.size; // 页长, 默认每页10条

        if(getQueryString('categoryid')){
            console.log(getQueryString('categoryid'))
            var linkUrl= url() + `api/exam/online-advice?page=${pageNum}&size=${pageSize}&categoryId=${getQueryString('categoryid')}&source=app`;
        }else if(localStorage.getItem('specialTeam')){
            var linkUrl= url()+`api/exam/online-advice?page=${pageNum}&size=${pageSize}&team=${localStorage.getItem('specialTeam')}&source=app`;
        }
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
                    var ymd = yearTime+'-0'+month+'-'+date;
                    var result = '';
                    
                    var totalPage=data.totalRecords;
                    if(page.num == 1) {dataL = [];} //如果是第一页需手动置空列表
                    dataL = dataL.concat(data); //追加新数据
                    // console.log(ymd)
                    console.log(dataL,'--提交的意见列表数据--');
                    $('#newsList').children().remove();

                    for (var i = 0; i < dataL.length; i++) {
                        result +=`<div class="commentList"><div class="${dataL[i].createdTime.substring(0,10) == ymd ? "newBg" : "" }"></div>
                                <li class="optionBtn" data-name="${dataL[i].category.name ? dataL[i].category.name : dataL[i].name}" data-id="${dataL[i].id}">
                                    <div class="optionuser clearfix">
                                        <img src="images/optionico1.png">
                                        <span class="publisher">${dataL[i].name ? dataL[i].name : dataL[i].category.name}</span><span>|</span>
                                        <span class="datatime">${dataL[i].createdTime}</span>
                                    </div>
                                    <div class="ophead">${dataL[i].title ? dataL[i].title : ''}</div>
                                    <div class="opconment">${dataL[i].content}</div>
                                    <div class="oplabel clearfix "><ul class="deleteHide" style="width:98%;text-align: left;"><li style="display:none;">右滑动删除意见</li></ul></div>
                                </li></div>`;
                                //<div class="totalRecords"><span>${data.length}</span></div>
                                // console.log(data[i].createdTime.substring(0,10),'截取的时间')
                                // console.log(data[i].createdTime.substring(0,10) == ymd)
                                // console.log(ymd)
                    }

                    $('#newsList').append(result);
                    //点击跳转页面(报表)
                    $('.commentList li').click(function () {
                        var optionId = $(this).attr('data-id');
                        var optionName = $(this).attr('data-name');
                        var link = `optionDatile.html?opinionid=${optionId}&name=${optionName}`
                        forward(htmlUrl(link));
                    });
                    mescroll.endByPage(data.length, totalPage);
                    // $('.delete').click(function(){
                    //     Delete(i)
                    // })

                    var slideEle = $("#newsList").slideEle({ //绑定插件所需要的作用域
                        parentBox: $("ul"),//被编辑标签的直接父元素标签
                        slideBars: $(".optionBtn"),//需要滑动删除、编辑的标签组
                        alterTag: $(".t"),//需要修改内容的标签，必须单独用一个标签包裹
                        tagWidth: 80,//右侧按钮宽度,默认80
                        editBtn: false,//是否需要编辑按钮 true/false
                    });
                };
                
            },
            error: function (status) {
                mescroll.endErr();
            },
        });
    }

 

}
SPA_RESOLVE_INIT = function (transition) {
    $('#mainHtml').children().remove();
    list();    
}