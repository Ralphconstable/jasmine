class Shader{
	constructor(gl,vertShaderSrc,fragShaderSrc){
		this._GLOBALARRAY=[]
		this.program = ShaderUtil.createProgramFromText(gl,vertShaderSrc,fragShaderSrc,true);
		this._GLOBALARRAY.length=[]

		if(this.program != null){
			this.gl = gl;
			this.gl.useProgram(this.program);
			this.attribLoc = ShaderUtil.getStandardAttribLocations(this.gl,this.program);
			this.uniformLoc = ShaderUtil.getStandardUniformLocations(this.gl,this.program);
			this.extractedVert=	ShaderUtil.extractAttributesAndUniforms(vertShaderSrc)
			this.extractedFrag=	ShaderUtil.extractAttributesAndUniforms(fragShaderSrc)
		}

		//Note :: Extended shaders should deactivate shader when done calling super and setting up custom parts in the constructor.
	}

	//...................................................
	//Methods
	activate(){ this.gl.useProgram(this.program); return this; }
	deactivate(){ this.gl.useProgram(null); return this; }

	setPerspective(matData){	this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData); return this; }
	setModalMatrix(matData){	this.gl.uniformMatrix4fv(this.uniformLoc.modalMatrix, false, matData); return this; }
	setCameraMatrix(matData){	this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData); return this; }
	setViewPosition(vecData){  this.gl.uniform3f(this.uniformLoc.viewPos, false, vecData.x,vecData.y,vecData.z); return this; }

	//function helps clean up resources when shader is no longer needed.
	dispose(){
		//unbind the program if its currently active
		if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
		this.gl.deleteProgram(this.program);
	}

	//...................................................
	//RENDER RELATED METHODS

	//Setup custom properties
	preRender(){} //abstract method, extended object may need need to do some things before rendering.

	//Handle rendering a modal
	renderModal(modal,mesh){
		this.setModalMatrix(modal.transform.getViewMatrix());
		this.gl.bindVertexArray(mesh.vao);

		if(mesh.noCulling) this.gl.disable(this.gl.CULL_FACE);
		if(mesh.doBlending) this.gl.enable(this.gl.BLEND);
		
		if(mesh.indexCount) this.gl.drawElements(mesh.drawMode, mesh.indexCount, this.gl.UNSIGNED_SHORT,0); 
		else this.gl.drawArrays(mesh.drawMode, 0, mesh.vertexCount);

		//Cleanup
		this.gl.bindVertexArray(null);
		if(mesh.noCulling) this.gl.enable(this.gl.CULL_FACE);
		if(mesh.doBlending) this.gl.disable(this.gl.BLEND);

		return this;
	}

	render(modal,i){
		this.setModalMatrix(modal.transform.getViewMatrix());	
		//Set the transform, so the shader knows where the modal exists in 3d space
		this.gl.bindVertexArray(modal.mesh.vao);

		if(modal.mesh.noCulling) this.gl.disable(this.gl.CULL_FACE);
		if(modal.mesh.doBlending) this.gl.enable(this.gl.BLEND);
		if(modal.mesh.indexCount) this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexCount, gl.UNSIGNED_SHORT, 0); 
		else this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vertexCount);

		//Cleanup
		this.gl.bindVertexArray(null);
		if(modal.mesh.noCulling) this.gl.enable(this.gl.CULL_FACE);
		if(modal.mesh.doBlending) this.gl.disable(this.gl.BLEND);
		

		return this;
	}
	prepareUniforms(obj,sect){
		const result = _OBJECTARRAY.filter(item => item.extent === 'global');
		if(result.length>0){
			for(var i=0;i<result.length;i++){
				var uniforms=result[i].sections[0].uniforms
				for(var j=0;j<uniforms.length;j++){
					ShaderUtil.createUniformSetter(this.program,uniforms[j] ) 
				}
			}
		}
		if(!sect)sect=0
			for(var j=0;j<obj.sections[sect].uniforms.length;j++)
				ShaderUtil.createUniformSetter(this.program,obj.sections[sect].uniforms[j] ) 
		return this;
	}



}


class ShaderUtil{
	//-------------------------------------------------
	// Main utility functions
	//-------------------------------------------------

	//get the text of a script tag that are storing shader code.
	static domShaderSrc(elmID){
		var elm = document.getElementById(elmID);
		if(!elm || elm.text == ""){ console.log(elmID + " shader not found or no text."); return null; }
		
		return elm.text;
	}

	//Create a shader by passing in its code and what type
	static createShader(gl,src,type){
		var shader = gl.createShader(type);
		gl.shaderSource(shader,src);
		gl.compileShader(shader);

		//Get Error data if shader failed compiling
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	//Link two compiled shaders to create a program for rendering.
	static createProgram(gl,vShader,fShader,doValidate){
		//Link shaders together
		var prog = gl.createProgram();
		gl.attachShader(prog,vShader);
		gl.attachShader(prog,fShader);

		//Force predefined locations for specific attributes. If the attibute isn't used in the shader its location will default to -1
		gl.bindAttribLocation(prog,ATTR_POSITION_LOC,ATTR_POSITION_NAME);
		gl.bindAttribLocation(prog,ATTR_NORMAL_LOC,ATTR_NORMAL_NAME);
		gl.bindAttribLocation(prog,ATTR_UV_LOC,ATTR_UV_NAME);

		gl.linkProgram(prog);

		//Check if successful
		if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
			console.error("Error creating shader program.",gl.getProgramInfoLog(prog));
			gl.deleteProgram(prog); return null;
		}
		//Only do this for additional debugging.
		if(doValidate){
			gl.validateProgram(prog);
			if(!gl.getProgramParameter(prog,gl.VALIDATE_STATUS)){
				console.error("Error validating program", gl.getProgramInfoLog(prog));
				gl.deleteProgram(prog); return null;
			}
		}
		//Can delete the shaders since the program has been made.
		gl.detachShader(prog,vShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
		gl.detachShader(prog,fShader);
		gl.deleteShader(fShader);
		gl.deleteShader(vShader);
		return prog;
	}

	//-------------------------------------------------
	// Helper functions
	//-------------------------------------------------
	
	//Pass in Script Tag IDs for our two shaders and create a program from it.
	static domShaderProgram(gl,vectID,fragID,doValidate){
		var vShaderTxt	= ShaderUtil.domShaderSrc(vectID);								if(!vShaderTxt)	return null;
		var fShaderTxt	= ShaderUtil.domShaderSrc(fragID);								if(!fShaderTxt)	return null;
		var vShader		= ShaderUtil.createShader(gl,vShaderTxt,gl.VERTEX_SHADER);		if(!vShader)	return null;
		var fShader		= ShaderUtil.createShader(gl,fShaderTxt,gl.FRAGMENT_SHADER);	if(!fShader){	gl.deleteShader(vShader); return null; }
		return ShaderUtil.createProgram(gl,vShader,fShader,true);
	}

	static createProgramFromText(gl,vShaderTxt,fShaderTxt,doValidate){
		var vShader		= ShaderUtil.createShader(gl,vShaderTxt,gl.VERTEX_SHADER);		if(!vShader)	return null;
		var fShader		= ShaderUtil.createShader(gl,fShaderTxt,gl.FRAGMENT_SHADER);	if(!fShader){	gl.deleteShader(vShader); return null; }
		var p = ShaderUtil.createProgram(gl,vShader,fShader,true);
		return p
	}

	//-------------------------------------------------
	// Setters / Getters
	//-------------------------------------------------

	//Get the locations of standard Attributes that we will mostly be using. Location will = -1 if attribute is not found.
	static getStandardAttribLocations(gl,program){
		return {
			position:	gl.getAttribLocation(program,ATTR_POSITION_NAME),
			norm:		gl.getAttribLocation(program,ATTR_NORMAL_NAME),
			uv:			gl.getAttribLocation(program,ATTR_UV_NAME)
		};
	}

	static getStandardUniformLocations(gl,program){
		return {
			perspective:	gl.getUniformLocation(program,"uPMatrix"),
			modalMatrix:	gl.getUniformLocation(program,"uMVMatrix"),
			cameraMatrix:	gl.getUniformLocation(program,"uCameraMatrix"),
			mainTexture:	gl.getUniformLocation(program,"uMainTex"),
			viewPos:	gl.getUniformLocation(program,"viewPos")

		};
	}
    static extractAttributesAndUniforms(shaderCode ) {
		
        const attributes = [];
        const uniforms = [];
		const structures = [];
      
        // Regular expressions to match attribute and uniform declarations in GLSL
        const attributeRegex = /in\s+(\w+)\s+(\w+)\s*;/g;
        const uniformRegex = /uniform\s+(\w+)\s+(\w+)\s*;/g;
		const structureRegex =/struct\s+(\w+)\s+\{([^\)]+)\}/g
        // Find and store attribute declarations
        let attributeMatches;
        while ((attributeMatches = attributeRegex.exec(shaderCode)) !== null) {
          const [, type, name] = attributeMatches;
          attributes.push({ type, name });
        }
      
        // Find and store uniform declarations
        let uniformMatches;
        while ((uniformMatches = uniformRegex.exec(shaderCode)) !== null) {
          const [, type, name] = uniformMatches;
          uniforms.push({ type, name });
        }
		let structMatches
        while ((structMatches = structureRegex.exec(shaderCode)) !== null) {
          const [st, type, name] = structMatches;
		 var structElements= st.substring(st.indexOf("{")+2).split(/\s{1,}/)
		 for(var i=1;i<structElements.length-1;i+=2){
			structures.push({"pre":type,"type":structElements[i],"uniform":structElements[i+1].replace(";","")})
			//alert(structures[structures.length-1].uniform)
		}
		}

        return { attributes, uniforms, structures }
      }

	  static getGLTypes(){
		return [
		{"gltype":gl.FLOAT,"value":0x1406,"string":"FLOAT"},
		{"gltype":gl.FLOAT_VEC2,"value":0x8B50,"string":"FLOAT_VEC2"},
		{"gltype":gl.FLOAT_VEC3,"value":0x8B51,"string":"FLOAT_VEC3"},
		{"gltype":gl.FLOAT_VEC4,"value":0x8B52,"string":"FLOAT_VEC4"},
		{"gltype":gl.INT_VEC2,"value":0x8B53,"string":"INT_VEC2"},
		{"gltype":gl.INT,"value":0x1404,"string":"INT"},
		{"gltype":gl.INT_VEC3,"value":0x8B54,"string":"INT_VEC3"},
		{"gltype":gl.INT_VEC4,"value":0x8B55,"string":"INT_VEC4"},
		{"gltype":gl.BOOL,"value":0x8B56,"string":"BOOL"},
		{"gltype":gl.BOOL_VEC2,"value":0x8B57,"string":"BOOL_VEC2"},
		{"gltype":gl.BOOL_VEC3,"value":0x8B58,"string":"BOOL_VEC3"},
		{"gltype":gl.BOOL_VEC4,"value":0x8B59,"string":"BOOL_VEC4"},
		{"gltype":gl.FLOAT_MAT2,"value":0x8B5A,"string":"FLOAT_MAT2"},
		{"gltype":gl.FLOAT_MAT3,"value":0x8B5B,"string":"FLOAT_MAT3"},
		{"gltype":gl.FLOAT_MAT4,"value":0x8B5C,"string":"FLOAT_MAT4"},
		{"gltype":gl.SAMPLER_2D,"value":0x8B5E,"string":"SAMPLER_2D"},
		{"gltype":gl.SAMPLER_CUBE,"value":0x8B60,"string":"SAMPLER_CUBE"},
	  ]
	}

    static createUniformSetter(program, uniformInfo) {
      const location = gl.getUniformLocation(program, uniformInfo.name);
      const type =  this.getGLTypes().find(({ string }) => string === uniformInfo.type).gltype;	
	  const v=uniformInfo.value
	  const unit=uniformInfo.unit
      // Check if this uniform is an array
      const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]');
      if (type === gl.FLOAT && isArray) {
          gl.uniform1fv(location, v);
      }
      if (type === gl.FLOAT) {
          gl.uniform1f(location, v);
      }
      if (type === gl.FLOAT_VEC2) {
          gl.uniform2fv(location, v);
      }
      if (type === gl.FLOAT_VEC3) {
          gl.uniform3fv(location,v);
      }
      if (type === gl.FLOAT_VEC4) {
          gl.uniform4fv(location, v);
      }
      if (type === gl.INT && isArray) {
          gl.uniform1iv(location, v);
      }
      if (type === gl.INT) {
          gl.uniform1i(location, v);
      }
      if (type === gl.INT_VEC2) {
          gl.uniform2iv(location, v);
      }
      if (type === gl.INT_VEC3) {
          gl.uniform3iv(location, v);
      }
      if (type === gl.INT_VEC4) {
          gl.uniform4iv(location, v);
      }
      if (type === gl.BOOL) {
          gl.uniform1iv(location, v);
      }
      if (type === gl.BOOL_VEC2) {
          gl.uniform2iv(location, v);
      }
      if (type === gl.BOOL_VEC3) {
          gl.uniform3iv(location, v);
      }
      if (type === gl.BOOL_VEC4) {
          gl.uniform4iv(location, v);
      }
      if (type === gl.FLOAT_MAT2) {
          gl.uniformMatrix2fv(location, false, v);
      }
      if (type === gl.FLOAT_MAT3) {
          gl.uniformMatrix3fv(location, false, v);
      }
      if (type === gl.FLOAT_MAT4) {
          gl.uniformMatrix4fv(location, false, v);
      }
      if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && unit>-1) {
		var loc = gl.getUniformLocation(program, uniformInfo.name);
		if(uniformInfo.textureid==-1)return
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, uniformInfo.textureid);
		gl.uniform1i(location,uniformInfo.unit); //Our predefined uniformLoc.mainTexture is uMainTex, Prev Lessons we made ShaderUtil.getStandardUniformLocations() function in Shaders.js to get its location.

        };
      }

     // throw ('unknown type: 0x' + type.toString(16)); // we should never get here.



	static makeShader(vs,fs){
		var shader=new Shader(gl,vs,fs);
		shader.setPerspective(gCamera.projectionMatrix)
		shader.mainTexture = -1; //Store Our Texture ID
		gl.useProgram(null); //Done setting up shader
		return shader
	}


}

    

