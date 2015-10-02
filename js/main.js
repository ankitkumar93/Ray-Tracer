//Created by Ankit Kumar
//For Computer Graphics Assignment @ NCSU, CSC 561

//Define Variables
var width;
var height;
var worldCoordinates;
var parsedFlag;
var vertices;
var verticeNormals;
var faces;
var materials;
var faceMtl;
var windowDims;
var maxVal;
var lights;

function main(){
	parsedFlag = 0;
	parseWindow(setParsedFlag,3);
	parseLights(setParsedFlag,5);
	parseObj(setParsedFlag,1);
}

function setParsedFlag(flag){
	parsedFlag += flag;
	if(flag == 1){
		vertices = getVertices();
		faces = getFaces();
		faceMtl = getFaceMtl();
		verticeNormals = getVerticeNormals();
		maxVal = getMaxVal();
	}else if(flag == 2){
		materials = getMaterials();
	}else if(flag == 3){
		windowDims = getWindowDims();
		getWorldCoordinates(setParsedFlag,4);
	}else if(flag == 4){
		console.log("Got World Coordinates");
	}else if(flag == 5){
		lights = getLights();
	}
	if(parsedFlag == 15)
	{
		rayTrace(vertices,verticeNormals,faces,faceMtl,materials,lights,windowDims[0],windowDims[1],worldCoordinates,maxVal);
	}
}

function getWorldCoordinates(callback,flag){
	worldCoordinates = [];
	for(width_index = 0; width_index < windowDims[0]; width_index++){
		for(height_index = 0; height_index < windowDims[1]; height_index++){
			var tempX = -1 + (width_index/128);
			var tempY = 1 - (height_index/128);
			worldCoordinates.push([tempX,tempY,-1]);
		}
	}
	callback(flag);
}
