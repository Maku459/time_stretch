let state, start_time, prev_time;
let control_time = 0;
let time_count = 0;
const oneSec = 1000;//1s
let timewitha = [];

var animation, op, ed, sound0, sound1;

let font, clock_font, button;
let time_length;
let nowState = 0, flag = 0;//flag0=奇数， flag1=偶数

let pMinMass = 4, pMaxMass = 10, particles = [], exact = [];

//分散の計算のための、simple-statistics読み込み
const el = document.createElement('script');
el.src = 'https://unpkg.com/simple-statistics@7.0.2/dist/simple-statistics.min.js';
document.body.appendChild(el);

function preload() {
  font = loadFont("ipam.ttf");
  clock_font = loadFont("digital.ttf");
}

function setup() {
  //fullscreen(true);
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  //textFont("Meiryo");
  textSize(30);
  textAlign(CENTER, CENTER);
  fill(0);
  time_length = 5.00;

  animation = createVideo("all.mp4");
  animation.hide();

  //animation = createVideo("Test.mp4");
  //animation.hide();

  sound0 = loadSound("Click1.mp3");
  sound1 = loadSound("Click2.mp3");


  state = new SettingState();
}
function draw() {
  background(0);
  state = state.doState();
}
function mousePressed() {
  state.mousePressed();
}

// function Particle(x, y, mass, displayColor) {
//   this.pos = new p5.Vector(x, y);//位置
//   this.vel = new p5.Vector(0, 0);//速度
//   this.acc = new p5.Vector(0, 0);//加速度
//   this.mass = mass;
//   this.displayColor = displayColor;
//   this.fallRate = map(this.mass, pMinMass, pMaxMass, 0.1, 0.05);//小さいものははやく落ちて大きいものはゆっくり落ちる

//   this.move = function() {
//     this.gravity = new p5.Vector(0, this.fallRate);
//     this.acc.add(this.gravity);

//     this.vel.add(this.acc);
//     this.pos.add(this.vel);
//     this.acc.mult(0);
//   };

//   this.display = function() {
//     stroke(this.displayColor);//枠線
//     strokeWeight(this.mass);
//     point(this.pos.x, this.pos.y);
//   };
// }


/////State/////////////////////////////
class State {
  constructor() {
    start_time = millis();
    time_count = 0;
  }
  doState() {
    const now = millis();
    control_time = now - start_time;
    if (control_time >= oneSec) {
      time_count++;
      start_time = millis();
    }
    this.drawState();
    return this.decideState();
  }
  mousePressed() {
    this.domousePressed();
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/////State2/////////////////////////////
//settings
class SettingState extends State {
  constructor() {
    super();
    prev_time = millis();
  }
  drawState() {
    background(0);
    fill(255);
    if (time_count > 1.00) {
      textSize(25);
      text("ここは時計の中です。", 0, height * 0.35, width);
      text("あなたが刻む1クリックが、この時計の1秒となります。", 0, height * 0.45, width);
      text("それでは早速、画面をクリックしてクリック音を確認してください。", 0, height * 0.55, width);
      text("※音量はご自身で調節ください。", 0, height * 0.55 + 30, width);
    }
    if (time_count > 7.99) {
      text("スペースキーを押して次へ行く", 0, height * 0.8, width);
    }
  }
  domousePressed() {
    //音を鳴らすだけ
    if (flag == 0) {
      flag = 1;
      sound0.play();
    }
    else {
      flag = 0;
      sound1.play();
    }
  }
  decideState() {
    if (time_count > 7.99 && keyIsPressed) {
      if (key == ' ') {
        return new TitleState_2();
      }
    }
    else if (keyIsPressed) {
      if (keyCode === ENTER) {
        return new TitleState_2();
      }
    }
    return this;
  }
}

/////State3/////////////////////////////
//Title_2 before clicking with Animation
class TitleState_2 extends State {
  constructor() {
    super();
    flag = 0;
  }
  drawState() {
    background(0);
    fill(255);
    if (time_count < 7.0) {
      text("画面から目を離さずに", 0, height * 0.35, width);
      text("あなたが思う正確な1秒を", 0, height * 0.45, width);
      text("クリックしながら刻み続けてください。", 0, height * 0.55, width);
    }
    else if (time_count < 8.0) {

    }
    else if (time_count < 9.0) {
      textSize(120);
      textFont(clock_font);
      text("3", 0, height * 0.5, width);
    }
    else if (time_count < 10.0) {
      textSize(120);
      textFont(clock_font);
      text("2", 0, height * 0.5, width);
    }
    else {
      textSize(120);
      textFont(clock_font);
      text("1", 0, height * 0.5, width);
    }
  }
  domousePressed() {
    //音を鳴らすだけ
    if (flag == 0) {
      flag = 1;
      sound0.play();
    }
    else {
      flag = 0;
      sound1.play();
    }
  }
  decideState() {
    if (time_count > 10.9) {
      return new ClickState();
    }
    return this;
  }
}

/////State4/////////////////////////////
//Click with Animation
class ClickState extends State {
  constructor() {
    super();
    prev_time = millis();
    this.count = 0;
  }
  drawState() {
    animation.loop();
    image(animation, 0, 0, width, height);
  }
  domousePressed() {
    //音を鳴らすだけ
    if (flag == 0) {
      flag = 1;
      sound0.play();
    }
    else {
      flag = 0;
      sound1.play();
    }
    const now = millis();
    timewitha[this.count] = (now - prev_time) / 1000;
    this.count++;
    prev_time = millis();
  }
  decideState() {
    if (time_count > 36.99) { // if ellapsed time is larger than
      timewitha[this.count] = (millis() - prev_time) / 1000;
      animation.stop();
      return new TitleState_3();
    }
    return this;
  }
}

/////State5/////////////////////////////
//Title_3 before the result
class TitleState_3 extends State {
  constructor() {
    super();
  }
  drawState() {
    //super.doState();
    textSize(25);
    textFont(font);
    text("最後に、あなたが刻んだ時間を可視化していきましょう。", 0, height * 0.4, width);
    text("刻みの間隔に応じて画面に表示される図形の幅が変化します。", 0, height * 0.5, width);
    text("[TAB]キーを押してください。", 0, height * 0.3, width);
  }
  domousePressed() {
  }
  decideState() {
    if (time_count > 10.99) {
      return new AnimationState();
    }
    else if (keyIsPressed) {
      if (keyCode === 9) {
        return new AnimationState();
      }
    }
    return this;
  }
}


/////State6/////////////////////////////
//result
class AnimationState extends State {
  constructor() {
    super();
    this.sum = timewitha[0];
    this.count = 0;
    this.nowW = 0;
    this.ok = 0;
    flag = 0;
  }
  drawState() {
    animation.loop();
    image(animation, width * 0.6, height * 0.1, 128 * 4, 72 * 4);
    this.exactsW = width * 0.2;
    this.exacteW = width * 0.3;
    if (timewitha[this.count] >= 1.0) {
      this.nowW = 1.0 * (timewitha[this.count] - 1.0);
      this.sW = width * (0.2 - this.nowW);
      this.eW = width * (0.3 + this.nowW);
    }
    if (timewitha[this.count] < 1.0) {
      this.nowW = 0.05 * timewitha[this.count];
      this.sW = width * (0.25 - this.nowW);
      this.eW = width * (0.25 + this.nowW);
    }

    fill(210, 255, 255);
    rect(this.sW, 0, abs(this.eW - this.sW), height);//始点ｘ， 始点y, 幅, 高さ
    fill(11, 255, 255, 200);
    rect(this.exactsW, 0, width * 0.1, height);


    //     strokeWeight(0);
    textSize(80);
    textFont(clock_font);
    fill(255);
    text(timewitha[this.count].toFixed(2), 0, height * 0.7, width * 1.5);

    if (this.sum < time_count) {
      this.count++;
      this.sum += timewitha[this.count];
      if (flag == 0) {
        flag = 1;
        this.ok = 0;
      }
      else if (flag == 1) {
        flag = 0;
        this.ok = 0;
      }
    }
    //音を鳴らすだけ
    if (flag == 0 && this.ok == 0) {
      sound0.play();
      this.ok = 1;
    }
    if (flag == 1 && this.ok == 0) {
      sound1.play();
      this.ok = 1;
    }

    localStorage.setItem("timewitha", JSON.stringify(timewitha));

    //平均をとる
    let sum = 0;

    for (let i = 1; i < 21; i++) {
      sum += timewitha[i];
    }

    let avarage = sum / 20;
    localStorage.setItem("avarage", avarage);

    //分散を取る
    let timewithb = [];
    for (let i = 1; i < 21; i++) {
      timewithb.push(timewitha[i]);
    }

    let v = ss.variance(timewithb);
    localStorage.setItem("bunsan", v);  

  }
  domousePressed() {
  }
  decideState() {
    if (time_count > 36.99) { // if ellapsed time is larger than
      animation.stop();
      return new EndingState(); // go to ending
    }
    return this;
  }
}

/////State7/////////////////////////////
//最後
class EndingState extends State {
  constructor() {
    super();
    strokeWeight();
  }
  drawState() {
    if (time_count < 3.99) {

    }
    else if (time_count < 13.99) {
      textSize(25);
      textFont(font);
      text("正確な時間を刻むことができたでしょうか。", 0, height * 0.35, width);
      text("あなたの知らぬ間に、時間はひっそりと流れ方を変えているのかもしれません。", 0, height * 0.45, width);
      text("ときには、そんな「伸縮する時間」に耳を傾けてみてください。", 0, height * 0.55, width);
    }
    else if (time_count < 15.00) {

    }
    else if (time_count < 21.00) {
      //ed.loop();
      image(ed, 0, 0, width, height);
    }
    else if (time_count < 22.00) {
      ed.stop();
      background(255);
    }
    else if (time_count < 25.00) {
      textSize(50);
      background(255);
      fill(0);
      text("伸縮する時間", 0, height * 0.5, width);
    }
    else if (time_count < 27.00) {
      background(255);
    }
    else {
      textSize(20);
      background(255);
      fill(0);
      text("※タブを閉じて作品ページへお戻りください※", 0, height * 0.45, width);
      text("※もう一度体験したい方はスペースキーを押してください※", 0, height * 0.55, width);
    }
  }
  domousePressed() {
  }
  decideState() {
    if (keyIsPressed) {
      if (key == ' ') {
        return new TitleState();
      }
    }
    return this;
  }
}