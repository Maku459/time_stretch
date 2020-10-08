int _frameRate = 60;
int wave_num = 3; //波の本数
int sampling = 500;

//波のパラメータ
float amplitude = 50;//振幅
float cycle = 1.5;//周期
float wavelength = 300;//波長
float minWeight = 2;
float maxWeight = 8;

//全体の時間経過
float offset_time;
//1フレームの時間
float offset_time_velocity = TWO_PI/_frameRate/cycle;

float offset_time_eachPoint;
float point_position_y;

Point tempP;

ArrayList<Wave> waves;
Wave tempW;

void setup() {
  size(600,400,P3D);//P3Dを使うことでレンダリングを高速化
  colorMode(HSB,100);
  frameRate(_frameRate);
  //点の密度
  offset_time_eachPoint = TWO_PI / (wavelength/width * sampling);

  //波を作成し、それぞれに番号を振る
  waves = new ArrayList<Wave>();
  for (int i = 0; i < wave_num; i ++) {
    Wave w = new Wave(i);
    waves.add(w);
  }
}

void draw() {
  background(51);
  //1フレームごとに時間を足す
  offset_time += offset_time_velocity;
  
  stroke(255);
  for (int i = waves.size() - 1; i >= 0; i --) {
    tempW = waves.get(i);
    tempW.change();
  }
}

class Wave{
  int index_wave;
  ArrayList<Point> points;
  
  Wave(int _i){
    index_wave = _i;
    
    //点自体の番号だけでなく、それが属する波の番号も付与
    points = new ArrayList<Point>();
    for (int i = 0; i < sampling; i ++) {
      Point p = new Point(i, index_wave);
      points.add(p);
    }
  }
  void change() {
    for (int i = points.size() - 1; i >= 0; i--) {
      tempP = points.get(i);
      tempP.move();
      tempP.display();
    }
  }
}

class Point{
  PVector pos;
  int index_point;
  int index_wave;
  float offset_time_currentPoint;

  //少しずつ波をずらす（波間のオフセット）
  float offset_eachWave = PI;

  //収縮させる
  float shrink;

  //線の太さと色
  float _weight;  
  color c;
  float h;
  float s = 85;
  float b = 99;

  Point(int _i, int _i_w) {
    index_point = _i;//点ごとの番号を取得
    index_wave = _i_w;//波番号を取得
    pos = new PVector();
    offset_time_currentPoint = index_point * offset_time_eachPoint + index_wave * offset_eachWave;
    pos.x = (index_point+0.5)/sampling*width;

    //収縮を初期化
    shrink = pow( sin(pos.x/width * PI), 2);

    //線の太さを初期化。両側が細く、波1が太く波3が細い
    _weight = map(shrink, 0, 1, minWeight, maxWeight - index_wave*2);
  }
  
  //波の形状を指定
  void move() {
    if (index_wave == 0) {
      //1番目の波：正弦波
      pos.y = shrink * amplitude * sin(offset_time + offset_time_currentPoint) + height/2;
    } else if (index_wave == 1) {
      //2番目の波：周波数2倍、振幅0.42倍
      pos.y = shrink * -0.42 * amplitude * ( sin(offset_time + offset_time_currentPoint) + sin(offset_time/2 + offset_time_currentPoint/2) )  + height/2;
    } else {
      pos.y = shrink * 0.5 * amplitude * ( sin(offset_time + offset_time_currentPoint) + 2*sin(offset_time/2 + offset_time_currentPoint/2) ) + height/2;
    }
  }
  
  void display() {
    strokeWeight(_weight);//初期化された太さ
    //両側・上側が紫、中央・下側が青みがかった色
    h = (map(shrink, 0, 1, 75, 65) + map(pos.y, height/2 + amplitude, height/2 - amplitude, 60, 90)) / 2;
    c = color(h, s, b);
    stroke(c);
    point(pos.x, pos.y);
  }
  
}