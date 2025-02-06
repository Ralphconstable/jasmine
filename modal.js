
class _3DObject {
	constructor(name){
		this.setName(name)	
		this.renderable=false;
		this.moveable=false
		this.display=[
			{"name":"renderable","editor":"boolean","caption":"Renderable","value":null},
			{"name":"moveable","editor":"boolean","caption":"Moveable","value":null},
			{"name":"id","editor":"number","caption":"ID","value":null},
			{"name":"scale","editor":"tripplepos","caption":"Scale","value":null}
		]		
		this.sections=[]

		this.uniforms=[]
		this.attributes=[]
		this.children=[]
	}

	addUniform(u){
		this.uniforms.push(u)
		this.initialize()
	}

	getUniforms(){return this.uniforms}


	filterObjectsByProperty(property,value){
		return this.uniforms.filter(obj=>obj[property]===value)
	}

	addChild(child){
		this.children.push(child)
	}

	getUniform(n,sect){
		if(!sect)sect=0
		var result = this.sections[sect].uniforms.find(({ name }) => name === n);	
		return result	
	}

	checkName(namev){
		var result = _OBJECTARRAY.find(({ name }) => name === namev);
		return result
	}
	setName(n){
		var x=0
		while(x<1006){
			if (this.checkName(n+x)==undefined)break
			x+=1
		}
		this.name=n+x
		//if(x==0)this.name=n
		return this;
	}

	createUniform(name,type,value){
		var editor=null
		if(value==null){
			if((type=='vec3'|| type=="vec4")
				&& ['diffuse','color','baseColor', 'Ka','Kd','Ks','Ke'].indexOf(name)>-1)
				editor="color"
		}
		if(type=="vec3")type="FLOAT_VEC3"
		this.uniforms.push({"name":name,"type":type,"value":[1,0,1],"editor":editor})
	}

	initialize(){
		for(var i=0;i<this.uniforms.length;i++){
			if(this.uniforms[i].pic!="" && this.uniforms[i].textureid==-1){
				var pic = document.getElementById("imgTex")
				pic.src=this.uniforms[i].pic
				var texid=BOTEX.loadTexture('texture',document.getElementById("imgTex"))
				this.uniforms[i].textureid=texid.id     
	
			}
		}
		return this;
	}
	addObjectToList(){
		_OBJECTARRAY.push(this)
		this.id=_OBJECTARRAY.length-1

	}
	addPropBox(){this.propbox=new PropBox2(this);this.propbox.hide();return this}
}

//------------------------------------------------------/
class Modal2 extends _3DObject{
	constructor(name,meshData,sect,add){
		super(name)
		if(!sect)
			this.sections.push({"name":"Default","objectName":"","material":"","index":[],"uniforms":[]})
		if(add==undefined)
			add=true
		this.shaderUniforms=[]
		this.fromFile=''
		this.renderable=true
		this.transform = new Transform();
		this.mesh = meshData;
		this.extent="local"
		this.uid=[]
		this.moveable =true;
		//this.uid=Utility.idToColor(_OBJECTARRAY.length+1)
		if(add)	this.addObjectToList()

		this.shader=null
		this.shaderchanged=true
		this.children=[]
		this.parent=null
	}
	setUID(n){	this.uid=Colors.idToColor(n)}
	//--------------------------------------------------------------------------
	//Getters/Setters
	setScale(x,y,z){ this.transform.scale.set(x,y,z); return this; }
	setPosition(x,y,z){ 
		this.transform.position.set(x,y,z);
		return this;
	}
	getPosition(){}
	setRotation(x,y,z){ this.transform.rotation.set(x,y,z); return this; }

	addScale(x,y,z){	this.transform.scale.x += x;	this.transform.scale.y += y;	this.transform.scale.y += y;	return this; }
	addPosition(x,y,z){	this.transform.position.x += x; this.transform.position.y += y; this.transform.position.z += z; return this; }
	addRotation(x,y,z){	this.transform.rotation.x += x; this.transform.rotation.y += y; this.transform.rotation.z += z; return this; }
	setShader(shdr){
		this.shader=shdr;
		return this;
	}
	setUniformsFromFile(sections,materials){
		this.sections=sections
		var materialCount=1
		var materialBlock=0
		var result
		for(var i=0;i<sections.length;i++){
			var result=-1
			for(var j=0;j<materials.length;j++)
				if(sections[i].name==materials[j][0].title)result=j
			for(var j=0;j<materials[result].length;j++){
				this.sections[i].uniforms.push(
					{"title":materials[result][j].title,
					"name":materials[result][j].name,
					"type":materials[result][j].type,
					 "value":materials[result][j].value,
					"textureid":materials[result][j].textureid,
					"unit":materials[result][j].unit,
					 "pic":materials[result][j].pic,
					 "editor":materials[result][j].editor}
					)
					
				}	
			}		
			return this
		}

	//--------------------------------------------------------------------------
	//Things to do before its time to render
	preRender(){ this.transform.updateMatrix();  return this; }
	render(MRT){
		if(!MRT)MRT=false
		if(MRT){gl.bindFramebuffer(gl.FRAMEBUFFER,fbo.id);}
			this.shader.activate()
			this.shader.setCameraMatrix(gCamera.viewMatrix)
			this.shader.setViewPosition(gCamera.transform.position)
       	/*	this.shader.prepareUniforms(this,0)
			var loc = gl.getUniformLocation(this.shader.program,'objid');
			gl.uniform3f(loc, this.uid[0],this.uid[1],this.uid[2]);
*/
        	this.shader.render(this.preRender(),0);

		if(MRT){
			this.drawToQuad()	
		}

    }
	drawToQuad(){
		gl.bindFramebuffer(gl.FRAMEBUFFER,null);
		quadModal.shader.activate()
		var loc= gl.getUniformLocation(quadModal.shader.program, 'tex0');
		gl.activeTexture(gl["TEXTURE" + 0]);
		gl.bindTexture(gl.TEXTURE_2D,fbo.colorBuf[0]);

		gl.uniform1i(loc,0);
		quadModal.shader.render(quadModal.preRender(),0);


	}
	createThumbnail(){
		var oldpos=[this.transform.position.x,this.transform.position.y,
			this.transform.position.z]
		this.setPosition(0.0,.7,-3)
		gCamera.updateViewMatrix();
		
		this.render()
		this.setPosition(oldpos[0],oldpos[1],oldpos[2])
    	var link = document.createElement('a');
    	link.download = 'filename.png';
    	link.href = gl.canvas.toDataURL('image/png')
    	link.click();
  	}

}


class SectionModal extends Modal2{
	constructor(name,mesh,sections,materials,f){

		super(name,mesh,sections)
		//this.setScale(0.04,0.04,0.04)
		this.sections=sections
		this.materials=materials
		this.base=	f.substring(0,f.lastIndexOf("\/")+1)
	}
	render(MRT){	
		if(!MRT)MRT=false
		if(MRT){gl.bindFramebuffer(gl.FRAMEBUFFER,fbo.id);}

		this.shader.activate()
		this.shader.setCameraMatrix(gCamera.viewMatrix)
		this.shader.setViewPosition(gCamera.transform.position)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.bufIndex);  
		gl.bindVertexArray(this.mesh.vao);
		for(var i=0;i<this.sections.length;i++){
			if(this.sections[i].type=="object")continue
			this.mesh.indexCount = this.sections[i].index.length;
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.sections[i].index), gl.STATIC_DRAW);
			this.shader.prepareUniforms(this,i)
			this.shader.renderModal( this.preRender(),this.mesh );
			var loc = gl.getUniformLocation(this.shader.program,'objid');
			gl.uniform3f(loc, this.uid[0],this.uid[1],this.uid[2]);

		}
		gl.bindVertexArray(null);
		if(MRT){
			this.drawToQuad()	
		}

	}


}
class Caster extends Modal2{
	constructor(name){	
		super(name,Primatives.Cube.createMesh(gl,1,1,1,0,0,0))
		this.extent="global"

		this.setPosition(1.2, 1, 2.0)
		this.setScale(0.2,0.2,0.2)
		var rev =new Vector3(0.5, 0.7, 1).normalize()

		this.sections[0].uniforms.push({"caption":"Color","name":"Kd","type":"FLOAT_VEC3","value":[1,0.0,0.0],"editor":"color","textureid":-1,"unit":-1,"pic":"","section":0});
		this.sections[0].uniforms.push({"caption":"Light Color","name":"lightColor","type":"FLOAT_VEC3","value":[1,1,1],"editor":"color","textureid":-1,"unit":-1,"pic":"","section":0});

		this.sections[0].uniforms.push({"caption":"Light Pos","name":"lightPos","type":"FLOAT_VEC3","value":[1.2,1.0,2.0],"editor":"edit","textureid":-1,"unit":-1,"pic":"","section":0});
		this.addPropBox()
	}
}



