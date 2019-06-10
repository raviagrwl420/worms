RADIUS = 10;
COLOR = '#E4141B';

class Food {
    constructor() {
        var x = paper.view.bounds.right * Math.random();
        var y = paper.view.bounds.bottom * Math.random();
        this.center = new paper.Point(x, y);

        this.setup();
    }

    setup() {
        this.circle = new paper.Shape.Circle({
            center: this.center,
            radius: RADIUS,
            strokeColor: COLOR,
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