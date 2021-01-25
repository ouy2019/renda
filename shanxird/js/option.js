//提交意见
function option(type) {
    layer.open({
      type: '1',
      title: '回复意见',
      content: "<div><p style='text-align:left;color:#959595;font-size:18px;padding:10px'>回复内容</p><textarea rows='20' cols='20' style='width:98%;border:1px solid #eee;outline:none;margin-bottom: 10px;' id='content'></textarea></div>",
      btn: ['确定', '取消'],
      yes: function (index) {
        if ($('#content').val() === '') {
          layer.msg('请先输入内容', {
            time: '1000'
          })
        } else {
          let adviceId = localStorage.getItem('writeId');
          var request = {
            advice: {
                id:adviceId
            },
            content:$('#content').val(),
          };
  
          $.ajax({
            type: 'POST',
            url: url() + 'api/exam/online-advice/reply',
            contentType: "application/json;charset=UTF-8",
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Working-Organization': 1 },
            data: JSON.stringify(request),
            dataType: "JSON",
            success: function (res) {
              //data = JSON.parse(res)
              var data = res;
              console.log(data,'提交')
              localStorage.setItem("replyUser", data.replyUser.name);//回复人
              localStorage.setItem("replyUserId", data.replyUser.id);//回复人id
              localStorage.setItem("optionContent", data.content);
              localStorage.setItem("replyTime", data.replyTime);//回复时间
              localStorage.setItem("revertId", data.id);//回复在线意见id
              if (data != null) {
                layer.msg('提交成功', {
                  time: '1000'
                })
                ok();
                if (type === 'option') {
                  // window.location.reload();
                  window.location.href = location.href+'?time='+((new Date()).getTime());
                }
                layer.close(index);
                
                //window.location.reload()
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