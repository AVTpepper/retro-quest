kaboom()
loadRoot('assets/images/')
loadSprite('brick', 'brick.png')
scene('game', () => {
    setGravity(1600);
    const maps = [
        [
            '            ',
            '            ',
            '            ',
            '            ',
            '            ',
            '            ',
            '            ',
            '------------',
        ]
    ];
    const levelCfg = {
        // define the size of tile block
        tileWidth: 16,
        tileHeight: 16,
        // define what each symbol means by a function returning a component list that will be passed to add()
        tiles: {
            '-': () => [
                sprite('brick'),
                area(),
                body({ isStatic: true })
            ]
        }
    };
    const gameLevel = addLevel(maps[0], levelCfg);
})
go('game');