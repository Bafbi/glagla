import { Vec2 } from "./utils.js";

export class Game {
    constructor(level) {
        this.level = JSON.parse(level);
        this.world = new World(this.level);
    }

    update() {
        this.world.update();
    }

    reset() {
        this.world = new World(this.level);
    }
}

class World {
    constructor(level) {
        this.level = new Level(level);
        this.player = new Player(level.body.start);
    }

    update() {
        this.level.update();
        this.player.update();

        if (
            this.player.pos.isSup(
                new Vec2(this.level.width - 1, this.level.height - 1)
            ) ||
            new Vec2(0, 0).isSup(this.player.pos)
        ) {
            this.player.pos.sub(this.player.direction);
            this.player.direction.set(0, 0);
        }

        switch (this.level.getObstacle(this.player.pos)) {
            case 2: {
                const dis = Vec2.sub(this.player.displayPos, this.player.pos);
                if (Math.abs(dis.x) > 0.3 || Math.abs(dis.y) > 0.3) break;
                this.level.setObstacle(this.player.pos, 3);
            }
            case -1:
                {
                    this.player.pos.add(this.player.direction);
                }
                break;
            case -2:
            case 0:
                {
                    this.player.pos.sub(this.player.direction);
                    this.player.direction.reset();
                }
                break;
            case 1:
                {
                    if (!this.player.moving) {
                        this.player.direction.set(0, 1);
                        this.player.move(this.player.direction);
                    }
                }
                break;
            case 3:
                {
                    this.player.freeze = true;
                }
                break;
            default:
                break;
        }
    }
}

///////////
// Level //
///////////

class Level {
    constructor(level) {
        this.height = level.header.height;
        this.width = level.header.width;
        this.texture = level.body.texture;
        this.obstacle = level.body.data;
        this.end = level.body.end;
    }

    getObstacle(vec2) {
        return this.obstacle[vec2.y * this.width + vec2.x];
    }

    setObstacle(vec2, value) {
        this.obstacle[vec2.y * this.width + vec2.x] = value;
    }

    update() {}
}

////////////
// Player //
////////////

class Player {
    constructor(start) {
        this.pos = new Vec2(start.x, start.y);
        this.oldPos = new Vec2();
        this.oldPos.copy(this.pos);
        this.oldDisplayPos = new Vec2();
        this.oldDisplayPos.copy(this.pos);
        this.displayPos = new Vec2();
        this.displayPos.copy(this.pos);
        this.motion = new Vec2();
        this.acceleration = new Vec2();
        this.moving = false;
        this.freeze = false;
        this.direction = new Vec2();
    }

    update() {
        this.updateOldDisplay();

        if (this.displayPos.x < this.pos.x) this.acceleration.x += 0.006;
        if (this.displayPos.x > this.pos.x) this.acceleration.x -= 0.006;
        if (this.displayPos.y < this.pos.y) this.acceleration.y += 0.006;
        if (this.displayPos.y > this.pos.y) this.acceleration.y -= 0.006;

        this.motion.add(this.acceleration);
        this.displayPos.add(this.motion);

        this.motion.multiply_by_cste(0.7);
        this.acceleration.multiply_by_cste(0.9);

        if (
            (this.displayPos.x > this.pos.x &&
                this.oldDisplayPos.x < this.displayPos.x) ||
            (this.displayPos.x < this.pos.x &&
                this.oldDisplayPos.x > this.displayPos.x)
        ) {
            this.acceleration.x = 0;
            this.motion.x = 0;
        }

        if (
            (this.displayPos.y > this.pos.y &&
                this.oldDisplayPos.y < this.displayPos.y) ||
            (this.displayPos.y < this.pos.y &&
                this.oldDisplayPos.y > this.displayPos.y)
        ) {
            this.acceleration.y = 0;
            this.motion.y = 0;
        }

        const dis = this.distancePosDisplay();
        if (
            dis.x < 0.1 &&
            dis.y < 0.1
            // this.pos.x == Math.round(this.displayPos.x) &&
            // this.pos.y == Math.round(this.displayPos.y)
        ) {
            this.moving = false;
        }
        // if (
        //     (this.displayPos.isSup(this.pos) &&
        //         this.displayPos.isSup(this.oldDisplayPos)) ||
        //     (this.pos.isSup(this.displayPos) &&
        //         this.oldDisplayPos.isSup(this.displayPos))
        // ) {
        //     console.log(this);
        //     this.moving = false;
        //     this.acceleration.reset();
        //     this.motion.reset();
        // }
    }

    move(direction) {
        if (!this.freeze) {
            this.updateOld();
            this.moving = true;
            this.direction.copy(direction);
            this.pos.add(direction);
        }
    }

    updateOld() {
        this.oldPos.copy(this.pos);
    }

    updateOldDisplay() {
        this.oldDisplayPos.copy(this.displayPos);
    }

    distancePosDisplay() {
        const dis = Vec2.sub(this.displayPos, this.pos);
        return { x: Math.abs(dis.x), y: Math.abs(dis.y) };
    }
}
