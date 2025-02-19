
function mouseCast1(){
    var nx = ix / Fungi.gl.fWidth * 2 - 1;
	var ny = 1 - iy / Fungi.gl.fHeight * 2;

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
	//.Mat4.transformVec4(vec4World,vec4Clip,Cam.invertedLocalMatrix);
    Matrix4.transformVec4(vec4World,vec4Eye,gCamera.localMatrix);

	var ray = new Vector3(vec4World[0],vec4World[1],vec4World[2]);
	ray.normalize();

	//..........................................
	//FungiApp.debugLines.addVector(ray,[0,0,0],"000000").update()

	//Orbit makes .Position unusable, need to put actual position from the matrix
	var rayStart	= new Vector3(gCamera.localMatrix[12],Cam.localMatrix[13],Cam.localMatrix[14]),
	rayEnd		= rayStart.clone().add( ray.multi(20) );

	FungiApp.debugLines.addVector(rayStart,rayEnd,"000000").update()
}