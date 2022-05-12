"use strict";

//////////////////////////
//#region *Url param* //

import baseLevel from "./game_modules/world/map.js";

let lvl = JSON.stringify(baseLevel);

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("lvl")) {
    const lvlName = urlParams.get("lvl");
    lvl = localStorage.getItem(lvlName);
}

//#endregion            //
//////////////////////////

////////////////////////////
//#region *Import modules* ///

import { Display } from "./game_modules/display.js";
import { Controller } from "./game_modules/controller.js";
import { Game } from "./game_modules/game.js";
import { Engine } from "./game_modules/engine.js";

//#endregion              //
////////////////////////////

/////////////////////
//#region *Function* //

function render() {
    display.drawBackground();
    display.drawTileLevel(game.world.level.texture, game.world.level.width);
    display.drawSpriteLevel(game.world.level.obstacle, game.world.level.width);
    display.drawPlayer(game.world.player.displayPos);
    display.updateCamera();
    display.render();
}
function update() {
    Object.keys(controller).forEach((key, index) => {
        if (controller[key].active) {
            controller[key].callback();
            controller[key].active = controller[key].slow ? false : true;
        }
    });
    // console.log(display.camera);
    game.update();
}

function reloadDisplay() {
    display.buffer.canvas.height =
        game.world.level.height * display.tileSheet.tileSize;
    display.buffer.canvas.width =
        game.world.level.width * display.tileSheet.tileSize;
    display.resize(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
        game.world.level.height / game.world.level.width
    );
}

//#endregion      //
/////////////////////

////////////////////
//#region *Objects* //

const display = new Display(document.getElementById("gameWindow"));
const controller = new Controller();
const game = new Game(lvl);
const engine = new Engine(1000 / 30, render, update);

//#endregion      //
////////////////////

///////////////////////
//#region *Listeners*//

//#region File loader //
const dropArea = document.getElementById("drop-area");

dropArea.addEventListener("dragover", (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Style the drag-and-drop as a "copy file" operation.
    event.dataTransfer.dropEffect = "copy";
});

dropArea.addEventListener("drop", (event) => {
    event.stopPropagation();
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    console.log(fileList.item(0));
    if (
        fileList.length > 1 ||
        (!fileList.item(0).name.includes(".ice") &&
            fileList.item(0).type != "application/json")
    ) {
        console.error("wrong format : .ice espected");
        return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        const rawdata = event.target.result;
        localStorage.setItem(fileList.item(0).name, rawdata);
        const importLevel = JSON.parse(rawdata);
        console.log(importLevel);
        game.level = importLevel;
        game.reset();
        reloadDisplay();
    });
    reader.readAsText(fileList.item(0));
});

//#endregion

//#region Controler //
window.addEventListener("keydown", (event) => {
    controller.keyDownUp(event.type, event.key);
    // console.log(event.key);
});
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
//#endregion

//#region Camera //
window.addEventListener("wheel", (event) => {
    display.camera.zoom += event.deltaY * 0.01;
});

let mouseDown = false;
let startX;
let startY;
window.addEventListener("mousedown", (event) => {
    mouseDown = true;
    startX = event.clientX;
    startY = event.clientY;
});
window.addEventListener("mousemove", (event) => {
    if (mouseDown) {
        display.camera.posC.x += (event.clientX - startX) * -0.02;
        display.camera.posC.y += (event.clientY - startY) * -0.02;
        startX = event.clientX;
        startY = event.clientY;
    }
});
window.addEventListener("mouseup", (event) => {
    mouseDown = false;
});
//#endregion

//#endregion         //
///////////////////////

//////////////////////////////
//#region Controle register //

controller.register(
    "cam",
    "m",
    () => {
        switch (display.camera.mode) {
            case "ALL":
                display.camera.mode = "PLAYER";
                display.camera.posC.x = game.world.player.pos.x;
                display.camera.posC.y = game.world.player.pos.y;
                break;
            case "PLAYER":
                display.camera.mode = "ALL";
                break;
            default:
                break;
        }
    },
    true
);
controller.register(
    "reset",
    "r",
    () => {
        game.reset();
    },
    true
);
controller.register(
    "up",
    ["z", "ArrowUp"],
    () => {
        if (!game.world.player.moving) game.world.player.move({ x: 0, y: -1 });
    },
    true
);
controller.register(
    "right",
    ["d", "ArrowRight"],
    () => {
        if (!game.world.player.moving) game.world.player.move({ x: 1, y: 0 });
    },
    true
);
controller.register(
    "down",
    ["s", "ArrowDown"],
    () => {
        if (!game.world.player.moving) game.world.player.move({ x: 0, y: 1 });
    },
    true
);
controller.register(
    "left",
    ("q", "ArrowLeft"),
    () => {
        if (!game.world.player.moving) game.world.player.move({ x: -1, y: 0 });
    },
    true
);

//#endregion                //
//////////////////////////////

//////////////////
/// Initialize ///
//////////////////
reloadDisplay();

display.camera.posC.x = game.world.player.pos.x;
display.camera.posC.y = game.world.player.pos.y;

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
