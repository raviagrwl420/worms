const FIELD_FILL_COLOR = '#fefefe';
const FIELD_STROKE_COLOR = '#444444';
const FIELD_WIDTH = 20;

class Field {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.rect = paper.Shape.Rectangle({
            point: [x, y],
            size: [width, height],
            fillColor: FIELD_FILL_COLOR,
            strokeColor: FIELD_STROKE_COLOR,
            strokeWidth: FIELD_WIDTH
        })
    }
}