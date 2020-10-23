let state, start_time, prev_time;
let control_time = 0;
let time_count = 0;
const oneSec = 1000;//1s
const time = [];
const timewitha = [];
var animation, movie; //animation: while clicking movie:after clicking

function setup() {
  createCanvas(1280, 750);
  textFont('Meiryo');
  textSize(30);
  //textAlign(CENTER);
  fill(0, 0, 0);
  animation = createVideo("Test.mp4");
  animation.hide();
  //animation.loop();
  //movie = createVideo("all_1.mp4");
  state = new TitleState();
}
function draw() {
  background(204);
  state = state.doState();
}
function mousePressed(){
  state.mousePressed();
}


/////State/////////////////////////////
class State {
 constructor() {
   start_time = millis();
   time_count = 0;
 }
 doState() {
   //background(204);
    const now = millis();
    text(time_count + 's passed', 30, 30);
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

/////State1/////////////////////////////
//Title
class TitleState extends State {
  constructor(){
    super();
    this.clicked = false;
  }
  drawState(){
    //super.doState();
    text("伸縮する時間へようこそ", 30, 210);
    text("まずはあなたの１秒がどのくらい正確なのか感じてみましょう", 30, 240);
    text("これからの５秒間，１秒ごとにマウスをクリックしてみてください", 30, 270);
    text("それではマウスをクリックしてスタート！", 30, 300);
  }
  domousePressed(){
    this.clicked = true;
  }
  decideState() {
    if (this.clicked) {
      for (let i = 0; i < 3000; i++) {
        time[i] = 0.0;
        timewitha[i] = 0.0;
      }
      return new ClickState1(); //new ClickState1();
    }
    return this;
  }
}

/////State2/////////////////////////////
//何もなしで刻む
class ClickState1 extends State {
  constructor(){
    super();
    prev_time = millis();
    this.count = 0;
  }
  drawState(){
    //super.doState();
    text("１秒ごとにマウスをクリックしてくださいね〜その調子その調子", 30, 30);
    //text("その調子その調子", 30, 240);
    // if(this.count > 0){
    //   text("count: "+this.count+" time: "+time[this.count-1], 240, 240);
    // }
  }
  domousePressed(){
    const now = millis();
    time[this.count] = (now - prev_time)/1000;
    this.count++;
    prev_time = millis();
  }
  decideState(){
    if (time_count > 5) { // if ellapsed time is larger than
      time[this.count] = abs(5.00 - prev_time)/1000;
      return new TitleState_2(); 
    } 
    return this;
  }
}

/////State3/////////////////////////////
//Title_2
class TitleState_2 extends State {
  constructor(){
    super();
    this.clicked = false;
  }
  drawState(){
    //super.doState();
    text("お疲れさまでした", 30, 210);
    text("それでは今度はアニメーションを見ながら", 30, 240);
    text("１秒ごとにマウスをクリックしてみてください", 30, 270);
    text("それではマウスをクリックしてよーいスタート！", 30, 300);
  }
  domousePressed(){
    this.clicked = true;
  }
  decideState() {
    if (this.clicked) {
      return new ClickState2(); //new ClickState1();
    }
    return this;
  }
}

/////State4/////////////////////////////
//アニメーション見ながらクリック
class ClickState2 extends State {
  constructor() {
    super();
    prev_time = millis();
    this.count = 0;
  }
  drawState() {
    text("１秒ごとにマウスをクリックしてくださいね〜その調子その調子", 30, 30);
    // if (this.count > 0) {
    //   text("count: " + this.count + " time: " + timewitha[this.count - 1], width * 0.5, height * 0.7);
    // }
    animation.loop();
    image(animation, 0, 30);
  }
  domousePressed() {
    const now = millis();
    timewitha[this.count] = (now - prev_time) / 1000;
    this.count++;
    prev_time = millis();
  }
  decideState() {
    if (time_count > 5) { // if ellapsed time is larger than
      timewitha[this.count] = abs(5.00 - prev_time) / 1000;
      return new TitleState_3(); 
    }
    return this;
  }
}

/////State5/////////////////////////////
//Title_3
class TitleState_3 extends State {
  constructor(){
    super();
    this.clicked = false;
  }
  drawState(){
    //super.doState();
    text("お疲れさまでした", 30, 210);
    text("最後に刻んだ最初の１秒，アニメーションを見ながらの１秒，正確な１秒を見比べてみましょう", 30, 240);
    text("それではマウスをクリックしてレッツゴー => ", 30, 270);
  }
  domousePressed(){
    this.clicked = true;
  }
  decideState() {
    if (this.clicked) {
      return new AnimationState(); //new ClickState1();
    }
    return this;
  }
}


/////State6/////////////////////////////
//くらべ〜る
class AnimationState extends State {
  constructor(){
    super();
    this.sum_time = time[0];
    this.sum_timewitha = timewitha[0];
    this.count = 0;
    this.countwitha = 0;
  }
  drawState() {
    text(" timeCount : "+this.count, width * 0.5, height * 0.6);
    text(" time: "+time[this.count], width * 0.5, height * 0.7);
    text(" timeCountwitha : "+this.countwitha, width * 0.5, height * 0.9);
    text(" timewitha: "+timewitha[this.countwitha], width * 0.5, height * 1.0);
    //text("Animation (for 40 seconds)", width * 0.5, height * 0.5);
    //this.playSpeed = abs(time[count]);
    //animation.loop();
    //animation.speed(this.playSpeed);
    //image(animation, 0, 0, width, height);
    if(time_count > this.sum_time) {
      this.sum_time += time[this.count];
      this.count++;
    }
    if(time_count > this.sum_timewitha){
      this.sum_timewitha += timewitha[this.countwitha];
      this.countwitha++;
    }
  }
  domousePressed() {
  }
  decideState() {
    if (time_count > 5) { // if ellapsed time is larger than
      return new EndingState(); // go to ending
    }
    return this;
  }
}

/////State5/////////////////////////////
//最後
class EndingState extends State {
  drawState() {
    text("１秒，正確に刻めていましたか？", 30, 210);
    text("時間の伸縮を感じていただけたら幸いです", 30, 240);
    // if (time_count > 3) {
    //   text("Press 'a' to restart.", width * 0.5, height * 0.7);
    // }
  }
  domousePressed() {}
  decideState() {
    if (count_time > 3 && keyPressed && key == 'a') {
      return new EndingState();
    }
    return this;
  }
}
