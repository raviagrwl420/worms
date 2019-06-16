window.onload = function () {
    // Setup paper once the DOM is ready
    let canvas = document.getElementById('gameCanvas');
    paper.setup(canvas);

    // Create game and start game loop
    let game = new Game();
    game.startLoop();
};
