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

function preload(){
  font = loadFont("ipam.ttf");
  clock_font = loadFont("digital.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  //textFont("Meiryo");
  textSize(30);
  textAlign(CENTER, CENTER);
  fill(0);
  time_length = 5.00;
  
  animation = createVideo("all.mp4");
  animation.hide();
  op = createVideo("OP.mp4");
  op.hide();
  ed = createVideo("ED.mp4");
  ed.hide();
    //animation = createVideo("Test.mp4");
    //animation.hide();
  
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
    if(time_count < 3.0){
      textSize(20);
      text("※この作品は音が出ます※", 0, height*0.5, width);
    }
    else if(time_count < 5.0){
      
    }
    else if(time_count < 9.0){
      textSize(30);
      text("時間は一定に流れている ―", 0, height*0.5, width);
    }
    else if(time_count < 11.0){
      
    }
    else{
      text("それは本当でしょうか。", 0, height*0.45, width);
      text("あなたには確信が持てますか？", 0, height*0.55, width);
    }    
  }
  domousePressed(){
  }
  decideState() {
    if (time_count > 14.99) {
      for (let i = 0; i < 3000; i++) {
        timewitha[i] = 1.0;
      }
      return new CountDownState();
    }
    else if (keyIsPressed) {
      if(keyCode === ENTER){
        for (let i = 0; i < 3000; i++) {
          timewitha[i] = 1.0;
        }
        return new CountDownState();
      }
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
    op.loop();
    image(op, 0, 0, width, height);    
  }
  domousePressed(){
  }
  decideState() {
    if (time_count > 7.99) {
      op.stop();
      return new SettingState(); 
    }
    else if (keyIsPressed) {
      if(keyCode === ENTER){
        op.stop();
        return new SettingState();
      }
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
      textSize(25);
      text("ここは時計の中です。", 0, height*0.35, width);
      text("あなたが刻む1クリックが、この時計の1秒となります。", 0, height*0.45, width);
      text("それでは早速、画面をクリックしてクリック音を確認してください。", 0, height*0.55, width);
      text("※音量はご自身で調節ください。", 0, height*0.55+30, width);
    }
    if(time_count > 7.99){
      text("スペースキーを押して次へ行く", 0, height*0.8, width);
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
    else if (keyIsPressed) {
      if(keyCode === ENTER){
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
      text("画面から目を離さずに", 0, height*0.35, width);
      text("あなたが思う正確な1秒を", 0, height*0.45, width);
      text("クリックしながら刻み続けてください。", 0, height*0.55, width);
    }
    else if(time_count < 8.0){
      
    }
    else if(time_count < 9.0){
      textSize(120);
      textFont(clock_font);
      text("3", 0, windowHeight*0.5, width);
    }
    else if(time_count < 10.0){
      textSize(120);
      textFont(clock_font);
      text("2", 0, windowHeight*0.5, width);
    }
    else{
      textSize(120);
      textFont(clock_font);
      text("1", 0, windowHeight*0.5, width);
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
  constructor(){
    super();
  }
  drawState(){
    //super.doState();
    textSize(25);
    textFont(font);
    text("最後に、あなたが刻んだ時間を可視化していきましょう。", 0, height*0.4, width);
    text("上から流れる白い砂があなたの刻み、青い砂が正確な1秒を表します。", 0, height*0.5, width);
    text("砂の流れは刻んだ一秒が長いときに太く、短いときに細くなります。", 0, height*0.6, width); 
  }
  domousePressed(){
  }
  decideState() {
    if (time_count > 10.99) {
      return new AnimationState(); 
    }
    else if (keyIsPressed) {
      if(keyCode === ENTER){
        return new AnimationState(); 
      }
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
    image(animation, width*0.6, height*0.1, 128*4, 72*4);
    //tint(255, 127);
//     this.nowW = 0.2*timewitha[this.count];
//     this.sW = windowWidth*(0.25 - this.nowW);
//     this.eW = windowWidth*(0.25 + this.nowW);
//     this.exactsW = windowWidth*0.05;
//     this.exacteW = windowWidth*0.45;
//     colorMode(HSB, 360);
//     for(let num = 0; num < 4; num++){
//       this.w = random(this.sW, this.eW);
//       this.mass = random(pMinMass, pMaxMass);
//       this.displayColor = color(255);
//       this.newParticle = new Particle(this.w, 0, this.mass, this.displayColor);
//       particles[particles.length] = this.newParticle;
//       exact[exact.length] = new Particle(random(this.exactsW, this.exacteW), 0, this.mass, color(random(210, 240), 255, 255));
//     }
    
//     colorMode(RGB, 255);
//     for(let i = 0; i < particles.length; i++){
//       particles[i].move();
//       particles[i].display();
//       exact[i].move();
//       exact[i].display();
//     }
    this.exactsW = windowWidth * 0.2;
    this.exacteW = windowWidth * 0.3;
    this.nowW = 3 * (timewitha[this.count] - 1.0);
    this.sW = windowWidth * (0.2 - this.nowW);
    this.eW = windowWidth * (0.2 + this.nowW);
    fill(210, 255, 255);
    rect(this.sW, 0, this.sW-this.eW, windowHeight);
    fill(11, 255, 255);
    rect(this.exactsW, 0, windowWidth * 0.1, windowHeight);
    
    
//     strokeWeight(0);
    textSize(80);
    textFont(clock_font);
    text(timewitha[this.count].toFixed(2), 0, height*0.7, width*0.9);
    
    if(this.sum < time_count){
      this.count++;
      this.sum += timewitha[this.count];
    }
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
  constructor(){
    super();
    strokeWeight();
  }
  drawState() {
    if(time_count < 3.99){
      
    }
    else if(time_count < 13.99){
      textSize(25);
      textFont(font);
      text("正確な時間を刻むことができたでしょうか。", 0, height*0.35, width);
      text("あなたの知らぬ間に、時間はひっそりと流れ方を変えているのかもしれません。", 0, height*0.45, width);
      text("ときには、そんな「伸縮する時間」に耳を傾けてみてください。", 0, height*0.55, width);
    }
    else if(time_count < 15.00){
      
    }
    else if(time_count < 23.00){
      ed.loop();
      image(ed, 0, 0, width, height);
    }
    else if(time_count < 24.00){
      ed.stop();
      background(255);
    }
    else{
      textSize(50);
      background(255);
      fill(0);
      text("伸縮する時間", 0, height*0.5, width);
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
