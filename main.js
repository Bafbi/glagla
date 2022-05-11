"use strict";

//////////////////////
/// Import modules ///
//////////////////////

import { Display } from "./game_modules/display.js";
import { Controller } from "./game_modules/controller.js";
import { Game } from "./game_modules/game.js";
import { Engine } from "./game_modules/engine.js";

////////////////
/// Function ///
////////////////

function render() {
    display.drawBackground();
    display.drawTileLevel(game.world.level.texture, game.world.level.width);
    display.drawSpriteLevel(game.world.level.obstacle, game.world.level.width);
    display.drawPlayer(game.world.player.displayPos);
    display.updateCamera(game.world.player.pos, 20);
    display.render();
}
function update() {
    if (!game.world.player.moving) {
        if (controller.left.active) {
            game.world.player.move({ x: -1, y: 0 });
            controller.left.active = false;
        }
        if (controller.right.active) {
            game.world.player.move({ x: 1, y: 0 });
            controller.right.active = false;
        }
        if (controller.up.active) {
            game.world.player.move({ x: 0, y: -1 });
            controller.up.active = false;
        }
        if (controller.down.active) {
            game.world.player.move({ x: 0, y: 1 });
            controller.down.active = false;
        }
        if (controller.reset.active) {
            game.reset();
        }
        if (controller.cam.active) {
            switch (display.camera.mode) {
                case "ALL":
                    display.camera.mode = "PLAYER";
                    break;
                case "PLAYER":
                    display.camera.mode = "ALL";
                    break;
                default:
                    break;
            }
            controller.cam.active = false;
        }
    }
    // console.log(display.camera);
    game.update();
}

///////////////
/// Objects ///
///////////////

const display = new Display(document.getElementById("gameWindow"));
const controller = new Controller();
const game = new Game();
const engine = new Engine(1000 / 30, render, update);

/////////////////
/// Listeners ///
/////////////////

window.addEventListener("keydown", (event) =>
    controller.keyDownUp(event.type, event.key)
);
window.addEventListener("keyup", (event) =>
    controller.keyDownUp(event.type, event.key)
);
window.addEventListener("resize", () =>
    display.resize(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
        game.world.level.height / game.world.level.width
    )
);

//////////////////
/// Initialize ///
//////////////////
display.buffer.canvas.height =
    game.world.level.height * display.tileSheet.tileSize;
display.buffer.canvas.width =
    game.world.level.width * display.tileSheet.tileSize;

display.background.image.src = "./game_modules/texture/stone-bg.png";
display.tileSheet.image.src = "./game_modules/texture/tilesheet_stony.png";
display.spriteSheet.image.src = "./game_modules/texture/spritesheet_stony.png";
display.player.image.src = "./game_modules/texture/spriteplayer.png";

display.background.image.onload = () => {
    display.resize(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
        game.world.level.height / game.world.level.width
    );

    engine.start();
};
