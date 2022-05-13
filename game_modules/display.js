import { Vec2 } from "./utils.js";

export class Display {
    constructor(canvas) {
        this.buffer = document.createElement("canvas").getContext("2d");
        this.context = canvas.getContext("2d");
        this.tileSheet = new TileSheet(16, 5);
        this.spriteSheet = new TileSheet(16, 5);
        this.player = new Sprite(12);
        this.background = new TileSheet(16, 1);
        this.camera = new Camera();
    }

    fill(context, color) {
        context.fillStyle = color;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
    drawRectangle(x, y, width, height, color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(Math.round(x), Math.round(y), width, height);
    }
    drawText(text, x, y, color) {
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }

    drawGrid(worldColumns, worldRows, color) {
        this.buffer.fillStyle = color;
        for (let columns = 0; columns < worldColumns; columns++) {
            this.buffer.fillRect(
                (columns + 1) * this.tileSheet.tileSize - 1,
                0,
                2,
                worldRows * this.tileSheet.tileSize
            );
        }
        for (let rows = 0; rows < worldRows; rows++) {
            this.buffer.fillRect(
                0,
                (rows + 1) * this.tileSheet.tileSize - 1,
                worldColumns * this.tileSheet.tileSize,
                2
            );
        }
    }

    // drawLevel(level) {
    //     level.texture.forEach((value, index) => {
    //         if (value < 0) {
    //             return;
    //         }
    //         const source_x =
    //             (value % this.tileSheet.columns) * this.tileSheet.tileSize;
    //         const source_y =
    //             Math.floor(value / this.tileSheet.columns) *
    //             this.tileSheet.tileSize;
    //         const destination_x =
    //             (index % level.width) * this.tileSheet.tileSize;
    //         const destination_y =
    //             Math.floor(index / level.width) * this.tileSheet.tileSize;

    //         this.buffer.drawImage(
    //             this.tileSheet.image,
    //             source_x,
    //             source_y,
    //             this.tileSheet.tileSize,
    //             this.tileSheet.tileSize,
    //             destination_x,
    //             destination_y,
    //             this.tileSheet.tileSize,
    //             this.tileSheet.tileSize
    //         );
    //     });
    // }
    drawTileLevel(levelTexture, width) {
        levelTexture.forEach((value, index) => {
            if (value < 0) {
                return;
            }
            const source_x =
                (value % this.tileSheet.columns) * this.tileSheet.tileSize;
            const source_y =
                Math.floor(value / this.tileSheet.columns) *
                this.tileSheet.tileSize;
            const destination_x = (index % width) * this.tileSheet.tileSize;
            const destination_y =
                Math.floor(index / width) * this.tileSheet.tileSize;

            this.buffer.drawImage(
                this.tileSheet.image,
                source_x,
                source_y,
                this.tileSheet.tileSize,
                this.tileSheet.tileSize,
                destination_x,
                destination_y,
                this.tileSheet.tileSize,
                this.tileSheet.tileSize
            );
        });
    }
    drawSpriteLevel(levelData, width) {
        levelData.forEach((value, index) => {
            if (value < 0) {
                return;
            }
            const source_x =
                (value % this.spriteSheet.columns) * this.spriteSheet.tileSize;
            const source_y =
                Math.floor(value / this.spriteSheet.columns) *
                this.spriteSheet.tileSize;
            const destination_x = (index % width) * this.spriteSheet.tileSize;
            const destination_y =
                Math.floor(index / width) * this.spriteSheet.tileSize;

            this.buffer.drawImage(
                this.spriteSheet.image,
                source_x,
                source_y,
                this.spriteSheet.tileSize,
                this.spriteSheet.tileSize,
                destination_x,
                destination_y,
                this.spriteSheet.tileSize,
                this.spriteSheet.tileSize
            );
        });
    }
    drawPlayer(vec2) {
        this.buffer.drawImage(
            this.player.image,
            2,
            0,
            this.player.tileSize,
            this.player.tileSize,
            Math.round(vec2.x * this.tileSheet.tileSize) +
                (this.tileSheet.tileSize - this.player.tileSize),
            Math.round(vec2.y * this.tileSheet.tileSize) +
                (this.tileSheet.tileSize - this.player.tileSize) / 2,
            this.player.tileSize,
            this.player.tileSize
        );
    }
    drawBackground() {
        const background = this.buffer.createPattern(
            this.background.image,
            "repeat"
        );
        this.buffer.fillStyle = background;
        this.buffer.fillRect(
            0,
            0,
            this.buffer.canvas.width,
            this.buffer.canvas.height
        );
        /*for (let rows = 0; rows < worldRows; rows++) {
            for (let columns = 0; columns < worldColumns; columns++) {
                this.buffer.drawImage(
                    this.background.image,
                    0,
                    0,
                    this.background.tileSize,
                    this.background.tileSize,
                    columns * this.background.tileSize,
                    rows * this.background.tileSize,
                    this.background.tileSize,
                    this.background.tileSize
                );
            }
        }*/
    }

    render() {
        this.fill(this.context, "black");
        this.context.drawImage(
            this.buffer.canvas,
            this.camera.pos1.x,
            this.camera.pos1.y,
            this.camera.pos2.x,
            this.camera.pos2.y,
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
        );
    }

    resize(width, height, height_width_ratio) {
        if (this.camera.mode == "PLAYER") height_width_ratio = height / width;
        if (height / width > height_width_ratio) {
            this.context.canvas.height = width * height_width_ratio;
            this.context.canvas.width = width;
        } else {
            this.context.canvas.height = height;
            this.context.canvas.width = height / height_width_ratio;
        }

        this.context.imageSmoothingEnabled = false;
        this.render();
    }

    updateCamera(clientWidth, clientHeight) {
        switch (this.camera.mode) {
            case "ALL":
                {
                    this.camera.pos1.reset();
                    this.camera.pos2.set(
                        this.buffer.canvas.width,
                        this.buffer.canvas.height
                    );
                }
                break;
            case "PLAYER":
                {
                    const zoom = this.camera.zoom;
                    const ratio = clientWidth / clientHeight;
                    const x = this.camera.posC.x * this.tileSheet.tileSize;
                    const y = this.camera.posC.y * this.tileSheet.tileSize;
                    this.camera.pos1.set(
                        x + this.tileSheet.tileSize / 2 - zoom * ratio,
                        y + this.tileSheet.tileSize / 2 - zoom
                    );
                    this.camera.pos2.set(zoom * 2 * ratio, zoom * 2);
                }
                break;

            default:
                break;
        }
    }
    toggleCameraMode(width, height, height_width_ratio) {
        switch (this.camera.mode) {
            case "ALL":
                this.camera.mode = "PLAYER";
                break;
            case "PLAYER":
                this.camera.mode = "ALL";
                break;
            default:
                break;
        }
        this.resize(width, height, height_width_ratio);
    }
}

class TileSheet {
    constructor(tile_size, columns) {
        this.image = new Image();
        this.tileSize = tile_size;
        this.columns = columns;
    }
}
class Sprite {
    constructor(tile_size) {
        this.image = new Image();
        this.tileSize = tile_size;
    }
}

class Camera {
    constructor() {
        this.mode = "ALL";
        this.zoom = 10;
        this.pos1 = new Vec2();
        this.pos2 = new Vec2();
        this.posC = new Vec2();
    }
}
