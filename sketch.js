const totalAchievements = 9; // ✅ 你可以根据实际成就数量改
let unlockedAchievements = [];




let maps = [];
let currentMap = 0;
let tileSize = 50;
let dialogText = "";
let firstStep = false;
//anime
let anim = {
  up: [], down: [], left: [], right: []
};
let frameIndex = 1;      // 0/1/2
let frameTimer = 0;      // 计时器
const FRAME_INTERVAL = 7; // 每隔多少帧切一次图（数值越小越快）
// 玩家（网格 + 像素 + 运动状态）
let player = {
  gx: 10, gy: 5,          // 当前所在格
  px: 10 * tileSize,      // 当前像素位置
  py: 2  * tileSize,
  dir: 'down',
  moving: false,
  startPX: 0, startPY: 0, // 本次移动起点像素
  targetPX: 0, targetPY: 0
};



//sound and image
let talkSound;
let playerImg;
let npc1Img;
let wallImg;
let treeImg;
let achievementSound;

function preload() {
  talkSound = loadSound('assets/achievement.mp3');  
  achievementSound = loadSound('assets/talking.mp3');
  npc1Img = loadImage('assets/stone.png');
  wallImg = loadImage('assets/wall.gif');
  treeImg = loadImage('assets/stump.gif');

  // ========= 加载每方向 3 帧图 =========
  anim.down[0]  = loadImage('assets/player_down_0.gif');
  anim.down[1]  = loadImage('assets/player_down_1.gif');
  anim.down[2]  = loadImage('assets/player_down_2.gif');

  anim.up[0]    = loadImage('assets/player_up_0.gif');
  anim.up[1]    = loadImage('assets/player_up_1.gif');
  anim.up[2]    = loadImage('assets/player_up_2.gif');

  anim.left[0]  = loadImage('assets/player_left_0.gif');
  anim.left[1]  = loadImage('assets/player_left_1.gif');
  anim.left[2]  = loadImage('assets/player_left_2.gif');

  anim.right[0] = loadImage('assets/player_right_0.gif');
  anim.right[1] = loadImage('assets/player_right_1.gif');
  anim.right[2] = loadImage('assets/player_right_2.gif');

}


function setup() {
  createCanvas(1000, 500);
  document.getElementById('achievement-count').textContent = `(0/${totalAchievements})`;

  maps[0] = [
    
    "##########N#########",
    "#..............T...#",
    "#..T...............#",
    "#..................#",
    "................T...",
    "....................",
    "#..................#",
    "#....T.............#",
    "#.............T....#",
    "#########>>>########",
  ];

  maps[1] = [
    "##############################",
    "#............................#",
    "#............................#",
    "#............................#",
    "#...........N................#",
    "#............................#",
    "...........<.................",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#############>>>##############"
  ];

  maps[2] = [
    "##############################",
    "#............................#",
    "#............................#",
    "#............................#",
    "#...........N................#",
    "#............................#",
    "...........<.................",
    "..............................",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#############>>>##############"
  ];
   // 初始化像素目标
  player.startPX = player.px;
  player.startPY = player.py;
  player.targetPX = player.px;
  player.targetPY = player.py;

  frameIndex = 1;  // 静止帧

}

function draw() {
  background(220, 210, 200, 180);
  drawMap(maps[currentMap]);
   // ========= 更新移动插值（每帧推进）=========
  const MOVE_SPEED = 0.2; // 0~1，越大越快（单步插值速度）
  if (player.moving) {
    // 朝目标插值
    player.px = lerp(player.px, player.targetPX, MOVE_SPEED);
    player.py = lerp(player.py, player.targetPY, MOVE_SPEED);

    // 到达判定（接近目标即认为到达）
    if (abs(player.px - player.targetPX) < 0.5 && abs(player.py - player.targetPY) < 0.5) {
      player.px = player.targetPX;
      player.py = player.targetPY;
      player.moving = false;
      frameIndex = 1; // 停下时回到待机帧
    } else {
      // 移动中更新动画帧
      frameTimer++;
      if (frameTimer % FRAME_INTERVAL === 0) {
        frameIndex = (frameIndex + 1) % 3; // 0→1→2 循环
      }
    }
  }

  // ========= 绘制玩家 =========
  imageMode(CENTER);
  const img = anim[player.dir][frameIndex];
  image(img, player.px + tileSize/2, player.py + tileSize/2, tileSize, tileSize);

  



  //对话框
  if (dialogText !== "") {
  stroke('#FDFBF7');           // ✅ 边框颜色
  strokeWeight(1);       // ✅ 边框粗细（单位：像素）
  fill(0, 150);                // 半透明黑背景
  rect(20, height - 120, width - 40, 100, 12);

  noStroke();  
  

  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text(dialogText, 40, height - 110, width - 80, 90); 
}
  handleContinuousMove();
}

function drawMap(map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let ch = map[y][x];
      if (ch === "T") {
        imageMode(CORNER);
        image(wallImg, x * tileSize, y * tileSize, tileSize, tileSize);
      } else if (ch === "N") {
       imageMode(CENTER);
       image(npc1Img, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, tileSize, tileSize);
      } else if (ch === ">" || ch === "<") {
        fill(0,0,200);
        rect(x*tileSize, y*tileSize, tileSize, tileSize);
      }
       else if (ch === "#") {
        imageMode(CENTER);
        image(treeImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
    }
  }
}

function keyPressed() {
  
  // 越界保护
  if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) return;

  const tile = map[ny][nx];
  const blocked = (tile === "#" || tile === "T"); // T: 树桩一类不可通行
  if (!blocked) {
    // 允许移动：更新网格坐标，设置像素目标，启动平滑移动 & 动画
    player.gx = nx;
    player.gy = ny;

    player.startPX = player.px;
    player.startPY = player.py;
    player.targetPX = player.gx * tileSize;
    player.targetPY = player.gy * tileSize;

    player.moving = true;
    // 移动开始时将帧切到 0，显得更有起步感（可选）
    frameIndex = 0;
 


  // 交互：遇到N

 if (player.gy - 1 >= 0 && map[player.gy - 1][player.gx] === "N") {
      dialogText = "O mighty administrator, grant me the wisdom to walk the path of a true hero.";
      if (talkSound && talkSound.isLoaded()) talkSound.play();
      // 把 N 变成 <（你原逻辑）
      const row = map[player.gy - 1].split("");
      row[player.gx] = "<";
      map[player.gy - 1] = row.join("");
    }
  
  
}




  if (tile === ">") {
  currentMap = 1;
  player.gx = 2; 
  player.gy = 2;

  // ✅ 内联对齐
  player.px = player.gx * tileSize;
  player.py = player.gy * tileSize;
  player.targetPX = player.px;
  player.targetPY = player.py;
  player.moving = false;
  frameIndex = 1;
} 
else if (tile === "<") {
  currentMap = 0;
  player.gx = 2; 
  player.gy = 6;

  // ✅ 同样直接对齐
  player.px = player.gx * tileSize;
  player.py = player.gy * tileSize;
  player.targetPX = player.px;
  player.targetPY = player.py;
  player.moving = false;
  frameIndex = 1;

  }
}

function unlockAchievement(name) {
  // ✅ 如果重复解锁，不再添加
  if (unlockedAchievements.includes(name)) return;
  unlockedAchievements.push(name);

  const box = document.getElementById('achievement-box');
  const list = document.getElementById('achievement-items');
  const count = document.getElementById('achievement-count');

   // ✅ 播放成就音效（确保已加载）
  if (achievementSound && achievementSound.isLoaded()) {
    achievementSound.play();
  }

  
  // ✅ 显示弹窗
  box.textContent = `🏆 Achievement Unlocked：${name}`;
  box.classList.add('show');
  setTimeout(() => box.classList.remove('show'), 3000);

  // ✅ 添加到右下角的成就列表
  const li = document.createElement('li');
  li.textContent = `🏆 ${name}`;
  list.appendChild(li);
   // ✅ 更新 (n/9)
  count.textContent = `(${unlockedAchievements.length}/${totalAchievements})`;

}
function handleContinuousMove() {
  // 如果玩家正在移动，就不触发新的移动
  if (player.moving) return;

  let nx = player.gx;
  let ny = player.gy;
  let newDir = player.dir;

  // ✅ 支持方向键和 WASD
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65))  { // 65 = 'A'
    nx--;
    newDir = 'left';
  }
  else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // 68 = 'D'
    nx++;
    newDir = 'right';
  }
  else if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // 87 = 'W'
    ny--;
    newDir = 'up';
  }
  else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // 83 = 'S'
    ny++;
    newDir = 'down';
  }
  else return;

  const map = maps[currentMap];
  if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) return;

  const tile = map[ny][nx];
  const blocked = (tile === "#" || tile === "T");
  player.dir = newDir;

  if (!blocked) {
    player.gx = nx;
    player.gy = ny;
    player.startPX = player.px;
    player.startPY = player.py;
    player.targetPX = player.gx * tileSize;
    player.targetPY = player.gy * tileSize;
    player.moving = true;
    frameIndex = 0;

     // ✅ 这里添加“第一步”检测
    if (!firstStep) {
      firstStep = true;
      unlockAchievement("First Step");
    }
  }
}
