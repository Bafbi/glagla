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
    display.drawLevel(game.world.level);
    display.drawPlayer(game.world.player.displayX, game.world.player.displayY);
    display.render();
}
function update() {
    if (!game.world.player.onIce) {
        if (controller.left.active) {
            game.world.player.moveLeft();
            controller.left.active = false;
        }
        if (controller.right.active) {
            game.world.player.moveRight();
            controller.right.active = false;
        }
        if (controller.up.active) {
            game.world.player.moveUp();
            controller.up.active = false;
        }
        if (controller.down.active) {
            game.world.player.moveDown();
            controller.down.active = false;
        }
    }
    // console.log(game.world.player);
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
    controller.keyDownUp(event.type, event.code)
);
window.addEventListener("keyup", (event) =>
    controller.keyDownUp(event.type, event.code)
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
display.tileSheet.image.src = "./game_modules/texture/spritesheet2.png";
display.player.image.src = "./game_modules/texture/spriteplayer.png";

display.background.image.onload = () => {
    display.resize(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
        game.world.level.height / game.world.level.width
    );

    engine.start();
};
