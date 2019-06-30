const MAX_SPEED = 250;
const TURN_SPEED = 1000;
const DEAD_COLOR = '#333333';

class Player {
    constructor(PROPS, position, orientation) {
        this.color = PROPS.COLOR;
        this.position = position;
        this.orientation = orientation;
        this.keyset = PROPS.KEY_SET;

        this.size = 0;
        this.speed = 0;
        this.turnSpeed = 0;
        this.dead = false;

        this.worm = new Worm(this.color, this.position, this.orientation);
        this.scoreText = new paper.PointText({
            point: PROPS.SCORE_LOC,
            content: this.size,
            fillColor: this.color,
            fontSize: 70
        });
    }

    handleEvent(key, event) {
        switch (key) {
            case this.keyset.UP_KEY:
                if (event === EVENT.DOWN)
                    this.speed = MAX_SPEED;
                else
                    this.speed = 0;
                break;
            case this.keyset.LEFT_KEY:
                if (event === EVENT.DOWN)
                    this.turnSpeed = -TURN_SPEED;
                else
                    this.turnSpeed = 0;
                break;
            case this.keyset.RIGHT_KEY:
                if (event === EVENT.DOWN)
                    this.turnSpeed = TURN_SPEED;
                else
                    this.turnSpeed = 0;
        }
    }

    die() {
        this.dead = true;
        this.color = DEAD_COLOR;
        this.worm.updateColor(this.color);
    }

    update(delta) {
        let headVector = this.worm.getHeadVector();
        let moveVector = headVector.multiply(delta * this.speed).rotate(delta * this.turnSpeed);
        this.position = this.position.add(moveVector);

        if (!this.dead) {
            this.worm.updatePosition(this.position);
        }
    }

    updateSize() {
        this.size++;
        this.worm.updateLength();
        this.scoreText.content = this.size;
    }

    render(delta) {
        this.worm.render(delta);
    }
}