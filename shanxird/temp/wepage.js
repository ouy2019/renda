

function we() {
   if(localStorage.getItem('userId')==undefined || localStorage.getItem('userId')==''){
     information();
   } 
    if (GetRequest('userId')) {
      information()
    }

  localStorage.getItem('year');
  $('body').css({ 'background': 'url() no-repeat', 'background-size': 'cover' })
  $('#mainHtml').children().remove();
  var htmlList = '';
  htmlList = `<div id="weicomtent"><div style = "height:4.36rem;">
  <img src="images/we.png" style = "width:100%;"/>
  </div><div class="weconment"><ul class="wePage"><li style="overflow:hidden">
  <div style="width:60px;float:left;padding-top:10px;padding-left:6%;">
  <img src="./images/optionico2.png" class="people_icon_class"></div>
  <div class="userNameCode">
  <p class="userName"></p>
  <p class="organizationName"></p>
  <p class="specialTeam"></p>
  </div><li  class="weico" ><a  style="border:none">个人意见管理</a></li><li class="upade_password"><a  style="border:none">修改密码</a></li><li  class="exit" ><a  style="border:none">退出登录</a></li></ul></div></div>`
  
  
  $('#mainHtml').prepend(htmlList);
  $('.userName').text(localStorage.getItem('userName'));

  if( localStorage.getItem('specialCode')){
    $('.organizationName').addClass('specialCode');
    $('.userNameCode').addClass('userCodeS');
    $('.organizationName').text('代表证号 : '+localStorage.getItem('specialCode'));//账户--代表证号
  }else{
    $('.specialTeam').css('top','0.7rem')
  }
  if(localStorage.getItem('specialTeam')){
    $('.specialTeam').text(localStorage.getItem('specialTeam'));//账户--代表团
  }

  //个人意见管理
  $(".wePage .weico").click(function () {
    var link = 'optionList.html?' + '&commentTitle=个人意见管理'+'&userName='+localStorage.getItem('userName');
    forward(htmlUrl(link))
  });

  //退出登录
  $(".wePage .exit").click(function () {
    $.ajax({
      url: url() + 'api/token',
      type: 'DELETE',
      accept: 'application/json;charset=UTF-8',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
      async: false,
      success: function (res) {
        var data = res.data;
        if (data) {
          layer.open({
            content: '您确定要退出登录吗？'
            , btn: ['确定', '取消']
            , yes: function (index) {
              // localStorage.clear();  清空localstorage
              // localStorage.removeItem('userName');
              // localStorage.removeItem('userId');
              //window.location.href='login.html';
              if (equipment('iphone')) {
                 logout();
                
              } else if (equipment("ipad")) {
                logout()
              
              }else{
                JsBridge.call('JSBridge', 'logout', {}, function (res) {})

              }
            }
          });
        }
      },
    });
  })

  // 修改用户密码
  $('.upade_password').click(function () {
    layer.open({
      title: '修改密码',
      className: 'updatePassworld',
      content: '<div><ul class="update_w"><li><input placeholder="原始密码" class="orign_p" /></li><li><input placeholder="新密码" class="newP01" /></li><li><input placeholder="重新输入新密码" class="newP02"/></li></ul></div>'
      , btn: ['确定', '取消']
      , yes: function (index3) {
        // location.reload();
        if ($('.orign_p').val() == '') {
          layer.open({
            content: '新密码不能为空'
            , skin: 'msg'
          });
          return;
        }
        if ($('.newP01').val() == '') {
          layer.open({
            content: '新密码不能为空'
            , skin: 'msg'

          });
          return;
        }
        if ($('.newP02').val() == '') {
          layer.open({
            content: '请输入两次新密码'
            , skin: 'msg'

          });
          return;
        }
        if ($('.newP02').val() != $('.newP01').val()) {
          layer.open({
            content: '输入的两次密码不正确'
            , skin: 'msg'

          });

          return;
        }

        const userId = localStorage.getItem('userId');
        let formerpassword = $('.orign_p').val();
        let newpassword = $('.newP01').val();
        $.ajax({
          url: url() + 'api/authority/users/' + userId + '/password',
          method: 'PUT',
          contentType: "application/json;charset=UTF-8",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1,
          },
          data: JSON.stringify({ oldPassword: formerpassword, newPassword: newpassword, }),
          success: function (res) {
            console.log(res);
            if (res.code == 1) {
              layer.msg('修改代码失败');
            } else {
              layer.msg('修改代码成功');
            }

          }
        })

      }
    });
  })
}

SPA_RESOLVE_INIT = function (transition) {
  $('#mainHtml').children().remove();
  we()
}


