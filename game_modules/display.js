import devTools from "./texture/devTools.js";

export class Display {
    constructor(canvas) {
        this.buffer = document.createElement("canvas").getContext("2d");
        this.context = canvas.getContext("2d");
        this.tileSheet = new TileSheet(16, 5);
        this.spriteSheet = new TileSheet(16, 5);
        this.player = new Sprite(12);
        this.background = new TileSheet(32, 1);
    }

    fill(color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(
            0,
            0,
            this.buffer.canvas.width,
            this.buffer.canvas.height
        );
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
    drawCollideTile(entity, color) {
        this.drawRectangle(
            Math.floor(entity.getLeft() / this.tileSheet.tileSize) *
                this.tileSheet.tileSize,
            Math.floor(entity.getBottom() / this.tileSheet.tileSize) *
                this.tileSheet.tileSize,
            this.tileSheet.tileSize,
            this.tileSheet.tileSize,
            color
        );
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
        this.context.drawImage(
            this.buffer.canvas,
            0,
            0,
            this.buffer.canvas.width,
            this.buffer.canvas.height,
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
        );
    }

    resize(width, height, height_width_ratio) {
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
