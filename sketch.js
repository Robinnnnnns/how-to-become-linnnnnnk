const totalAchievements = 9; // ✅ 你可以根据实际成就数量改
let unlockedAchievements = [];

let teleportLock = false; // 防抖，避免同帧/连续传送
let firstTeleportUnlocked = false; // 全局变量
let firstBesideE = false; // 全局标记，只触发一次
let overlayUntil = 0; // 毫秒时间戳：在此时间前显示遮盖


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
const FRAME_INTERVAL = 5; // 每隔多少帧切一次图（数值越小越快）
// 玩家（网格 + 像素 + 运动状态）
let player = {
  gx: 10, gy: 5,          // 当前所在格
  px: 10 * tileSize,      // 当前像素位置
  py: 5  * tileSize,
  dir: 'down',
  moving: false,
  startPX: 0, startPY: 0, // 本次移动起点像素
  targetPX: 0, targetPY: 0
};



//sound and image
let talkSound;
let achievementSound;
let interactSound;

let playerImg;
let npc1Img;
let wallImg;
let treeImg;
let bushImg;
let fenceImg;
let fenceImg1;
let chicImg;
let seaImg;
let seaImg1;
let beachImg;
let beachImg1;
let shellImg;
let appleImg;
let coopImg;
let wellImg;
let flowerImg;
let ghostImg;
let swordImg;


let firstpage;
let stonewalk1;
let stonewalk2;
let flowerwalk1;
let flowerwalk2;





function preload() {
  talkSound = loadSound('assets/achievement.mp3');  
  achievementSound = loadSound('assets/interaction.mp3');
  interactSound = loadSound('assets/interaction.mp3');
  npc1Img = loadImage('assets/stone.gif');
  wallImg = loadImage('assets/wall.gif');
  treeImg = loadImage('assets/stump.gif');
  bushImg = loadImage('assets/bush.gif');
  fenceImg = loadImage('assets/fence.gif');
  fenceImg1 = loadImage('assets/fence1.gif');
  chicImg = loadImage('assets/chicken.gif');
  seaImg = loadImage('assets/sea.gif');
  seaImg1 = loadImage('assets/sea1.gif');
  beachImg = loadImage('assets/beach.gif');
  beachImg1 = loadImage('assets/beach1.gif');
  shellImg = loadImage('assets/shell.gif');
  appleImg = loadImage('assets/apple.gif');
  coopImg = loadImage('assets/coop.gif');
  wellImg = loadImage('assets/well.gif');
  flowerImg = loadImage('assets/flower.gif');
  ghostImg = loadImage('assets/ghost.gif');
  swordImg = loadImage('assets/sword.gif');


  firstpage = loadImage('assets/firstpage.gif');
  stonewalk1 = loadImage('assets/stonewalk1.gif');
  stonewalk2 = loadImage('assets/stonewalk2.gif');
  flowerwalk1 = loadImage('assets/flowerwalk1.gif');
  flowerwalk2 = loadImage('assets/flowerwalk2.gif');

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
    
    "----------N---------",
    "1BBBBBBBB.@.BBBBBBB1",
    "1PCC......@.....CTT1",
    "1.........@B..C....1",
    "1P.C.B...T@.....TTT1",
    "<@@@@@@@@@@@@@@@@@@>",
    "1C........@.CBBBBBB1",
    "1TW.......@..TRRRRR1",
    "1BTBBBBBBB@.WTRRRRR1",
    "----------!---------",
  ];

  maps[1] = [//> mountain
    "BBBBBBBBBBBBBBBBBBBB",
    "B......%.......%...B",
    "B.BB.BBB.B..BB.BBB.B",
    "B.%..B...B...B.%...B",
    "....BBB.BBB.BBB....B",
    "B...B.%..B.....B...B",
    "B.BBBBB.BBB.BB.BB%.B",
    "B.%..B......B..%...B",
    "B....BBB.B%.BB.B...B",
    "BBBBBBBBBBBBBBBBBBBB",
  ];

  maps[2] = [//< beach
    "SSSE***.X&..*..&&..O",
    "SSSE.X..&&&..X.....O",
    "SSSE&&..X...&...*..O",
    "SSSEX..*.*...&...*.O",
    "SSSSE&&.&&....*&*..O",
    "SSSSE*&**...&...*&*O",
    "SSSSSSSSE&*..X.....O",
    "SSSSSSSSSSE*&&*X...O",
    "SSSSSSSSSSSSSSE&**.O",
    "SSSSSSSSSSSSSSSSSSEO",
  ];

  maps[3] = [//^ forest
    "####################",
    "####################",
    "#TTTTTTTTTGTTTTTTTT#",
    "#TTTTTT.......TTTTT#",
    "#BBBBBA.......BBBBB#",
    "#BBBBBBB.....BBBBBB#",
    "#RRRRRRB.....BRRRRR#",
    "#RRRRRRB.....BRRRRR#",
    "#RRRRRRB.....BRRRRR#",
    "##########O#########",
  ];
  maps[4] = [//! grasslandmaze
    "BBBBBBBBBB.BBBBBBBBB",
    "BDL.L.BLLL.LL.LL#.DB",
    "B.TTT.B.BBBBBBBBLL.B",
    "B.TF..BL.LLL.LB.DBBB",
    "B.TTT..LTTTTT.BD.B.B",
    "BL..L.B.LL.T.LL..L.B",
    "BBBBBBBBBB.TTTTTTT.B",
    "BDD#DDB.L.LBLLDDDBLB",
    "BDBBBBB.BBBBBBBBBB.B",
    "BDDDDDD#DDDDDDDDDOOB",
    

  ];

   // 初始化像素目标
  player.startPX = player.px;
  player.startPY = player.py;
  player.targetPX = player.px;
  player.targetPY = player.py;

  frameIndex = 1;  // 静止帧

}

function draw() {
  //background颜色
  if (currentMap === 0) {
    background(220, 210, 200); // 
  } 
  else if (currentMap === 1) {
    background(190, 187, 180); // grey
  } 
  else if (currentMap === 2) {
    background(255, 207, 110); // yellow
  }
  else if (currentMap === 3) {
    background(215, 250, 160); // green
  }
  else if (currentMap === 4) {
    background(70, 229, 23); // green
  }

  drawMap(maps[currentMap]);
   // ========= 更新移动插值（每帧推进）=========
  const MOVE_SPEED = 0.3; // 0~1，越大越快（单步插值速度）
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
  if (abs(player.px - player.targetPX) < 0.5 && abs(player.py - player.targetPY) < 0.5) {
  player.px = player.targetPX;
  player.py = player.targetPY;
  player.moving = false;
  frameIndex = 1;

  // ✅ 到达网格中心后立刻检查是否传送
  checkTeleport();
} else {
  // 移动中更新动画帧...
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
  rect(20, height - 100, width - 40, 100, 12);

  noStroke();  
  

  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text(dialogText, 40, height - 90, width - 80, 90); 
}
  //
  handleContinuousMove();
  //
  checkBeside();
  //
  if (millis() < overlayUntil && firstpage) {
    push();
    imageMode(CENTER);
                   // 半透明覆盖，可删
    image(firstpage, width/2, height/2, 220, 220); // 居中 220×220
    pop();
  }

  
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
      } 
       else if (ch === "#") {
        imageMode(CENTER);
        image(treeImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } else if (ch === "B") {
        imageMode(CENTER);
        image(bushImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "-") {
        imageMode(CENTER);
        image(fenceImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "1") {
        imageMode(CENTER);
        image(fenceImg1, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "S") {
        imageMode(CENTER);
        image(seaImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "E") {
        imageMode(CENTER);
        image(seaImg1, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "&") {
        imageMode(CENTER);
        image(beachImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "*") {
        imageMode(CENTER);
        image(beachImg1, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "X") {
        imageMode(CENTER);
        image(shellImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "G") {
        imageMode(CENTER);
        image(npc1Img, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "A") {
        imageMode(CENTER);
        image(appleImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "C") {
        imageMode(CENTER);
        image(chicImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "P") {
        imageMode(CENTER);
        image(coopImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
       else if (ch === "W") {
        imageMode(CENTER);
        image(wellImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
       else if (ch === "F") {
        imageMode(CENTER);
        image(flowerImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "%") {
        imageMode(CENTER);
        image(ghostImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "&") {
        imageMode(CENTER);
        image(swordImg, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "@") {
        imageMode(CENTER);
        image(stonewalk1, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
       else if (ch === "$") {
        imageMode(CENTER);
        image(stonewalk2, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "D") {
        imageMode(CENTER);
        image(flowerwalk1, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "L") {
        imageMode(CENTER);
        image(flowerwalk2, x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize);
      } 
      else if (ch === "R") {
        noStroke();//这里开始没有描边
        fill(64, 164, 223);
        rect(x * tileSize, y * tileSize, tileSize, tileSize,5);
      } 
      else if (ch === ">" || ch === "<"|| ch === "^"|| ch === "!"|| ch === "O") {
        noFill();
        rect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
      }
  }
}

function keyPressed() {//暂时没有
 

  
  

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
  const blocked = (tile === "#" || tile === "T"|| tile === "B"|| tile === "R"|| tile === "1"|| tile === "-"|| tile === "E"|| tile === "X"|| tile === "N"|| tile === "G"|| tile === "A"|| tile === "C"|| tile === "P"|| tile === "W"|| tile === "F");//防撞
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
      unlockAchievement("Learning to Walk");
    }
  }
}

function checkTeleport() {
  if (teleportLock) return;

  const map = maps[currentMap];
  const tile = map[player.gy][player.gx];

  // 一个小帮助函数
  const doTeleport = (toMap, gx, gy) => {
    currentMap = toMap;
    player.gx = gx;
    player.gy = gy;
    player.px = gx * tileSize;
    player.py = gy * tileSize;
    player.targetPX = player.px;
    player.targetPY = player.py;
    player.moving = false;
    frameIndex = 1;

    // ✅ 第一次传送时解锁成就
    if (!firstTeleportUnlocked) {
      unlockAchievement("Leaving Home");
      firstTeleportUnlocked = true;
      
    }
    

    // 开个很短的锁，避免刚落地又被重复检测到
    teleportLock = true;
    setTimeout(() => teleportLock = false, 120);
  };
  

  if (tile === ">") doTeleport(1, 1, 5);
  else if (tile === "<") doTeleport(2, 18, 5);
  else if (tile === "^") doTeleport(3, 10, 8);
  else if (tile === "!") doTeleport(4, 10, 0);
  else if (tile === "O") doTeleport(0, 10, 5);
}

function mousePressed() {
  const map = maps[currentMap];
  
  // 鼠标坐标转为网格坐标
  const tx = floor(mouseX / tileSize);
  const ty = floor(mouseY / tileSize);

  // 边界保护
  if (ty < 0 || ty >= map.length || tx < 0 || tx >= map[0].length) return;

  // 检测点击的格子是不是 X
  if (map[ty][tx] === "X") {
    // 检查玩家是否在 X 的上下左右一格
    const adjacent =
      (player.gx === tx && abs(player.gy - ty) === 1) ||
      (player.gy === ty && abs(player.gx - tx) === 1);

    if (adjacent) {
      // ✅ 播放音效
      if (interactSound && interactSound.isLoaded()) interactSound.play();

      // ✅ 解锁成就
      unlockAchievement("I got a shell!");

      // ✅ （可选）改变地图上该 X 的外观，例如让它消失或变成别的符号
      const row = map[ty].split("");
      row[tx] = ".";
      map[ty] = row.join("");
    }
  }
  // 检测点击的格子是不是 A
  if (map[ty][tx] === "A") {
    // 检查玩家是否在 X 的上下左右一格
    const adjacent =
      (player.gx === tx && abs(player.gy - ty) === 1) ||
      (player.gy === ty && abs(player.gx - tx) === 1);

    if (adjacent) {
      // ✅ 播放音效
      if (interactSound && interactSound.isLoaded()) interactSound.play();

      // ✅ 解锁成就
      unlockAchievement("???");

      // ✅ （可选）改变地图上该 X 的外观，例如让它消失或变成别的符号
      const row = map[ty].split("");
      row[tx] = ".";
      map[ty] = row.join("");
    }
  }

  // 检测点击的格子是不是 C
  if (map[ty][tx] === "C") {
    // 检查玩家是否在 C 的上下左右一格
    const adjacent =
      (player.gx === tx && abs(player.gy - ty) === 1) ||
      (player.gy === ty && abs(player.gx - tx) === 1);

    if (adjacent) {
      // ✅ 播放音效
      if (interactSound && interactSound.isLoaded()) interactSound.play();

      // ✅ 解锁成就
      overlayUntil = millis() + 1000;
      unlockAchievement("Hero of the Coop");
  
      
    }
  }
  // 检测点击的格子是不是 f
  if (map[ty][tx] === "F") {
    // 检查玩家是否在 X 的上下左右一格
    const adjacent =
      (player.gx === tx && abs(player.gy - ty) === 1) ||
      (player.gy === ty && abs(player.gx - tx) === 1);

    if (adjacent) {
      // ✅ 播放音效
      if (interactSound && interactSound.isLoaded()) interactSound.play();

      // ✅ 解锁成就
      unlockAchievement("Picked a Tiny Blossom");

      // ✅ （可选）改变地图上该 X 的外观，例如让它消失或变成别的符号
      const row = map[ty].split("");
      row[tx] = ".";
      map[ty] = row.join("");
    }
  }

  if (map[ty][tx] === "N") {
    // 检查玩家是否在 n 的上下左右一格
    const adjacent =
      (player.gx === tx && abs(player.gy - ty) === 1) ||
      (player.gy === ty && abs(player.gx - tx) === 1);

    if (adjacent) {
      // ✅ 播放音效
      if (talkSound && talkSound.isLoaded()) talkSound.play();

      // ✅ 解锁成就
      dialogText = "O mighty administrator, grant me the wisdom to walk the path of a true hero.";
      unlockAchievement("Press ‘E’ to Interact?");

      // ✅ （可选）改变地图上的外观，例如让它消失或变成别的符号
      const row = map[ty].split("");
      row[tx] = "^";
      map[ty] = row.join("");
      setTimeout(() => {
    dialogText = "";
  }, 3000);
    }
  } 
  if (map[ty][tx] === "G") {
    // 检查玩家是否在g的上下左右一格
    const adjacent =
      (player.gx === tx && abs(player.gy - ty) === 1) ||
      (player.gy === ty && abs(player.gx - tx) === 1);

    if (adjacent) {
      // ✅ 播放音效
      if (talkSound && talkSound.isLoaded()) talkSound.play();

      // ✅ 解锁成就
      dialogText = "Find the nine, and your path shall be revealed.";
      
      setTimeout(() => {
    dialogText = "";
  }, 3000);
    }
    
  
  }
}

function checkBeside() {
  if (firstBesideE) return; // 已经触发过则不再执行

  const map = maps[currentMap];
  const x = player.gx;
  const y = player.gy;

  // 检查玩家格是否是 E
  if (x + 1 < map[0].length && map[y][x - 1] === 'E') {
    unlockAchievement("Sea Gazer");
    firstBesideE = true; // ✅ 标记已触发
  }
}