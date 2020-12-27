$(function () {
    'use strict';
  
    var thanks = false; // お礼メッセージを出す場合はtrue、出さない場合はfalse
    var folderpath = '/';
    // record_appフォルダが入っているパスを、ドメイン名以下から記入してください。
    // 下記の例に従ってください。
    // var folderpath = '/'; --- http://example.com/record_app/の場合
    // var folderpath = '/site/'; --- http://example.com/site/record_app/の場合
    // var folderpath = 'site/folder/' --- http://example.com/site/folder/record_app/の場合
  
    ////// ここから下のエリアには変更を加えないでください ///////
    var pathname = location.href;
  
    var ajaxPath = `${location.protocol}//${location.host}${folderpath}record_app/record.php`;
    var timewitha = JSON.parse(localStorage.getItem("datalist"));
    var avarage = localStorage.getItem("avarage");
    var bunsan = localStorage.getItem("bunsan");
  
    /*
    $(document).ready(function () {
      $.ajax({
        type: 'GET',
        url: ajaxPath,
        data: { path: pathname, mode: 'show' }
      }).fail(function () {
        // alert('record.jsのfolderpathの値を確認して下さい。');
      }).done(function (res) {
        if (res < 0) {
          res = 0;
        }
        //count.innerHTML = res;
      });
    });
    */
  
    // update
    $(document).keydown(function(e){
      if(e.keyCode == 9){
        e.preventDefault();
        $.post(ajaxPath, {
          path: pathname,
          timewitha: timewitha,
          avarage: avarage,
          bunsan: bunsan
        }
      ).fail(function () {
          // alert('record.jsのfolderpathの値を確認して下さい。');
        }).done(function (res) {
          //count.innerHTML = res;
        });
      }
    });
  });
  