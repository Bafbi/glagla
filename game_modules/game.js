import mapFile from "./world/map.js";

export class Game {
    constructor() {
        this.world = new World();
    }

    update() {
        this.world.update();
    }

    reset() {
        this.world = new World();
    }
}

class World {
    constructor() {
        this.level = new Level(JSON.parse(JSON.stringify(mapFile)));
        this.player = new Player();
    }

    update() {
        this.level.update();
        this.player.update();

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
    constructor(map) {
        this.height = map.height;
        this.width = map.width;
        this.texture = map.texture;
        this.obstacle = map.data;
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
    constructor() {
        this.pos = new Vec2(2, 2);
        this.oldPos = new Vec2(0, 0);
        this.oldPos.copy(this.pos);
        this.oldDisplayPos = new Vec2(0, 0);
        this.oldDisplayPos.copy(this.pos);
        this.displayPos = new Vec2(0, 0);
        this.displayPos.copy(this.pos);
        this.motion = new Vec2(0, 0);
        this.acceleration = new Vec2(0, 0);
        this.moving = false;
        this.freeze = false;
        this.direction = new Vec2(0, 0);
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

///////////
// Utils //
///////////

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static sub(vec2A, vec2B) {
        return { x: vec2A.x - vec2B.x, y: vec2A.y - vec2B.y };
    }

    copy(vec2) {
        this.x = vec2.x;
        this.y = vec2.y;
    }

    add(vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
    }

    sub(vec2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
    }

    multiply_by_cste(cste) {
        this.x *= cste;
        this.y *= cste;
    }

    isSup(vec2) {
        return this.x > vec2.x && this.y > vec2.y;
    }

    isSup_of_cste(cste) {
        return this.x > cste || this.y > cste;
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}
