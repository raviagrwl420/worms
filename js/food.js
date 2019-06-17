RADIUS = 10;
COLOR = '#E4141B';

class Food {
    constructor(bounds) {
        let x = bounds.right * Math.random();
        let y = bounds.bottom * Math.random();
        this.center = new paper.Point(x, y);

        this.setup();
    }

    setup() {
        this.circle = new paper.Shape.Circle({
            center: this.center,
            radius: RADIUS,
            strokeWidth: 0,
            fillColor: COLOR
        });
    }

    update() {

    }

    render() {

    }

    destroy() {
        this.circle.remove();
    }
}