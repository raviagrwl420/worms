var GAME_STATE = {
    GAME_INIT: 'GAME_INIT',
    GAME_IN_PLAY: 'GAME_IN_PLAY',
    GAME_OVER: 'GAME_OVER'
};

var KEY = {
    LEFT_KEY: 37,
    UP_KEY: 38,
    RIGHT_KEY: 39,
    DOWN_KEY: 40
};

var EVENT = {
    DOWN: 1,
    UP: 2,
    PRESS: 3
};

class Game {
    constructor() {
        this.gameState = GAME_STATE.GAME_INIT;
        this.numPlayers = 1;
        this.numFoods = 20;

        this.startTime = null;
        this.lastTime = null;

        this.worms = [];
        for (var i = 0; i < this.numPlayers; i++) {
            this.worms.push(new Worm(paper.view.center, 180));
        }

        this.foods = [];
        for (var i = 0; i < this.numFoods; i++) {
            this.foods.push(new Food());
        }

        this.addEventListeners();
    }

    update(delta) {
        for (var i in this.worms) {
            for (var f in this.foods) {
                this.foods[f] = this.worms[i].hitTest(this.foods[f]);
            }

            this.worms[i].update(delta);
        }
    }

    render(delta) {
        for (var i in this.worms) {
            this.worms[i].render(delta);
        }
    }

    loop(timestamp) {
        if (!this.startTime) {
            this.startTime = timestamp;
            this.lastTime = timestamp;
        }

        var delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        delta = Math.min(delta / 1000, 0.2);

        this.update(delta);
        this.render(delta);

        window.requestAnimationFrame(this.loop.bind(this));
    }

    startLoop() {
        window.requestAnimationFrame(this.loop.bind(this));
    }

    handleEvent(key, event) {
        for (var i in this.worms) {
            this.worms[i].handleEvent(key, event);
        }
    }

    addEventListeners() {
        var that = this;
        document.addEventListener('keydown', function (event) {
            if (Object.values(KEY).indexOf(event.keyCode) > -1) {
                event.preventDefault();
                that.handleEvent(event.keyCode, EVENT.DOWN);
            }
        });

        document.addEventListener('keyup', function (event) {
            if (Object.values(KEY).indexOf(event.keyCode) > -1) {
                event.preventDefault();
                that.handleEvent(event.keyCode, EVENT.UP);
            }
        });
    }
}