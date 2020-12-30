<?php

///////////////////////////////////////////////////
// 個人サイト向けいいねボタンプログラム Ver1.1.1
// 製作者    ：ガタガタ
// サイト    ：https://do.gt-gt.org/
// ライセンス：MITライセンス
// 全文      ：https://ja.osdn.net/projects/opensource/wiki/licenses%2FMIT_license
// 公開日    ：2020.08.21
// 最終更新日：2020.09.15
//
// このプログラムはどなたでも無償で利用・複製・変更・
// 再配布および複製物を販売することができます。
// ただし、上記著作権表示ならびに同意意志を、
// このファイルから削除しないでください。
///////////////////////////////////////////////////

$include = get_included_files();
if (array_shift($include) === __FILE__) {
    die('このファイルへの直接のアクセスは禁止されています。');
}

class record {
  
  private $csv;
  private $time;
  
  	// コンストラクタ宣言
  	public function __construct() {

      $this->csv = 'data.csv';

      date_default_timezone_set('Asia/Tokyo');
      $this->time = date("Y/m/d-H:i:s");
      var_dump($this);
    }

    // URL名がindex.htmlもしくはindex.phpで終わる場合はURLを丸める
    public function checkURL($url) {
      $filenames = array('index.html', 'index.php');
      foreach ($filenames as $filename) {
        if (strpos($url, $filename) !== false) {
          $url = rtrim($url, $filename);
        }
      }
      return $url;
    }

    // PHP5.5以下でもarray_columnに相当する関数を使う
    public function check_column ($target_data, $column_key, $index_key = null) {
      if (is_array($target_data) === FALSE || count($target_data) === 0) return array(false,false,false);

      $result = array();
      foreach ($target_data as $array) {
        if (array_key_exists($column_key, $array) === FALSE) continue;
        if (is_null($index_key) === FALSE && array_key_exists($index_key, $array) === TRUE) {
          $result[$array[$index_key]] = $array[$column_key];
          continue;
        }
        $result[] = $array[$column_key];
      }

      if (count($result) === 0) return array(false,false,false);
      return $result;
    }

    // CSVファイルに二次元配列を上書きする関数
    private function rewriteCSV($datas) {
      $fp = fopen($this->csv, 'w');
      error_log(var_export($datas, true), 3, 'debug.txt');
      // 二次元配列を１行ずつCSV形式に直して書き込む
      foreach ($datas as $v) {
        $line = implode(',' , $v);
        fwrite($fp, $line . "\n");
      }

      // ファイルを閉じる
      fclose($fp);
    }

    // 記録する関数
    public function recordCount($timewitha, $average, $bunsan) {
      $fp = fopen($this->csv, 'a');
      //配列は文字列にできないので別に書き込む
      $linea = implode(',' , $timewitha);
      $data = array($this->time, $average, $bunsan);
      $lineb = implode(',' , $data);
      error_log(var_export($line, true), 3, 'debug.txt');
      fwrite($fp, $linea . "\n");
      fwrite($fp, $lineb . "\n");
      fwrite($fp, "----------" . "\n");
      fclose($fp);
    }

} // end class record

 ?>
