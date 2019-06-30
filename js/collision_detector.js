const COLLISION_SIDES = {
    LEFT: 0,
    RIGHT: 1,
    TOP: 2,
    BOTTOM: 3
};

class CollisionDetector {
    static checkCollision (a, b) {
        if (a instanceof Player) {
            if (b === undefined) {
                return CollisionDetector.checkCollisionPlayerSelf(a);
            } else if (b instanceof Food) {
                return CollisionDetector.checkCollisionPlayerFood(a, b);
            } else if (b instanceof Ball) {
                return CollisionDetector.checkCollisionPlayerBall(a, b);
            } else if (b instanceof Field) {
                return CollisionDetector.checkCollisionPlayerField(a, b);
            } else if (b instanceof Player) {
                return CollisionDetector.checkCollisionPlayerPlayer(a, b);
            }
        } else if (a instanceof Ball) {
            if (b instanceof Field) {
                return CollisionDetector.checkCollisionBallField(a, b);
            }
        }
    }

    static checkCollisionPlayerSelf(player) {
        let head = player.worm.head;

        let collisions = player.worm.path.segments.map(function (segment, index) {
            let lengthOfSegments = index * SEGMENT_LENGTH;
            let collide = head.position.getDistance(segment.point, true) <= (Math.pow(STROKE_WIDTH, 2));
            return lengthOfSegments > STROKE_WIDTH && collide;
        });

        return collisions.includes(true);
    }

    static checkCollisionPlayerFood(player, food) {
        return player.worm.head.position.getDistance(food.center, true) <= (Math.pow(STROKE_WIDTH,2));
    }

    static checkCollisionPlayerBall(player, ball) {
        if (player.worm.path.strokeBounds.contains(ball.collider.bounds)) {
            let nearest = player.worm.path.getNearestLocation(ball.collider.position);
            let distance2 = nearest.point.getDistance(ball.collider.position, true);
            if (distance2 < Math.pow(STROKE_WIDTH, 2)) {
                let normal = nearest.normal;
                let ballVector = (new paper.Point(1, 0)).rotate(ball.orientation);
                let newVector = ballVector.subtract(normal.multiply(2*ballVector.dot(normal)));
                ball.orientation = newVector.angle;

                let distance = STROKE_WIDTH - Math.sqrt(distance2);
                let vector1 = ballVector.multiply(-1)
                    .normalize(distance / -normal.dot(ballVector));
                let vector2 = newVector.normalize(vector1.length);

                ball.position = ball.position.add(vector1).add(vector2);

                let minTranslationVector = newVector
                    .normalize(STROKE_WIDTH - Math.sqrt(distance2));
                // console.log(minTranslationVector);
                // ball.position = ball.position.add(minTranslationVector);
            }
        }
    }

    static checkCollisionPlayerField(player, field) {
        return !field.collider.bounds.contains(player.worm.head.bounds);
    }

    static checkCollisionPlayerPlayer(player1, player2) {
        let head = player1.worm.head;

        let collisions = player2.worm.path.segments.map(function (segment) {
            return head.position.getDistance(segment.point, true) <= (Math.pow(STROKE_WIDTH, 2));
        });

        return collisions.includes(true);
    }

    static checkCollisionBallField(ball, field) {
        if (ball.collider.bounds.y < field.collider.bounds.y) {
            // Collision with top
            let vector = new paper.Point(0, field.collider.bounds.y - ball.collider.bounds.y);
            return {
                side: COLLISION_SIDES.TOP,
                vector: vector
            };
        } else if (ball.collider.bounds.y + ball.collider.bounds.height >
            field.collider.bounds.height) {
            // Collision with bottom
            let vector = new paper.Point(0, field.collider.bounds.height -
                (ball.collider.bounds.y + ball.collider.bounds.height));
            return {
                side: COLLISION_SIDES.BOTTOM,
                vector: vector
            };
        }

        if (ball.collider.bounds.x < field.collider.bounds.x) {
            // Collision with left
            let vector = new paper.Point(field.collider.bounds.x - ball.collider.bounds.x, 0);
            return {
                side: COLLISION_SIDES.LEFT,
                vector: vector
            };
        } else if (ball.collider.bounds.x + ball.collider.bounds.width >
            field.collider.bounds.width) {
            // Collision with right
            let vector = new paper.Point(field.collider.bounds.width -
                (ball.collider.bounds.x + ball.collider.bounds.width));
            return {
                side: COLLISION_SIDES.RIGHT,
                vector: vector
            };
        }
    }
}