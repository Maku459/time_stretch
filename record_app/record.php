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

    //↑と↓の違いがわからない

    // いいね数を増やす関数
    public function recordCount($postPath) {
      // CSVに新たな行を追加する
      $data = array($postPath, $this->time, 1);
      $fp = fopen($this->csv, 'a');
      $line = implode(',' , $data);
      error_log(var_export($line, true), 3, 'debug.txt');
      fwrite($fp, $line . "\n");
      fclose($fp);
    }

} // end class record

 ?>
