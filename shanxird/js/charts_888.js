
$(document).ready(function () {
    $('.opinion').unbind("click").click(function () {
        option($('#excelHead').text())
    })
    $('.back').click(function () {
       back();
    });
    var userId = localStorage.getItem('userId')
    var name = getQueryString('childrenname');
    var id = getQueryString('childrenid');
   
   // localStorage.setItem()
    //$('body').css({'background':'url(images/indebg.png) no-repeat','background-size':'100% 100%'})
   
    // 点击切换
    $('#tabUl li').click(function () {
        $('#tabUl li').removeClass('tab_active')
        $(this).addClass('tab_active')
        $(this).addClass('active');
        $(this).siblings('li').removeClass('active');
        var numberIndex = $(this).index();
        if (numberIndex == '2') {
            $('.draft_title ').css('display', 'none')
        } else {
            $('.draft_title ').css('display', 'flex')
        }
        if(numberIndex == '1' ){
            tablePage()
        }
        if(numberIndex == '0' || numberIndex == '2'){
            // $('.layui-border-box').remove();
            $('.layui-border-box').css('display','none');
        }
        $('.page').css('display', 'none')
        $('.page').eq(numberIndex).css('display', 'block')
    })
    $('#title').text(name);
    // $('#header .yearSelect').text(year);
    //选择年份
    timeTip(id);
    function timeTip(id) {
        var li = ''
        var urlyear = url() + "api/app/report/years?menuId="+id;
        $.ajax({
            url: urlyear,
            type: 'GET',
            async: false,
            accept: 'application/json;charset=UTF-8',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            dataType: "json",
            success: function (data) {
                ////         ($(this).text(),'年份点击事件console.log(data, '选择年份---');
                if (data.length !=null && data.length !=0) {
                    localStorage.setItem("year", data[0]);
                   $('#header .yearSelect').text(data[0]);
                    for (var i = 0; i < data.length; i++) {
                        li += '<li class="tipList">' + data[i] + '</li>';
                    }
                    $('.timeTip').children('ul').append(li);
                    //选择年份事件                      
                    $('.yearSelect').click(function () {
                        
                        if ($('.timeTip').hasClass('show')) {
                            $('.timeTip').hide();
                            $('.timeTip').removeClass('show')
                        } else {
                            $('.timeTip').addClass('show')
                        }
                    });
                   
                    $('.timeZZ').click(function () {
                        
                        $('.timeZZ').css('visibility', 'hidden')
                        $('.timeTip').hide();
                        $('.timeTip').removeClass('show')
                    })
                    //年份点击事件
                    $('.tipList').click(function () {
                        layer.msg('努力加载中...', {icon: 16, shade: 0.4, time:1000});
                        $('.tipList').removeClass('yearactive')
                        $(this).addClass('yearactive')
                        localStorage.setItem('year', $(this).text())
                        $('.yearSelect').text( $(this).text())
                        $('.timeTip').removeClass('show')
                        $('.iframe').remove();
                        $('.pk-option').remove(); 
                        $('.pk-option_1').remove();
                        $('.budgetcss').remove();
                        $('#tabUl li').removeClass('active');
                        $('#tabUl li').eq(0).addClass('active');
                        $('.layui-border-box').children().remove();
                        echarts_title(id, name);
                        table_title(id, name);
                        relationDocument(id, name);
                        clickMonth(id);
                        //tablePage()//表格数据
                        // location.reload();
                        charts_page();
                    })
                } else {
                    // const time = new Date();
                    // const year = time.getFullYear(); 
                    // $('.yearSelect').text(year);
                    // localStorage.setItem('year',year)
                    
                }
            },
            error: function () {
                
            },
           

        })

    }
    //关闭月份
    function close_Month() {
        $('.month_show').click(function () {
            $(this).css('display', 'none')
            $('.month_M').css('display', 'none')
            $('.month').css({ 'background': 'url(./images/index_search_icon.png) right center no-repeat #fff', 'background-size': '10px', 'background-position': 'right 4px center' })
        })
    }
    close_Month()

    clickMonth(id)
    //选择月份
    function clickMonth(id) {
        var Monthurl = url() + "api/app/report/months?menuId="+id+"&year="+localStorage.getItem('year');
        $.ajax({
            url: Monthurl,
            type: 'GET',
            async: false,
            accept: 'application/json;charset=UTF-8',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            timeout: 100000,
            dataType: "json",
            success: function (data) {
                // //         ($(this).text(),'年份点击事件console.log(data, '选择月份---');
                if (data.length != 0 && data.length != null) {
                        $('.month').css('display', 'block')
                        $('#excelHead').css('width', '75%')
                        $('.month_cur').text(data[0]);
                        var li = '';
                        for (var i = 0; i < data.length; i++) {
                            li += '<li><span>' + data[i] + '月</span></li>'
                        }
                        $('.month_M').append(li)
                        $('.month_M ').find('span').eq(0).addClass('active')

                        $('.month').click(function () {
                            $('.month_M').css('display', 'block')
                            $('.month_show').css('display', 'block')
                            $('.month').css({ 'background': 'url(./images/index_search_icon_top.png) right center no-repeat #fff', 'background-size': '10px', 'background-position': 'right 4px center' })
                        })
                        $('.month_M li').click(function () {
                            layer.msg('努力加载中...', {icon: 16, shade: 0.4, time:1000});
                            $('.month_M li').children('span').removeClass('active');
                            $(this).children('span').addClass('active')
                            $('.month_show').css('display', 'none')
                            $('.month_dq').text($(this).children('span').text())
                            localStorage.setItem('month', parseInt($(this).text()))
                            $('#tabUl li').removeClass('active')
                            $('#tabUl li').eq('1').addClass('active')
                            $('.month_M').css('display', 'none');
                            $('.iframe').remove();
                            $('.pk-option').remove(); 
                            table_title(id, name)
                        })
                        $('.month').css('display', 'block')
                        $('#excelHead').css('width', '75%')
                    } else {
                        $('.month').css('display', 'none')
                    }
            },
            error: function () {
               
            },
           

        })
    }

    const XAXIS_OFFSET_GROW = 28; // 多轴时每行高度
    /** 渲染自定义多维度轴 */
    function renderCustomItem(arr, level) {
        if (!arr || !arr.length) return;
        const dataLen = arr.length,
            showArr = getShowMark(arr, dataLen),
            fp = {}; // 记录当前刻度刷新的时间
        return function (params, api) {
            if (!api.coord) return;
            const p = showArr[params.dataIndex];
            if (!p) return;
            const currentTime = new Date().getTime();
            if (fp[p.start] && currentTime - fp[p.start] < 10) return;
            // 同时只渲染一组
            fp[p.start] = currentTime;

            const style = api.style({
                stroke: '#ccc', // 颜色要根据主题变化，不应写死
                lineWidth: .5,
                fill: null
            });
            const pointA = api.coord([p.start, 0]);
            const pointA_ = api.coord([p.start + 1, 0]);
            const pointB = api.coord([p.end, 0]);
            const halfX = (pointA_[0] - pointA[0]) / 2;
            const baseY = params.coordSys.y + params.coordSys.height;
            const x1 = pointA[0] - halfX;
            let x2 = pointB[0] - halfX;

            if (p.end === dataLen - 1) { // 最后一列
                x2 = pointB[0] + halfX;
            }
            const comp = [];
            comp.push({
                type: 'text',
                style: {
                    text: p.text,
                    x: (x1 + x2) / 2,
                    y: baseY + (level - 1) * XAXIS_OFFSET_GROW + 8,
                    textAlign: 'center',
                    fill: '#999' // 颜色要根据主题变化，不应写死
                    // textFont: api.font({color: '#ccc'})
                }
            });
            // if(p.start != 0){ // 首列不显示刻度了
            comp.push({
                type: 'line',
                shape: {
                    x1: x1,
                    x2: x1,
                    y1: baseY,
                    y2: baseY + level * XAXIS_OFFSET_GROW
                },
                style: style
            });
            // }
            if (p.end === dataLen - 1) { // 最后一列
                comp.push({
                    type: 'line',
                    shape: {
                        x1: x2,
                        x2: x2,
                        y1: baseY,
                        y2: baseY + level * XAXIS_OFFSET_GROW
                    },
                    style: style
                });
            }
            return {
                type: 'group',
                children: comp
            };
        };
    }
    /** 找出所有2+级刻度 */
    function getShowMark(arr, dataLen) {
        const showArr = {};
        let currentData, currentIndex = 0;

        arr.forEach(function (d, index) {
            const nowData = (d && d.value) || d;
            if (nowData !== currentData || index === dataLen - 1) { // 跟上一个元素不一样了
                if (currentData !== undefined) {
                    const show = {
                        start: currentIndex,
                        end: index,
                        text: currentData
                    };
                    const middleIndex = (currentIndex + index - 1) / 2;
                    // 只记录任意一边都会造成部分情况下不显示刻度
                    // 全部都记录又太多，dataZoom滚动时刻度会闪烁
                    // 折中，记录前、中、后
                    showArr[currentIndex] = show;
                    showArr[Math.floor(middleIndex)] = show;
                    showArr[Math.ceil(middleIndex)] = show;
                    showArr[index - 1] = show;
                }
                currentData = nowData; // 清空
                currentIndex = index;
            }
        });
        // //         ($(this).text(),'年份点击事件console.log('数据长度：', dataLen, arr, showArr);
        return showArr;
    }
    function RandomNumBoth(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    }
    echarts_title(id, name)
    //根据菜单查询绑定分析模型
    function echarts_title(id, name) {
        var chartur = url() + "api/app/report/analysis-modules?menuId="+id;
        $.ajax({
            url: chartur,
            type: 'GET',
            accept: 'application/json;charset=UTF-8',
            async: false,
            data: {},   //请求的数据
            //请求的头部信息
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            dataType: 'json',
            success: function (data) {
               // //         ($(this).text(),'年份点击事件console.log(data, '菜单查询绑定分析模型--------');
                //排列data的循序安小到大排列
                for (var j = 0; j < data.length - 1; j++) {
                    for (var i = 0; i < data.length - 1 - j; i++) {
                        if (data[i].showOrder > data[i + 1].showOrder) {
                            var temp = data[i];
                            data[i] = data[i + 1];
                            data[i + 1] = temp;
                        }
                    }
                }
                if (data.length > 0) {
                    // $('.yearSelect').text(data[0].year)
                    localStorage.setItem('echartsid', data[0].resourcePath);
                    $('#excelHead_1').text(data[0].name);
                    var tableSelect = '';
                    for (var i = 0; i < data.length; i++) {
                        tableSelect += '<li class="pk-option_1  -clean_1" data-id=' + data[i].resourcePath + '>' + '<span class="icon_1">' + '</span>' + '<span class="txt_1">' + data[i].name + '</span>' + '</li>'
                    }
                    $('.mainExcel_1').append(tableSelect);
                    $('.mainExcel_1 li').eq('0').addClass('active')

                    //打开报表列表显示层
                    $('.btn_1').bind('click', function () {
                        $('.month_M_1').css('display', 'none')
                        $('.month_show_1').css('display', 'none')
                        $('.pk-overlay_1').addClass('-show_1')
                        $('.excel_1').addClass('-show_1')
                    })
                    $('.yearD li').eq('0').css({ 'background': 'url(images/selected.png) 0.25rem center no-repeat', 'background-size': '10px' })
                    $('.mainExcel_1 li').click(function () {
                        layer.msg('努力加载中...', {icon: 16, shade: 0.4, time:1000});
                        $('.month_M span').removeClass('active')
                        $('.mainExcel_1 li').removeClass('active')
                        $(this).addClass('active')
                        $('.excel_1').addClass('-show_1');
                        var str = $(this).find('span').eq('1').text();
                        $('#excelHead_1').text(str)
                        $('.excel_1').removeClass('-show_1')
                        $('.pk-overlay_1').removeClass('-show_1')
                        localStorage.setItem('echartsid', $(this).attr('data-id'))
                        $('.page').eq('0').find('.budgetcss').remove()
                        $('#tabUl li').eq('0').addClass('tab_active')
                        var tabIndex
                        for (var i = 0; i < 3; i++) {
                            if ($('#tabUl li').eq(i).hasClass('active')) {
                                tabIndex = i
                            }
                        }
                        $('#tabUl li').removeClass('active tab_active')
                        $('#tabUl li').eq(tabIndex).addClass('active tab_active')
                        var title = $(this).find('.txt_1').text();
                        charts_page(id, title, name)
                    })


                    $('.pk-overlay_1').click(function (e) {
                        layer.msg('努力加载中...', {icon: 16, shade: 0.4, time:1000});
                        e.preventDefault();
                        e.stopPropagation();
                        $('.excel_1').removeClass('-show_1')
                        $('.pk-overlay_1').removeClass('-show_1')
                        $('.yearD').removeClass('-show')
                    })
                    $('.close_1').click(function (e) {
                        layer.msg('努力加载中...', {icon: 16, shade: 0.4, time:1000});
                        e.preventDefault();
                        e.stopPropagation();
                        $('.excel_1').removeClass('-show_1')
                        $('.pk-overlay_1').removeClass('-show_1')
                        $('.yearD').removeClass('-show')
                    })
                } else {
                    
                    $('#excelHead_1').text('暂时无数据');
                   
                }
            },
            error: function () {
                localStorage.removeItem('echartsid');
            },

        })

    }
   
    charts_page();
    // 图形分析   多维分析管理接口
    function charts_page(id, name) {
        var year = localStorage.getItem('year');
        //         ($(this).text(),'年份点击事件console.log(year,'99999')
        $('.page').eq('0').css('display', 'block')
       
        tableData = [];
        tip = '';       //localStorage.getItem('') 
        var dataUrl = url() + "api/data/insight/convertInsight?insightId="+localStorage.getItem('echartsid')+"&isOptionOnly=true";
        $.ajax({
            url: dataUrl,
            type: 'POST',
            accept: 'application/json;charset=UTF-8',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            data: JSON.stringify({
                "年份":year,
            }),   //请求的数据
            processData: false,
            //请求的头部信息
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            timeout: 100000,
            dataType: "json",
            success: function (data) {
                // //         ($(this).text(),'年份点击事件console.log(data, '多维分析管理接口----');
                if (data.code == 15) {
                    layer.open({
                        content: '登录超过有效期，请重新登录',
                        btn: ['重新登录'],
                        yes: function (index) {
                            window.location = '../login.html'
                        }
                    });

                } else {
                    if (data.length == 0) {
                        $('.tip').text('暂时无数据')
                    }
                    function tmpl(iclass, barID, title) {
                        html = '<div class="budgetcss">' + '<div class="draft_title">' + '<h3><p>' + title + '</p><small style="font-size:10px;color:#939393">&nbsp&nbsp(单位:万元)</small>' + '</h3>' + '</div>' +
                            '<div id="' + barID + '" class="' + iclass + ' line charts" style="width:100%"></div>' +
                            '</div>';
                        $('.page').eq('0').append(html)
                    }

                    function pageDiv(i) {
                        var jsonData;
                        try {
                            jsonData = JSON.parse(data[i].snapshotResult.data);
                        }catch(e) {
                            //console.error(e);
                            return;
                        }
                        var series_ber = jsonData.series;
                      
                        for (let b = 0; b < series_ber.length; b++) {
                            if (series_ber[b].type === 'custom') {
                                // series_ber[b].level = 2;   
                                series_ber[b].renderItem = renderCustomItem(series_ber[b].data, series_ber[b].level);
                            }

                            if (series_ber[b].label && series_ber[b].label.formatterFun) {
                                series_ber[b].label.formatter = (params) => {
                                    if (params.value == null) {
                                        return '';
                                    }
                                    if (data[i].subChartType.includes('orizon')) { // 条形
                                        return params.value[0];
                                    }
                                    return params.value[1];
                                };
                            }
                        }
                        const axiss = [].concat(jsonData.xAxis || []).concat(jsonData.yAxis || []);
                        if (axiss && axiss.length) {
                            axiss.forEach(axis => {
                                if (axis.axisLabel && axis.axisLabel.categoryAxisLabelWidth) {
                                    axis.axisLabel.formatter = (label) => {
                                        const len = label.length;
                                        const w = Math.max(1, Math.min(axis.axisLabel.categoryAxisLabelWidth, len));
                                        const cycle = len / w | 0;
                                        const rest = len % w;
                                        let newLabel = '';
                                        let i = 0;
                                        while (i < cycle) {
                                            newLabel += label.slice(i * w, (i + 1) * w);
                                            newLabel += '\n';
                                            i += 1;
                                        }
                                        if (rest) {
                                            newLabel += label.slice(-rest);
                                        }
                                        return newLabel;
                                    };
                                }
                            })
                        }
                       
                        //柱状图  bar
                        if (data[i].chartType == "bar") {
                           if(data[i].columns.filter){
                            var columns=data[i].columns.filter;
                            var title = data[i].chartTitle;
                            for(var k=0;k<columns.length; k++){
                                timu = columns[k].columnOption.filterValues[0];
                                const reg=new RegExp(`\\\${${columns[k].originColumn.aliasName}}`,'g');
                                title=title.replace(reg,timu);
                                if(Number(columns[k].columnOption.filterValues[0])  && title.indexOf("年") > 0 ){
                                    title = year + title.substring(4);
                                }
                                //         ($(this).text(),'年份点击事件console.log(title,'----------')
                            }
                           }else{
                              var title = data[i].chartTitle;
                           }
                            var barID = i
                            var iclass = "bar";
                            tmpl(iclass, barID, title);
                            // labelX(barID,labelTxt_len,i);
                            var jsonData = JSON.parse(data[i].snapshotResult.data);
                            var series_ber = jsonData.series;

                            for (let b = 0; b < series_ber.length; b++) {
                                if (series_ber[b].type === 'custom') {
                                    // series_ber[b].level = 2;   
                                    series_ber[b].renderItem = renderCustomItem(series_ber[b].data, series_ber[b].level);
                                }
                                if (series_ber[b].label && series_ber[b].label.formatterFun) {
                                    series_ber[b].label.formatter = (params) => {
                                        if (params.value == null) {
                                            return '';
                                        }
                                        if (data[i].subChartType.includes('orizon')) { // 条形
                                            return params.value[0];
                                        }
                                        return params.value[1];
                                    };
                                }
                            }
                            const axiss = [].concat(jsonData.xAxis || []).concat(jsonData.yAxis || []);
                            if (axiss && axiss.length) {
                                axiss.forEach(axis => {
                                    if (axis.axisLabel && axis.axisLabel.categoryAxisLabelWidth) {
                                        axis.axisLabel.formatter = (label) => {
                                            const len = label.length;
                                            const w = Math.max(1, Math.min(axis.axisLabel.categoryAxisLabelWidth, len));
                                            const cycle = len / w | 0;
                                            const rest = len % w;
                                            let newLabel = '';
                                            let i = 0;
                                            while (i < cycle) {
                                                newLabel += label.slice(i * w, (i + 1) * w);
                                                newLabel += '\n';
                                                i += 1;
                                            }
                                            if (rest) {
                                                newLabel += label.slice(-rest);
                                            }
                                            return newLabel;
                                        };
                                    }
                                })
                            }
                            barID = echarts.init(document.getElementById(barID));
                            barID.setOption(jsonData);
                            //饼形图 pie
                        } else if (data[i].chartType == "pie") {
                            var barID = i
                            if(data[i].columns.filter){
                                var columns=data[i].columns.filter;
                                var title = data[i].chartTitle;
 
                                for(var k=0;k<columns.length; k++){
                                    timu = columns[k].columnOption.filterValues[0];
                                    const reg = new RegExp(`\\\${${columns[k].originColumn.aliasName}}`,'g');
                                    title=title.replace(reg,timu);

                                    if(Number(columns[k].columnOption.filterValues[0])  && title.indexOf("年") > 0 ){
                                        title = year + title.substring(4);
                                    }
                                    //         ($(this).text(),'年份点击事件console.log(title);
                                    
                                }
                               
                            }else{
                                  var title = data[i].chartTitle;
                            }
                            var iclass = "pie";
                            tmpl(iclass, barID, title);
                            // labelX(barID,labelTxt_len,i);

                            var jsonData = JSON.parse(data[i].snapshotResult.data);
                            barID = echarts.init(document.getElementById(barID));
                            barID.setOption(jsonData);


                        } else if (data[i].chartType == 'line') {  //折线图  line
                            var barID = i
                            if(data[i].columns.filter){
                                var columns=data[i].columns.filter;
                                var title = data[i].chartTitle;
                                for(var k=0;k<columns.length; k++){
                                    timu = columns[k].columnOption.filterValues[0];
                                    const reg=new RegExp(`\\\${${columns[k].originColumn.aliasName}}`,'g');
                                    title=title.replace(reg,timu);
                                    if(Number(columns[k].columnOption.filterValues[0])  && title.indexOf("年") > 0 ){
                                        title = year + title.substring(4);
                                    }
                                    //         ($(this).text(),'年份点击事件console.log(title)
                                }
                            }else{
                                var title = data[i].chartTitle;
                            }
                            var iclass = "Line";
                            tmpl(iclass, barID, title);
                            // labelX(labelTxt_len, barID,i);
                            var jsonData = JSON.parse(data[i].snapshotResult.data);
                            barID = echarts.init(document.getElementById(barID));
                            barID.setOption(jsonData);

                        } else if (data[i].chartType == 'map') {  //地图map
                            var barID = i
                            if(data[i].columns.filter){
                                var columns=data[i].columns.filter;
                                var title = data[i].chartTitle;
                                for(var k=0;k<columns.length; k++){
                                    timu = columns[k].columnOption.filterValues[0];
                                    const reg=new RegExp(`\\\${${columns[k].originColumn.aliasName}}`,'g');
                                    title=title.replace(reg,timu);
                                    if(Number(columns[k].columnOption.filterValues[0])  && title.indexOf("年") > 0 ){
                                        title = year + title.substring(4);
                                    }
                                    //         ($(this).text(),'年份点击事件console.log(title)
                                }
                            }else{
                                var title = data[i].chartTitle;
                            }
                            var iclass = "map";
                            tmpl(iclass, barID, title);
                            // labelX(i, barID,labelTxt_len);
                            var jsonData = JSON.parse(data[i].snapshotResult.data);
                            barID = echarts.init(document.getElementById(barID));
                            barID.setOption(jsonData);
                        } else if (data[i].chartType == 'BarLine') {  //柱状折线图
                            var barID = i
                            if(data[i].columns.filter){
                                var columns=data[i].columns.filter;
                                var title = data[i].chartTitle;
                                for(var k=0;k<columns.length; k++){
                                    timu = columns[k].columnOption.filterValues[0];
                                    const reg=new RegExp(`\\\${${columns[k].originColumn.aliasName}}`,'g');
                                    title=title.replace(reg,timu);
                                    if(Number(columns[k].columnOption.filterValues[0])  && title.indexOf("年") > 0 ){
                                        title = year + title.substring(4);
                                    }
                                    //         ($(this).text(),'年份点击事件console.log(title)
                                }
                            }else{
                                var title = data[i].chartTitle;
                            }
                            var iclass = "BarLine";
                            tmpl(iclass, barID, title);
                            // labelX(labelTxt_len,barID,i);
                            var jsonData = JSON.parse(data[i].snapshotResult.data);
                            barID = echarts.init(document.getElementById(barID));
                            barID.setOption(jsonData);


                            // 玫瑰饼图  pieRose
                        } else if (data[i].chartType == 'pieRose') {
                            var barID = i
                            if(data[i].columns.filter){
                                var columns=data[i].columns.filter;
                                var title = data[i].chartTitle;
                                for(var k=0;k<columns.length; k++){
                                    timu = columns[k].columnOption.filterValues[0];
                                    const reg=new RegExp(`\\\${${columns[k].originColumn.aliasName}}`,'g');
                                    title=title.replace(reg,timu);
                                    if(Number(columns[k].columnOption.filterValues[0])  && title.indexOf("年") > 0 ){
                                        title = year + title.substring(4);
                                    }
                                    //         ($(this).text(),'年份点击事件console.log(title)
                                }
                            }else{
                                var title = data[i].chartTitle;
                            }
                            var iclass = "Rosmap";
                            tmpl(iclass, barID, title);
                            // labelX(labelTxt_len, barID,i)
                            rosemap(barID, seriesData);
                            var jsonData = JSON.parse(data[i].snapshotResult.data);
                            barID = echarts.init(document.getElementById(barID));
                            barID.setOption(jsonData);

                        }
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (JSON.stringify(data[i]) == '{}') {
                            $('body').removeClass('is-loading')
                            $('.tip').text('暂时无数据')
                        } else {
                            $('.tip').css('display', 'none')
                            pageDiv(i)
                            $('body').removeClass('is-loading')
                        }
                    }
                   
                    // 重新初始化
                    function resize() {
                        window.addEventListener("resize", function () { //重新初始化 
                            var vh = $(window).height();
                            var vw = $(window).width();

                            if (vh < vw) {
                                $('.line').css('width', vw)

                            } else {
                                $('.line').css('width', vw)
                            }
                            barID.resize();
                        });
                    }
                    resize()
                    // 重新初始化
                    function resize() {
                        window.addEventListener("resize", function () { //重新初始化
                            var vh = $(window).height();
                            var vw = $(window).width();
                            if (vh < vw) {
                                $('.line').css('width', vw)
                            } else {
                                $('.line').css('width', vw)
                            }
                            barID.resize();
                        });
                    }
                    resize()

                    $(window).resize(function () {
                        var vh = $(window).height();
                        var vw = $(window).width();

                        if (vh < vw) {
                            $('.line').css('width', vw)

                        } else {
                            $('.line').css('width', vw)
                        }
                        barID.resize();
                    })

                    document.body.className = '';
                    $('.line').css('height', '800px')
                    $('.curtain').remove()
                }
            },
            error: function () {    
                                        
            },
            

        })
    }


    table_title(id, name);
    //获取表格标题接口
    function table_title(id, name) {
        var id = getQueryString('childrenid');
        var urlink = url() + "api/app/report/instances?menuId="+id+"&year="+localStorage.getItem('year');
       // //         ($(this).text(),'年份点击事件console.log(year);
        //api/app/report/instances?menuId=186781671155175424&year=2019
        tableSelect = '';
        $.ajax({
            url: urlink,
            type: 'GET',
            accept: 'application/json;charset=UTF-8',
            async: false,
            data: {},   //请求的数据
            //请求的头部信息
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            dataType: 'json',
            success: function (data) {
               // //         ($(this).text(),'年份点击事件console.log(data, '数据报表--------');
               //排列data的循序安小到大排列 
            for (var j = 0; j < data.length - 1; j++) {
                for (var i = 0; i < data.length - 1 - j; i++) {
                    if (data[i].reportDefinition.showOrder > data[i + 1].reportDefinition.showOrder) {
                        var temp = data[i];
                        data[i] = data[i + 1];
                        data[i + 1] = temp;
                    }
                }
            }
                if (data.length > 0) {
                    $('#excelHead').text(data[0].reportTitle);
                    localStorage.setItem('tableid',data[0].id);//把第一个表格id存入
                    for (var i = 0; i < data.length; i++) {
                        tableSelect += '<li class="pk-option  -clean" data-id=' + data[i].id + '>' + '<span class="icon">' + '</span>' + '<span class="txt">' + data[i].reportTitle + '</span>' + '</li>'
                    }
                    $('.mainExcel').append(tableSelect);
                    $('.mainExcel li').eq('0').addClass('active')
                    //打开报表列表显示层
                    $('.btn').bind('click', function () {
                        $('.month_M').css('display', 'none')
                        $('.month_show').css('display', 'none')
                        $('.pk-overlay').addClass('-show')
                        $('.excel').addClass('-show')
                    })
                  
                    $('#tabUl li').removeClass('tab_active')
                    $('.yearD li').eq('0').css({ 'background': 'url(images/selected.png) 0.25rem center no-repeat', 'background-size': '10px' })
                    $('.mainExcel li').click(function () {
                        var loading = layer.msg('努力加载中...', {icon: 16, shade: 0.3, time:2000});
                        $('.month_M span').removeClass('active')
                        $('.mainExcel li').removeClass('active')
                        $(this).addClass('active')
                        $('.excel').addClass('-show');
                        var str = $(this).find('span').eq('1').text();
                        $('#excelHead').text(str)
                        $('.excel').removeClass('-show')
                        $('.pk-overlay').removeClass('-show')
                        localStorage.setItem('tableid', $(this).attr('data-id'));//切换不同表格把id带上

                        $('.layui-border-box').children().remove();
                        tablePage(); //表格数据

                        $('#tabUl li').removeClass('tab_active')
                        $('#tabUl li').eq('0').addClass('tab_active')
                        var tabIndex
                        for (var i = 0; i < 3; i++) {
                            if ($('#tabUl li').eq(i).hasClass('active')) {
                                tabIndex = i
                            }
                        }
                        $('#tabUl li').removeClass('active tab_active')
                        $('#tabUl li').eq(tabIndex).addClass('active tab_active')
                        $('.page').css('display', 'none')
                        $('.page').eq(tabIndex).css('display', 'block')
                    })

                   
                    $('.pk-overlay').click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $('.excel').removeClass('-show')
                        $('.pk-overlay').removeClass('-show')
                        $('.yearD').removeClass('-show')
                    })
                    $('.close').click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $('.excel').removeClass('-show')
                        $('.pk-overlay').removeClass('-show')
                        $('.yearD').removeClass('-show')
                    })
                } else {
                    $('#excelHead').text('暂时无数据');
                }
            },
            error: function () {
                
                
            },
        


        })
    }
    //获取关联文档
    function relationDocument(id, name) {
        $('.dyn').empty()
        var url_link = url() + "api/app/report/documents?menuId="+id+"&year="+localStorage.getItem('year');
        $.ajax({
            url: url_link,
            type: 'GET',
            async: false,
            accept: 'application/json;charset=UTF-8',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            timeout: 100000,
            dataType: "json",
            success: function (data) {
                // //         ($(this).text(),'年份点击事件console.log(data, '关联文档---');
                $('.dyn').empty();
                localStorage.setItem("documentsYear", data[0].year);
                // timeTip(data[0].year)
                //排列data的循序安小到大排列
                for (var j = 0; j < data.length - 1; j++) {
                    for (var i = 0; i < data.length - 1 - j; i++) {
                        if (data[i].showOrder > data[i + 1].showOrder) {
                            var temp = data[i];
                            data[i] = data[i + 1];
                            data[i + 1] = temp;
                        }
                    }
                }
                if (data.length != 0 && data.length != null) {
                    var navLi = ''
                    for (var i = 0; i < data.length; i++) {
                     
                        navLi += '<li class="parent dynli" data-name='+data[i].files[0].name+' data-title=' + data[i].title + '><a href="#"  class="filetab">' + data[i].title + '</a><i class="inext"></i></li>'
                        
                    }
                    $('#nav').append(navLi)
                   
                    $('.dynli').click(function () {
                        var name = $(this).attr('data-name');
                        var title = $(this).attr('data-title');
                        //var link = urlLink + "doc-html/" + id + ".html";
                        //var link = 'iframe.html'+'?documentname='+name;
                         //forward(htmlUrl(link))   //h5跳转方法
                        var link = url()+ "doc-html/" + name + ".html"
                        loadPage(link,title);  //调用原生跳转方法
                        event.preventDefault();
                    })
                }else{
                    tip = '<div class="tip">' + '暂无数据' + '</div>';
                    $('.page').eq('2').append(tip)
                    $('.page').eq('2').css('display', 'none')
                }
            },
            error: function () {
                
            },
            

        })
    }
    relationDocument(id, name)

    //表格数据
    function tablePage(){
      //         ($(this).text(),'年份点击事件console.log(localStorage.getItem('tableid'),'表格数据'); //274910628018262016
      if(!localStorage.getItem('tableid'))return;
      $.ajax({
          url:url()+`api/report-instances/${localStorage.getItem('tableid')}/content?page=0&size=30&sort=index,asc`,
          type: 'POST',
          accept: 'application/json;charset=UTF-8',
          contentType: 'application/json;charset=UTF-8',
          async: false,
          data:JSON.stringify([]),
          processData: false,
          //请求的头部信息
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
          dataType: 'json',
          success: function (msg){
            
            
            // $("#unit").text("("+unitText+unitName+")");
           ////         ($(this).text(),'年份点击事件console.log(msg,'---表格数据---');
            var tableHead = msg.data.head;
            var tableData = msg.data.data;//表格数据
            var convertH = convertHeaders(tableHead,msg.data.reportViewConfigs);
            var convertD = convertData(tableData,msg.data.reportViewConfigs,convertH[0]);
            var  unitText = msg.data.unitInfo.unitText ? msg.data.unitInfo.unitText : "";
            var  unitName = msg.data.unitInfo.name ? msg.data.unitInfo.name:"";
         
           
		   
            // return
            layui.use('table', function(){
                var table = layui.table;//第一个实例
                table.render({
                elem: '#layuiTable',
                height: convertD.length>10 ? 10*48.2 : convertD.length*58,
				data:convertD,
				page:{layout:['prev', 'page', 'next','limit','count']},
                cols:convertH,
				done: function (res, curr, count) {
                    //console.log(res)
					$("[data-field='lowerHairPath']").css('display', 'none');
					$(".layui-table-main tr").each(function (index, val) {
						$($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
						$($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
					});
					//动态监听表头高度变化，冻结行跟着改变高度
					$(".layui-table-header tr").resize(function () {
						$(".layui-table-header tr").each(function (index, val) {
							$($(".layui-table-fixed .layui-table-header table tr")[index]).height($(val).height());
						});
					});
					//初始化高度，使得冻结行表头高度一致
					$(".layui-table-header tr").each(function (index, val) {
						$($(".layui-table-fixed .layui-table-header table tr")[index]).height($(val).height());
					});
					//动态监听表体高度变化，冻结行跟着改变高度
					$(".layui-table-body tr").resize(function () {
						$(".layui-table-body tr").each(function (index, val) {
							$($(".layui-table-fixed .layui-table-body table tr")[index]).height($(val).height());
						});
					});
					//初始化高度，使得冻结行表体高度一致
					$(".layui-table-body tr").each(function (index, val) {
						$($(".layui-table-fixed .layui-table-body table tr")[index]).height($(val).height());
					});
				}
                });
                table.on('tool(layuiTableFilter)', function(obj){
                //console.log( obj.event );    
                layer.msg( obj.data[obj.event]  );

                });
            });
           $('#unit').text(`单位:(${unitText+unitName})`);//单位
          },
        error: function () {
        },
      })
    }
    tablePage()//表格数据
   
    function convertHeaders (headers, config) { //解析表格表头数据
        if (!headers || !headers.length) return [];
        const currHeader = headers.map(headerRow => {
			return headerRow.map(cur =>{
				// 左锁定
				const leftLock =  config && config.find(c => c.colIndex >= cur.index && c.type === 'LEFT_LOCK_COL');
				// 右锁定
				const rightLock =  false;
				
				const sizeWidth =  config && config.find(c => c.colIndex >= cur.index && c.type === 'RESIZE_COL');
				var resData = {
                    field: `a${cur.index}`.toString(),
                    event: `a${cur.index}`.toString(),
				    title: cur.text,
                    width: parseInt(cur.width, 10) * 1.5,
                    align: cur.textAlign || 'center',//字体对齐方向
                    templet: function(d){
                        let Style = `display:block;text-align:${d['a'+cur.index+'Style']}`
                        return `<span style="${Style}">${d["a"+cur.index.toString()]}</span>`
                    }
				};
				
				if(cur.rowSpan && cur.rowSpan>1) resData.rowspan = cur.rowSpan;
				
				if(cur.colSpan && cur.colSpan>1)resData.colspan = cur.colSpan;
				
				if (leftLock) {
					resData.fixed = 'left';
				} else if (rightLock) {
					resData.fixed = 'right';
				}
				if(sizeWidth && sizeWidth.size) resData.width = sizeWidth.size*1.5;
				return resData;
			});
        })
        return currHeader;
        
    }
	
    function convertData(data,config,convertTou){ //解析表格数据
		if (!data || !data.length) return [];
        var convertList = [];
		data.forEach((item,index)=>{
            var convertObj={};
            item.map((items,indexs)=>{
              //console.log(item)
                if(!items.index) return;
                const key = 'a' + items.index;
                convertObj[key] = {};
                convertObj[key] = items.text;
                convertObj[key+'Style'] = items.textAlign;
            })
            convertList.push(convertObj);
        })
        //console.log(convertList,'表格数据');
        return convertList;
    }


    $('.layui-border-box').remove();
    function pageChange() {
        if (window.location.href.indexOf('table.html') > -1) {
            $('.page').eq('0').remove()
            $('.page').eq('2').remove()
            $('.tabMenu').remove()
        } else if (window.location.href.indexOf('tableandocument') > -1) {
            $('.page').eq('0').css('display', 'none')
            $('#tabUl li').eq('0').css('display', 'none')
            $('.page').eq('2').css('display', 'none')
            $('#tabUl li').eq('1').addClass('active tab_active')
        } else {
            $('.page').css('display', 'none')
            $('.page').eq('0').css('display', 'block')
        }
    }
    pageChange();
    $('.curtain').remove();
})