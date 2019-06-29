const GAME_STATE = {
    GAME_INIT: 'GAME_INIT',
    GAME_IN_PLAY: 'GAME_IN_PLAY',
    GAME_OVER: 'GAME_OVER'
};

const FIELD_PROPS = {
    width: 1000,
    height: 800
};

const KEY_SETS = {
    PLAYER_1: {
        LEFT_KEY: 65,
        UP_KEY: 87,
        RIGHT_KEY: 68,
        DOWN_KEY: 83
    },
    PLAYER_2: {
        LEFT_KEY: 37,
        UP_KEY: 38,
        RIGHT_KEY: 39,
        DOWN_KEY: 40
    }
};

const PLAYER_PROPS = {
    PLAYER_1: {
        COLOR: '#0C9CE8',
        KEY_SET: KEY_SETS.PLAYER_1,
        SCORE_LOC: [50, 100]
    },
    PLAYER_2: {
        COLOR: '#0CE880',
        KEY_SET: KEY_SETS.PLAYER_2,
        SCORE_LOC: [1800, 100]
    }
};

const EVENT = {
    DOWN: 1,
    UP: 2,
    PRESS: 3
};

const NUM_FOODS = 20;
const OFFSET = 500;

class Game {
    constructor() {
        this.gameState = GAME_STATE.GAME_INIT;

        this.startTime = null;
        this.lastTime = null;

        this.field = new Field(0, 0, paper.view.bounds.width, paper.view.bounds.height);

        this.player1 = new Player(PLAYER_PROPS.PLAYER_1,
            paper.view.center.add(new paper.Point(-OFFSET, 0)),
            180);
        this.player2 = new Player(PLAYER_PROPS.PLAYER_2,
            paper.view.center.add(new paper.Point(OFFSET, 0)),
            0);

        this.foods = [];
        for (let i = 0; i < NUM_FOODS; i++) {
            this.foods.push(new Food(paper.view.bounds));
        }

        this.ball = new Ball(paper.view.center);

        this.addEventListeners();
    }

    update(delta) {
        if (this.gameState == GAME_STATE.GAME_IN_PLAY) {
            this.player1.update(delta);
            this.player2.update(delta);
            for (let i in this.foods) {
                let food = this.foods[i];
                if (this.player1.foodCollision(food)) {
                    this.player1.updateSize();
                    food.destroy();
                    this.foods[i] = new Food(paper.view.bounds);
                }
                if (this.player2.foodCollision(food)) {
                    this.player2.updateSize();
                    food.destroy();
                    this.foods[i] = new Food(paper.view.bounds);
                }
            }
            if (this.player1.playerCollision(this.player2)) {
                this.player1.die();
            }
            if (this.player2.playerCollision(this.player1)) {
                this.player2.die();
            }
        }
        this.player1.ballCollision(this.ball);
        this.player2.ballCollision(this.ball);
        this.ball.update(delta);
    }

    render(delta) {
        this.player1.render(delta);
        this.player2.render(delta);
        this.ball.render();
    }

    loop(timestamp) {
        if (!this.startTime) {
            this.startTime = timestamp;
            this.lastTime = timestamp;
        }

        let delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        delta = Math.min(delta / 1000, 0.05);

        this.update(delta);
        this.render(delta);

        window.requestAnimationFrame(this.loop.bind(this));
    }

    startLoop() {
        this.gameState = GAME_STATE.GAME_IN_PLAY;
        window.requestAnimationFrame(this.loop.bind(this));
    }

    handleEvent(key, event) {
        if (Object.values(KEY_SETS.PLAYER_1).indexOf(key) > -1) {
            this.player1.handleEvent(key, event);
        } else if (Object.values(KEY_SETS.PLAYER_2).indexOf(key) > -1) {
            this.player2.handleEvent(key, event);
        }
    }

    addEventListeners() {
        let that = this;
        document.addEventListener('keydown', function (event) {
            if (Object.values(KEY_SETS.PLAYER_1).indexOf(event.keyCode) > -1 ||
                Object.values(KEY_SETS.PLAYER_2).indexOf(event.keyCode) > -1) {
                event.preventDefault();
                that.handleEvent(event.keyCode, EVENT.DOWN);
            }
        });

        document.addEventListener('keyup', function (event) {
            if (Object.values(KEY_SETS.PLAYER_1).indexOf(event.keyCode) > -1 ||
                Object.values(KEY_SETS.PLAYER_2).indexOf(event.keyCode) > -1) {
                event.preventDefault();
                that.handleEvent(event.keyCode, EVENT.UP);
            }
        });
    }
}