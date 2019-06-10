// Setup paper once the DOM is ready.
window.onload = function () {
    var canvas = document.getElementById('gameCanvas')
    paper.setup(canvas);

    game = new Game();
    game.startLoop();
};
