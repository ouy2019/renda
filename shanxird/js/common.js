
var origin = window.location.origin;
var h5_Address = origin+"/shanxird/";
// var api_Address = origin+"/exam/"; 

//h5内网API地址// h5地址
var api_Address = "http://183.6.115.160:8301/exam/";
// var api_Address = "http://120.79.58.103:8301/exam/";


 // 判断设备类型
  var u = navigator.userAgent;  
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端  
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  var iswin = u.indexOf('Windows') > -1;

 if(isAndroid===true || isiOS===true){
 	app_opend = true
 }else {
 	app_opend = false;
 }



function htmlUrl(rLink) {
  if (app_opend) {
    return h5_Address + rLink;
  } else {
    return rLink
  }
  // return h5_Address+rLink
}


function getQueryString(key) {
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  var result = window.location.search.substr(1).match(reg);
  return result ? decodeURIComponent(result[2]) : null;
}

function GetRequest(key) {
  var urlArray = window.location.href.split("?")
  var url = '?' + urlArray[1]
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest[key];
}

function information() {
  //获取链接参数
  function GetRequest() {
    // var url =split(window.location.href)[1]; //获取url中"?"符后的字串
    var urlArray = window.location.href.split("?")
    var url = '?' + urlArray[1]
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
      }
       //encodeURI()  //中文转字符串
      //decodeURIComponent  //字符串转中文
    }
    return theRequest;
  }
  var Request = new Object();
  Request = GetRequest();
  // var name = Request['userName']
  var userId = Request['userId']
  var token = Request['token']
  var workingOrganization = Request['workingOrganization']
  // localStorage.setItem('userName', name)
  localStorage.setItem('token', token)
  localStorage.setItem('userId', userId)
  localStorage.setItem('workingOrganization', workingOrganization)
}



function url() {
  return api_Address;
}

//var myToken=localStorage.getItem('token');
//返回
function back() {
	if (equipment('iphone')) {
		naviBack({ 'isRefresh': '0', 'callBack': 'isRefresh()' });
	} else if (equipment("ipad")) {
		naviBack({ 'isRefresh': '0', 'callBack': 'isRefresh()' });
	} else {
		JsBridge.call('JSBridge', 'naviBack', { 'isRefresh': false, 'callBack': 'isRefresh()' }, function(res) {})
  }
  //window.history.go('-1');
}

//跳转页面
function forward(url) {
	if(app_opend){
	   if (equipment('iphone')) {
		   openNewPage({ 'url': url, 'rotate': '1' });
	   } else if (equipment("ipad")) {
		   openNewPage({ 'url': url, 'rotate': '1' });
	   } else {
		   JsBridge.call('JSBridge', 'openNewPage', { 'url': url }, function(res) {})
	   }
	 }else{
		 window.location=url
	}   
}


function loadPage(url, title) {
 
  if (equipment('iphone') || equipment("ipad")) {
    openNewPage({ 'url': url, 'rotate': '0', 'hasback': '1', 'title': title });
  } else {
    JsBridge.call('JSBridge', 'openNewPage', { 'url': url, 'hasback': '1', 'title': title }, function (res) {
    })
  }
}

//打开文档页面
function fileUrl(rLink) {
   return h5_Address+'attachfile/'+rLink+'.html';
  //return api_Address + 'attachfile/' + rLink + '.html';
}

//调用原生打开文档
function openwatchFile(url, title) {
  if (equipment('iphone') || equipment("ipad")) {
    watchFile({ 'url': url, 'title': title });
  } else {
    JsBridge.call('JSBridge', 'watchFile', { 'url': url }, function (res) {
    })
  }
}

function appSignNumber() {
 var userId = localStorage.getItem('userId');
  // console.log(localStorage.getItem('token'));
  // console.log(userId)
  var Sign = "userId=" + userId + "&timeIntervalStr=" + timrstamp() + "&userToken=" + localStorage.getItem('token');
  // console.log(Sign)
  return (SHA2(Sign).toString())
}


//用户权限管理
function jurisdiction(){
  $.ajax({
    // url:url()+`api/authority/users/${localStorage.getItem('userId')}`,
    url:url()+`api/analysis/app/user/${localStorage.getItem('userId')}`,
    contentType: "application/json;charset=UTF-8",
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
    dataType: "JSON",
    success: function (res){
      //console.log(res,'用户权限管理')
      if(res && res.authorities.length){
        localStorage.setItem('authorities',JSON.stringify(res.authorities));
        localStorage.setItem('userName',res.account)//账户名
        localStorage.setItem('roleId',res.id)//账户id
        if(res.specialCode){
          localStorage.setItem('specialCode',res.specialCode);//账户--代表证号
        }
        if(res.specialTeam){
          localStorage.setItem('specialTeam',res.specialTeam);//账户--代表团
        }

      }
      
    },
    error:function(){
      localStorage.setItem('userName','')//账户名
    }

  })
}
jurisdiction();

function filterArray(item){ //用户权限管理判断封装
  // console.log(item,'item---用户权限管理判断封装')
  
  var authorities = JSON.parse(localStorage.getItem('authorities'));
  for(let i = 0; i< item.length; i++){
    //如果acl没有 或者有为真的时候赋值给它
    item[i].aclTrue = !item[i].acl ? true : authorities.indexOf(item[i].acl) > -1     
   
    if(item[i].children && item[i].children.length){
      filterArray(item[i].children);
    }
  }

}



(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      if (clientWidth > 750) {
        clientWidth = 750
      }
      docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'
    };
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window);

function equipment(val) {
 
  var res = false;
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf(val) > -1) {
    res = true;
  }
  return res;

};

// 与Android和ios的交互
// ios下增加高度   
function addHeight() {
  $('#mainHtml').append('<div id="iosHeight">' + '</div>')
  $('#iosHeight').height('30px'); 
}

$(function () {
  // 判断设备类型
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端  
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isiOS == true) {
    addHeight();
  }
  $('.line2:last').css('display', 'none')
})




// tab切换栏目
function total() {
  var oTab = document.getElementById("tabUl");
  var aH3 = oTab.getElementsByTagName("span");
  var aDiv = document.getElementById('pu_content').getElementsByClassName('page');
  for (var i = 0; i < aH3.length; i++) {
    aH3[i].index = i;
    aH3[i].onclick = function () {
      for (var i = 0; i < aH3.length; i++) {
        aH3[i].className = "";
        aDiv[i].style.display = "none";
      }
      $('html,body').animate({ scrollTop: 0 }, 'slow');
      this.className = "active";
      aDiv[this.index].style.display = "block";
    }
  }
}

// mobileInput的js代码
/*
* Pickout - Cool effect for field select on form
* Copyright (c) 2016 Ktquez
* Project repository: https://github.com/ktquez/pickout
*   MIT license.
*/

var pickout = (function () {
  "use strict";
  // Own configuration of each field select
  var ownConfig = {};
  // Default values
  var defaults = {
    theme: 'clean',
    search: false
  };
  /**
   * Starts the module preparing the elements
   * @param config = String or object to setting
   */
  function init(config) {
    setElement(config);
    prepareElement();
  }
  /**
   * Defines the own configuration and assigns the select
   * @param {[type]} config = String or object to setting
   */
  function setElement(config) {
    var objConfig = typeof config === 'object' ? config : {};
    if (typeof config === 'string') {
      objConfig.el = config;
    }
    // Retrieve the DOM to be manipulated
    objConfig.DOM = [].slice.call(document.querySelectorAll(objConfig.el));
    mergeToDefaults(objConfig);
  }
  /**
   * Prepare the elements that will be handled by the module
   */
  function prepareElement() {
    ownConfig.DOM.map(function (select, index) {
      createElements(select, index);
    });
    prepareModal();
  }
  function createElements(select, index) {
    // Cache self config 
    var config = ownConfig;
    select.style.display = 'none';
    var parent = select.parentElement;
    parent.setAttribute('style', 'position:relative;float:left;');
    var placeholder = select.getAttribute('placeholder');
    // input
    var input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('class', 'pk-input -' + config.theme);
    if (!!placeholder) input.setAttribute('placeholder', placeholder);
    if (parent.hasAttribute('for')) input.setAttribute('id', parent.getAttribute('for'));
    // Arrow
    var arrow = document.createElement('span');
    arrow.setAttribute('class', 'pk-arrow -' + config.theme);
    parent.appendChild(input);
    parent.appendChild(arrow);
    // Event listener
    parent.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      config.currentIndex = index;
      fireModal(config);
    }, false);

  }

  /**
   * Create and manage options in modal
   * @param  {Object} config = ownConfig
   */
  function fireModal(config) {
    var modal = document.querySelector('.pk-modal'),
      select = config.DOM[config.currentIndex],
      data;
    // modal theme
    modal.setAttribute('class', modal.getAttribute('class') + ' -' + config.theme);
    // Avoid charging again when changing tab and the field gives focus again
    var main = modal.querySelector('.main');
    if (!!main.children.length) {
      return;
    }
    var overlay = document.querySelector('.pk-overlay');
    var options = [].slice.call(select);
    var optionsModal = options.map(function (option, key) {
      data = { index: key, item: option };
      return createOption(data, modal, config);
    });
    // Displaying overlay and modal
    modal.setAttribute('class', modal.getAttribute('class') + ' -show');
    overlay.setAttribute('class', overlay.getAttribute('class') + ' -show');
    var title = select.hasAttribute('placeholder') ? select.getAttribute('placeholder') : 'Select to option';
    modal.querySelector('.head').innerHTML = title;
    // If search
    if (config.search) {
      var search = modal.querySelector('.pk-search');
      var inputSearch = search.querySelector('input');
      inputSearch.value = '';
      // Focus no field search
      setTimeout(function () {
        inputSearch.focus();
      }, 300);
      search.setAttribute('class', search.getAttribute('class') + ' -show');
      // Listener
      inputSearch.addEventListener('keyup', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var optionsDefault = optionsModal,
          main = modal.querySelector('.main');
        // Specific for IE
        if (!!document.documentMode) {
          optionsModal.map(function (option) {
            option.style.display = 'none';
          });
        } else {
          // Deletes the options
          main.innerHTML = '';
        }
        // If the search field is empty
        if (!e.target.value) {
          optionsDefault.map(function (option) {
            // Specific for IE
            if (!!document.documentMode) {
              option.style.display = 'block';
              return;
            }
            main.appendChild(option);
          });
          return;
        }
        // If any character typed
        optionsModal.map(function (option) {
          // Recover text element
          var txt = option.children[1] || option.children[0];
          // Compares the search with the text option
          if (txt.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {
            // Specific for IE
            if (!!document.documentMode) {
              option.style.display = 'block';
              return;
            }
            main.appendChild(option);
          }
        });
        // No results
        if (!main.children.length) {
          var noResults = document.createElement('li');
          noResults.setAttribute('class', 'pk-no_result_search');
          noResults.innerHTML = 'No Results';
          main.appendChild(noResults);
          return;
        }
      }, false);
    }
  }
  /**
   * Creates options for the chosen select
   * @param  {Object} data = {index, option}
   * @param  {object DOM} modal  = Modal that will receive the list
   * @param  {object} config 
   */
  function createOption(data, modal, config) {
    var select = config.DOM[config.currentIndex];
    var main = modal.querySelector('.main');
    var item = document.createElement('li');
    var selected = data.item.hasAttribute('selected') ? '-selected' : '';
    item.setAttribute('class', 'pk-option ' + selected + ' -' + config.theme);
    var icon = document.createElement('span');
    icon.setAttribute('class', 'icon');
    icon.innerHTML = data.item.getAttribute('data-icon') || '';
    var txt = document.createElement('span');
    txt.setAttribute('class', 'txt');
    txt.innerHTML = data.item.innerHTML;
    main.appendChild(item);
    item.appendChild(icon);
    item.appendChild(txt);
    // Event listener
    item.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      // Converting to array, because it is a (object) HTMLCollection 
      [].slice.call(select.children).map(function (item, index) {
        if (index === data.index) {
          item.setAttribute('selected', 'selected');
          return;
        }
        item.removeAttribute('selected');
      });
      feedInput(select, txt.innerHTML);
      closeModal();
      $('.form-group').eq('1').trigger('click')
    }, false);
    return item;
  }
  function feedInput(select, value) {
    select.parentElement.querySelector('.pk-input').value = value;
  }
  /**
   * Sets a value (option) default for field select
   */
  function setInitialValue(config) {
    setElement(config);
    ownConfig.DOM.map(function (select) {
      feedInput(select, select[select.selectedIndex].innerHTML);
    });
  }
  /**
   * Prepare the divs that will be used for modal with options
   */
  function prepareModal() {
    // Checks has been created
    if (document.querySelector('.pk-overlay')) {
      return;
    }
    var overlay = document.createElement('div');
    overlay.setAttribute('class', 'pk-overlay');
    var modal = document.createElement('div');
    modal.setAttribute('class', 'pk-modal');
    var mainModal = document.createElement('ul');
    mainModal.setAttribute('class', 'main');
    var head = document.createElement('div');
    head.setAttribute('class', 'head');
    var search = document.createElement('div');
    search.setAttribute('class', 'pk-search');
    var inputSearch = document.createElement('input');
    inputSearch.setAttribute('type', 'text');
    var close = document.createElement('span');
    close.setAttribute('class', 'close');
    close.innerHTML = '&times;';
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    modal.appendChild(head);
    modal.appendChild(search);
    search.appendChild(inputSearch);
    modal.appendChild(close);
    modal.appendChild(mainModal);
    // Event listener
    overlay.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }, false);
    close.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }, false);
  }
  /**
   * Resume normal classes and removes the content from within the modal
   * @param  {object DOM} overlay
   * @param  {object DOM} modal
   */
  function closeModal() {
    var overlay = document.querySelector('.pk-overlay');
    var modal = document.querySelector('.pk-modal');
    var search = modal.querySelector('.pk-search');
    overlay.setAttribute('class', 'pk-overlay');
    modal.setAttribute('class', 'pk-modal');
    search.setAttribute('class', 'pk-search');
    setTimeout(function () {
      modal.querySelector('.main').innerHTML = '';
    }, 500);
  }
  /**
   * Merges the settings passed by the user with the default settings of the package, adding their own configurations
   */
  function mergeToDefaults(config) {
    ownConfig = JSON.parse(JSON.stringify(defaults));
    for (var item in config) {
      if (config.hasOwnProperty(item)) {
        ownConfig[item] = config[item];
      }
    }

  }

  // Revealing the methods that shall be public
  return {
    to: init,
    updated: setInitialValue
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = pickout;
}

// SHA1加密处理
function add(x, y) {
  return ((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
}

function SHA1hex(num) {
  var sHEXChars = "0123456789abcdef";
  var str = "";
  for (var j = 7; j >= 0; j--)
    str += sHEXChars.charAt((num >> (j * 4)) & 0x0F);
  return str;
}

function AlignSHA1(sIn) {
  var nblk = ((sIn.length + 8) >> 6) + 1,
    blks = new Array(nblk * 16);
  for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
  for (i = 0; i < sIn.length; i++)
    blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);
  blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
  blks[nblk * 16 - 1] = sIn.length * 8;
  return blks;
}

function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

function ft(t, b, c, d) {
  if (t < 20) return (b & c) | ((~b) & d);
  if (t < 40) return b ^ c ^ d;
  if (t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

function kt(t) {
  return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
    (t < 60) ? -1894007588 : -899497514;
}

function SHA1(sIn) {  //大写加密
  var x = AlignSHA1(sIn);
  var w = new Array(80);
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;
  var e = -1009589776;
  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;
    for (var j = 0; j < 80; j++) {
      if (j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      t = add(add(rol(a, 5), ft(j, b, c, d)), add(add(e, w[j]), kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }
    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
    e = add(e, olde);
  }
  SHA1Value = SHA1hex(a) + SHA1hex(b) + SHA1hex(c) + SHA1hex(d) + SHA1hex(e);
  return SHA1Value.toUpperCase();
}

function SHA2(sIn) {   //小写加密
  return SHA1(sIn).toLowerCase();
}

//获取当前时间戳
function timrstamp() {
  var time = Date.parse(new Date());
  return time;
}


// layer弹窗组件
function layTip(txt) {
  layer.open({
    content: txt
    ,style: 'background-color:#fff; color:#333; border:none;' //自定风格
    ,time: 3000

  });
}





// // 获取不带参数的url
function getDocumentUrl() {
  var url = window.location;
  url = url.split('?')[0];
  return url
}

//获取当前的appSign
function watermark(settings) {
  //默认设置  
  var defaultSettings = {
    watermark_txt: "text",
    watermark_x: 20,//水印起始位置x轴坐标  
    watermark_y: 60,//水印起始位置Y轴坐标  
    watermark_rows: 20,//水印行数  
    watermark_cols: 20,//水印列数  
    watermark_x_space: 50,//水印x轴间隔  
    watermark_y_space: 50,//水印y轴间隔  
    watermark_color: '#c5c5c5',//水印字体颜色  
    watermark_alpha: 0.3,//水印透明度  
    watermark_fontsize: '18px',//水印字体大小  
    watermark_font: '宋体',//水印字体  
    watermark_width: 138,//水印宽度  
    watermark_height: 80,//水印长度  
    watermark_angle: 15//水印倾斜度数  
  };
  //采用配置项替换默认值，作用类似jquery.extend  
  if (arguments.length === 1 && typeof arguments[0] === "object") {
    var src = arguments[0] || {};
    for (key in src) {
      if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
        continue;
      else if (src[key])
        defaultSettings[key] = src[key];
    }
  }
  var oTemp = document.createDocumentFragment();
  //获取页面最大宽度  
  var page_width = Math.max(document.body.scrollWidth, document.body.clientWidth);
  //获取页面最大长度  
  var page_height = Math.max(document.body.scrollHeight, document.body.clientHeight);

  //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔  
  if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
    defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
    defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
  }
  //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔  
  if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
    defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
    defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
  }
  var x;
  var y;
  for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
      x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

      var mask_div = document.createElement('div');
      mask_div.id = 'mask_div' + i + j;
      mask_div.className = 'mask_div';
      mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
      //设置水印div倾斜显示  
      mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.visibility = "";
      mask_div.style.position = "absolute";
      mask_div.style.left = x + 'px';
      mask_div.style.top = y + 'px';
      mask_div.style.overflow = "hidden";
      mask_div.style.zIndex = "-1";
      //mask_div.style.border="solid #eee 1px";  
      mask_div.style.opacity = defaultSettings.watermark_alpha;
      mask_div.style.fontSize = defaultSettings.watermark_fontsize;
      mask_div.style.fontFamily = defaultSettings.watermark_font;
      mask_div.style.color = defaultSettings.watermark_color;
      mask_div.style.textAlign = "center";
      mask_div.style.width = defaultSettings.watermark_width + 'px';
      mask_div.style.height = defaultSettings.watermark_height + 'px';
      mask_div.style.display = "block";
      mask_div.style.lineHeight = "26px";
      oTemp.appendChild(mask_div);
    };
  };
  document.body.appendChild(oTemp);
}


function wxconfig() {
  $.ajax({
    url: 'http://112.74.96.24:8082/mt-gzrd/login/loginbyuser?code=huA-LD0K-TkmOp2qKFdY45zyCQs4pFZNTizvleIs_FM&state=STATE',
    type: "get",
    async: true,
    dataType: "json",
    success: function (res) {
      alert(res)
    },
    error: function (e) {
      var er = JSON.stringify(e)
      alert(er)
    }
  })
}

//获取用户id以及用户名称
function to404() {
   if(localStorage.getItem('userId')=='' || localStorage.getItem('userId')==undefined || localStorage.getItem('userId')==null){
      window.location.href='./404.html'
  }
}


function ajaxLoadPageSynch(link) {
  var data
  $.ajax({
    url: link,
    async: false,
    success: function (d) {
      console.log(d)
      d = JSON.parse(d)
      data = d
    }
  })
  return data
}

function encode(key) {
  var data = encodeURI(encodeURI(key))
  return data
}


//提交意见
function option(type) {
  layer.open({
    type: '1',
    title: '写意见',
    content: "<div style = 'margin-bottom:10px;display:flex;flex-direction:row'><span style='float:left;color:#959595;font-size:14px;padding:10px'>意见主题:</span><input type='text' class='optStyle' val='123' id='put'/></div><div><p style='text-align:left;color:#959595;font-size:14px;padding:10px'>意见内容</p><textarea rows='5' cols='20' style='width:98%;border:1px solid #eee;outline:none;margin-bottom: 10px;' id='content'></textarea></div>",
    btn: ['确定', '取消'],
    yes: function (index) {
      // console.log($('#put').val())
      if ($('#put').val() === '') {

        layer.msg('请先输入主题', {
          time: '1000'
        })
      } else if ($('#content').val() === '') {
        layer.msg('请先输入内容', {
          time: '1000'
        })
      } else {
        let specialTeam = localStorage.getItem('specialTeam');
        let userName = localStorage.getItem('userName');
        let roleId = localStorage.getItem('roleId');
        var request = {
          categoryId: "created",
          title: $('#put').val(),
          content:$('#content').val(),
          roleId:roleId, // 角色ID
          name:userName,//发表人名称
          team:specialTeam,//所在代表团
          // examProject:'',//审查项目
          // committeeName:'',//工委名称

        };

        $.ajax({
          type: 'POST',
          url: url() + 'api/exam/app/online-advice',
          contentType: "application/json;charset=UTF-8",
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
          data: JSON.stringify(request),
          dataType: "JSON",
          success: function (res) {
            //data = JSON.parse(res)
            var data = res;
            console.log(data,'提交')
            localStorage.setItem("title", data.title);
            localStorage.setItem("content", data.content);
            localStorage.setItem("created", data.id);
            if (data != null) {
              layer.msg('提交成功', {
                time: '1000'
              })
              if (type === 'option') {
                location.reload();
              }
              ok();
              layer.close(index)
              // location.reload()
              return '成功'
            } else {
              layer.close();
              layer.msg(data, {
                time: '1000'
              })

            }
          }
        })
      }
    }
  });
}
function ok(){
  if (isAndroid===true) {
    JsBridge.call('JSBridge', 'ok', { 'isRefresh': false, 'callBack': 'isRefresh()' }, function(res) {})
	} 
}



//设置年份为当前年份
function setyear() {
  var dateTime = new Date;
  var yearTime = dateTime.getFullYear();
  localStorage.setItem('year', yearTime);
}

//设置年份
// function timeTip() {
//   //设置当前年份
//   $('.yearSelect').html(localStorage.getItem('year'))
//   $('.backT').click(function () {
//     var dateTime = new Date;
//     var yearTime = dateTime.getFullYear();
//     localStorage.setItem('year', yearTime);
//     back()
//   })
//   var timeSet = new Date();
//   var li = ''
//   var yearsET = timeSet.getFullYear();
//   var munY = parseInt(yearsET - '2015')
//   for (var i = 0; i < munY + 1; i++) {
//     li += '<li class="tipList">' + yearsET + '</li>';
//     yearsET--
//   }
//   $('.timeTip').children('ul').append(li);
//   // $('.tipList').eq('0').addClass('yearactive')
//   function yearS() {
//     $('.yearSelect').click(function () {
//       if ($('.timeTip').hasClass('show')) {
//         $('.timeTip').hide();
//         $('.timeTip').removeClass('show')
//       } else {
//         $('.timeTip').addClass('show')
//       }
//     })
//   }
//   yearS()
//   $('.tipList').on('click', function () {
//     $('.timeTip').removeClass('show')
//   })
//   $('.timeZZ').click(function () {
//     $('.timeZZ').css('visibility', 'hidden')
//     $('.timeTip').hide();
//     $('.timeTip').removeClass('show')
//   })
// }
//TAB栏切换
function selectTab() {
  $('#tabUl li').on('click', function () {
    $(this).addClass('active').siblings('li').removeClass('active')
    $('.page').eq($(this).index()).css('display', 'block').siblings('.page').css('display', 'none')
  })

}



