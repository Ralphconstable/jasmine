//--------------------------------------------------
// Global Constants 
//--------------------------------------------------
const ATTR_POSITION_NAME	= "a_position";
const ATTR_POSITION_LOC		= 0;
const ATTR_NORMAL_NAME		= "a_norm";
const ATTR_NORMAL_LOC		= 1;
const ATTR_UV_NAME			= "a_uv";
const ATTR_UV_LOC			= 2;



//--------------------------------------------------
// Util  Class 
//--------------------------------------------------
class GlUtil{

	//Convert Hex colors to float arrays, can batch process a list into one big array.
	//example : GlUtil.rgbArray("#FF0000","00FF00","#0000FF");
	static rgbArray(){
		if(arguments.length == 0) return null;
		var rtn = [];

		for(var i=0,c,p; i < arguments.length; i++){
			if(arguments[i].length < 6) continue;
			c = arguments[i];		//Just an alias(copy really) of the color text, make code smaller.
			p = (c[0] == "#")?1:0;	//Determine starting position in char array to start pulling from

			rtn.push(
				parseInt(c[p]	+c[p+1],16)	/ 255.0,
				parseInt(c[p+2]	+c[p+3],16)	/ 255.0,
				parseInt(c[p+4]	+c[p+5],16)	/ 255.0
			);
		}
		return rtn;
	}

}



class webglCanvas {
    constructor(w,h) {	

        this.width = w; // Default canvas width
        this.height = h; // Default canvas height
        this.gl = null; // WebGL2 context
		this.createCanvas()
		this.initializeCanvas()
    }

    createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.gl = canvas.getContext("webgl2");
		canvas.style.marginTop="10px"
        document.getElementById("homeplate").appendChild(canvas);
		
    }

    initializeCanvas() {
        if (!this.gl) {
            console.error("WebGL context is not created. Call createCanvas() first.");
            return;
        }

        this.gl.viewport(0, 0, this.width, this.height);
        this.init(this.gl)
        
        this.setClearColor(125/255,125/255,125/255); // Default clear color
        this.clear();
    }

    init(gl){
		//...................................................
		//Setup custom properties
		gl.mMeshCache = [];	//Cache all the mesh structs, easy to unload buffers if they all exist in one place.
		
		gl.mTextureCache = [];
		//...................................................
		//Setup GL, Set all the default configurations we need.
		gl.cullFace(gl.BACK);								//Back is also default
		
 		gl.frontFace(gl.CCW);								//Dont really need to set it, its ccw by default.
		
		gl.enable(gl.DEPTH_TEST);							//Shouldn't use this, use something else to add depth detection
		
		gl.enable(gl.CULL_FACE);							//Cull back face, so only show triangles that are created clockwise

		gl.depthFunc(gl.LEQUAL);							//Near things obscure far things
	
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);	//Setup default alpha blending
	}

    setClearColor(r,g,b) {
        this.gl.clearColor(r, g, b, 1.0);
		this.clear();

    }

    clear() {
        if (!this.gl) {
            console.error("WebGL context is not created. Call createCanvas() first.");
            return;
        }

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
		document.getElementById("homeplate").width=width+"px"
		document.getElementById("homeplate").height=height+"px"

        if (this.gl) {
            this.gl.canvas.width = width;
            this.gl.canvas.height = height;
            this.gl.viewport(0, 0, width, height);
            this.clear();
        }
    }
}

class RenderLoop{
	constructor(callback,fps){
		var oThis = this;
		this.msLastFrame = null;	//The time in Miliseconds of the last frame.
		this.callBack = callback;	//What function to call for each frame
		this.isActive = false;		//Control the On/Off state of the render loop
		this.fps = 0;				//Save the value of how fast the loop is going.

		//if(!fps && fps > 0){ //Build a run method that limits the framerate
		if(fps != undefined && fps > 0){ //Build a run method that limits the framerate
			this.msFpsLimit = 1000/fps; //Calc how many milliseconds per frame in one second of time.
			this.run = function(){
				//Calculate Deltatime between frames and the FPS currently.
				var msCurrent	= performance.now(),
					msDelta		= (msCurrent - oThis.msLastFrame),
					deltaTime	= msDelta / 1000.0;		//What fraction of a single second is the delta time
				
				if(msDelta >= oThis.msFpsLimit){ //Now execute frame since the time has elapsed.
					oThis.fps			= Math.floor(1/deltaTime);
					oThis.msLastFrame	= msCurrent;
					oThis.callBack(deltaTime);
				}

				if(oThis.isActive) window.requestAnimationFrame(oThis.run);
			}
		}else{ //Else build a run method thats optimised as much as possible.
			this.run = function(){
				//Calculate Deltatime between frames and the FPS currently.
				var msCurrent	= performance.now(),	//Gives you the whole number of how many milliseconds since the dawn of time :)
					deltaTime	= (msCurrent - oThis.msLastFrame) / 1000.0;	//ms between frames, Then / by 1 second to get the fraction of a second.

				//Now execute frame since the time has elapsed.
				oThis.fps			= Math.floor(1/deltaTime); //Time it took to generate one frame, divide 1 by that to get how many frames in one second.
				oThis.msLastFrame	= msCurrent;

				oThis.callBack(deltaTime);
				if(oThis.isActive) window.requestAnimationFrame(oThis.run);
			}
		}
	}

	start(){
		this.isActive = true;
		this.msLastFrame = performance.now();
		window.requestAnimationFrame(this.run);
		return this;
	}

	stop(){ this.isActive = false; }
}







	