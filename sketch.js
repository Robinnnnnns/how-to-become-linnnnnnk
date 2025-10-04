let maps = [];
let currentMap = 0;
let tileSize = 50;
let player = {x: 10, y: 2};
let dialogText = "";
let playerImg;


//sound and image
let talkSound;

function preload() {
  talkSound = loadSound('assets/kookaburra.wav');  
  playerImg = loadImage('assets/player.png');  
  npc1Img = loadImage('assets/npc.png');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  maps[0] = [
    "#########.N.########",
    "#..................#",
    "#..................#",
    "#..................#",
    "#..................#",
    "#..................#",
    "....................",
    "....................",
    "....................",
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
    "..............................",
    "..............................",
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
    "..............................",
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
  fill(0, 150);                // 半透明黑背景
  rect(20, height - 120, width - 40, 100, 12);

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
      if (ch === "#") {
        fill(100);
        rect(x*tileSize, y*tileSize, tileSize, tileSize);
      } else if (ch === "N") {
        fill(0,200,0);
        rect(x*tileSize, y*tileSize, tileSize, tileSize);
      } else if (ch === ">" || ch === "<") {
        fill(0,0,200);
        rect(x*tileSize, y*tileSize, tileSize, tileSize);
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
  if (tile !== "#") {
    player.x = nx;
    player.y = ny;
  }

  // 交互：遇到N
 if (player.y - 1 >= 0) {
  if (map[player.y - 1][player.x] === "N") {
    dialogText = "O mighty administrator, grant me the wisdom to walk the path of a true hero.";
    
    if (talkSound.isLoaded()) {
    talkSound.play();
  }
  
    let row = map[player.y - 1].split("");
    row[player.x] = "<";
    map[player.y - 1] = row.join("");
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

