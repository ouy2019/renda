
SPA_RESOLVE_INIT = function (transition) {
    if (localStorage.getItem('userId') == undefined || localStorage.getItem('userId') == '') {
        information()
    }
    setyear()
    $('#mainHtml').children().remove();
	if(localStorage.getItem('menuData')){

		var msg = JSON.parse(localStorage.getItem('menuData'));
		//var data = msg[0].children[4].children[2];
		for(var j=0;j<msg[0].children.length;j++){
		    if(msg[0].children[j].name == "标准版本"){
		        data=msg[0].children[j].children[2]
		    }
		}
	
        var htmlList = '';
		htmlList = '<div id="header">' + data.name + '<span id="year" class="timeStyle">' +
			'</span>' + '</div>' + '<div id="Public_container" style="width:100%;overflow:auto">' +
			'<div class="tabMenu tabCl" style="margin-top: 1rem">' +
			'<ul id="tabUl" class="officetab">' + '</ul>' + '</div>' +
			'<div id="Public_container" class="office_page" style="width:100%;height:100%;overflow:auto;">' +
			'<div id="pu_content" style="padding: 0px">' +
			'<div class="page" style="display: block;">' + '<ul id="treeDemo0" class="ztree">' + '</ul>' + '</div>' +
			'<div class="page" style="display: none;">' + '<ul id="treeDemo1" class="ztree">' + '</ul>' + '</div>' +
			'<div class="page" style="display: none;">' + '<ul id="treeDemo2" class="ztree">' + '</ul>' + '</div>' +
			'</div>' + '</div>'
		$('#mainHtml').prepend(htmlList);
		$('#mainHtml').css('overflow', 'auto');
		 var fileHeader = '';
		 var fileContent = '';
		 var fileContent_1 = '';
		 var fileContent_2 = '';
		 var fileContentChilren = '';
		 var fileContentChilren_1 = '';
		 var fileContentChilren_2 = '';
		$('#mainHtml').removeClass('Html_list');
		$('body').css({ 'background': 'url() no-repeat', 'background-size': 'cover' })
		 
		 //添加tab栏
		//  var menu = [{ name: '政策法规' }, { name: '使用指南' }, { name: '文档资料' }]
		 for (i = 0; i < data.children.length; i++) {
			 fileHeader += '<li>' + '<span>' + data.children[i].name + '</span>' + '</li>';
		 }
		 $('#tabUl').append(fileHeader);
		 $('#tabUl li').eq('0').addClass('active')
		 $('.page:first').addClass('pageOne')
		 //tab栏的点击事件  
		 $('#tabUl li').on('click', function () {
			 var numberIndex = $(this).index()
			 $(this).addClass('active');
			 $(this).siblings('li').removeClass('active');
			 $('.page').css('display', 'none')
			 $('.page').eq(numberIndex).css('display', 'block')
		 })
			
	}
   
    //政策法规
    policies()
    function policies() {
        $.ajax({
            url: url() + 'api/policy-categories/null/children?deepLoad=true&showSelf=false',
            type: 'GET',
            accept: 'application/json;charset=UTF-8',
            async: false,
            data: {},   //请求的数据
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            dataType: 'JSON',
            timeout: 3000,
            success: function (data) {
                // console.log(data)
                if (data != null && data != undefined) {
                    for (var a = 0; a < data.length; a++) {
                        if (data[a].children && data[a].children.length > 0) {
                            fileContentChilren = '';
                            for (var b = 0; b < data[a].children.length; b++) {
                                fileContentChilren +=
                                    '<li id="li_1" class="level1" data-name= "' + data[a].children[b].name + '"">' +
                                    '<span class="button level1 switch center_docu"></span>' +
                                    '<a id="a_1" class="level1">' +
                                    '<span class="button ico_docu"></span>' +
                                    '<span class="node_name topage" data-id="' + data[a].children[b].id + '" data-resourceType="' + data[a].children[b].resourceType + '">' + data[a].children[b].name + '</span>' + '</a>' +
                                    '</li>'

                            }
                            fileContent +=
                                '<li id="li_0" class="level0" data-id="' + data[a].id + '" data-name="' + data[a].name + '">' +
                                '<span class="button level0 switch roots_close">' + '</span>' +
                                '<a id="a_0" class="level0 curSelectedNode" target="_blank">' +
                                '<span class="button ico_open">' + '</span>' +
                                '<span class="node_name" data-id="' + data[a].id + '" data-resourceType="' + data[a].resourceType + '">' + data[a].name + '</span>' + '</a>' +

                                '<ul id="ul_1" class="level0 line">' + fileContentChilren + '</ul>' +
                                '</li>'
                            fileContentChilren += '';
                        } else {
                            fileContent +=
                                '<li id="li_0" class="level0">' +
                                '<span class="button level0 switch roots_close">' + '</span>' +
                                '<a id="a_0" class="level0 curSelectedNode" target="_blank">' +
                                '<span class="button ico_open">' + '</span>' +
                                '<span class="node_name topage" data-id="' + data[a].id + '" data-resourceType="' + data[a].resourceType + '">' + data[a].name + '</span>' + '</a>' +
                                '</li>'
                        }
                    }
                } else {
                    fileContent += ''
                }
                $('#treeDemo0').append(fileContent);
                $('#treeDemo0 li').children('ul').css('display', 'none');
                $('#treeDemo0 li').on('click', function () {
                    if ($(this).children('ul').hasClass('hideOffice')) {
                        $(this).children('ul').removeClass('hideOffice');
                    } else {
                        $('#treeDemo0 li').children('ul').removeClass('hideOffice');
                        $(this).children('ul').addClass('hideOffice');
                    };
                    event.preventDefault()
                    // event.stopPropagation();
                });
               
            },
            error: function (status) {
               
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
               
            }

        })
    };
    //监督指南
    Guide()
    function Guide() {
        $.ajax({
            url: url() + 'api/guide-categories/null/children?deepLoad=true',
            type: 'GET',
            accept: 'application/json;charset=UTF-8',
            async: false,
            data: {},   //请求的数据
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            dataType: 'JSON',
            timeout: 3000,
            success: function (data) {
                // console.log(data)
                if (data != null && data != undefined) {
                    for (var a = 0; a < data.length; a++) {
                        if (data[a].children && data[a].children.length > 0) {
                            fileContentChilren_1 = '';
                            for (var b = 0; b < data[a].children.length; b++) {
                                fileContentChilren_1 +=
                                    '<li id="li_3" class="level1" data-name= "' + data[a].children[b].name + '"">' +
                                    '<span class="button level1 switch center_docu"></span>' +
                                    '<a id="a_3" class="level1">' +
                                    '<span class="button ico_docu"></span>' +
                                    '<span class="node_name topage" data-id= "' + data[a].children[b].id + '" data-resourceType="' + data[a].children[b].resourceType + '">' + data[a].children[b].name + '</span>' + '</a>' +
                                    '</li>'
                            }
                            fileContent_1 +=
                                '<li id="li_2" class="level0" data-id="' + data[a].id + '" data-name="' + data[a].name + '">' +
                                '<span class="button level0 switch roots_close">' + '</span>' +
                                '<a id="a_2" class="level0 curSelectedNode" target="_blank">' +
                                '<span class="button ico_open">' + '</span>' +
                                '<span class="node_name" data-id="' + data[a].id + '" data-resourceType="' + data[a].resourceType + '">' + data[a].name + '</span>' + '</a>' +

                                '<ul id="ul_3" class="level0 line">' + fileContentChilren_1 + '</ul>' +
                                '</li>'
                            fileContentChilren_1 += '';
                        } else {
                            fileContent_1 +=
                                '<li id="li_2" class="level0">' +
                                '<span class="button level0 switch roots_close">' + '</span>' +
                                '<a id="li_2" class="level0 curSelectedNode" target="_blank">' +
                                '<span class="button ico_open">' + '</span>' +
                                '<span class="node_name topage" data-id="' + data[a].id + '" data-resourceType="' + data[a].resourceType + '">' + data[a].name + '</span>' + '</a>' +
                                '</li>'
                        }
                    }
                } else {
                    fileContent_1 += ''
                }
                $('#treeDemo1').append(fileContent_1);
                $('#treeDemo1 li').children('ul').css('display', 'none');
                $('#treeDemo1 li').on('click', function () {
                    if ($(this).children('ul').hasClass('hideOffice')) {
                        $(this).children('ul').removeClass('hideOffice');
                       
                    } else {
                        $('#treeDemo1 li').children('ul').removeClass('hideOffice');
                        $(this).children('ul').addClass('hideOffice');
                        
                    };
                    event.preventDefault()
                });
               

            },
            error: function (status) {
                
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
               
            }

        })
    }
    //文档资料
    Documentation()
    function Documentation() {
        $.ajax({
            url: url() + 'api/documentation-categories/null/children?deepLoad=true&showSelf=false',
            type: 'GET',
            accept: 'application/json;charset=UTF-8',
            async: false,
            data: {},
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            dataType: 'JSON',
            timeout: 3000,
            success: function (data) {
                // console.log(data)
                if (data != null && data != undefined) {
                    for (var a = 0; a < data.length; a++) {
                        if (data[a].children && data[a].children.length > 0) {
                            fileContentChilren_2 = '';
                            for (var b = 0; b < data[a].children.length; b++) {
                                fileContentChilren_2 +=
                                    '<li id="li_5" class="level1" data-name= "' + data[a].children[b].name + '"">' +
                                    '<span class="button level1 switch center_docu"></span>' +
                                    '<a id="a_5" class="level1">' +
                                    '<span class="button ico_docu"></span>' +
                                    '<span class="node_name topage" data-id="' + data[a].children[b].id + '" data-resourceType="' + data[a].children[b].resourceType + '">' + data[a].children[b].name + '</span>' + '</a>' +
                                    '</li>'
                            }
                            fileContent_2 +=
                                '<li id="li_4" class="level0" data-id="' + data[a].id + '" data-name="' + data[a].name + '">' +
                                '<span class="button level0 switch roots_close">' + '</span>' +
                                '<a id="a_4" class="level0 curSelectedNode" target="_blank">' +
                                '<span class="button ico_open">' + '</span>' +
                                '<span class="node_name" data-id="' + data[a].id + '" data-resourceType="' + data[a].resourceType + '">' + data[a].name + '</span>' + '</a>' +

                                '<ul id="ul_5" class="level0 line">' + fileContentChilren_2 + '</ul>' +
                                '</li>'
                            fileContentChilren_2 += '';
                        } else {
                            fileContent_2 +=
                                '<li id="li_4" class="level0">' +
                                '<span class="button level0 switch roots_close">' + '</span>' +
                                '<a id="a_4" class="level0 curSelectedNode" target="_blank">' +
                                '<span class="button ico_open">' + '</span>' +
                                '<span class="node_name topage" data-id="' + data[a].id + '" data-resourceType="' + data[a].resourceType + '">' + data[a].name + '</span>' + '</a>' +
                                '</li>'
                        }
                    }
                } else {
                    fileContent_2 += ''
                }
                $('#treeDemo2').append(fileContent_2);
                $('#treeDemo2 li').children('ul').css('display', 'none');
                // $('#treeDemo2 li').children('ul').remove();
                $('#treeDemo2 li').on('click', function () {
                    if ($(this).children('ul').hasClass('hideOffice')) {
                        $(this).children('ul').removeClass('hideOffice');
                       
                    } else {
                        $('#treeDemo2 li').children('ul').removeClass('hideOffice');
                        $(this).children('ul').addClass('hideOffice');
                       
                    };

                    event.preventDefault()
                });
               
            },
            error: function (status) {
                
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                
            }

        })
    }
    //子目录点击事件
     $('.topage').on('click', function(){
         console.log('子目录点击事件')
        var childrenid = $(this).attr('data-id');
        var childrenname = $(this).text();
        if(childrenname === '用户操作指南'){
            var title= '用户操作指南';
            var link = url()+ "doc-html/72777baf-b46b-44dc-aacf-365e82a81055.html";
            loadPage(link,title);
            return;
        }
        var link_url = 'officelist.html';  //resourceType
        localStorage.setItem('type',$(this).attr('data-resourceType'));
        if (link_url.indexOf("?") > -1) {
            var link =link_url+'&id='+childrenid+'&name='+childrenname;
            forward(htmlUrl(link))
        }else{
            var link =link_url+'?id='+childrenid+'&name='+childrenname;
            forward(htmlUrl(link))
        };
        event.preventDefault();
    })

        
  
	

}