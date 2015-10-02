//Created by Ankit Kumar
//For Computer Graphics Assignment @ NCSU, CSC 561
var vertices;
var faces;
var verticeNormals;
var materials;
var faceMtl;
var maxVX, maxVY, minVZ, maxVal;
var windowDims;
var lights;
function parseWindow(callback,flag){
	var readWindowDims = new XMLHttpRequest();										//This AJAX function to read files has been taken from http://www.w3schools.com/ajax/ajax_xmlfile.asp
	readWindowDims.onreadystatechange = function(){
		if(readWindowDims.readyState == 4)
		{
			windowDims = readWindowDims.responseText.split(" ");
			callback(flag);
		}
	}
	readWindowDims.open("GET","./windows.txt");
	readWindowDims.send();
}
function parseLights(callback,flag){
	var readLights = new XMLHttpRequest();										//This AJAX function to read files has been taken from http://www.w3schools.com/ajax/ajax_xmlfile.asp
	readLights.onreadystatechange = function(){
		if(readLights.readyState == 4)
		{
			lights = [];
			var lightData = readLights.responseText.split("\n");
			for(light_index = 0; light_index < lightData.length; light_index++){
				var currentData = lightData[light_index].split(" ");
				var lightObject = new Object(6);
				lightObject["x"] = currentData[0];
				lightObject["y"] = currentData[1];
				lightObject["z"] = currentData[2];
				lightObject["r"] = currentData[3];
				lightObject["g"] = currentData[4];
				lightObject["b"] = currentData[5];
				lights.push(lightObject);
			}
			callback(flag);
		}
	}
	readLights.open("GET","./lights.txt");
	readLights.send();
}
function parseObj(callback,flag){
	var readObj = new XMLHttpRequest;												//This AJAX function to read files has been taken from http://www.w3schools.com/ajax/ajax_xmlfile.asp
	readObj.onreadystatechange = function(){
		if(readObj.readyState == 4){
			vertices = [];
			faces = [];
			verticeNormals = [];
			maxVX = 0, maxVY = 0, minVZ = 0;
			faceMtl = new Object();
			var groupData;
			var objData = readObj.responseText.split("\n");
			for(obj_index = 0; obj_index < objData.length; obj_index++){
				var currentData = objData[obj_index].trim().replace("  "," ").split(" ");
				if(currentData[0] == "v"){
					var temp = [parseFloat(currentData[1]), parseFloat(currentData[2]), parseFloat(currentData[3])];
					maxVX = Math.max(maxVX,Math.abs(currentData[1]));
					maxVY = Math.max(maxVY,Math.abs(currentData[2]));
					minVZ = Math.min(minVZ,currentData[3]);
					vertices.push(temp);
				}
				else if(currentData[0] == "vn"){
					var temp = [parseFloat(currentData[1]), parseFloat(currentData[2]), parseFloat(currentData[3])];
					verticeNormals.push(temp);
				}else if(currentData[0] == "f"){
					for(temp_index = 0; temp_index < currentData.length - 3; temp_index++){
						var tempFace = new Object(3);
						tempFace["group"] = groupData;
						tempFace["coord"] = [currentData[1].split("/")[0] - 1, currentData[2+temp_index].split("/")[0] - 1, currentData[3+temp_index].split("/")[0] - 1];
						if(currentData[1].split("/").length > 2)
							tempFace["normal"] = [currentData[1].split("/")[2] - 1, currentData[2+temp_index].split("/")[2] - 1, currentData[3+temp_index].split("/")[2] - 1];
						else
							tempFace["normal"] = null;
						faces.push(tempFace);
					}
				}else if(currentData[0] == "g" || currentData[0] == "group"){
					if(currentData[1] != null)
						groupData = currentData[1].split(" ");
				}else if(currentData[0] == "usemtl"){
					for(group_index = 0; group_index < groupData.length; group_index++){
						faceMtl[groupData[group_index]] = currentData[1];
					}
				}else if(currentData[0] == "mtllib"){
					parseMtl(currentData[1],callback,flag+1);
				}
			}
			maxVal = [maxVX,maxVY,minVZ];
			callback(flag);
		}
	}
	readObj.open("GET","./input.obj");
	readObj.send()
}
function parseMtl(mtlFile,callback,flag){
	var readMtl = new XMLHttpRequest;														//This AJAX function to read files has been taken from http://www.w3schools.com/ajax/ajax_xmlfile.asp
	readMtl.onreadystatechange = function(){
		if(readMtl.readyState == 4){
			materials = new Object();
			var mtlCat;
			var nData = 0;
			var first = true;
			var mtlType;
			var mtlData = readMtl.responseText.split("\n");
			for(mtl_index = 0; mtl_index < mtlData.length; mtl_index++){
				var currentData = mtlData[mtl_index].trim().replace("  "," ").split(" ");
				if(currentData[0] == "newmtl"){
					if(!first)
					{
						materials[mtlType] = mtlObject;
					}
					var mtlObject = new Object(4);
					mtlType = currentData[1];
					first = false;
				}else if(currentData[0] == "Ka"){
					var kaData = new Array(3);
					kaData[0] = currentData[1];
					kaData[1] = currentData[2];
					kaData[2] = currentData[3];
					mtlObject["ka"] = kaData;
				}else if(currentData[0] == "Kd"){
					var kdData = new Array(3);
					kdData[0] = currentData[1];
					kdData[1] = currentData[2];
					kdData[2] = currentData[3];
					mtlObject["kd"] = kdData;
				}else if(currentData[0] == "Ks"){
					var ksData = new Array(3);
					ksData[0] = currentData[1];
					ksData[1] = currentData[2];
					ksData[2] = currentData[3];
					mtlObject["ks"] = ksData;
				}else if(currentData[0] == "N"){
					nData = (currentData[1]*128/1000);
					mtlObject["n"] = nData;
				}else if(currentData[0] == "Ns"){
					nData = currentData[1];
					mtlObject["n"] = nData;
				}if(mtl_index == mtlData.length - 1){
					materials[mtlType] = mtlObject;
				}
			}
			callback(flag);
		}
	}
	readMtl.open("GET","./"+mtlFile);
	readMtl.send();
}

function getVertices(){
	return vertices;
}

function getFaces(){
	return faces;
}

function getMaterials(){
	return materials;
}

function getMaxVal(){
	return maxVal;
}

function getVerticeNormals(){
	return verticeNormals;
}

function getFaceMtl(){
	return faceMtl;
}

function getWindowDims(){
	return windowDims;
}

function getLights(){
	return lights;
}