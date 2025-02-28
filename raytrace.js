
function mouseCast1(ix,iy){
    var nx = ix / gl.canvas.width * 2 - 1;
	var ny = 1 - iy / gl.canvas.height * 2;
	gCamera.updateViewMatrix();
	//..........................................
	//4d Homogeneous Clip Coordinates
	var vec4Clip = [nx,ny,-1.0,1.0]; // -Z is forward, W just needs to be 1.0.
	//..........................................
	//4d Eye (Camera) Coordinates
	var vec4Eye = [0,0,0,0];
	var matInvProj = new Matrix4();
	Matrix4.invert(matInvProj,gCamera.projectionMatrix);
	Matrix4.transformVec4(vec4Eye, vec4Clip, matInvProj);
	vec4Eye[2] = -1; //Reset Forward Direction
	vec4Eye[3] = 0.0; //Not a Point
	//..........................................
    //4d World Coordinates
	var vec4World = [0,0,0,0];
	//.Mat4.transformVec4(vec4World,vec4Clip,Cam.inalert()vertedLocalMatrix);
	Matrix4.transformVec4(vec4World,vec4Eye,gCamera.transform.matView.raw);
	var ray = new Vector3(vec4World[0],vec4World[1],vec4World[2]);
	ray.normalize();
	//..........................................
	//FungiApp.debugLines.addVector(ray,[0,0,0],"000000").update()
	//Orbit makes .Position unusable, need to put actual position from the matrix
	var rayStart	= new Vector3(gCamera.localMatrix[12],gCamera.localMatrix[13],gCamera.localMatrix[14])
	var rayEnd		= rayStart.clone().add( ray.multiScalar(20) );
	alert(rayStart.x+" "+rayStart.y+" "+rayStart.z)
	new Modal2('cube',Primatives.Line.createMesh(gl,rayStart,rayEnd)).setShader(pShader)

	//FungiApp.debugLines.addVector(rayStart,rayEnd,"000000").update()
}

function mouseCast2(ix,iy){

	//http://antongerdelan.net/opengl/raycasting.html
	//Normalize Device Coordinate
	var nx = ix / gl.canvas.width * 2 - 1;
	var ny = 1 - iy /gl.canvas.height * 2;

	//Clip Cords would be [nx,ny,-1,1];

	// inverseWorldMatrix = invert(ProjectionMatrix * ViewMatrix)
	var matWorld = new Matrix4();
	Matrix4.mult(matWorld,
	gCamera.projectionMatrix,gCamera.transform.matView.raw);

	//gCamera.invertedLocalMatrix);
	Matrix4.invert(matWorld);

	//https://stackoverflow.com/questions/20140711/picking-in-3d-with-ray-tracing-using-ninevehgl-or-opengl-i-phone/20143963#20143963
	var vec4Near	= [0,0,0,0],
		vec4Far		= [0,0,0,0];		
	Matrix4.transformVec4(vec4Near, [nx,ny,-1,1.0], matWorld); //using  4d Homogeneous Clip Coordinates
	Matrix4.transformVec4(vec4Far, [nx,ny,1,1.0], matWorld);
	
	//vec4Near[0] /= vec4Near[3]; //perspective divide ("normalize" homogeneous coordinates)
	//vec4Near[1] /= vec4Near[3];
	//vec4Near[2] /= vec4Near[3];

	//vec4Far[0] /= vec4Far[3];
	//vec4Far[1] /= vec4Far[3];
	//vec4Far[2] /= vec4Far[3];

	for(var i=0; i < 3; i++){
		vec4Near[i] /= vec4Near[3];
		vec4Far[i] /= vec4Far[3];
	}

	var rayNear	= new Vector3(vec4Near[0],vec4Near[1],vec4Near[2]),
		rayFar	= new Vector3(vec4Far[0],vec4Far[1],vec4Far[2]);


		new Modal2('cube',Primatives.Line.createMesh(gl,rayStart,rayEnd)).setShader(pShader)
	}
