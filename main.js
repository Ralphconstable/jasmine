function toggleProperties(){

	if(	_OBJECTARRAY[_SelectStart].propbox.div.style.display=="none"){
		_OBJECTARRAY[_SelectStart].propbox.show()
	}else{
		_OBJECTARRAY[_SelectStart].propbox.hide()

	}
}




function main(){

	_OBJECTARRAY=[]
	_SelectStart=-1

	lastPosition=new  Vector3(0,0,0)
	screen.orientation.addEventListener("change", (event) => {
  		const type = event.target.type;
  		const angle = event.target.angle;
		glCanvas.resize(window.innerWidth,window.innerWidth)
		 onRender(30)

	});
	_Galleries=[]
	//_Galleries.push(new Gallery2('Primatives').addIcons(_ModelsGallery).hide())
	_Galleries.push(new Gallery2('models'))
	glCanvas= new webglCanvas(window.innerWidth,window.innerHeight)
	gl=glCanvas.gl
	gCamera = new Camera(gl);
	_SceneGraph=new SceneGraph()
	_ShaderBox=new ShaderBox()

	gCamera.transform.position.set(0,1,3);
    gCameraCtrl = new KBMCtrl()
		.addHandler("camera",new KBMCtrl_Viewport(gCamera),true)
		.addHandler("pick",new KBMCtrl_Picking(),false)
			.setDownOverride(function(e,ctrl,x,y){  
          		var yi		= gl.canvas.height - y //Gotta flip the y
				  gCamera.updateViewMatrix();
				 //mouseCast1(x,yi)
         // drawPick()
		//	pixel	= FBO.readPixel(fbo,x,yi),
			//id		= Colors.colorToID(pixel)
		   // if(id == 0 || id == 16777215){PropBox2.hide();return}; //ignore Black and white.
			//_PropBox2.show(_OBJECTARRAY[id-1])
           //ctrl.switchHandler("pick");
        })
		  pShader=ShaderUtil.makeShader(ShaderUtil.domShaderSrc("vertex_shader"),ShaderUtil.domShaderSrc("fragment_shader"))
		   oShader=ShaderUtil.makeShader(ShaderUtil.domShaderSrc("vertex_shader"),ShaderUtil.domShaderSrc("fragment_outline"))
		   ShaderUtil.makeShaderFromdict('SimpleDiffuse')

		
		   gGridFloor=new GridFloor(gl)
		RLoop = new RenderLoop(onRender,30).start();
}

function onRender(dt){
	gCamera.updateViewMatrix();

	glCanvas.clear();
  // Set up stencil buffer
	gGridFloor.render(gCamera)
	for(var i=0;i<_OBJECTARRAY.length;i++){
		var curObj=_OBJECTARRAY[i]
		if(curObj instanceof Promise)continue
		if(curObj.renderable){
			if(_SelectStart==i){
				outline(curObj)
			}else{	
				curObj.render(false)
			}
		}
	}  
  
}
