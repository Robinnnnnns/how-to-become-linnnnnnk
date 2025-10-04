const totalAchievements = 9; // ✅ 你可以根据实际成就数量改
let unlockedAchievements = [];

function unlockAchievement(name) {
  // ✅ 如果重复解锁，不再添加
  if (unlockedAchievements.includes(name)) return;
  unlockedAchievements.push(name);

  const box = document.getElementById('achievement-box');
  const list = document.getElementById('achievement-items');
  const count = document.getElementById('achievement-count');

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



let maps = [];
let currentMap = 0;
let tileSize = 50;
let player = {x: 10, y: 5};
let dialogText = "";
let playerImg;
let firstStep = false;



//sound and image
let talkSound;

function preload() {
  talkSound = loadSound('assets/kookaburra.wav');  
  playerImg = loadImage('assets/player.png');  
  npc1Img = loadImage('assets/stone.png');
  wallImg = loadImage('assets/wall.gif');
  treeImg = loadImage('assets/stump.gif');
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
}

function draw() {
  background(220, 210, 200, 180);
  drawMap(maps[currentMap]);

  // 玩家
 imageMode(CENTER); // 图片中心对齐，角色会居中更自然
 image(playerImg, player.x * tileSize + tileSize / 2, player.y * tileSize + tileSize / 2, tileSize, tileSize)

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
  let nx = player.x;
  let ny = player.y;
  if (keyCode === LEFT_ARROW) nx--;
  if (keyCode === RIGHT_ARROW) nx++;
  if (keyCode === UP_ARROW) ny--;
  if (keyCode === DOWN_ARROW) ny++;

  let map = maps[currentMap];
  let tile = map[ny][nx];
  if (tile !== "#" && tile !== "T") {
  player.x = nx;
  player.y = ny;
}


  // 交互：遇到N
 if (player.y - 1 >= 0) {
  if (map[player.y - 1][player.x] === "N") {
    dialogText = "O mighty administrator, grant me the wisdom to walk the path of a true hero.";
    
    if (talkSound.isLoaded()) {
    talkSound.play();

    unlockAchievement("Press ‘E’ to Interact")
  }
  
    let row = map[player.y - 1].split("");
    row[player.x] = "<";
    map[player.y - 1] = row.join("");
  }
  if (tile !== "#" && tile !== "T") {
  // ✅ 检测第一次移动
  if (!firstStep) {
    firstStep = true;
    unlockAchievement("A Journey Begins");
  }
  player.x = nx;
  player.y = ny;
}
}



  // 传送门
  if (map[player.y][player.x] === ">") {
    currentMap = 1;
    player = {x: 2, y: 2};
  }
  if (map[player.y][player.x] === "<") {
    currentMap = 0;
    player = {x: 2, y: 6};
  }
}



