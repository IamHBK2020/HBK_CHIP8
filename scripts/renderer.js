class Render{

    constructor(scale){
        this.cols = 64; //length
        this.rows = 32; //breadth

        this.scale = scale;
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d'); // fetch the get2drenderobj for my canvas bascically acts as an API

        this.canvas.width = this.cols * this.scale; //scaling 640 * 320 if scale = 10
        this.canvas.height = this.rows * this.scale;

        this.display = new Array(this.cols * this.rows); // creating array 1D unscaled for easier mapping

    }

    setPixel(x,y){
        // if they are out of bounds and 
        // also toggle pixel on off in this function bascially the 1D display array

        //theese two if conditions for wrapping around
        if(x >= this.cols){
            x -= this.cols;
        }else if (x < 0){
            x += this.cols;
        }

        if(y >= this.rows){
            y -= this.rows;
        }else if (y < 0){
            y += this.rows;
        }

        //pixel location or its index in the 1D array
        let pixelLoc = x + (y * this.cols);
        
        this.display[pixelLoc] = this.display[pixelLoc] ^ 1;

        return this.display[pixelLoc] === 0; // if true pixel erased if false not erased
        //useful for detecting **Sprite Collisions
    }


    clear(){
        this.display = new Array(this.cols * this.rows); // clears the display i.e creates a new display array
    }


    render(){ // this gets called per second 60fps 

        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height); //starts clearing from the top left corner upto the width and height

        for(let i = 0;i<this.cols * this.rows;i++){

            let x = (i % this.cols) * this.scale;   //converts 1D index to 2D coordinates
            let y = Math.floor(i / this.cols) * this.scale;


            if(this.display[i]){  //if array[i] cotnains 1 fill that
 
                this.ctx.fillStyle = '#00FF00';

                this.ctx.fillRect(x,y,this.scale,this.scale);
            }
        }

    }

    // testRender() {
    //     this.setPixel(0, 0);
    //     this.setPixel(5, 2);
    //     this.setPixel(1, 3);
    //     this.setPixel(10, 20);
    //     this.setPixel(33, 22);
    // }


}

export default Render; //exports the Render class