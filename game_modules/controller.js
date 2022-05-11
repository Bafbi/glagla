export class Controller {
    constructor() {
        // this.active = false;
        this.left = new ButtonInput();
        this.right = new ButtonInput();
        this.up = new ButtonInput();
        this.down = new ButtonInput();
    }
    keyDownUp(type, code) {
        let down = type == "keydown" ? true : false;
        // if (this.down != down) this.active = down;

        switch (code) {
            case "KeyA":
                this.left.setState(down);
                break;
            case "KeyD":
                this.right.setState(down);
                break;
            case "KeyW":
                this.up.setState(down);
                break;
            case "KeyS":
                this.down.setState(down);
        }
    }
}

class ButtonInput {
    constructor() {
        this.down = false;
        this.active = false;
    }
    setState(down) {
        if (this.down != down) this.active = down;
        this.down = down;
    }
}
