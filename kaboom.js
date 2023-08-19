kaboom()

// Speed identifiers
const MOVE_SPEED = 120
const JUMP_FORCE = 360
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
let CURRENT_MOVE_SPEED = MOVE_SPEED
const FALL_DEATH = 400
const ENEMY_SPEED = 20

// logic variables
let isJumping = true
let isInvincible = false

// sprites from assets
// loadAseprite('mario', 'assets/images/Mario.png', 'assets/images/Mario.json')
loadSprite('background', '/assets/images/background.png')
loadSprite('turtle', 'assets/images/turtle.png')
loadSprite('star', 'assets/images/starsprite.png') // temp star sprite
loadSprite('background1', '/assets/images/background.png')
loadSprite('background2', '/assets/images/background2.png')
loadSprite('background3', '/assets/images/background3.png')
loadSprite('turtle', 'assets/images/turtle.png')

// sprites from imgur
loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('mario', 'Wb1qfhK.png')
loadSprite('mushroom', '0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')
loadSprite('blue-block', 'fVscIbn.png')
loadSprite('blue-brick', '3e5YRQd.png')
loadSprite('blue-steel', 'gqVoI2b.png')
loadSprite('blue-evil-shroom', 'SvV4ueD.png')
loadSprite('blue-surprise', 'RMqCc1G.png')


scene('game', ({ level, score }) => {
    setGravity(1600);
    const maps = [
        [
            '                                                                                                     ',
            '                                                                                                     ',
            '                                                                                                     ',
            '                                                                                                     ',
            '                                                                                                     ',
            '    %   ==*=%=                        %=*=%=                                                        % ',
            '                                                                                                     ',
            '                            -+                                     -+                         -+     ',
            '            ^        ^   ^  ()   ^                         ^    ^  ()                         ()     ',
            '=================  ==========================  ======  ==================   =============== =========',
        ],
        [
            '£                                                                                                      £',
            '£                                                                                                      £',
            '£                                                                                                      £',
            '£                                                                                                      £',
            '£                                                                                                      £',
            '£  @@@@@@   =*=%=            x x                                     @@@=*=%=                          £',
            '£                          x x x     =*=%=                                                             £',
            '£                        x x x x  x                                                                 -+ £',
            '£            &     & z  x x x x x  x                      &   &            &  z       &           & () £',
            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  !!!!  !!!!!!!!!!!!! !!!!!!!!!!!!!!!!!!!!    !!!!!!!!!!!!',
        ],
        /* level by q 
        /* level by q
    problems: evil shrooms don't fall; evil shrooms should move back and forth
    requires: mushroom to also increase jump force
    requires: finish line to go to next lvl*/
        [
            '                                                                                                                    ',
            '                                                  *                           $$$$$$                                ',
            '                                                                            ===========                             ',
            '                                               =======                                                              ',
            '                 $$$                                                                                                ',
            '               =======                                   %%%%%         ^                                            ',
            '                                                                 =======                           ^                ',
            '          ====          =%%%%%=                                =========        *         ==========                ',
            '                                            ^                ===========                               $$           ',
            '=========         ^             ^        ======            =============                             ======         ',
            '           ========  ====================      ======  ==================   =====                            =======',
        ],
        // level design by james
        [
            '!                                                                                                                   ',
            '!                                                                                                    $              ',
            '!                                                                                                ==  =              ',
            '!                                                                  $$$                       ==                     ',
            '!                      ^                                          }}}}}     *%%                          !  !       ',
            '!                   =*===                                                                 $              !$$!       ',
            '!               $                                              }         =======          x              !$$!       ',
            '!              &x                   xx                      }                            xxx             !$$!       ',
            '!             $xxx$     ===   %%%   ()               =%%=                               xxxxx&           !  !       ',
            '!            $xxxxx$                ()xx                              x                xxxxxxx                  -+  ',
            '!            xxxxxxx                ()()             ^ ^             xxx        &     xxxxxxxxx                 ()  ',
            '==========================    ==============================         ===============================================',
        ],
    ]
    
    const levelCfg = {
        // define the size of tile block
        tileWidth: 16,
        tileHeight: 16,
        // define what each symbol means by a function returning a component list that will be passed to add()
        tiles: {
            '=': () => [
                sprite('block'),
                area(),
                pos(),
                body({ isStatic: true })
            ],
            '$': () => [
                sprite('coin'),
                area(),
                'coin'
            ],
            '%': () => [
                sprite('surprise'),
                area(),
                pos(),
                body({ isStatic: true }),
                'coin-surprise'
            ],
            '*': () => [
                sprite('surprise'),
                area(),
                pos(),
                body({ isStatic: true }),
                'mushroom-surprise'
            ],
            '<': () => [
                sprite('surprise'),
                area(),
                pos(),
                body({ isStatic: true }),
                'star-surprise'
            ],
            '}': () => [
                sprite('unboxed'),
                area(),
                pos(),
                body({ isStatic: true }),
            ],
            '(': () => [
                sprite('pipe-bottom-left'),
                area(),
                pos(),
                body({ isStatic: true }),
                scale(0.5)
            ],
            ')': () => [
                sprite('pipe-bottom-right'),
                area(),
                pos(),
                body({ isStatic: true }),
                scale(0.5)
            ],
            '-': () => [
                sprite('pipe-top-left'),
                area(),
                pos(),
                body({ isStatic: true }),
                scale(0.5),
                'pipe'
            ],
            '+': () => [
                sprite('pipe-top-right'),
                area(),
                pos(),
                body({ isStatic: true }),
                scale(0.5),
                'pipe'
            ],
            '^': () => [
                sprite('evil-shroom'),
                area(),
                pos(),
                body(),
                'dangerous'
            ],
            '#': () => [
                sprite('mushroom'),
                area(),
                pos(),
                body(),
                'mushroom'
            ],
            '!': () => [
                sprite('blue-block'),
                area(),
                pos(),
                body({ isStatic: true }),
                scale(0.5)
            ],
            '£': () => [
                sprite('blue-brick'),
                area(),
                pos(),
                body({ isStatic: true }),
                scale(0.5)
            ],
            'z': () => [
                sprite('blue-evil-shroom'),
                area(),
                pos(),
                body(),
                scale(0.5),
                'dangerous'],
            '@': () => [
                sprite('blue-surprise'),
                area(),
                pos(),
                body({ isStatic: true }),
                scale(0.5),
                'coin-surprise'
            ],
            'x': () => [
                sprite('blue-steel'),
                area(),
                pos(),
                body({ isStatic: true }),
                scale(0.5)
            ],
            '&': () => [
                sprite('turtle'),
                area(),
                pos(),
                body(),
                'turtle',
                'dangerous'
            ],
            '>': () => [
                sprite('star'),
                area(),
                pos(),
                body(),
                'star'
            ],
        }
    };
    const gameLevel = addLevel(maps[0], levelCfg);

    // game labels
    const scoreLabel = add([
        text(score),
        pos(30, 6),
        {
            value: score,
        }
    ])

    add([text('level ' + parseInt(level + 1)), pos(40, 6)])

    // add player
    const player = add([
        sprite('mario'),
        area(),
        pos(30, 0),
        body(),
        // big(),
        // star(),
        anchor('bot'),
    ])

    //game logic
    // player controls and logic
    onKeyDown('right', () => {
        player.move(CURRENT_MOVE_SPEED, 0)
        // player.flipX(true)
    })

    onKeyDown('left', () => {
        player.move(-CURRENT_MOVE_SPEED, 0)
        // player.flipX(false)
    })

    onKeyPress('space', () => {
        if (player.grounded()) {
            isJumping = true
            player.jump(CURRENT_JUMP_FORCE)
        }
    })

    // player.onUpdate(() => {
    //     if (player.grounded()) {
    //         isJumping = false
    //     }
    // })

})
go('game', { level: 0, score: 0 });