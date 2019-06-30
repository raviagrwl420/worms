STROKE_WIDTH = 20;
STROKE_CAP = 'round';
NUM_POINTS = 3;
SEGMENT_LENGTH = 10;

class Worm {
    constructor(color, position, orientation) {
        this.path = new paper.Path({
            strokeColor: color,
            strokeWidth: STROKE_WIDTH,
            strokeCap: STROKE_CAP
        });

        this.numPoints = NUM_POINTS;
        for (let i = 0; i < this.numPoints; i++) {
            let newPoint = position.add(new paper.Point(i * SEGMENT_LENGTH, 0));
            this.path.add(newPoint.rotate(orientation, position));
        }

        this.head = new paper.Shape.Circle({
            center: this.path.firstSegment.point,
            radius: STROKE_WIDTH / 2
        });
    }

    getHeadVector() {
        return this.path.firstSegment.point.subtract(
            this.path.firstSegment.next.point).normalize();
    }

    update(delta) {

    }

    updatePosition(position) {
        this.path.firstSegment.point = position;
        this.head.position = this.path.firstSegment.point;

        for (let i = 0; i < this.numPoints - 1; i++) {
            let segment = this.path.segments[i];
            let nextSegment = segment.next;
            let vector = segment.point.subtract(nextSegment.point);
            vector.length = SEGMENT_LENGTH;
            nextSegment.point = segment.point.subtract(vector);
        }

        this.path.smooth({type: 'continuous'});
    }

    updateColor(color) {
        this.path.strokeColor = color;
    }

    updateLength() {
        let vector = this.path.lastSegment.previous.point.subtract(this.path.lastSegment.point);
        vector.length = SEGMENT_LENGTH;
        this.path.insert(this.numPoints, this.path.lastSegment.point.subtract(vector));
        this.numPoints++;
    }

    render(delta) {

    }
}