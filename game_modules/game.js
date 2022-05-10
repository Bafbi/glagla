import mapFile from "./world/map.js";

export class Game {
    constructor() {
        this.world = new World();
    }

    update() {
        this.world.update();
    }
}

class World {
    constructor() {
        this.level = new Level(mapFile);
        this.player = new Player();
    }

    update() {
        this.level.update();
        this.player.update();

        if (this.level.getObstacle(this.player.X, this.player.Y) == 1) {
            if (this.player.X > this.player.oldX) this.player.X += 1;
            if (this.player.X < this.player.oldX) this.player.X -= 1;
            if (this.player.Y > this.player.oldY) this.player.Y += 1;
            if (this.player.Y < this.player.oldY) this.player.Y -= 1;
        }
    }
}

///////////
// Level //
///////////

class Level {
    constructor(mapFile) {
        this.height = mapFile.height;
        this.width = mapFile.width;
        this.texture = mapFile.texture;
        this.obstacle = mapFile.data;
    }

    getObstacle(x, y) {
        return this.obstacle[y * this.width + x];
    }

    update() {}
}

////////////
// Player //
////////////

class Player {
    constructor() {
        this.X = 2;
        this.Y = 2;
        this.oldX = this.X;
        this.oldY = this.Y;
        this.oldDisplayX = this.X;
        this.oldDisplayY = this.Y;
        this.displayX = this.X;
        this.displayY = this.Y;
        this.dX = 0;
        this.dY = 0;
        this.ddX = 0;
        this.ddY = 0;
        this.moving = false;
    }

    update() {
        this.oldDisplayX = this.displayX;
        this.oldDisplayY = this.displayY;

        if (this.displayX < this.X) this.ddX += 0.006;
        if (this.displayX > this.X) this.ddX -= 0.006;
        if (this.displayY < this.Y) this.ddY += 0.006;
        if (this.displayY > this.Y) this.ddY -= 0.006;
        this.dX += this.ddX;
        this.dY += this.ddY;
        this.displayX += this.dX;
        this.displayY += this.dY;
        this.dX *= 0.7;
        this.dY *= 0.7;
        this.ddX *= 0.9;
        this.ddY *= 0.9;
        // console.log(this.dY);
        if (
            (this.displayX > this.X && this.oldDisplayX < this.displayX) ||
            (this.displayX < this.X && this.oldDisplayX > this.displayX)
        ) {
            this.moving = false;
            this.ddX = 0;
            this.dX = 0;
        }

        if (
            (this.displayY > this.Y && this.oldDisplayY < this.displayY) ||
            (this.displayY < this.Y && this.oldDisplayY > this.displayY)
        ) {
            this.moving = false;
            this.ddY = 0;
            this.dY = 0;
        }
    }

    moveRight() {
        this.updateOld();
        this.moving = true;
        this.X += 1;
    }
    moveLeft() {
        this.updateOld();
        this.moving = true;
        this.X -= 1;
    }
    moveUp() {
        this.updateOld();
        this.moving = true;
        this.Y -= 1;
    }
    moveDown() {
        this.updateOld();
        this.moving = true;
        this.Y += 1;
    }

    updateOld() {
        this.oldX = this.X;
        this.oldY = this.Y;
    }
}
