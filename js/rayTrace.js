//Created by Ankit Kumar
//For Computer Graphics Assignment @ NCSU, CSC 561
//GLMatrix 2.2.0 has been used and has been taken from http://glmatrix.net/

function rayTrace(vertices,verticeNormals,faces,faceMtl,materials,lights,width,height,worldCoordinates,maxVal){

	//Canvas
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');
	canvas.width = windowDims[0];
	canvas.height = windowDims[1];
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	var la = 1, ld = 1, ls = 1;

	for(pi = 0; pi < canvas.width; pi++)
		for(pj = 0; pj < canvas.height; pj++)
			setPixel(imageData,0,0,0,255,pi,pj);

	//64 Bit Vals
	glMatrix.setMatrixArrayType(Float64Array);

	var eye = vec3.create();
	vec3.set(eye,0,0,-2);

	var depth = new Array(worldCoordinates.length);

	var scaleVerFactor = Math.max(maxVal[0],maxVal[1]);
	if(maxVal[2]/scaleVerFactor <= -2)
		scaleVerFactor = Math.abs(maxVal[2]);

	scaleVerFactor  = 1/scaleVerFactor;

	console.log("Starting Ray Tracing!");
	for(face_index = 0; face_index < faces.length; face_index ++){

		//Read Faces and Vertices
		var face = faces[face_index];
		var v1 = vec3.create();
		var v2 = vec3.create();
		var v3 = vec3.create();
		vec3.set(v1,vertices[face["coord"][0]][0],vertices[face["coord"][0]][1],vertices[face["coord"][0]][2]);
		vec3.scale(v1,v1,scaleVerFactor);
		vec3.set(v2,vertices[face["coord"][1]][0],vertices[face["coord"][1]][1],vertices[face["coord"][1]][2]);
		vec3.scale(v2,v2,scaleVerFactor);
		vec3.set(v3,vertices[face["coord"][2]][0],vertices[face["coord"][2]][1],vertices[face["coord"][2]][2]);
		vec3.scale(v3,v3,scaleVerFactor);

		var faceNormal = face["normal"];

		var v1N,v2N,v3N;
		if(face["normal"] != null){
			v1N = vec3.create();
			v2N = vec3.create();
			v3N = vec3.create();
			vec3.set(v1N,verticeNormals[faceNormal[0]][0],verticeNormals[faceNormal[0]][1],verticeNormals[faceNormal[0]][2]);
			vec3.set(v2N,verticeNormals[faceNormal[1]][0],verticeNormals[faceNormal[1]][1],verticeNormals[faceNormal[1]][2]);
			vec3.set(v3N,verticeNormals[faceNormal[2]][0],verticeNormals[faceNormal[2]][1],verticeNormals[faceNormal[2]][2]);
		}

		//Read MTL
		var mtl = faceMtl[face["group"]];

		var kaData, ksData, kdData, nData;

		//Get the Material Data
		if(materials != null && mtl!= null)
		{
			kaData = materials[mtl]["ka"];
			ksData = materials[mtl]["ks"];
			kdData = materials[mtl]["kd"];
			nData = materials[mtl]["n"];
			if(kaData == null)
				kaData = [1,1,1];
			if(kdData == null)
				kdData = [0,0,0];
			if(ksData == null)
				ksData = [0,0,0];
			if(nData == null)
				nData = 0;
		}
		else
		{
			kaData = [1,1,1];
			kdData = [0,0,0];
			ksData = [0,0,0];
			nData = 0;
		}

		//Prepare Barycentric Matrix
		var baryMat = mat3.clone([v1[0],v1[1],v1[2],v2[0],v2[1],v2[2],v3[0],v3[1],v3[2]]);
		var barMatInv = mat3.create();
		mat3.invert(barMatInv,baryMat);


		//Get Equation of Triangle
		var edge1 = vec3.create();
		vec3.subtract(edge1,v1,v2);
		var edge2 = vec3.create();
		vec3.subtract(edge2,v2,v3);
		var triangle = vec3.create();
		vec3.normalize(triangle,vec3.cross(triangle,edge1,edge2));

		for(coordinates_index = 0; coordinates_index < worldCoordinates.length; coordinates_index++){
			if(typeof depth[coordinates_index] == "undefined"){
				depth[coordinates_index] = Number.MAX_VALUE;
			}
			var coord = vec3.create();
			var equation = vec3.create();
			var constant = vec3.create();
			var intersection = vec3.create();
			var baryVal = vec3.create();
			vec3.set(coord,worldCoordinates[coordinates_index][0],worldCoordinates[coordinates_index][1],worldCoordinates[coordinates_index][2]);

			vec3.subtract(equation,coord,eye);

			vec3.set(constant,eye[0],eye[1],eye[2]);

			//Get point of Intersection
			var intersection1 = vec3.dot(v1,triangle)-vec3.dot(constant,triangle);
			var intersection2 = vec3.dot(equation,triangle);
			if(intersection2 == 0)
				continue;
			var intersection = intersection1/intersection2;

			var intersectionPoint = vec3.create();

			vec3.add(intersectionPoint,vec3.scale(intersectionPoint,equation,intersection),constant);

			vec3.transformMat3(baryVal,intersectionPoint,barMatInv);

			var alpha = baryVal[0];
			var beta = baryVal[1];
			var gamma = baryVal[2];

			if((alpha >= 0 && alpha <=1 ) && (beta >= 0 && beta <= 1) && (gamma >= 0 && gamma <= 1)) {

				var diffuseFactor = 0, specularFactor = 0;

				//Color Calculations for Blinn Phong Model (If MTL file is Present)

				var colorNormal = vec3.create();
				var r = 1,g = 1,b = 1;

				if(materials != null){
					r = 0, g = 0, b = 0;
					if(face["normal"] != null){
						vec3.scale(v1N,v1N,alpha);
						vec3.scale(v2N,v2N,beta);
						vec3.scale(v3N,v3N,gamma);
						vec3.add(colorNormal,v1N,v2N);
						vec3.add(colorNormal,colorNormal,v3N);
						vec3.normalize(colorNormal,colorNormal);
					}
					else{
						vec3.set(colorNormal,triangle[0],triangle[1],triangle[2]);
					}
					var direction = vec3.create();
					vec3.normalize(direction,vec3.subtract(direction,eye,coord));
					for(light_index = 0; light_index < lights.length; light_index++){
						var currLight = lights[light_index];
						var lightSource = [currLight["x"],currLight["y"],currLight["z"]];
						var light = [currLight["r"],currLight["g"],currLight["b"]];
						var lVector = vec3.create();
						var hVector = vec3.create();
						vec3.normalize(lVector,vec3.subtract(lVector,lightSource,intersectionPoint));
						vec3.normalize(hVector,vec3.add(hVector,lVector,direction));
						diffuseFactor = vec3.dot(colorNormal,lVector);
						if(diffuseFactor > 0)
						{
							var specularDotProd = vec3.dot(colorNormal,hVector);
							if(specularDotProd > 0)
							{
								specularFactor = Math.pow(specularDotProd,nData);
							}
						}
						else
						{
							diffuseFactor = 0;
							specularFactor = 0;
						}
						r  += light[0]*((la*kaData[0]) + (ld*diffuseFactor*kdData[0]) + (ls*specularFactor*ksData[0]));
						g  += light[1]*((la*kaData[1]) + (ld*diffuseFactor*kdData[1]) + (ls*specularFactor*ksData[1]));
						b  += light[2]*((la*kaData[2]) + (ld*diffuseFactor*kdData[2]) + (ls*specularFactor*ksData[2]));
					}
				}

				var x_coord = Math.round((1+coord[0])*(windowDims[0])/2);
				var y_coord = Math.round((1-coord[1])*(windowDims[1])/2);

				var z_depth = intersectionPoint[2];
				if(z_depth < depth[coordinates_index]) {
					setPixel(imageData,r,g,b,1,x_coord,y_coord);
					depth[coordinates_index] = z_depth;
				}
			}
		}

	}
	console.log("Finishing Up Ray Tracing Please Wait!");
	context.putImageData(imageData, 0, 0);
}

function setPixel(imageData, r, g, b, a, x, y) {
	var index = (x + y * imageData.width) * 4;
	imageData.data[index + 0] = r*255;
	imageData.data[index + 1] = g*255;
	imageData.data[index + 2] = b*255;
	imageData.data[index + 3] = a*255;
}