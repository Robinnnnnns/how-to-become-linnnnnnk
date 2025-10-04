let maps = [];
let currentMap = 0;
let tileSize = 40;
let player = {x: 2, y: 2};

function setup() {
  createCanvas(windowWidth, windowHeight);

  maps[0] = [
    "##########...#################",
    "#............................#",
    "#....N.......................#",
    "#.............................",
    "#.............................",
    "#.............................",
    ".............................#",
    ".....>.......................#",
    ".....>.......................#",
    "#....>.......................#",
    "#....>.......................#",
    "#....>.......................#",
    "#....>.......................#",
    "#....>.......................#",
    "#############...##############"
  ];

  maps[1] = [
    "##########",
    "#........#",
    "#....<...#",
    "#........#",
    "#....N...#",
    "#........#",
    "#........#",
    "#........#",
    "##########"
  ];

  maps[2] = [
    "##########",
    "#........#",
    "#....N...#",
    "#........#",
    "#........#",
    "#........#",
    "#........#",
    "#........#",
    "##########"
  ];
}

function draw() {
  background(220);
  drawMap(maps[currentMap]);

  // 玩家
  fill(255,0,0);
  rect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
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
  if (key === ' ') {
    if (map[player.y][player.x] === "N") {
      alert("你和NPC对话了！");
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
