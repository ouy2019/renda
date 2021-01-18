$(document).ready(function () {

  

    $('.back').click(function () {
        back()
    })
   
    var userId = localStorage.getItem('userId')
    
    var timeIntervalStr = timrstamp();
    var menuName = getQueryString('menuChildName');
    $('#title').text(menuName)
    var fileId = ''
    var trialId = getQueryString('menuChildId');

    fileLink = fileUrl()
    var link=url()

    // 点击切换
    $('#tabUl li').click(function () {

        $('#tabUl li').removeClass('active')
        $(this).addClass('active')
        var numberIndex = $(this).index()

     
        $('.page').css('display', 'none')
        $('.page').eq(numberIndex).css('display', 'block')
    })


   


  
   



    var url2 = url() + '/user/appSubMenu?userId=' + userId + '&menuId=' + trialId + '&timeIntervalStr=' + timrstamp() + '&appSign=' + appSignNumber + '&type=1&title=' + encode(menuName);


    function back() {

        if (equipment('iphone')) {

            naviBack({ 'isRefresh': '0', 'callBack': 'isRefresh()' });


        } else if (equipment("ipad")) {
            naviBack({ 'isRefresh': '0', 'callBack': 'isRefresh()' });
        } else {

            JsBridge.call('JSBridge', 'naviBack', { 'isRefresh': false, 'callBack': 'isRefresh()' }, function (res) { })


        }
    }
   
   
    userId = localStorage.getItem('userId')
    budgetId = getQueryString('menuChildId')


   //获取年份和月份
   function getYearandMonth(year){
  //  $('#selectYear').empty()
    $('#selectMonuth').empty()   
    if(year!=undefined){

    YearUrl=url() + '/section/reportTitle?userId=' + userId +'&menuId='+budgetId+'&year='+year+'&month=&needMonth=true'+ '&timeIntervalStr=' + timrstamp() + '&appSign=' + appSignNumber() + '&typeContent=2'

    }else{   
    YearUrl=url() + '/section/reportTitle?userId=' + userId +'&menuId='+budgetId+'&year=&month=&needMonth=true'+ '&timeIntervalStr=' + timrstamp() + '&appSign=' + appSignNumber() + '&typeContent=2'
    }
    $.ajax({
        url: YearUrl,
        type: 'Get',
        async: false,
        timeout: 100000,
        dataType: "json",
        success: function (data) {
             console.log(data)
              //年份数组集合
            var yearArray=[]
            var mounthArray=[] 
   
             yearArray=data.result.yearList
             console.log(yearArray)
             mounthArray=data.result.monthList
               //添加年份
            function addYear(){
                yearList=''
                for(var i=0;i<yearArray.length;i++){
                    yearList += '<option value="'+yearArray[i]+'">'+yearArray[i]+'</option>'
                }
                $('#selectYear').append(yearList)
               
            }
            
           

            //添加月份
            function  addMounth(){
                mounthList=''
                for(var i=0;i<mounthArray.length;i++){
                    mounthList += '<option value="'+mounthArray[i]+'">'+mounthArray[i]+'</option>'
                }
                $('#selectMonuth').append(mounthList)
            }
            

            if(year==undefined){
                addYear()
            }
            
            try {
                addMounth()
            } catch (error) {
                
            }
            
            menuId=data.result.reportTitleList[0].menuId
            
            charts_page(menuId)
            

            //切换年份月份
                  //年份刷选
            function selectYear(menuId){
            
                $('#selectYear').on('change',function(e){
                   
                    ycli = $('#selectYear').val()
                   
                    getYearandMonth(ycli)
                }) 
            
                
            }
        

                //月份刷选
            function selectMonuth(menuId){
            
                    $('#selectMonuth').on('change',function(){

                        charts_page(menuId,false)
                    }) 
                
                    
                }
  

            selectMonuth(menuId) 
            selectYear(menuId)

            $('.curtain').remove()

        }
    })

   }

   getYearandMonth()





    // 图形分析
    function charts_page(menuId,yearUpdate) {
        
        $('.list').empty()

        $('.page').eq('0').css('display', 'block')

        timeIntervalStr = timrstamp();

  
        charts()
        

        function charts() {
            
           
            

            var dataUrl = ''
            var ipSp = localStorage.getItem('ipSeach');
            
            if($('#selectYear').val()==null){
                selectYear=''
            }else{
                selectYear=$('#selectYear').val()
            }


            if($('#selectMonuth').val()==null){
                selectMonuth=''
            }else{
                selectMonuth=$('#selectMonuth').val()
            }  


            dataUrl = url() + '/section/getPicAna?userId=' + userId + '&budgetId=' + menuId + '&year=' + selectYear + '&timeIntervalStr=' + timrstamp() + '&appSign=' + appSignNumber() + '&month=' + selectMonuth + '&typeContent=2'
       

            dataLoad(dataUrl)

            function dataLoad(dataUrl) {
                


                $.ajax({
                    url: dataUrl,
                    type: 'Get',
                    async: false,
                    timeout: 100000,
                    dataType: "json",
                    success: function (data) {

                        if (data.code == 15) {

                            layer.open({
                                content: '登录超过有效期，请重新登录',
                                btn: ['重新登录'],
                                yes: function (index) {

                                    window.location = '../login.html'
                                }
                            });

                        } else if (data.code == -1) {
                            layer.open({

                                content: data.msg,
                                skin: 'msg',
                                time: 2 //2秒后自动关闭
                            });
                        } else {
                            


                            
                            

                            if (data.result.length == 0) {

                                $('.tip').text('暂时无数据')
                            }

                            
                          



                              
                            function tmpl(iclass, barID, title) {


                                html = '<div class="budgetcss">' + '<div class="draft_title">' + '<h3>' + title + '<small style="font-size:10px;color:#939393">&nbsp&nbsp(单位:万元)</small>' + '</h3>' + '</div>' +
                                    '<div id="' + barID + '" class="' + iclass + ' line" style="width:100%"></div>' +
                                    '</div>';
                                $('.page').eq('0').find('.list').append(html)



                            }

                            function stringFG(stringData) {
                                var yourString = stringData;
                                var stringColo = []
                                var result = yourString.split(",");
                                for (var i = 0; i < result.length; i++) {
                                    stringColo.push(result[i])
                                }
                                return stringColo
                            }




                            function pageDiv(i) {

                                if (data.result[i].titleConfig.ctype == "Barh" || data.result[i].titleConfig.ctype == "Barv") {
                                    var barID = i
                                    var title = data.result[i].titleConfig.title;

                                    var iclass = "bar";
                                    var xAxisData = data.result[i].xAxis
                                    tmpl(iclass, barID, title);

                                    var dataSize = data.result[i].dataSize
                                    var dataCol = []
                                    var labelTxt = ''

                                    for (var b = 0; b < dataSize; b++) {
                                        labelTxt += data.result[i].xAxis[a]
                                    }

                                    if (data.result[i].titleConfig.groupBy != null) {

                                        st_c = stringFG(data.result[i].titleConfig.groupBy)

                                        if (st_c.length == 1) {
                                            for (var a = 0; a < data.result[i].xAxis.length; a++) {
                                                if (data.result[i].data[a] == '') {

                                                    var xdata = '0'
                                                } else {
                                                    var xdata = data.result[i].data[a]
                                                }

                                                dataCol.push(xdata)

                                            }
                                        } else {

                                            for (var a = 0; a < st_c.length; a++) {

                                                dataCol.push(data["result"][i]['data'][a])

                                            }


                                        }



                                    } else {
                                        // st_c='0'
                                        var legendData = data.result[i].titleConfig.groupBy
                                        if (data.result[i].xAxis != null) {

                                            for (var a = 0; a < data.result[i].xAxis.length; a++) {
                                                if (data.result[i].data[a] == '') {

                                                    var xdata = '0'
                                                } else {
                                                    var xdata = data.result[i].data[a]
                                                }

                                                dataCol.push(xdata)

                                            }

                                        } else {
                                            dataCol.push(data.result[i].data)
                                        }

                                        dataCol.push(data["result"][i]['data'])

                                    }

                                    for (var b = 0; b < data.result[i].xAxis.length; b++) {
                                        labelTxt += data.result[i].xAxis[a]
                                    }


                                    var labelTxt_len = st_c.length
                                    labelX(labelTxt_len, barID)
                                    legendData = st_c
                                    var angle = data.result[i].titleConfig.rotate
                                    bar(legendData, dataCol, xAxisData, barID, labelTxt_len, st_c, angle)



                                } else if (data.result[i].titleConfig.ctype == 'PieD') {


                                    var barID = i
                                    var title = data.result[i].titleConfig.title;
                                    var xAxisData = data.result[i].xAxis
                                    var iclass = "pie";
                                    var legendData = []

                                    tmpl(iclass, barID, title);

                                    var dataSize = data.result[i].dataSize
                                    var dataCol = []
                                    var labelTxt = ''

                                    for (var a = 1; a < dataSize + 1; a++) {


                                        if (data["result"][i]['data' + a].name.indexOf('备注') == -1) {
                                            dataCol.push(data["result"][i]['data' + a].value)
                                            legendData.push(data["result"][i]['data' + a].name)
                                        }


                                    }

                                    for (var b = 1; b < dataSize + 1; b++) {
                                        if (data["result"][i]['data' + b].name.indexOf('备注') == -1) {
                                            labelTxt += data["result"][i]['data' + b].name
                                        }

                                    }


                                    var labelTxt_len = labelTxt.length

                                    labelX(labelTxt_len, barID)

                                    pie(xAxisData, dataSize, barID, dataCol, labelTxt_len, legendData)



                                } else if (data.result[i].titleConfig.ctype == 'Line') {

                                    var barID = i
                                    var title = data.result[i].titleConfig.title;

                                    var iclass = "Line";
                                    var xAxisData = data.result[i].xAxis
                                    tmpl(iclass, barID, title);

                                    var dataSize = data.result[i].dataSize
                                    var dataCol = []
                                    var labelTxt = ''

                                    for (var b = 0; b < data.result[i].xAxis.length; b++) {
                                        labelTxt += data.result[i].xAxis[a]
                                    }

                                    if (data.result[i].titleConfig.groupBy.length > 0) {

                                        var legendData =
                                            st_c = stringFG(data.result[i].titleConfig.groupBy)

                                        for (var a = 0; a < st_c.length; a++) {

                                            dataCol.push(data.result[i].data[a])

                                        }

                                    } else {

                                        var legendData = data.result[i].titleConfig.groupBy

                                        dataCol.push(data["result"][i]['data'])
                                        st_c = '0'

                                    }
                                    var labelTxt = ''
                                    for (var b = 0; b < data.result[i].xAxis.length; b++) {

                                        labelTxt += data.result[i].xAxis[b]
                                    }

                                    var labelTxt_len = labelTxt.length

                                    labelX('0', barID)



                                    var angle = data.result[i].titleConfig.rotate
                                    brokenLine(legendData, dataCol, xAxisData, barID, labelTxt_len, st_c, angle)


                                } else if (data.result[i].titleConfig.ctype == 'map') {

                                    var barID = i
                                    var title = data.result[i].titleConfig.title;

                                    var iclass = "map";

                                    var labelTxt_len = 30
                                    tmpl(iclass, barID, title);
                                    labelX(labelTxt_len, barID)
                                    var mapData = []
                                    var color = ['#ff6864', '#ffa060', '#b8de7c', '#6dd3a2',
                                        '#8baeee', '#9894b9', '#ff9bc5', '#ff5970',
                                        '#ed5424', '#d1b379', '#129900', '#ed5424'
                                    ]
                                    for (var a = 1; a < data.result[i].dataSize + 1; a++) {
                                        mapData.push({
                                            name: data["result"][i]['data' + a].name.replace(/\s/g, ""),
                                            value: data["result"][i]['data' + a].value,
                                            itemStyle: {
                                                normal: { areaColor: color[a], label: { show: true } }
                                            }
                                        });
                                    }


                                    map(mapData, barID, labelTxt_len)

                                } else if (data.result[i].titleConfig.ctype == 'BarLine') {
                                    var barID = i
                                    var title = data.result[i].titleConfig.title;
                                    var iclass = "BarLine";

                                    tmpl(iclass, barID, title);
                                    var xAxisData = data.result[i].xAxis
                                    var dataSize = data.result[i].dataSize
                                    var dataCol = []
                                    var labelTxt = ''

                                    for (var b = 0; b < data.result[i].xAxis.length; b++) {
                                        labelTxt += data.result[i].xAxis[a]
                                    }

                                    if (data.result[i].titleConfig.groupBy.length > 0) {

                                        var legendData =
                                            st_c = stringFG(data.result[i].titleConfig.groupBy)

                                        for (var a = 0; a < st_c.length; a++) {

                                            dataCol.push(data.result[i].data[a])

                                        }

                                    } else {

                                        var legendData = data.result[i].titleConfig.groupBy

                                        dataCol.push(data["result"][i]['data'])
                                        st_c = '0'

                                    }
                                    var labelTxt = ''
                                    for (var b = 0; b < data.result[i].xAxis.length; b++) {

                                        labelTxt += data.result[i].xAxis[b]
                                    }

                                    var labelTxt_len = labelTxt.length

                                    labelX(labelTxt_len, barID)

                                    var dataType = data.result[i].dataType

                                    var angle = data.result[i].titleConfig.rotate
                                    BarLine(legendData, dataCol, xAxisData, barID, labelTxt_len, st_c, angle, dataType)

                                } else if (data.result[i].titleConfig.ctype == 'pieRose') {

                                    var barID = i
                                    var title = data.result[i].titleConfig.title;
                                    var iclass = "Rosmap";
                                    tmpl(iclass, barID, title);
                                    var seriesData = [];
                                    var labelTxt = ''
                                    for (var a = 1; a < data.result[i].dataSize + 1; a++) {
                                        var dataItem = 'data' + a

                                        seriesData.push(data["result"][i][dataItem])
                                        labelTxt += data["result"][i][dataItem].name
                                    }
                                    var labelTxt_len = labelTxt.length
                                    labelX(labelTxt_len, barID)
                                    rosemap(barID, seriesData)

                                }
                            }
                            for (var i = 0; i < data.result.length; i++) {


                                if (JSON.stringify(data.result[i]) == '{}') {
                                    $('body').removeClass('is-loading')
                                    $('.tip').text('暂时无数据')
                                } else {

                                    $('.tip').css('display', 'none')
                                    pageDiv(i)
                                    $('body').removeClass('is-loading')
                                }
                            }


                            function labelX(labelTxt_len, barID) {

                                if ($(window).width() < $(window).height()) {
                                    if (labelTxt_len < 21) {
                                        centerPoint = '35%'
                                        barHeight = '50%'
                                        topHeight = '52%'
                                        pietop = '200px'
                                        piecenter = '100px'
                                        $('#' + barID).height('5rem')

                                    } else if (labelTxt_len > 20 && labelTxt_len < 31) {

                                        centerPoint = '35%'
                                        barHeight = '50%'
                                        topHeight = '52%'
                                        pietop = '250px'
                                        piecenter = '140px'
                                        $('#' + barID).height('7rem')


                                    } else if (labelTxt_len > 30 && labelTxt_len < 51) {

                                        centerPoint = '35%'
                                        barHeight = '60%'
                                        topHeight = '42%'
                                        pietop = '300px'
                                        piecenter = '150px'
                                        $('#' + barID).height('9rem')

                                    } else if (labelTxt_len > 50 && labelTxt_len < 67) {

                                        centerPoint = '35%'
                                        barHeight = '60%'
                                        topHeight = '42%'
                                        pietop = '360px'
                                        piecenter = '180px'
                                        $('#' + barID).height('10rem')

                                    } else if (labelTxt_len > 66 && labelTxt_len < 90) {
                                        centerPoint = '35%'
                                        barHeight = '60%'
                                        topHeight = '42%'
                                        pietop = '360px'
                                        piecenter = '180px'
                                        $('#' + barID).height('11rem')
                                    } else if (labelTxt_len > 89 && labelTxt_len < 130) {
                                        centerPoint = '25%'
                                        barHeight = '60%'
                                        topHeight = '42%'
                                        pietop = '320px'
                                        piecenter = '180px'
                                        $('#' + barID).height('10rem');


                                    } else if (labelTxt_len > 129 && labelTxt_len < 200) {
                                        $('#' + barID).css('height', '12rem');
                                        barHeight = '60%';
                                        topHeight = '22%'
                                        centerPoint = '30%';
                                        pietop = '360px'
                                        piecenter = '180px'
                                        // alert($('#' + idN).height())

                                    } else if (labelTxt_len > 199) {
                                        barHeight = '60%';
                                        centerPoint = '30%';
                                        topHeight = '42%'
                                        pietop = '360px'
                                        piecenter = '180px';

                                        $('#' + barID).height('16rem');
                                    }


                                } else {
                                   console.log(labelTxt_len)

                                    if (labelTxt_len < 21) {
                                        centerPoint = '35%'
                                        barHeight = '50%'
                                        topHeight = '52%'
                                        pietop = '200px'
                                        piecenter = '100px'
                                        $('#' + barID).height('4rem')

                                    } else if (labelTxt_len > 20 && labelTxt_len < 31) {

                                        centerPoint = '35%'
                                        barHeight = '50%'
                                        topHeight = '52%'
                                        pietop = '250px'
                                        piecenter = '140px'
                                        $('#' + barID).height('5rem')


                                    } else if (labelTxt_len > 30 && labelTxt_len < 51) {

                                        centerPoint = '35%'
                                        barHeight = '60%'
                                        topHeight = '42%'
                                        pietop = '300px'
                                        piecenter = '150px'
                                        $('#' + barID).height('6rem')

                                    } else if (labelTxt_len > 50 && labelTxt_len < 67) {

                                        centerPoint = '35%'
                                        barHeight = '60%'
                                        topHeight = '42%'
                                        pietop = '360px'
                                        piecenter = '180px'
                                        $('#' + barID).height('7rem')

                                    } else if (labelTxt_len > 66 && labelTxt_len < 90) {
                                        centerPoint = '35%'
                                        barHeight = '60%'
                                        topHeight = '42%'
                                        pietop = '360px'
                                        piecenter = '180px'
                                        $('#' + barID).height('8rem')
                                    } else if (labelTxt_len > 89 && labelTxt_len < 130) {
                                        centerPoint = '25%'
                                        barHeight = '60%'
                                        topHeight = '42%'
                                        pietop = '320px'
                                        piecenter = '180px'
                                        $('#' + barID).height('10rem');


                                    } else if (labelTxt_len > 129 && labelTxt_len < 200) {
                                        $('#' + barID).css('height', '11rem');
                                        barHeight = '60%';
                                        topHeight = '22%'
                                        centerPoint = '30%';
                                        pietop = '360px'
                                        piecenter = '180px'
                                        // alert($('#' + idN).height())

                                    } else if (labelTxt_len > 199) {
                                        barHeight = '60%';
                                        centerPoint = '30%';
                                        topHeight = '42%'
                                        pietop = '360px'
                                        piecenter = '180px';

                                        $('#' + barID).height('12rem');
                                    }


                                }

                            }

                            labelTx = ''

                            //柱状图
                            function bar(legendData, dataCol, xAxisData, barID, labelTxt_len, st_c, angle) {

                                var seriesData = [];

                                // var seriesData=[] 
                                var colorList = ['#6dd3a2', '#83c9e3', '#8baeee', '#83e3d9', '#ff6864', '#ffa060', '#dfb32d', '#ffcd35', '#b8de7c', '#90c988', '#b4adee', '#9894b9', '#dda6cb', '#ff9bc5', '#ff5970', '#d18785', '#ca0b26', '#ed5424', '#d79459', '#c8bca7', '#d1b379', '#e38000', '#129900', '#d2d014', '#92914b']


                                if (st_c.length == 1) {
                                    seriesData.push({
                                        name: st_c,
                                        type: 'bar',
                                        itemStyle: {
                                            normal: {
                                                color: colorList[0]
                                            }
                                        },
                                        data: dataCol
                                    });
                                } else {


                                    for (var i = 0; i < st_c.length; i++) {

                                        seriesData.push({
                                            name: st_c[i],
                                            type: 'bar',
                                            itemStyle: {
                                                normal: {
                                                    color: colorList[i]
                                                }
                                            },
                                            data: dataCol[i],
                                            animation: true
                                        });

                                    }
                                }



                                // $('#'+barID).width('100%')

                                barID = echarts.init(document.getElementById(barID));
                                barID.setOption({
                                    baseOption: {


                                        // title: {
                                        //     text: "单位:万元",
                                        //     fontSize: '6px',
                                        //     color: '#eee',
                                        //     right: '20',
                                        //     textStyle: {
                                        //         color: '#a3a3a3',
                                        //         fontSize: '10px'
                                        //     }
                                        // },
                                        tooltip: {
                                            trigger: 'axis',
                                            axisPointer: {
                                                type: 'shadow'
                                            },
                                            position: function (point, params, dom) {
                                                return [point[30], '0%'];
                                            }
                                        },
                                        legend: {
                                            data: legendData,
                                            orient: 'horizontal',

                                            width: '100%',
                                            textStyle: {
                                                fontSize: '12px',
                                                color: '#6a6a6a'

                                            },
                                            top: 200,
                                            icon: 'circle',
                                            itemWidth: 8

                                        },
                                        grid: {
                                            left: 10,
                                            right: 10,
                                            bottom: 140,
                                            top: 10,
                                            containLabel: true,
                                            x: '0',
                                            y: '0',
                                            x2: '0',

                                            backgroundColor: 'rgba(0,0,0,0)',
                                            borderWidth: 1,
                                            borderColor: '#ccc'
                                        },

                                        xAxis: [{
                                            // type: xdire,
                                            data: xAxisData

                                        }],
                                        yAxis: [{
                                            type: 'value',
                                            splitNumber: 3
                                        }],
                                        series: seriesData,
                                        media: [{
                                            //小与1000像素时候响应
                                            query: {
                                                maxWidth: 2000
                                            },
                                            option: {
                                                series: [{
                                                    itemStyle: {
                                                        //通常情况下：
                                                        normal: {　　　　　　　　　　　　 //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                                            color: function (params) {
                                                                var colorList = ['rgb(164,205,238)', 'rgb(42,170,227)', 'rgb(25,46,94)', 'rgb(195,229,235)'];
                                                                return colorList[params.dataIndex];
                                                            }
                                                        }
                                                    }

                                                }]

                                            }
                                        }]

                                    }

                                });

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
                            };



                            // //折线图

                            function brokenLine(legendData, dataCol, xAxisData, barID, labelTxt_len, st_c, angle) {

                                var colorList = ['#ff6864', '#ffa060', '#dfb32d', '#ffcd35', '#b8de7c', '#90c988', '#6dd3a2', '#83e3d9', '#83c9e3', '#8baeee', '#b4adee', '#9894b9', '#dda6cb', '#ff9bc5', '#ff5970', '#d18785', '#ca0b26', '#ed5424', '#d79459', '#c8bca7', '#d1b379', '#e38000', '#129900', '#d2d014', '#92914b']

                                var seriesData = [];


                                if (st_c == 0) {

                                    seriesData.push({
                                        type: 'line',
                                        itemStyle: {
                                            normal: {
                                                color: colorList[1],
                                                lineStyle: {
                                                    color: colorList[1]
                                                }
                                            }
                                        },
                                        data: dataCol[0],
                                        symbolSize: 6,
                                        symbol: 'circle',
                                        showAllSymbol: true
                                    });
                                } else {
                                    for (var i = 0; i < st_c.length; i++) {

                                        seriesData.push({
                                            name: st_c[i],
                                            type: 'line',
                                            itemStyle: {
                                                normal: {
                                                    color: colorList[i],
                                                    lineStyle: {
                                                        color: colorList[i]
                                                    }
                                                }
                                            },
                                            data: dataCol[i],
                                            symbolSize: 6,
                                            symbol: 'circle',
                                            showAllSymbol: true
                                        });

                                    }
                                }


                                barID = echarts.init(document.getElementById(barID));
                                barID.setOption({
                                    baseOption: {
                                        tooltip: {
                                            trigger: 'axis',
                                            axisPointer: { // 坐标轴指示器，坐标轴触发有效  
                                                type: 'line' // 默认为直线，可选为：'line' | 'shadow'  
                                            }
                                        },
                                        legend: {
                                            data: legendData,
                                            x: 'center',
                                            icon: 'circle',
                                            itemWidth: 8,
                                            top: 220
                                        },
                                        axisPointer: {
                                            link: {
                                                xAxisIndex: 'all'
                                            }
                                        },

                                        grid: {
                                            left: 10,
                                            right: 10,
                                            bottom: 160,
                                            top: 10,
                                            containLabel: true,
                                            height: 180
                                        },
                                        xAxis: {
                                            type: 'category',
                                            boundaryGap: ['50%', '50%'],
                                            axisLabel: { interval: 0 },
                                            axisLine: {
                                                onZero: true
                                            },
                                            data: xAxisData,
                                            axisLabel: {
                                                interval: 0,//横轴信息全部显示
                                                formatter: function (value) {
                                                    // debugger
                                                    var ret = "";//拼接加\n返回的类目项
                                                    var maxLength = 5;//每项显示文字个数
                                                    var valLength = value.length;//X轴类目项的文字个数
                                                    var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                                                    if (rowN > 1)//如果类目项的文字大于3,
                                                    {
                                                        for (var i = 0; i < rowN; i++) {
                                                            var temp = "";//每次截取的字符串
                                                            var start = i * maxLength;//开始截取的位置
                                                            var end = start + maxLength;//结束截取的位置
                                                            //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                                                            temp = value.substring(start, end) + "\n";
                                                            ret += temp; //凭借最终的字符串
                                                        }
                                                        return ret;
                                                    }
                                                    else {
                                                        return value;
                                                    }
                                                }
                                            }
                                        },
                                        yAxis: {
                                            type: 'value',
                                            axisLabel: {
                                                formatter: '{value}'
                                            }
                                        },
                                        series: seriesData



                                    }
                                });
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

                            }



                            //饼状图

                            function pie(xAxisData, dataSize, barID, dataCol, labelTxt_len, legendData) {

                                $('#' + barID).css('width', '100%')
                                // labelX(labelTxt_len,idN)
                                labelX(labelTxt_len, barID)

                                var seriesData = [];
                                var opiData = [];
                                var opid = [];
                                var groudArray = [];
                                var legrndGrouid = []




                                for (var i = 0; i < dataSize; i++) {
                                    if (dataCol[i] == 0) {
                                        dataCol[i] = ''

                                    }


                                    seriesData.push({
                                        name: legendData[i], type: 'line', value: dataCol[i], itemStyle: {
                                            normal: {
                                                label: {
                                                    show: true,
                                                    formatter: function (params, option) {
                                                        if (params.data.value == 0) {
                                                            // params.data.itemStyle.normal.labelLine.show = false;
                                                            params.data.label.normal.show = false;
                                                            params.data.labelLine.normal.show = false;
                                                        }
                                                    },
                                                },
                                                labelLine: {
                                                    show: true
                                                }
                                            }
                                        }
                                    });



                                }


                                barID = echarts.init(document.getElementById(barID));
                                barID.setOption({

                                    baseOption: {

                                        tooltip: {
                                            // trigger: 'item',
                                            formatter: "{b} : {c} , 占比 : {d}%",
                                            position: 'top'
                                        },
                                        legend: {
                                            // type: 'scroll',
                                            orient: 'horizontal',
                                            data: legendData,

                                            width: '100%',
                                            textStyle: {
                                                fontSize: '14px'

                                            },
                                            top: pietop, //330,
                                            icon: 'circle',
                                            itemWidth: 8


                                        },
                                        grid: {

                                            containLabel: true,
                                            bottom: '30%',
                                            top: '20%',
                                            x: '0',
                                            y: '5%',
                                            y2: '5%',
                                            x2: '0',
                                        },

                                        series: [{
                                            name: '访问来源',
                                            type: 'pie',
                                            radius: 60,
                                            center: ['50%', piecenter], //150
                                            data: seriesData,
                                            stillShowZeroSum: false,

                                            itemStyle: {
                                                normal: {
                                                    color: function (params) {
                                                        var colorList = ['#ff6864', '#ffa060', '#dfb32d', '#ffcd35', '#b8de7c', '#90c988', '#6dd3a2', '#83e3d9', '#83c9e3', '#8baeee', '#b4adee', '#9894b9', '#dda6cb', '#ff9bc5', '#ff5970', '#d18785', '#ca0b26', '#ed5424', '#d79459', '#c8bca7', '#d1b379', '#e38000', '#129900', '#d2d014', '#92914b']
                                                        return colorList[params.dataIndex];
                                                    },

                                                    label: {
                                                        show: true,
                                                        formatter: "{d}%",
                                                        position: 'outer'
                                                    }
                                                },

                                            }

                                        }]
                                    }
                                });

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
                            };


                            //地图
                            function map(mapData, barID, labelTxt_len) {

                                // $.getJSON('http://183.6.115.160:8010/gzrd/echartsMap/static/map/province/neijiang.json', function(data) {
                                //     echarts.registerMap('neijiang', data)

                                //     barID = echarts.init(document.getElementById(barID));


                                //     barID.setOption({
                                //         baseOption: {
                                //             tooltip: {
                                //                 trigger: 'item',
                                //                 formatter: '{b}<br/>{c}'
                                //             },


                                //             series: [{
                                //                 name: '',
                                //                 type: 'map',
                                //                 mapType: 'neijiang',
                                //                 silent: false,
                                //                 itemStyle: {
                                //                     normal: { label: { show: true } },
                                //                     emphasis: { label: { show: true } }
                                //                 },
                                //                 data: mapData
                                //             }]

                                //         }
                                //     })

                                // })
                            }


                            //柱状图折线图

                            function BarLine(legendData, dataCol, xAxisData, barID, labelTxt_len, st_c, angle, dataType) {

                                var colorList = ['#ff6864', '#ffa060', '#dfb32d', '#ffcd35', '#b8de7c', '#90c988', '#6dd3a2', '#83e3d9', '#83c9e3', '#8baeee', '#b4adee', '#9894b9', '#dda6cb', '#ff9bc5', '#ff5970', '#d18785', '#ca0b26', '#ed5424', '#d79459', '#c8bca7', '#d1b379', '#e38000', '#129900', '#d2d014', '#92914b']

                                barID = echarts.init(document.getElementById(barID));
                                var yitem = legendData.splice(',')
                                var yAxis = []
                                yitem.forEach(function (item) {
                                    var ynew = {};
                                    ynew.name = item;
                                    ynew.type = 'value';


                                    yAxis.push(ynew)
                                });

                                var seriesArrary = []
                                for (var i = 0; i < yitem.length; i++) {
                                    var seriesItem = {};
                                    seriesItem.name = yitem[i];
                                    seriesItem.type = dataType[i];
                                    seriesItem.data = dataCol[i];
                                    seriesItem.itemStyle = {
                                        normal: {
                                            color: colorList[i],
                                            lineStyle: {
                                                color: colorList[i]
                                            }
                                        }
                                    }
                                    seriesArrary.push(seriesItem)
                                }

                                barID.setOption({
                                    baseOption: {

                                        tooltip: {
                                            trigger: 'axis',
                                            axisPointer: {
                                                type: 'cross',
                                                crossStyle: {
                                                    color: '#999'
                                                }
                                            }
                                        },
                                        grid: {
                                            left: 10,
                                            right: 10,
                                            bottom: 160,
                                            top: 10,
                                            containLabel: true,
                                            height: 180

                                        },
                                        legend: {
                                            data: yitem,
                                            x: 'center',
                                            icon: 'circle',
                                            itemWidth: 8,
                                            top: 220
                                        },
                                        xAxis: [
                                            {
                                                type: 'category',
                                                data: xAxisData,
                                                axisPointer: {
                                                    type: 'shadow'
                                                }
                                            }
                                        ],
                                        yAxis: yAxis,
                                        series: seriesArrary
                                    }





                                })

                            }

                            //玫瑰图
                            function rosemap(barID, seriesData) {

                                //颜色
                                var colorList = ['#ff6864', '#ffa060', '#dfb32d', '#ffcd35', '#b8de7c', '#90c988', '#6dd3a2', '#83e3d9', '#83c9e3', '#8baeee', '#b4adee', '#9894b9', '#dda6cb', '#ff9bc5', '#ff5970', '#d18785', '#ca0b26', '#ed5424', '#d79459', '#c8bca7', '#d1b379', '#e38000', '#129900', '#d2d014', '#92914b']

                                var seriesArrary = []
                                for (var i = 0; i < seriesData.length; i++) {

                                    var seriesItem = {};
                                    seriesItem.value = seriesData[i].value;
                                    seriesItem.name = seriesData[i].name;
                                    seriesItem.itemStyle = {
                                        normal: {
                                            color: colorList[i]
                                        }
                                    }
                                    seriesArrary.push(seriesItem)


                                }

                                var legendData = [];
                                seriesData.forEach(function (element, index) {
                                    legendData.push(element.name)
                                });

                                barID = echarts.init(document.getElementById(barID));
                                barID.setOption({
                                    baseOption: {


                                        grid: {
                                            left: 10,
                                            right: 10,
                                            // bottom: 160,
                                            top: 10,
                                            containLabel: true


                                        },
                                        tooltip: {
                                            trigger: 'item',
                                            formatter: "{b} <br/>{c} ({d}%)"
                                        },
                                        legend: {
                                            data: legendData,
                                            x: 'center',
                                            icon: 'circle',
                                            itemWidth: 8,
                                            bottom: 100
                                        },
                                        series: [

                                            {

                                                type: 'pie',
                                                radius: [30, 50],
                                                center: ['50%', '20%'],
                                                roseType: 'area',
                                                x: '50%',               // for funnel
                                                max: 40,                // for funnel
                                                sort: 'ascending',     // for funnel
                                                data: seriesArrary
                                            }

                                        ]
                                    }





                                })

                                document.body.className = '';




                                // $('.line').css('height','800px')
                                $('.curtain').remove()

                            }
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.open({
                            content: '请求超时,请重新加载',
                            btn: ['重新加载'],
                            yes: function (index) {
                                location.reload();
                            }
                        });

                    },
                    complete: function (XMLHttpRequest, status) {
                        if (status == 'timeout') {

                            layTip("请求超时")
                        }
                    }

                })

            }

        }

    }

    //国库支付部门名称生成
    function createDeputy(){
        userId = localStorage.getItem('userId')
        trialId= getQueryString('parentId')
        pageLi=''
        url2 =link+'/user/appSubMenu?userId='+userId+'&menuId=' + trialId+ '&timeIntervalStr=' + timeIntervalStr + '&appSign=' + appSignNumber()+'&typeContent=1&title='+encode(menuName)+'&executeDeptTableName='+getQueryString('executeDeptTableName')+'&executeField='+getQueryString('executeField');
        
        $.ajax({
            url: url2,
            async: false,
            timeout: 3000,
            success: function(data) {
                data = JSON.parse(data);
                for (a = 0; a < data.result.length; a++) {
             
                    (function(a) {
                        
                        pageLi += '<div     menuId="' + data.result[a].menuId + '"  data-menuName="' + data.result[a].menuName + '" data-link="'+data.result[a].menuUrl+'" ><a  class="fileTab">' + data.result[a].menuName + '</a></div>'
                    }(a))
                    
                

        
                }

                $('.tableMenu').append(pageLi)
      
                $('.tableMenu  div').on('click', function() {
                    var id=$(this).attr('menuid')
                    var name= $(this).attr('data-menuname') 
                    var link_url=$(this).attr('data-link')
                    var link=link_url+'&menuChildName='+name+'&menuChildId='+id
                    localStorage.setItem('year','')
                    localStorage.setItem('month','')
                    forward(htmlUrl(link))

                })
               
            }
        })

    }

    createDeputy()


     $('.curtain').remove()

})