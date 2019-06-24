const BALL_RADIUS = 10;
const BALL_COLOR = '#444444';
const BALL_MAX_SPEED = 200;

const COLLISION = {
    LEFT: 0,
    RIGHT: 1,
    TOP: 2,
    BOTTOM: 3
};

class Ball {
    constructor(position) {
        this.position = position;
        this.speed = BALL_MAX_SPEED;
        this.orientation = 360 * Math.random();

        this.circle = new paper.Shape.Circle({
            center: this.position,
            radius: BALL_RADIUS,
            strokeWidth: 0,
            fillColor: BALL_COLOR
        });
    }

    edgeCollision() {
        if (this.circle.bounds.y < paper.view.bounds.y) {
            return COLLISION.TOP;
        } else if (this.circle.bounds.y + this.circle.bounds.height
            > paper.view.bounds.height) {
            return COLLISION.BOTTOM;
        }

        if (this.circle.bounds.x < paper.view.bounds.x) {
            return COLLISION.LEFT;
        } else if (this.circle.bounds.x + this.circle.bounds.width
            > paper.view.bounds.width) {
            return COLLISION.RIGHT;
        }
    }

    update(delta) {
        this.updateOrientation();
        let unitVector = new paper.Point(1, 0);
        let newVector = unitVector
            .rotate(this.orientation)
            .multiply(delta * this.speed);
        this.position = this.position.add(newVector);
    }

    updateOrientation() {
        let collision = this.edgeCollision();
        if (collision == COLLISION.TOP) {
            this.orientation = 360 - this.orientation;
        } else if (collision == COLLISION.BOTTOM) {
            this.orientation = 360 - this.orientation;
        }

        if (collision == COLLISION.LEFT) {
            this.orientation = 180 - this.orientation;
        } else if (collision == COLLISION.RIGHT) {
            this.orientation = 180 - this.orientation;
        }
    }

    render() {
        this.circle.position = this.position;
    }

    destroy() {
        this.circle.remove();
    }
}