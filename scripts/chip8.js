import Render from './renderer.js';
import Keyboard from './keyboard.js';
import Speaker from './speaker.js';
import CPU from './cpu.js';



//create instances

const renderer = new Render(10);  // scale = 10
const keyboard = new Keyboard();
const speaker = new Speaker();
const cpu = new CPU(renderer,keyboard,speaker);

let fps = 60;
let loop;
let startTime,then,elapsedTime,fpsInterval = 0;
let isRunning = false;

//intialize and start the render loop

async function init(){
    fpsInterval = 1000/fps; //60 frames 1 second so 1 frame 16.67 ms
    then = performance.now();
    startTime = then;

    cpu.loadSpritesIntoMemory();
    await cpu.loadRom('INVADERS');
    updateStatus('INVADERS');

    // Setup file input handler
    const romInput = document.getElementById('romInput');
    romInput.addEventListener('change', handleRomChange);

    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', handleReset);

    startEmulation();
}

async function handleRomChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        // Stop current emulation
        stopEmulation();
        
        // Load new ROM
        const romName = await cpu.loadRomFromFile(file);
        updateStatus(romName);
        
        // Restart emulation
        startEmulation();
    } catch (error) {
        console.error('Failed to load ROM:', error);
        alert('Failed to load ROM. Please try another file.');
    }
}

function updateStatus(romName) {
    const status = document.getElementById('status');
    status.textContent = `Current ROM: ${romName}`;
}



// After defining handleRomChange and before startEmulation()
function handleReset() {
    stopEmulation();
    cpu.reset();
    cpu.loadSpritesIntoMemory();
    // Reload the current ROM (from status or keep track of last loaded ROM)
    const romName = document.getElementById('status').textContent.replace('Current ROM: ', '');
    if (romName) {
        cpu.loadRom(romName).then(() => {
            startEmulation();
        });
    }
}

// In your init() function, after setting up romInput:


function startEmulation() {
    if (!isRunning) {
        isRunning = true;
        loop = requestAnimationFrame(step);
    }
}

function stopEmulation() {
    if (isRunning) {
        isRunning = false;
        cancelAnimationFrame(loop);
    }
}

//then refers to the last time frame gets rendered initially performance.now()
//then gets updated when the new frame renders may have some drift that is delay
//timestamp refers to the current time and changes every step call

function step(timestamp) {
    if (!isRunning) return;

    elapsedTime = (timestamp - then);

    if(elapsedTime>fpsInterval){
        //cycle the CPU
        //render the frames
        //update the then
        cpu.cycle();
        then = timestamp - (elapsedTime % fpsInterval); // this is done to reset the drift
    }

    loop = requestAnimationFrame(step); //asks browser for next frame
}

init();

