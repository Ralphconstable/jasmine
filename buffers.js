
function boing(){alert(6663)}
	//...................................................

function fCreateMeshVAOByLocation(name,aryInd,aryVert,vertLen,stride,offset){ //TODO : ADDED VERT LEN
	var rtn = { drawMode:gl.TRIANGLES };

	//Create and bind vao
	rtn.vao = gl.createVertexArray();															
	gl.bindVertexArray(rtn.vao);	//Bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao.
	if(aryVert !== undefined && aryVert != null){
		rtn.bufVertices = gl.createBuffer();													//Create buffer...
		rtn.vertexComponentLen = vertLen || 3;													//How many floats make up a vertex
		rtn.vertexCount = aryVert.length / rtn.vertexComponentLen;								//How many vertices in the array

		gl.bindBuffer(gl.ARRAY_BUFFER, rtn.bufVertices);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryVert), gl.STATIC_DRAW);		//then push array into it.
		gl.enableVertexAttribArray(0);										//Enable Attribute location
		gl.vertexAttribPointer(0,rtn.vertexComponentLen,gl.FLOAT,false,8*4,0);
		 //Put buffer at location of the vao
		gl.enableVertexAttribArray(1);										//Enable Attribute location					//Put buffer at location of the vao\
		gl.vertexAttribPointer(1,rtn.vertexComponentLen,gl.FLOAT,false,8*4,3*4);

		gl.enableVertexAttribArray(2);										//Enable Attribute location					//Put buffer at location of the vao\
		gl.vertexAttribPointer(2,rtn.vertexComponentLen,gl.FLOAT,false,8*4,6*4);
	
	}
	//Setup Index.
	if(aryInd !== undefined && aryInd != null){
	rtn.bufIndex = gl.createBuffer();
	rtn.indexCount = aryInd.length;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);  
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), gl.STATIC_DRAW);
	
	//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null); //TODO REMOVE gl AND ADD TO CLEANUP
}

//Clean up
gl.bindVertexArray(null);					//Unbind the VAO, very Important. always unbind when your done using one.
gl.bindBuffer(gl.ARRAY_BUFFER,null);	//Unbind any buffers that might be set
if(aryInd != null && aryInd !== undefined)  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

gl.mMeshCache[name] = rtn;
return rtn;
}

//Turns arrays into GL buffers, then setup a VAO that will predefine the buffers to standard shader attributes.
function fCreateMeshVAO(name,aryInd,aryVert,aryNorm,aryUV,vertLen){ //TODO : ADDED VERT LEN
	
	var rtn={drawMode:gl.TRIANGLES}
	if(vertLen!=undefined)
	rtn.drawMode=vertLen
	//Create and bind vao
	rtn.vao = gl.createVertexArray();															
	gl.bindVertexArray(rtn.vao);	//Bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao.
	//.......................................................
	//Set up vertices
	if(aryVert !== undefined && aryVert != null){
		rtn.bufVertices = gl.createBuffer();	
		rtn.vertexComponentLen = vertLen || 3;
		rtn.vertexCount=aryVert.length
		if(vertLen!=0)													//How many floats make up a vertex
		rtn.vertexCount = aryVert.length / rtn.vertexComponentLen;	
		//How many vertices in the array
		gl.bindBuffer(gl.ARRAY_BUFFER, rtn.bufVertices);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryVert), gl.STATIC_DRAW);		//then push array into it.
		gl.enableVertexAttribArray(ATTR_POSITION_LOC);	
											//Enable Attribute location
		//gl.vertexAttribPointer(ATTR_POSITION_LOC,3,gl.FLOAT,false,0,0);						//Put buffer at location of the vao\
		gl.vertexAttribPointer(ATTR_POSITION_LOC,rtn.vertexComponentLen,gl.FLOAT,false,0,0);
		 //Put buffer at location of the vao
	}

	//.......................................................
	//Setup normals
	if(aryNorm !== undefined && aryNorm != null){
		rtn.bufNormals = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, rtn.bufNormals);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryNorm), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(ATTR_NORMAL_LOC);
		gl.vertexAttribPointer(ATTR_NORMAL_LOC,3,gl.FLOAT,false, 0,0);

	}

	//.......................................................
	//Setup UV
	if(aryUV !== undefined && aryUV != null){
		rtn.bufUV = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, rtn.bufUV);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryUV), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(ATTR_UV_LOC);
		gl.vertexAttribPointer(ATTR_UV_LOC,2,gl.FLOAT,false,0,0);	//UV only has two floats per component

	}

	//.......................................................
	//Setup Index.
	if(aryInd !== undefined && aryInd != null){
		rtn.bufIndex = gl.createBuffer();
		rtn.indexCount = aryInd.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);  
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), gl.STATIC_DRAW);

	}

	//Clean up
	gl.bindVertexArray(null);					//Unbind the VAO, very Important. always unbind when your done using one.
	gl.bindBuffer(gl.ARRAY_BUFFER,null);	//Unbind any buffers that might be set
	if(aryInd != null && aryInd !== undefined)  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
	
	gl.mMeshCache[name] = rtn;

	return rtn;
}




class BOTEX {
	static create(out){
		out.id = gl.createTexture();
		return this;
	}

	static flip(out,yn) {
	 
		if(yn == true) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, yn);
		return this
	}

	static setImage(out,img){
		try {											//Set text buffer for work
		 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			
		} 
		catch(e){('noimage')}
	
		return this;
	}

	static setParamaters(){
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		return this;
	}

		static readPixel(fbo,x,y){
			var p = new Uint8Array(4);
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.id);
			gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, p);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			return p;
		}
	
	

	static activate(out,name){
		gl.bindTexture(gl.TEXTURE_2D, out.id);

		return this;
	}
	static deactivate(out,name){ 
		gl.bindTexture(gl.TEXTURE_2D,null);									//Unbind
		gl.mTextureCache[name] = out.id;											//Save ID for later unloading
	
	//	if(doYFlip == true) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);	//Stop flipping 
		return this;
	}
	static readPixel(fbo,x,y){
		var p = new Uint8Array(4);
		gl.bindFramebuffer(gl.FRAMEBUFFER, rtn.id);
		gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, p);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		return p;
	}


	static loadTexture(name,img){
		var rtn={}
	  try { 
		BOTEX.create(rtn)
			.flip(rtn,true)
			.activate(rtn)	
			.setImage(rtn,img)
			.setParamaters()
		  .deactivate(rtn,name)
	  }
	  catch(e){alert(e.message+" fail")}

		return rtn;

	}


}

class FBO{
	static build(name,colorCnt,useDepth,wSize,hSize){
		var rtn = {}
		if(wSize === undefined || wSize == null) wSize = gl.canvas.width;
		if(hSize === undefined || wSize == null) hSize = gl.canvas.height;
		//Create and Set Depth
		FBO.create(rtn);
		if(useDepth == true) FBO.depthBuffer(rtn,wSize,hSize);

		//Build color buffers
		var cBufAry = [];
		for(var i=0; i < colorCnt; i++){
			cBufAry.push( gl.COLOR_ATTACHMENT0 + i );
			FBO.texColorBuffer(rtn,i,wSize,hSize);
		}

		if(cBufAry.length > 1)gl.drawBuffers(cBufAry);

		//All Done.
		FBO.finalize(rtn,name);

		return rtn;
	}

	static create(out){
		out.colorBuf = [];
		out.id = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, out.id);
		return this;
	}

	static texColorBuffer(out,cAttachNum,w,h){
		//Up to 16 texture attachments 0 to 15
		out.colorBuf[cAttachNum] = gl.createTexture();
		_Textures=cAttachNum
		gl.bindTexture(gl.TEXTURE_2D, out.colorBuf[cAttachNum]);
		gl.texImage2D(gl.TEXTURE_2D,0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);	//Stretch image to X position
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);	//Stretch image to Y position

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + cAttachNum, gl.TEXTURE_2D, out.colorBuf[cAttachNum], 0);
		return this;
	}

	static depthBuffer(out,w,h){
		out.depth = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, out.depth);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, out.depth);
		return this;
	}

	static finalize(out,name){
		switch(gl.checkFramebufferStatus(gl.FRAMEBUFFER)){
			case gl.FRAMEBUFFER_COMPLETE: break;
			case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: alert("FRAMEBUFFER_INCOMPLETE_ATTACHMENT"); break;
			case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: alert("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"); break;
			case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:alert("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"); break;
			case gl.FRAMEBUFFER_UNSUPPORTED: alert("FRAMEBUFFER_UNSUPPORTED"); break;
			case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: alert("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE"); break;
			case gl.RENDERBUFFER_SAMPLES: alert("RENDERBUFFER_SAMPLES"); break;
		}
		
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		//Fbo[name] = out;

		return out;
	}

	static colorDepthFBO(name){
		var rtn = {};
		return FBO.create(rtn)
			.texColorBuffer(rtn,0)
			.depthBuffer(rtn)
			.finalize(rtn,name);
	}

	static readPixel(fbo,x,y,cAttachNum){
		var p = new Uint8Array(4);
		gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fbo.id);
		gl.readBuffer(gl.COLOR_ATTACHMENT0 + cAttachNum);
		gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, p);
		//gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
		return p;
	}

	static activate(fbo){ gl.bindFramebuffer(gl.FRAMEBUFFER,fbo.id); return this; }
	static deactivate(){ gl.bindFramebuffer(gl.FRAMEBUFFER,null); return this; }
	static clear(fbo){	

		gl.bindFramebuffer(gl.FRAMEBUFFER,fbo.id);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
		gl.bindFramebuffer(gl.FRAMEBUFFER,null);
	}
	static clearAttachment(fbo){	
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.id);
		gl.clearBufferfv(gl.COLOR, 0, new Float32Array([ 0,0,0,0 ]));
		gl.clearBufferfv(gl.COLOR, 1, new Float32Array([ 0,0,0,0 ]));
	
		gl.clearBufferfi(gl.DEPTH_STENCIL, 0, 1.0, 0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	
	static delete(fbo){
		//TODO, Delete using the Cache name, then remove it from cache.
		  gl.deleteRenderbuffer(fbo.depth);
		  gl.deleteTexture(fbo.texColor);
		  gl.deleteFramebuffer(fbo.id);
	}
}