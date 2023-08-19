//IMPORTANT: Make sure to use Kaboom version 0.5.0 for this game by adding the correct script tag in the HTML file.

kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

// Speed identifiers
const MOVE_SPEED = 120;
const JUMP_FORCE = 360;
const BIG_JUMP_FORCE = 550;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
let CURRENT_MOVE_SPEED = MOVE_SPEED;
const FALL_DEATH = 400;
const ENEMY_SPEED = 20;

// Game logic

let isJumping = true;
let isInvincible = false;
let hasFire = false;

// loadAseprite('mario', 'assets/images/Mario.png', 'assets/images/Mario.json')
loadSprite("background", "assets/images/background.png");
loadSprite("background1", "assets/images/background.png");
loadSprite("background2", "assets/images/background2.png");
loadSprite("background3", "assets/images/background3.png");

loadSprite("turtle", "assets/images/turtle.png"); // add turtle
loadSprite("star", "assets/images/starsprite.png"); // temp star sprite
loadSprite("turtle", "assets/images/turtle.png");
loadSprite("fireball", "assets/images/fireball.png");
loadSprite("fireflower", "assets/images/fire-flower.png");

//new enemies
loadSprite("fly-guy", "assets/images/img20x20/fly-guy.png");
loadSprite("goomba", "assets/images/img20x20/goomba.png");
loadSprite("koopa-green", "assets/images/img20x20/koopa-green.png");
loadSprite("shy-guy", "assets/images/img20x20/shy-guy.png");
loadSprite("wild-piranha", "assets/images/img20x20/wild-piranha.png");

//main character
loadRoot("https://i.imgur.com/");
loadSprite("mario", "Wb1qfhK.png");
loadSprite("luigi", "pogC9x5.png");
loadSprite("peach", "KPO3fR9.png");
loadSprite("donkey-kong", "bdrLpi6.png");

loadSprite("coin", "wbKxhcd.png");
loadSprite("evil-shroom", "KPO3fR9.png");
loadSprite("brick", "pogC9x5.png");
loadSprite("block", "M6rwarW.png");
loadSprite("mushroom", "0wMd92p.png");
loadSprite("surprise", "gesQ1KP.png");
loadSprite("unboxed", "bdrLpi6.png");
loadSprite("pipe-top-left", "ReTPiWY.png");
loadSprite("pipe-top-right", "hj2GK4n.png");
loadSprite("pipe-bottom-left", "c1cYSbt.png");
loadSprite("pipe-bottom-right", "nqQ79eI.png");

loadSprite("blue-block", "fVscIbn.png");
loadSprite("blue-brick", "3e5YRQd.png");
loadSprite("blue-steel", "gqVoI2b.png");
loadSprite("blue-evil-shroom", "SvV4ueD.png");
loadSprite("blue-surprise", "RMqCc1G.png");

// selection screen
const characters = ["mario", "luigi", "peach", "donkey-kong"];

scene("characterSelect", () => {
  layers(["bg", "obj", "ui"], "obj");

  add([sprite("background"), layer("bg"), pos(0, 0), scale(1.9, 0.495)]);

  let selectedCharacter = 0;

  function drawCharacters() {
    characters.forEach((character, index) => {
      const position = vec2(40 + index * 80, 100);
      const spriteName = character;
      const isSelected = index === selectedCharacter;
      add([
        sprite(spriteName),
        pos(position),
        scale(isSelected ? 1.5 : 1),
        "character",
        {
          characterName: character,
        },
      ]);
    });
  }

  drawCharacters();

  keyPress("right", () => {
    selectedCharacter = (selectedCharacter + 1) % characters.length;
    destroyAll("character");
    drawCharacters();
  });

  keyPress("left", () => {
    selectedCharacter =
      (selectedCharacter - 1 + characters.length) % characters.length;
    destroyAll("character");
    drawCharacters();
  });

  keyPress("space", () => {
    go("game", {
      character: characters[selectedCharacter],
      level: 0,
      score: 0,
    });
  });
});





scene("game", ({ character, level, score }) => {
  layers(["bg", "obj", "ui"], "obj");

  let backgroundSprite;
  switch (level) {
    case 0:
      backgroundSprite = "background1";
      break;
    case 1:
      backgroundSprite = "background2";
      break;
    case 2:
      backgroundSprite = "background3";
      break;
    default:
      backgroundSprite = "background1";
  }



  const maps = [
    //Test level for new items
    [
      "                                                                                                     ",
      "                                                                                                     ",
      "                                                                                                     ",
      "                                                                                                     ",
      "                                                                                                     ",
      "    %   <=*=%=                        %=*=%=                                                       % ",
      "                     w                                                            w                  ",
      "                            -+                                     -+                         -+     ",
      "             q              ()   e              rr       t     ^  ()                          ()     ",
      "=================  ==========================  ======  ==================   =============== =========",
    ],
    [
      "                                                                                                     ",
      "                                                                                                     ",
      "                                                                                                     ",
      "                                                                                                     ",
      "                                                                                                     ",
      "       <=*=%=                        %=*=%=                                                        % ",
      "    g                                                                                                ",
      "                            -+                                     -+                         -+     ",
      "            ^        ^   ^  ()   ^                         ^    ^  ()                         ()     ",
      "=================  ==========================  ======  ==================   =============== =========",
    ],
    [
      "£                                                                                                      £",
      "£                                                                                                      £",
      "£                                                                                                      £",
      "£                                                                                                      £",
      "£                                                                                                      £",
      "£  @@@@@@   =*=%=            x x                                     @@@=*=%=                          £",
      "£                          x x x     =*=%=                                                             £",
      "£                        x x x x  x                                                                  -+£",
      "£            &     & z  x x x x x  x                      &   &            &  z       &           &  ()£",
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  !!!!  !!!!!!!!!!!!! !!!!!!!!!!!!!!!!!!!!    !!!!!!!!!!! ",
    ],
    /* level by q 
        /* level by q
    problems: evil shrooms don't fall; evil shrooms should move back and forth
    requires: mushroom to also increase jump force
    requires: finish line to go to next lvl*/
    [
      "                                                                                                                    ",
      "                                                  *                           $$$$$$                                ",
      "                                                                            ===========                             ",
      "                                               =======                                                              ",
      "                 $$$                                                                                                ",
      "               =======                                   %%%%%         ^                                            ",
      "                                                                 =======                           ^                ",
      "          ====          =%%%%%=                                =========        *         ==========                ",
      "                                            ^                ===========                               $$       -+  ",
      "=========         ^             ^        ======            =============                             ======     ()  ",
      "           ========  ====================      ======  ==================   =======                          =======",
    ],
    // level design by james
    [
      "!                                                                                                                   ",
      "!                                                                                                    $              ",
      "!                                                                                                ==  =              ",
      "!                                                                  $$$                       ==                     ",
      "!                      ^                                          }}}}}     *%%                          !  !       ",
      "!                   =*===                                                                 $              !$$!       ",
      "!               $                                              }         =======          x              !$$!       ",
      "!              &x                   xx                      }                            xxx             !$$!       ",
      "!             $xxx$     ===   %%%   ()               =%%=                               xxxxx&           !  !       ",
      "!            $xxxxx$                ()xx                              x                xxxxxxx                  -+  ",
      "!            xxxxxxx                ()()             ^ ^             xxx        &     xxxxxxxxx                 ()  ",
      "==========================    ==============================         ===============================================",
    ],
  ];

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
    $: [sprite("coin"), "coin"],
    "%": [sprite("surprise"), solid(), "coin-surprise"],
    "*": [sprite("surprise"), solid(), "mushroom-surprise"],
    "<": [sprite("surprise"), solid(), "star-surprise"],
    g: [sprite("surprise"), solid(), "fire-surprise"],
    "}": [sprite("unboxed"), solid()],
    "(": [sprite("pipe-bottom-left"), solid(), scale(0.5)],
    ")": [sprite("pipe-bottom-right"), solid(), scale(0.5)],
    "-": [sprite("pipe-top-left"), solid(), scale(0.5), "pipe"],
    "+": [sprite("pipe-top-right"), solid(), scale(0.5), "pipe"],
    "^": [sprite("evil-shroom"), solid(), "dangerous"],
    "#": [sprite("mushroom"), solid(), "mushroom", body()],
    "!": [sprite("blue-block"), solid(), scale(0.5)],
    "£": [sprite("blue-brick"), solid(), scale(0.5)],
    z: [sprite("blue-evil-shroom"), solid(), scale(0.5), "dangerous"],
    "@": [sprite("blue-surprise"), solid(), scale(0.5), "coin-surprise"],
    x: [sprite("blue-steel"), solid(), scale(0.5)],
    "&": [sprite("turtle"), "turtle", "dangerous"],
    ">": [sprite("star"), "star"],
    f: [sprite("fireflower"), "fireflower"],
    //new
    q: [sprite("fly-guy"), solid(), "dangerous"],
    w: [sprite("goomba"), solid(), "dangerous"],
    e: [sprite("koopa-green"), solid(), "dangerous"],
    r: [sprite("shy-guy"), solid(), "dangerous"],
    t: [sprite("wild-piranha"), solid(), "dangerous"],
  };

 


  const gameLevel = addLevel(maps[level], levelCfg);

  const scoreLabel = add([
    text(score),
    pos(30, 6),
    layer("ui"),
    {
      value: score,
    },
  ]);

  add([text("level " + parseInt(level + 1)), pos(40, 6)]);

  // power-up functions
  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        CURRENT_JUMP_FORCE = JUMP_FORCE;
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(2);
        timer = time;
        isBig = true;
      },
    };
  }

  function star() {
    let timer = 0;
    return {
      update() {
        if (isInvincible) {
          CURRENT_MOVE_SPEED = MOVE_SPEED * 1.1;
          timer -= dt();
          if (timer <= 0) {
            this.noStar();
          }
        }
      },
      noStar() {
        isInvincible = false;
        CURRENT_MOVE_SPEED = MOVE_SPEED;
        timer = 0;
      },
      starUp(time) {
        timer = time;
        isInvincible = true;
      },
    };
  }

  function spawnFireball(p) {
    const fireball = add([sprite("fireball"), pos(p), "fireball"]);
    fireball.collides("dangerous", (d) => {
      destroy(d);
      destroy(fireball);
    });
    wait(1.5, () => {
      destroy(fireball);
    });
  }

  function firePower() {
    let timer = 0;
    return {
      update() {
        if (hasFire) {
          keyPress("f", () => {
            spawnFireball(player.pos.sub(1, 0));
          });
          action("fireball", (f) => {
            f.move(MOVE_SPEED, 0);
          });
          timer -= dt();
          if (timer <= 0) {
            this.noFire();
          }
        }
      },
      noFire() {
        hasFire = false;
        timer = 0;
      },
      fireUp(time) {
        timer = time;
        hasFire = true;
      },
    };
  }

  const player = add([
    sprite(character),
    solid(),
    pos(30, 0),
    body(),
    big(),
    star(),
    firePower(),
    origin("center"), // Sets the origin to the middle of the sprite
    { scale: { x: 1, y: 1 } },
    // origin(bot)
  ]);

  action("mushroom", (m) => {
    m.move(20, 0);
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("mushroom-surprise")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("star-surprise")) {
      gameLevel.spawn(">", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("fire-surprise")) {
      gameLevel.spawn("f", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
  });

  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify(6);
  });

  player.collides("coin", (c) => {
    destroy(c);
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
  });

  player.collides("star", (s) => {
    destroy(s);
    player.starUp(6);
  });

  player.collides("fireflower", (f) => {
    destroy(f);
    player.fireUp(6);
  });

  action("dangerous", (d) => {
    d.move(-ENEMY_SPEED, 0);
  });

  player.action(() => {
    camPos(player.pos);
    if (player.pos.y >= FALL_DEATH) {
      go("lose", {
        score: scoreLabel.value,
      });
    }
  });

  player.collides("pipe", () => {
    keyPress("down", () => {
      go("game", {
        character: character,
        level: (level + 1) % maps.length,
        score: scoreLabel.value,
      });
    });
  });

  player.collides("dangerous", (d) => {
    if (isJumping || isInvincible) {
      destroy(d);
    } else {
      go("lose", {
        score: scoreLabel.value,
      });
    }
  });

  action("turtle", (t) => {
    t.move(-ENEMY_SPEED, 0);
  });

  keyDown("left", () => {
    player.scale.x = -1; // Flip the sprite horizontally
    player.move(-CURRENT_MOVE_SPEED, 0);
  });

  keyDown("right", () => {
    player.scale.x = 1; // Reset the sprite to its original orientation
    player.move(CURRENT_MOVE_SPEED, 0);
  });

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
      if (keyIsDown("left")) {
        player.move(-CURRENT_MOVE_SPEED, 0);
        player.scale.x = -1; // Flip the sprite horizontally
      } else if (keyIsDown("right")) {
        player.move(CURRENT_MOVE_SPEED, 0);
        player.scale.x = 1; // Reset the sprite to its original orientation
      }
    }
  });

  keyPress("space", () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(CURRENT_JUMP_FORCE);
    }
  });

  // player.action(() => {
  //   if (player.grounded()) {
  //     isJumping = false;
  //   }
  // });
});

scene("lose", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
});

start("characterSelect");

// start("game", { level: 0, score: 0 })
