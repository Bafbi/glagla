export class Controller {
    constructor() {
        // this.active = false;
        this.left = new ButtonInput("q");
        this.right = new ButtonInput("d");
        this.up = new ButtonInput("z");
        this.down = new ButtonInput("s");
        this.reset = new ButtonInput("r");
        this.cam = new ButtonInput("m");
    }
    keyDownUp(type, code) {
        let down = type == "keydown" ? true : false;

        Object.keys(this).forEach((key, index) => {
            if (this[key].keyCode == code) this[key].setState(down);
        });
    }
}

class ButtonInput {
    constructor(keyCode) {
        this.down = false;
        this.active = false;
        this.keyCode = keyCode;
    }
    setState(down) {
        if (this.down != down) this.active = down;
        this.down = down;
    }
}
