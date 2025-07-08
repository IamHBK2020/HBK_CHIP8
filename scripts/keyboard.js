class Keyboard{
    constructor(){
        this.KEYMAP = {
            //the key are the ascii code to which the chip 8 values are getting mapped to
            //these are not typical hexes this is what chip8 used
            49:0x1, ///1 getting mapped to 1
            50:0x2,
            51:0x3,
            52:0xC, //c on chip8 getting mapped to 4
            81:0x4, //4 on chip8 getting mapped to Q
            87:0x5,
            69:0x6,
            82:0xD,
            65:0x7,
            83:0x8,
            68:0x9,
            70:0xE,
            90:0xA,
            88:0x0,
            67:0xB,
            86:0xF,
        }

        this.keysPressed = [];

        // when FXOA gets called we dynamically assign a callback fucntion to this.onNextKeyPress and it waits for a key
        this.onNextKeyPress = null;

        window.addEventListener('keydown', this.onKeyDown.bind(this), false); //.bind(this) refers to the class instance
		window.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }


    //for checking
    isKeyPressed(keyCode) {
        return this.keysPressed[keyCode]; //returns true if the key is true in the array means keydowned
    }

    onKeyDown(event) {
        let key = this.KEYMAP[event.which]; //w is pressed 87 is mapped to 0x5 
        this.keysPressed[key] = true; //index 0x5 i.e 5 is true
    
        // Make sure onNextKeyPress is initialized(FX0A called) and the pressed key is actually mapped to a Chip-8 key
        if (this.onNextKeyPress !== null && key !== undefined) {
            this.onNextKeyPress(parseInt(key)); //if 0xA chagnes to 10
            this.onNextKeyPress = null;
        }
    }

    onKeyUp(event) { // when we relase the key set the key value to false in the array
        let key = this.KEYMAP[event.which];
        this.keysPressed[key] = false;
    }
}

export default Keyboard;