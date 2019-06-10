START_POINTS = 3;
SEGMENT_LENGTH = 10;
STROKE_COLOR = '#E4141B';
STROKE_WIDTH = 20;
STROKE_CAP = 'round';
MAX_SPEED = 200;
TURN_SPEED = 1000;
DEAD_COLOR = '#222222';

class Worm {
    constructor(start, orientation) {
        this.start = start;
        this.orientation = orientation;

        this.numPoints = START_POINTS;
        this.speed = 0;
        this.turnSpeed = 0;
        this.color = STROKE_COLOR;
        this.dead = false;

        this.setup();
    }

    setup() {
        this.path = new paper.Path({
            strokeColor: STROKE_COLOR,
            strokeWidth: STROKE_WIDTH,
            strokeCap: STROKE_CAP
        });

        for (var i = 0; i < this.numPoints; i++) {
            var newPoint = this.start.add(new paper.Point(i * SEGMENT_LENGTH, 0));
            this.path.add(newPoint.rotate(this.orientation, this.start));
        }

        this.head = new paper.Shape.Circle({
            center: this.path.firstSegment.point,
            radius: STROKE_WIDTH
        })
    }

    move(delta) {
        var next = this.path.firstSegment.point.subtract(
            this.path.firstSegment.next.point)
            .normalize()
            .multiply(delta * this.speed)
            .rotate(delta * this.turnSpeed);

        this.path.firstSegment.point = this.path.firstSegment.point.add(next);
        this.head.position = this.path.firstSegment.point;
        for (var i = 0; i < this.numPoints - 1; i++) {
            var segment = this.path.segments[i];
            var nextSegment = segment.next;
            var vector = segment.point.subtract(nextSegment.point);
            vector.length = SEGMENT_LENGTH;
            nextSegment.point = segment.point.subtract(vector);
        }

        this.path.smooth({type: 'continuous'});
    }

    collides() {
        var edgeCollision = !paper.view.bounds.contains(this.path.firstSegment.point);

        var head = this.head;
        var selfCollisions = this.path.segments.map(function (segment, index) {
            if (index == 0) {
                return false;
            } else {
                var lengthOfSegments = index * SEGMENT_LENGTH;
                var areClose = head.position.getDistance(segment.point, true) <= (Math.pow(STROKE_WIDTH, 2));
                return lengthOfSegments > STROKE_WIDTH && areClose;
            }
        });

        return edgeCollision || selfCollisions.includes(true);
    }

    update(delta) {
        if (!this.dead) {
            this.move(delta);

            if (this.collides()) {
                this.dead = true;
                this.path.strokeColor = DEAD_COLOR;
            }
        }
    }

    render(delta) {

    }

    handleEvent(key, event) {
        switch (key) {
            case KEY.UP_KEY:
                if (event == EVENT.DOWN)
                    this.speed = MAX_SPEED;
                // else
                    // this.speed = 0;
                break;
            case KEY.LEFT_KEY:
                if (event == EVENT.DOWN)
                    this.turnSpeed = -TURN_SPEED;
                else
                    this.turnSpeed = 0;
                break;
            case KEY.RIGHT_KEY:
                if (event == EVENT.DOWN)
                    this.turnSpeed = TURN_SPEED;
                else
                    this.turnSpeed = 0
        }
    }

    hitTest(food) {
        if (this.head.position.getDistance(food.center, true) <= (Math.pow(STROKE_WIDTH,2))) {
            var vector = this.path.lastSegment.previous.point.subtract(this.path.lastSegment.point);
            vector.length = SEGMENT_LENGTH;
            this.path.insert(this.numPoints, this.path.lastSegment.point.subtract(vector));
            this.numPoints += 1;

            food.destroy();
            food = new Food();
        }
        return food;
    }
}