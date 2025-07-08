class CPU{

    constructor(renderer,keyboard,speaker){
        this.renderer = renderer;
        this.speaker = speaker;
        this.keyboard = keyboard;

        this.memory = new Uint8Array(4096); // 4096 bytes of memory 8 bits each
        this.v = new Uint8Array(16); // 16 registers of 8 bits each **unsigned array

        this.i = 0; //index register

        this.delayTimer = 0; //DT
        this.soundTimer = 0; //ST

        this.pc = 0x200; //program counter , our program starts from address 0x200

        this.stack = [];

        this.paused = false; // some instructions require pausing such as FX0A

        this.speed = 10; ///10 instructions per cycle

    }



loadSpritesIntoMemory(){
    const sprites = [
        0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
        0x20, 0x60, 0x20, 0x20, 0x70, // 1
        0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
        0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
        0x90, 0x90, 0xF0, 0x10, 0x10, // 4
        0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
        0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
        0xF0, 0x10, 0x20, 0x40, 0x40, // 7
        0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
        0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
        0xF0, 0x90, 0xF0, 0x90, 0x90, // A
        0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
        0xF0, 0x80, 0x80, 0x80, 0xF0, // C
        0xE0, 0x90, 0x90, 0x90, 0xE0, // D
        0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
        0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];

    for(let i = 0; i < sprites.length; i++){
        this.memory[i] = sprites[i];
        //first (0-79)80 bytes are used to store the sprites , normally from 0x50 that is 80 itself they are stored
    }
}

loadProgramIntoMemory(program){
    for(let i = 0; i < program.length ;i++){
        this.memory[0x200 + i] = program[i];
    }
    //program stored from 0x200 in memory
}

async loadRom(romName) {
    try {
      const response = await fetch(`roms/${romName}`);
      if (!response.ok) {
        throw new Error(`Failed to load ROM: ${response.status} ${response.statusText}`);
      }
  
      const arrayBuffer = await response.arrayBuffer();
      const program = new Uint8Array(arrayBuffer);
      this.loadProgramIntoMemory(program);
    } catch (error) {
      console.error('Error loading ROM:', error.message);
    }
  }
  

cycle(){
    //this function will get called 60 times per second in chip8.js
    //handles execution of instructions ,update timers,renders graphhics

    for(let i = 0;i < this.speed;i++){
        if(!this.paused){ //meaning emulator is not paused
            let opcode = (this.memory[this.pc]<<8 | this.memory[this.pc+1]); //getting opcode that were stored in big endian format
            this.executeInstruction(opcode);
        }
    }

    if(!this.paused){ //meaning if the game is not paused
        this.updateTimers();
    }

    this.playSound();
    this.renderer.render();
}


//delay timer basically says when to do the next action
//sound timer tells us till how long the sound plays

updateTimers(){
    //if they are grater than 0 decrement by 1;

    if(this.delayTimer > 0){
        this.delayTimer-= 1;
    }

    if(this.soundTimer > 0){
        this.soundTimer-=1;
    }
}

playSound(){
    if(this.soundTimer > 0){
        this.speaker.play(440);
    }else{
        this.speaker.stop();
    }
}





executeInstruction(opcode){
    this.pc +=2; //increment by 2 beacuse instructions are of 2bytes i.e takes 2 mem adresses

    let x = (opcode & 0x0F00) >> 8; //we shift to remove the extra 8bits from the end that might result in a bigger number

    let y = (opcode & 0x00F0) >> 4  //here we remove the extra 4bits from the end

    switch(opcode & 0xF000){ //get the 1st digit that defines most of the opcode
        case 0x0000:
            switch (opcode){
                case 0x00E0:
                    this.renderer.clear();
                    break;
                case 0x00EE:
                    this.pc = this.stack.pop(); //after returning from the subroutine pops the last address from the stack and pushes it into the program counter
                    break;
            }
            break;

        case 0x1000:
            this.pc = (opcode & 0xFFF); //1NNN: jumpst to NNN basically PC gets updated to NNN address
            break;
        case 0x2000:
            this.stack.push(this.pc); //pushes the current pc and the updates it to NNN
            this.pc = (opcode & 0xFFF);
            break;
        case 0x3000: //3xkk
            if(this.v[x] === (opcode & 0x00FF)){
                this.pc +=2;
            }
            break;
        case 0x4000: //4xkk
            if(this.v[x]!== (opcode & 0x00FF)){
                this.pc+=2;
            }
            break;
        case 0x5000: //5xy0
            if(this.v[x] === this.v[y]){
                this.pc+=2;
            }
            break;
        case 0x6000: //6xkk
            this.v[x] = (opcode & 0x00FF);
            break;
        case 0x7000:
            this.v[x] = this.v[x] + (opcode & 0x00FF);
            break;
        case 0x8000:
            switch (opcode & 0x000F){ //after the 1st index = 8 , check the last indexes
                case 0x0:
                    this.v[x] = this.v[y];
                    break;
                case 0x1:
                    this.v[x] = this.v[x] | this.v[y];
                    break;
                case 0x2:
                    this.v[x] = this.v[x] & this.v[y];
                    break;
                case 0x3:
                    this.v[x] = this.v[x] ^ this.v[y];
                    break;
                case 0x4: //add vx,vy
                    let sum  = this.v[x] + this.v[y];

                    this.v[0XF] = 0; //v[f] or v[0xf] is the flag

                    if(sum > 0xFF){ //0xFF is 255
                        this.v[0xF] = 1; //set carry flag to  1 if overflow
                    }

                    this.v[x] = sum; //unit8array automatically stores lowest 8 bit value
                    break;
                case 0x5: //sub vx,vy
                    this.v[0xF] = 0;

                    if(this.v[x] > this.v[y]){
                        this.v[0xF] = 1; //if no borrow
                    }
                    this.v[x] -= this.v[y];

                    break;
                case 0x6:
                    this.v[0xF] = (this.v[x] & 0x1); //LSB mask

                    this.v[x] >>= 1;

                    break;
                case 0x7:
                    this.v[0xF] = 0;

                    if(this.v[y] > this.v[x]){
                        this.v[0xF] = 1; //if no borrow
                    }
                    
                    this.v[x] = this.v[y] - this.v[x];

                    break;
                case 0xE:
                    this.v[0xF] = (this.v[x] & 0x80); //MSB 8 bit mask
                    this.v[x] <<= 1;

                    break;
            }
            break;

        case 0x9000:
            if(this.v[x]!== this.v[y]){
                this.pc +=2;
            }

            break;
        case 0xA000: //Annn
            this.i = (opcode & 0x0FFF);

            break;
        case 0xB000: //jump Bnnn nnn
            this.pc = (opcode & 0x0FFF) + this.v[0];

            break;
        case 0xC000: //Cxkk
            let rand = Math.floor(Math.random() * 0x100); //0x100 refers to 256 so geenerate random numbers between 0 and 255
            this.v[x] = rand & (opcode & 0xFF);

            break;
        case 0xD000://DRW Vx, Vy,nibble (DXYn)
            let width = 8;
            let height  = (opcode & 0x000F);//last nibble n

            this.v[0xF] = 0;

            for(let row = 0;row < height;row++){
                let sprite = this.memory[this.i + row];

                for(let col = 0; col < width; col++){

                    if((sprite & 0x80) > 0){ //checks the MSB , if it is 1 then only set pixel
                        if(this.renderer.setPixel(this.v[x]+ col,this.v[y]+row)){
                            this.v[0xF] = 1; // if true collision occured pixel that was on,got turned off
                        }

                    }
                    sprite <<= 1; //we  shift the sprite as to iterate through every bit ,becasuse manually we cant iterate over bits

                }
            }

            break;
        case 0xE000:
            switch (opcode & 0x00FF){
                case 0x9E: //SKIP
                    if(this.keyboard.isKeyPressed(this.v[x])){ //if key stored in Vx is pressed,skip next instruction
                        this.pc += 2;
                    }
                    break;
                case 0xA1: //when i press a key in the array that postion is set to true
                    if(!this.keyboard.isKeyPressed(this.v[x])){ //if
                        this.pc +=2;
                    }
                    break;
            }
            break;

        case 0xF000:
            switch(opcode & 0x00FF){
                case 0x07:
                    this.v[x] = this.delayTimer;
                    break;
                case 0x0A: //pause untill a key is pressed and stored in vx
                    this.paused = true;
                    
                    this.keyboard.onNextKeyPress = function (key) {
                        this.v[x] = key;
                        this.paused = false;
                      }.bind(this); //ensure that this refers to the cpu object not the keyboard

                    break;
                case 0x15:
                    this.delayTimer = this.v[x];
                    break;
                case 0x18:
                    this.soundTimer = this.v[x];
                    break;
                case 0x1E:
                    this.i = (this.i + this.v[x]);
                    break;
                case 0x29:
                    this.i = this.v[x] * 5; //beacuse each sprite takes 5 indexes
                    break;
                case 0x33: //BCD
                    this.memory[this.i] = Math.floor(this.v[x]/100); //hundreds
                    this.memory[this.i+1] = Math.floor((this.v[x]%100)/10); //tens
                    this.memory[this.i+2] = (this.v[x]%10); //ones

                    break;
                case 0x55: //stores values from v0 to vs into starting from this.memory[this.i]
                    for(let loc = 0; loc <= x; loc++){
                        this.memory[this.i + loc] = this.v[loc];
                    }

                    break;
                case 0x65:
                    for(let idx = 0; idx <= x; idx++){
                        this.v[idx] = this.memory[this.i + idx];
                    }
                    break;
            }
            break;

        default:
            throw new Error('Unknown opcode: ' + opcode);

    }
    


    
}

async loadRomFromFile(file) {  //loading from the select option in the browser
    try {
        const arrayBuffer = await file.arrayBuffer();
        const program = new Uint8Array(arrayBuffer);
        
        this.reset(); // Reset CPU state
        this.loadProgramIntoMemory(program);
        return file.name;
    } catch (error) {
        console.error('Error loading ROM from file:', error.message);
        throw error;
    }
}

reset() {
    // Reset all CPU registers and memory
    this.memory = new Uint8Array(4096);
    this.v = new Uint8Array(16);
    this.i = 0;
    this.pc = 0x200;
    this.stack = []; // Use an empty array, not Uint16Array
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.paused = false;
    this.loadSpritesIntoMemory();
    if (this.renderer && typeof this.renderer.clear === 'function') {
        this.renderer.clear();
    }
}

}


export default CPU;