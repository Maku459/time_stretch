let state, start_time, prev_time;
let control_time = 0;
let time_count = 0;
const oneSec = 1000;//1s
let timewitha = [];

var animation, sound0, sound1; 

let font, button;
let time_length;
let nowState = 0, flag = 0;//flag0=奇数， flag1=偶数

let pMinMass = 4, pMaxMass = 10, particles = [], exact = [];

function preload(){
  font = loadFont("NotoSerifJP-ExtraLight.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  //textFont("Meiryo");
  textSize(20);
  textAlign(CENTER, CENTER);
  fill(0);
  time_length = 5.00;
  
  animation = createVideo("all.mp4");
  animation.hide();
    // animation = createVideo("Test.mp4");
    // animation.hide();
  
  sound0 = loadSound("Click1.mp3");
  sound1 = loadSound("Click2.mp3");
  
  
  state = new TitleState();
}
function draw() {
  background(0);
  state = state.doState();
}
function mousePressed(){
  state.mousePressed();
}

function Particle(x, y, mass, displayColor) {
  this.pos = new p5.Vector(x, y);//位置
  this.vel = new p5.Vector(0, 0);//速度
  this.acc = new p5.Vector(0, 0);//加速度
  this.mass = mass;
  this.displayColor = displayColor;
  this.fallRate = map(this.mass, pMinMass, pMaxMass, 0.1, 0.05);//小さいものははやく落ちて大きいものはゆっくり落ちる
  
  this.move = function() {
    this.gravity = new p5.Vector(0, this.fallRate);
    this.acc.add(this.gravity);
    
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };
  
  this.display = function() {
    stroke(this.displayColor);//枠線
    strokeWeight(this.mass);
    point(this.pos.x, this.pos.y);
  };
}


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
 mousePressed(){
   this.domousePressed();
 }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/////State1/////////////////////////////
//Title
class TitleState extends State {
  constructor(){
    super();
  }
  drawState(){
    background(255);
    fill(0);
    //super.doState();
    if(time_count<3.0){
      text("時間は一定に流れている ―", 0, windowHeight*0.5, width);
    }
    else if(time_count > 3.0){
      text("それは本当でしょうか。", 0, windowHeight*0.45, width);
      text("あなたには確信が持てますか？", 0, windowHeight*0.55, width);
    }    
  }
  domousePressed(){
  }
  decideState() {
    if (time_count > 8.99) {
      for (let i = 0; i < 3000; i++) {
        timewitha[i] = 1.0;
      }
      return new CountDownState();
    }
    return this;
  }
}

/////State1'/////////////////////////////
//Count Down Going into the world of Clock
class CountDownState extends State {
  constructor(){
    super();
  }
  drawState(){
    fill(255);
    text("時計に入り込むアニメーションをいれます", 0, windowHeight*0.5, width);
  }
  domousePressed(){
  }
  decideState() {
    if (time_count > 2.99) {
      return new SettingState(); 
    }
    return this;
  }
}

/////State2/////////////////////////////
//settings
class SettingState extends State {
  constructor(){
    super();
    prev_time = millis();
  }
  drawState(){
    background(0);
    fill(255);
    if(time_count > 1.00){
      text("ここは時計の中です。", 0, windowHeight*0.35, width);
      text("あなたが刻む1クリックが、この時計の1秒となります。", 0, windowHeight*0.45, width);
      text("それでは早速、画面をクリックしてクリック音を確認してください。", 0, windowHeight*0.55, width);
      text("※音量はご自身で調節ください。", 0, windowHeight*0.55+30, width);
    }
    if(time_count > 7.99){
      text("スペースキーを押して次へ行く", 0, windowHeight*0.8, width);
    }
  }
  domousePressed(){
    //音を鳴らすだけ
    if(flag == 0){
      flag = 1;
      sound0.play();
    }
    else{
      flag = 0;
      sound1.play();
    }
  }
  decideState(){
    if (time_count > 7.99 && keyIsPressed) {
      if(key == ' '){
        return new TitleState_2();  
      }
    } 
    return this;
  }
}

/////State3/////////////////////////////
//Title_2 before clicking with Animation
class TitleState_2 extends State {
  constructor(){
    super();
    flag = 0;
  }
  drawState(){
    background(0);
    fill(255);
    if(time_count < 7.0){
      text("画面から目を離さずに", 0, windowHeight*0.35, width);
      text("あなたが思う正確な1秒を", 0, windowHeight*0.45, width);
      text("クリックしながら刻み続けてください。", 0, windowHeight*0.55, width);
    }
  }
  domousePressed(){
    //音を鳴らすだけ
    if(flag == 0){
      flag = 1;
      sound0.play();
    }
    else{
      flag = 0;
      sound1.play();
    }
  }
  decideState() {
    if (time_count > 10.99) {
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
    if(flag == 0){
      flag = 1;
      sound0.play();
    }
    else{
      flag = 0;
      sound1.play();
    }
    const now = millis();
    timewitha[this.count] = (now - prev_time) / 1000;
    this.count++;
    prev_time = millis();
  }
  decideState() {
    if (time_count > 41.99) { // if ellapsed time is larger than
      //timewitha[this.count] = abs(time_length - prev_time) / 1000;
      animation.stop();
      return new TitleState_3(); 
    }
    return this;
  }
}

/////State5/////////////////////////////
//Title_3 before the result
class TitleState_3 extends State {
  constructor(){
    super();
  }
  drawState(){
    //super.doState();
    text("お疲れさまでした。", 0, windowHeight*0.3, width);
    text("最後にあなたの1秒を可視化していきましょう。", 0, windowHeight*0.4, width);
    text("上から流れる白い砂があなたの刻みです。", 0, windowHeight*0.5, width);
    text("色のついた砂より太かったら刻んだ1秒が短く、細かったら刻んだ1秒が長かったということです。", 0, windowHeight*0.6, width); 
    //text("細かったら刻んだ1秒が長かったということです。", 0, windowHeight*0.7, width);
  }
  domousePressed(){
  }
  decideState() {
    if (time_count > 10.99) {
      return new AnimationState(); 
    }
    return this;
  }
}


/////State6/////////////////////////////
//result
class AnimationState extends State {
  constructor(){
    super();
    this.sum = timewitha[0];
    this.count = 0;
    this.nowW = 0;
  }
  drawState() {
    animation.loop();
    image(animation, width*0.6, height*0.1, 128*3, 72*3);
    //tint(255, 127);
    this.nowW = 0.05/(timewitha[this.count]*timewitha[this.count]);
    this.sW = windowWidth*(0.35 - this.nowW);
    this.eW = windowWidth*(0.35 + this.nowW);
    // for(let h=0; h<=0.00333*draw_count*windowHeight; h+=15){
    //   //text(timewitha[this.count], windowWidth*0.5, 50);
    //   this.nowW = 0.1/timewitha[this.count];
    //   this.sW = windowWidth*(0.35 - this.nowW);
    //   this.eW = windowWidth*(0.35 + this.nowW);
    //   for(let w = this.sW; w <= this.eW; w+=15){
    //     ellipse(w, h, 10, 10);
    //   }
    // }
    this.exactsW = windowWidth*0.25;
    this.exacteW = windowWidth*0.45;
    colorMode(HSB, 360);
    for(let num = 0; num < 4; num++){
      this.w = random(this.sW, this.eW);
      this.mass = random(pMinMass, pMaxMass);
      this.displayColor = color(255);
      // if (particles.length % 5 == 0) {
      //   this.displayColor = color(255);
      // } 
      // else {
      //   this.displayColor = color(random(210, 240), 255, 255);
      // }

      this.newParticle = new Particle(this.w, 0, this.mass, this.displayColor);
      particles[particles.length] = this.newParticle;
      exact[exact.length] = new Particle(random(this.exactsW, this.exacteW), 0, this.mass, color(random(210, 240), 255, 255));
    }
    
    colorMode(RGB, 255);
    for(let i = 0; i < particles.length; i++){
      particles[i].move();
      particles[i].display();
      exact[i].move();
      exact[i].display();
      //if (particles[i].pos.y > height) {
        //particles.splice(i, 1);
      //}
    }
    
    if(this.sum < time_count){
      this.count++;
      this.sum += timewitha[this.count];
    }
  }
  domousePressed() {
  }
  decideState() {
    if (time_count > 41.99) { // if ellapsed time is larger than
      animation.stop();
      return new EndingState(); // go to ending
    }
    return this;
  }
}

/////State7/////////////////////////////
//最後
class EndingState extends State {
  constructor(){
    super();
    strokeWeight();
  }
  drawState() {
    if(time_count < 3.99){
      
    }
    else if(time_count < 13.99){
      text("正確な1秒を刻めていましたか？", 0, windowHeight*0.35, width);
      text("時間は様々な要因によって変化します。", 0, windowHeight*0.45, width);
      text("少しでもその『伸縮』を感じていただけたら幸いです。", 0, windowHeight*0.55, width);
    }
    else if(time_count < 15.00){
      
    }
    else if(time_count < 19.00){
      text("『伸縮する時間』", 0, windowHeight*0.3, width);
      text("稲田栞里 佐久間響子 菊池知世", 0, windowHeight*0.45, width);
    }
    else{
      text("もどりのアニメーションをいれます", 0, windowHeight*0.5, width);
    }
    
  }
  domousePressed() {
  }
  decideState() {
    return this;
  }
}



/////State5/////////////////////////////
//Title_3 before the result
// class TitleState_3 extends State {
//   constructor(){
//     super();
//     this.clicked = false;
    
//     button = createButton('次へ');
//     button.position(windowWidth*0.8, windowHeight*0.8);
//     button.style("width", "120px");
//     button.style("height", "70px");
//     button.style("border-radius", "5px");
//     button.style("font-size", "24px");
//   }
//   drawState(){
//     //super.doState();
//     text("お疲れさまでした", 30, windowHeight*0.3);
//     text("最後に刻んだ最初の１秒，アニメーションを見ながらの１秒，正確な１秒を見比べてみましょう", 30, windowHeight*0.3+30);
//     text("それでは[次へ]をダブルクリックしてレッツゴー => ", 30, windowHeight*0.3+70);
//   }
//   domousePressed(){
//     //音を鳴らすだけ
//     if(flag == 0){
//       flag = 1;
//       sound0.play();
//     }
//     else{
//       flag = 0;
//       sound1.play();
//     }
//     button.mousePressed(()  => this.clicked = true);
//   }
//   decideState() {
//     if (this.clicked) {
//       button.hide();
//       return new AnimationState(); //new ClickState1();
//     }
//     return this;
//   }
// }


//     button = createButton('次へ');
//     button.position(windowWidth*0.8, windowHeight*0.8);
//     button.style("width", "120px");
//     button.style("height", "70px");
//     button.style("border-radius", "5px");
//     button.style("font-size", "24px");
