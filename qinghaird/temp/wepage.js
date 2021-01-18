

function we() {
   if(localStorage.getItem('userId')==undefined || localStorage.getItem('userId')==''){
     information();
     console.log(localStorage.getItem('userId'))
   } 
  if (GetRequest('userId')) {
    information()
  }

  localStorage.getItem('year');
  $('body').css({ 'background': 'url() no-repeat', 'background-size': 'cover' })
  $('#mainHtml').children().remove();
  var htmlList = '';
  //'+localStorage.getItem('userName')+'
  htmlList = '<div id="weicomtent"><div style = "height:28.2vh;"><img src="images/we.png" style = "width:100%;height:28.2vh"/></div><div class="weconment"><ul class="wePage"><li style = "overflow:hidden"><div style="width:60px;float:left;padding-top:10px;padding-left:10px"><img src="./images/optionico2.png" class="people_icon_class"></div><div id="userName" style="width:60%;float:left;margin-left:10px;padding-top:0.45rem;font-size: 0.3rem;"></div><li class="upade_password"><a  style="border:none">修改密码</a></li><li  class="exit" ><a  style="border:none">退出登录</a></li></ul></div></div>'
  $('#mainHtml').prepend(htmlList);
  $('.username').text(localStorage.getItem('userName'));
  //个人意见管理
  // $(".wePage .weico").click(function () {
  //   var link = 'optionList.html?' + '&commentTitle=个人意见管理';
  //   forward(htmlUrl(link))
  // });

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
	  error:function(){
		  layer.msg("数据异常，请你检查你的地址...", {
		     time: 3000,
		     shade : [0.6 , '#000' , true],
		     // btn: ['关闭'],
		     yes: function () { back(); }
		  });
	  }
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


