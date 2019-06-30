const BALL_RADIUS = 10;
const BALL_COLOR = '#444444';
const BALL_MAX_SPEED = 200;

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

        this.collider = this.circle;
    }

    update(delta) {
        let unitVector = new paper.Point(1, 0);
        let newVector = unitVector
            .rotate(this.orientation)
            .multiply(delta * this.speed);
        this.position = this.position.add(newVector);
    }

    resolveCollision(collision) {
        this.position = this.position.add(collision.vector);
        if (collision.side == COLLISION_SIDES.TOP) {
            this.orientation = 360 - this.orientation;
        } else if (collision.side == COLLISION_SIDES.BOTTOM) {
            this.orientation = 360 - this.orientation;
        }

        if (collision.side == COLLISION_SIDES.LEFT) {
            this.orientation = 180 - this.orientation;
        } else if (collision.side == COLLISION_SIDES.RIGHT) {
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