"use strict";

//////////////////////////
//#region *Url param* //

import baseLevel from "./level/map.js";

let lvl = JSON.stringify(baseLevel);

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("lvl")) {
    const lvlName = urlParams.get("lvl");
    const localLvl = localStorage.getItem(lvlName);
    if (localLvl !== null) {
        lvl = localLvl;
    } else {
        console.warn(`Level ${lvlName} not found`);
    }
} else if (urlParams.has("map-data")) {
    lvl = decodeURI(urlParams.get("map-data"));
    if (urlParams.has("map-id")) {
        localStorage.setItem(urlParams.get("map-id"), lvl);
        window.location.search = "lvl=" + urlParams.get("map-id");
    }
}

//#endregion            //
//////////////////////////

////////////////////////////
//#region *Import modules* ///

import { Vec2 } from "./game_modules/utils.js";
import { Display } from "./game_modules/display.js";
import { Controller } from "./game_modules/controller.js";
import { Game } from "./game_modules/game.js";
import { Engine } from "./game_modules/engine.js";

//#endregion              //
////////////////////////////

/////////////////////
//#region *Function* //

function render() {
    display.drawMap(game.world.level.data, game.world.level.width);
    display.drawWall(game.world.level.width, game.world.level.height);
    display.drawTile(
        { x: game.world.level.end.x + 1, y: game.world.level.end.y + 1 },
        19
    );
    display.drawTile(
        { x: game.world.level.start.x + 1, y: game.world.level.start.y + 1 },
        18
    );
    display.drawPlayer(
        game.world.player.displayPos,
        game.world.player.lastDir,
        game.world.player.animation.currentAnim,
        game.world.player.animation.currentFrame
    );
    display.updateCamera();
    display.render();
}
function update() {
    if (!keyBlock) {
        Object.keys(controller).forEach((key, index) => {
            if (controller[key].active) {
                controller[key].callback();
                controller[key].active = !controller[key].slow;
            }
        });
    }

    game.world.player.animation.update(engine.time);
    // console.log(engine.time);
    game.update();
}

function reloadDisplay() {
    display.buffer.canvas.height =
        (game.world.level.height + 2) * display.tileSheet.tileSize;
    display.buffer.canvas.width =
        (game.world.level.width + 2) * display.tileSheet.tileSize;
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

const gameWindow = document.getElementById("gameWindow");
const display = new Display(gameWindow);
const controller = new Controller();
const game = new Game(lvl);
const engine = new Engine(1000 / 30, render, update);
const menu = document.getElementById("menu");
let keyBlock = false;

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
        window.location.search = `?lvl=${fileList.item(0).name}`;
        const importLevel = JSON.parsetion(rawdata);
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
    display.camera.zoom += event.deltaY * 0.01 * (display.camera.zoom / 80);
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
        display.camera.posC.x +=
            (event.clientX - startX) * -0.02 * (display.camera.zoom / 100);
        display.camera.posC.y +=
            (event.clientY - startY) * -0.02 * (display.camera.zoom / 100);
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
    "center",
    " ",
    () => {
        display.camera.posC.copy(game.world.player.pos);
        console.log(display.camera);
    },
    true
);
controller.register(
    "cam",
    "m",
    () => {
        display.toggleCameraMode(
            document.documentElement.clientWidth,
            document.documentElement.clientHeight,
            game.world.level.height / game.world.level.width
        );
        display.camera.posC.copy(game.world.player.pos);
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
    ["q", "ArrowLeft"],
    () => {
        if (!game.world.player.moving) game.world.player.move({ x: -1, y: 0 });
    },
    true
);
controller.register(
    "esc",
    ["Escape"],
    () => {
        // console.log(engine.running);
        menu.classList.toggle("disable");
        gameWindow.classList.toggle("disable");
        // if (engine.running) engine.stop();
        // else engine.start();
    },
    true
);
controller.register(
    "return",
    ["v"],
    () => {
        // console.log(engine.running);
        window.location = "http://localhost/game.php";
        // menu.classList.toggle("disable");
        // gameWindow.classList.toggle("disable");
        // if (engine.running) engine.stop();
        // else engine.start();
    },
    true
);
controller.register(
    "edit",
    ["e"],
    () => {
        window.location = localStorage.getItem("editorUrl")
            ? localStorage.getItem("editorUrl")
            : "https://bafbi.github.io/2d-tilemap-editor/" +
              "?map-data=" +
              JSON.stringify(game.world.level);
        // window.location =
        //     "https://bafbi.github.io/2d-tilemap-editor/?map-data=" +
        //     JSON.stringify(game.world.level);
    },
    true
);

controller.register(
    "edit",
    ["E"],
    () => {
        keyBlock = true;
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Editor Url";
        input.style =
            "position: absolute; top: 50%; left: 50%; width: 10rem; height: 2rem;";
        document.body.appendChild(input);
        input.focus();
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                localStorage.setItem("editorUrl", input.value);
                input.remove();
                keyBlock = false;
            }
        });
    },
    true
);

//#endregion                //
//////////////////////////////

//////////////////
/// Initialize ///
//////////////////
export const api = {
    registerEvent(type, callback) {
        game.registerEvent(type, callback);
    },
};

reloadDisplay();

display.camera.posC.copy(game.world.player.pos);

display.tileSheet.image.src = "./assets/tilesheet.png";
display.player.image.src = "./assets/player.png";

display.tileSheet.image.onload = () => {
    display.resize(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
        game.world.level.height / game.world.level.width
    );

    engine.start();
};
