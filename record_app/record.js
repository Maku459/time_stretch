$(function () {
    'use strict';

    var thanks = false; // お礼メッセージを出す場合はtrue、出さない場合はfalse
    var folderpath = 'time_stretch/';
    // record_appフォルダが入っているパスを、ドメイン名以下から記入してください。
    // 下記の例に従ってください。
    // var folderpath = '/'; --- http://example.com/record_app/の場合
    // var folderpath = '/site/'; --- http://example.com/site/record_app/の場合
    // var folderpath = 'site/folder/' --- http://example.com/site/folder/record_app/の場合
  
    ////// ここから下のエリアには変更を加えないでください ///////
    var pathname = location.href;
  
    var ajaxPath = `${location.protocol}//${location.host}/${folderpath}record_app/_ajax.php`;

    // update
    $(document).keydown(function(e){
      if(e.keyCode == 9){
        e.preventDefault();
        $.post(ajaxPath, {
          path: pathname,
          mode: 'check',
          timewitha: JSON.parse(localStorage.getItem("timewitha")),
          average: localStorage.getItem("average"),
          bunsan: localStorage.getItem("bunsan")
        }
      ).fail(function () {
           alert('record.jsのfolderpathの値を確認して下さい。');
        }).done(function (res) {
          //count.innerHTML = res;
        });
      }
    });
  });
  