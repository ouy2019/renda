var title=getQueryString('commentTitle')
$('#title').text(title);
var proviceLink = window.location.origin+'/shanxird/assets/map/china-province-map.json'
    var proviceId = '';
    var mapData = {};
    var mapOptions = geOptions().map;
    // 各个区域的数据
    var dataValue = geOptions().data;

    // 保存市县开通情况
    var hasOpen = '';
    var noOpen = '';

    $.getJSON(proviceLink, function(data){
        var name = '陕西'
        var id = data[name];
        proviceId = id;
        var provice = true;
        // 获取省份地图
        createMap(name,id, provice);
    })
    var createMap = function(name,id,provice){
    var mapLink = '';
    if(provice){
        //   省份地图地址
        mapLink = 'assets/map/province/'+id+'.json'
    } else {
        // 地级县地图
        mapLink = 'assets/map/city/'+proviceId+'/'+id+'.json'
    }
    $.getJSON(mapLink, function(geoJson){

    // 如果是省会地图请求则获取相关地级市的名称以及相对应json文件名称
    if(provice){
        var features = geoJson['features'];
        for(var i = 0; i< features.length;i++){
            var cname = features[i].properties.name;
            if(!mapData.hasOwnProperty(cname)){
                var item = {'id':features[i].properties.adcode, 'data': []};
                mapData[cname] = item;
            }
        }
    }

    echarts.registerMap( name, geoJson);
    var content = '';
    if(provice){
        var chart = echarts.init(document.getElementById('mainMap'));
    }else{
        var chart = echarts.init(document.getElementById('cityMap'));
    }

    var seriesData = [];

    var opend = '';
    var noopend = '';

    for(var i = 0; i< dataValue[name].length;i++){

        var d = {
            name: '',
            value: ''
        }
        // 市级
        if(dataValue[name][i].hasOwnProperty('市') && dataValue[name][i]['市']!=='取色补充'){
            d = {
                name: dataValue[name][i]['市'],
                value:dataValue[name][i]['数值1']
            }

            // 设置是否开通备注
            if(dataValue[name][i]['数值1']>0){
                opend+=dataValue[name][i]['市']+', '
            }else{
                noopend+=dataValue[name][i]['市']+', '
            }
        }

        //县级
        if(dataValue[name][i].hasOwnProperty('县')  && dataValue[name][i]['县']!=='取色补充'){
            d = {
                name: dataValue[name][i]['县'],
                value:dataValue[name][i]['数值1']
            }
            // 设置是否开通备注
            if(dataValue[name][i]['数值1']>0){
                opend+=dataValue[name][i]['县']+', '
            }else{
                noopend+=dataValue[name][i]['县']+', '
            }
        }

        seriesData.push(d);

    }
    console.log(opend.slice(0, -1))
    $('.hasOpen').html(opend.slice(0, -2));
    $('.noOpen').html(noopend.slice(0, -2));

    // 如果市省级对于市级，把市级的开通情况保存下来

    if(provice){
        hasOpen = opend.slice(0, -2);
        noOpen = noopend.slice(0, -2);
    }

    mapOptions.series[0].map=name;
    mapOptions.series[0].data = seriesData;
    console.log(mapOptions);
    chart.setOption(mapOptions);

    chart.on('click', function(e){
        var name = e.name;
        var id = mapData[name].id;
        $('#mainMap').addClass('mapArea');
        $('#cityMap').css('display', 'block');
        createMap(name, id, false);
        console.log(name)
        var text=name+'系统建设情况'
        $('.biaoti').text(text)
        $('.title').css('display', 'block');
        $('.hasOpen').css('display', 'block');
        $('.noOpen').css('display', 'block');
        $('.jianjie').css('display', 'none');
        event.stopPropagation()
    })

    })

    $('.clickTmp').click(function(){
        $('#mainMap').removeClass('mapArea');
        $('#cityMap').css('display', 'none');
        $('.hasOpen').html(hasOpen);
        $('.noOpen').html(noOpen);
        $('.biaoti').text('')
        $('.title').css('display', 'none');
        $('.hasOpen').css('display', 'none');
        $('.noOpen').css('display', 'none');
        $('.jianjie').css('display', 'block');
    })

    }