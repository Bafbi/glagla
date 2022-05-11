export class Controller {
    constructor() {
        // this.active = false;
        this.left = new ButtonInput("KeyA");
        this.right = new ButtonInput("KeyD");
        this.up = new ButtonInput("KeyW");
        this.down = new ButtonInput("KeyS");
        this.reset = new ButtonInput("KeyR");
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
