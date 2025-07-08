class Speaker{

    constructor(){

        this.audioCtx = new AudioContext();

        this.gain = this.audioCtx.createGain(); //for volume control
        this.finish = this.audioCtx.destination; //seelct the destination my speaker
        this.gain.connect(this.finish); //links gain to destination i.e speaker

    }

    play(frequency){

        if(this.audioCtx && !this.oscillator){
            this.oscillator = this.audioCtx.createOscillator(); //creates an oscillatorNode
            this.oscillator.frequency.setValueAtTime(frequency || 440, this.audioCtx.currentTime); ///set frequency
            this.oscillator.type = 'square'; //square wave
            this.oscillator.connect(this.gain); //connect oscillator to gain
            this.oscillator.start();
        }

    }

    stop(){
        if(this.oscillator){
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
        }
    }
    

    
}

export default Speaker;