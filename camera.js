 class Camera{
	constructor(gl,fov,near,far){
		//Setup the perspective matrix
		this.projectionMatrix = new Float32Array(16);
		var ratio = gl.canvas.width / gl.canvas.height;
		Matrix4.perspective(this.projectionMatrix, fov || 45, ratio, near || 0.1, far || 100.0);
		this.transform = new Transform();		//Setup transform to control the position of the camera
		this.viewMatrix = new Float32Array(16);	//Cache the matrix that will hold the inverse of the transform.
		this.mode = Camera.MODE_ORBIT;			//Set what sort of control mode to use.
	}

	panX(v){
		if(this.mode == Camera.MODE_ORBIT) return; // Panning on the X Axis is only allowed when in free mode
		this.updateViewMatrix();
		this.transform.position.x += this.transform.right[0] * v;
		this.transform.position.y += this.transform.right[1] * v;
		this.transform.position.z += this.transform.right[2] * v; 
	}

	panY(v){
		this.updateViewMatrix();
		this.transform.position.y += this.transform.up[1] * v;
		if(this.mode == Camera.MODE_ORBIT) return; //Can only move up and down the y axix in orbit mode
		this.transform.position.x += this.transform.up[0] * v;
		this.transform.position.z += this.transform.up[2] * v; 
	}

	panZ(v){
		this.updateViewMatrix();
	
		if(this.mode == Camera.MODE_ORBIT){
			this.transform.position.z += v; //orbit mode does translate after rotate, so only need to set Z, the rotate will handle the rest.
		}else{
			//in freemode to move forward, we need to move based on our forward which is relative to our current rotation
			this.transform.position.x += this.transform.forward[0] * v;
			this.transform.position.y += this.transform.forward[1] * v;
			this.transform.position.z += this.transform.forward[2] * v; 
		}
	}

	//To have different modes of movements, this function handles the view matrix update for the transform object.
	updateViewMatrix(){
		//Optimize camera transform update, no need for scale nor rotateZ
		if(this.mode == Camera.MODE_FREE){
			this.transform.matView.reset()
				.vtranslate(this.transform.position)
				.rotateX(this.transform.rotation.x * Transform.deg2Rad)
				.rotateY(this.transform.rotation.y * Transform.deg2Rad);
				
		}else{
			this.transform.matView.reset()
				.rotateX(this.transform.rotation.x * Transform.deg2Rad)
				.rotateY(this.transform.rotation.y * Transform.deg2Rad)
				.vtranslate(this.transform.position);

		}
 
		this.transform.updateDirection();

		//Cameras work by doing the inverse transformation on all meshes, the camera itself is a lie :)
		Matrix4.invert(this.viewMatrix,this.transform.matView.raw);
		return this.viewMatrix;
	}
}

Camera.MODE_FREE = 0;	//Allows free movement of position and rotation, basicly first person type of camera
Camera.MODE_ORBIT = 1;	//Movement is locked to rotate around the origin, Great for 3d editors or a single model viewer


KBMCtrl = class{
	constructor(){
		this.canvas = gl.canvas;
		this.initX = 0;
		this.initY = 0;
		this.prevX = 0;
		this.prevY = 0;
		this._boundMouseMove = this.onMouseMove.bind(this);

		var box = this.canvas.getBoundingClientRect();
		this.offsetX = box.left;
		this.offsetY = box.top;

		this.canvas.addEventListener("mousedown",this.onMouseDown.bind(this));
		this.canvas.addEventListener("mouseup",this.onMouseUp.bind(this));
		this.canvas.addEventListener("mousewheel", this.onMouseWheel.bind(this));
		this.canvas.addEventListener("touchstart",this.onMouseDown.bind(this));
		this.canvas.addEventListener("touchend",this.onMouseUp.bind(this));


		document.addEventListener("keydown",this.onKeyDown.bind(this));
		document.addEventListener("keyup",this.onKeyUp.bind(this));

		this.onDownOverride = null;		//Optional, Allow the ability to swop event handlers or do whatever else before the evtHandlers do their job
		this._activeHandler = null;		//Handlers are like state machines, swop functionality when needed
		this._handlers = {};
	}

	switchHandler(name){ this._activeHandler = this._handlers[name]; ;return this; }
	addHandler(name,h,active){
		this._handlers[name] = h;
		if(active == true) this._activeHandler = h;

		return this;
	}
	
	setDownOverride(d){ this.onDownOverride = d; return this; }

	onMouseWheel(e){
		if(!this._activeHandler.onMouseWheel) return;

		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); //Try to map wheel movement to a number between -1 and
		
		this._activeHandler.onMouseWheel(e,this,delta);

	}

	onMouseDown(e){
		
		this.initX = this.prevX = e.pageX - this.offsetX;
		this.initY = this.prevY = e.pageY - this.offsetY

		if(e.type.startsWith("touch")){
			this.initX = this.prevX=e.touches[0].pageX - this.offsetX;
			this.initY = this.prevY= e.touches[0].pageY - this.offsetY;
		}

		if(this.onDownOverride != null) {this.onDownOverride(e,this,this.initX,this.initY);}

		if(this._activeHandler.onMouseDown) this._activeHandler.onMouseDown(e,this,this.initX,this.initY);
		this.canvas.addEventListener("mousemove",this._boundMouseMove);
		this.canvas.addEventListener("touchmove",this._boundMouseMove);
	}

	onMouseMove(e){
		var x = e.pageX - this.offsetX,	//Get X,y where the canvas's position is origin.
			y = e.pageY - this.offsetY

			if(e.type.startsWith("touch")){
				x = e.touches[0].pageX - this.offsetX;
				y = e.touches[0].pageY - this.offsetY;
				if(e.touches.length>=2){
					var delta = Math.max(-1, Math.min(1, (y-this.prevY))); //Try to map wheel movement to a number between -1 and
					this._activeHandler.onMouseWheel(e,this,delta);
					return
				}

			}
			
		var	dx = x - this.prevX,		//Difference since last mouse move
			dy = y - this.prevY;
		if(this._activeHandler.onMouseMove) this._activeHandler.onMouseMove(e,this,x,y,dx,dy);
		this.prevX = x;
		this.prevY = y;
		 
	}

	onMouseUp(e){
		var x = e.pageX - this.offsetX,	//Get X,y where the canvas's position is origin.
			y = e.pageY - this.offsetY,
			dx = x - this.prevX,		//Difference since last mouse move
			dy = y - this.prevY;

		this.canvas.removeEventListener("mousemove",this._boundMouseMove);
		if(this._activeHandler.onMouseUp) this._activeHandler.onMouseUp(e,this,x,y,dx,dy);
	}

	////console.log(e.key,e.keyCode,e.shiftKey,e.ctrlKey);
	onKeyDown(e){	if(this._activeHandler.onKeyDown)	this._activeHandler.onKeyDown(e,this,e.keyCode); }
	onKeyUp(e){		if(this._activeHandler.onKeyUp)		this._activeHandler.onKeyUp(e,this,e.keyCode); }
}

KBMCtrl_Viewport = class{
	constructor(camera){
		var w = gl.canvas.width, h = gl.canvas.height;
		this.camera = camera;
		

		this.rotRate = -500;	//How fast to rotate, degrees per dragging delta
		this.panRate = 5;		//How fast to pan, max unit per dragging delta
		this.zoomRate = 200;	//How fast to zoom or can be viewed as forward/backward movement

		this.yRotRate = this.rotRate / w * Math.PI/180;
		this.xRotRate = this.rotRate / h * Math.PI/180;
		this.xPanRate = this.panRate / w;
		this.yPanRate = this.panRate / h;

	}

	onMouseWheel(e,ctrl,delta){
	
		this.camera.transform.position.z += delta * this.zoomRate/gl.canvas.height
		
		;}
	onMouseMove(e,ctrl,x,y,dx,dy){
	
		//When shift is being helt down, wn  e pan around else we rotate.
		if(!e.shiftKey){

			this.camera.transform.rotation.y += dx * (this.rotRate / gl.canvas.width);
			this.camera.transform.rotation.x += dy * (this.rotRate / gl.canvas.height);
		
		}else{
			this.camera.panX( -dx * (this.panRate / gl.canvas.width) );
			this.camera.panY( dy * (this.panRate / gl.canvas.height) );
		}
	
		ctrl.prevX = x;
		ctrl.prevY = y; 
	}

	onKeyDown(e,ctrl,keyCode){
		switch(keyCode){		
			case 87: this.camera.position.z -= 2 * this.zPanRate; break;	//W
			case 83: this.camera.position.z += 2 * this.zPanRate; break;	//S
			case 65: this.camera.position.x -= 50 * this.xPanRate; break;	//A
			case 68: this.camera.position.x += 50 * this.xPanRate; break;	//D
			case 81: this.camera.euler.y += 10 * this.yRotRate; break;		//Q
			case 69: this.camera.euler.y -= 10 * this.yRotRate; break;		//E
		}
	}
}

class  KBMCtrl_Picking { 
	constructor(){this.rate = 0.007; }
	onMouseUp(e,ctrl,x,y,dx,dy){ ctrl.switchHandler("camera");return this }
	onMouseMove(e,ctrl,xx,yy,dx,dy){
					var v = [0,0,0];
	gCamera.transform.updateDirection();
	_CurrentModel.addPosition(gCamera.transform.right[0]/gl.canvas.width+dx*this.rate,
		gCamera.transform.up[1]/gl.canvas.height-dy*this.rate,
		0)

	return this;
	}		
}
