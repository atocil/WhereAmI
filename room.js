NORTH = 0;
WEST  = 1;
SOUTH = 2;
EAST  = 3;

ROOM_HEIGHT = 10;
ROOM_WIDTH = 10;
ROOM_OFFSET = ROOM_WIDTH/2;
ROOM_TOLERANCE = .3;	//How close to the wall you can get

DOOR_WIDTH = 2;
DOOR_HEIGHT = 2*DOOR_WIDTH;
DOOR_OFFSET = DOOR_WIDTH/2;

FRAME_DEPTH = .15;


DOOR_GEOM = new THREE.Geometry();
DOOR_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET, 0, -ROOM_OFFSET));
DOOR_GEOM.vertices.push(new THREE.Vector3( DOOR_OFFSET, 0, -ROOM_OFFSET));
DOOR_GEOM.vertices.push(new THREE.Vector3( DOOR_OFFSET, DOOR_HEIGHT, -ROOM_OFFSET));
DOOR_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET, DOOR_HEIGHT, -ROOM_OFFSET));
DOOR_GEOM.faces.push(new THREE.Face3(0,1,2));
DOOR_GEOM.faces.push(new THREE.Face3(2,3,0));

FRAME_GEOM = new THREE.Geometry();
FRAME_GEOM.vertices.push(new THREE.Vector3(DOOR_OFFSET - FRAME_DEPTH, 0, -ROOM_OFFSET + FRAME_DEPTH));
FRAME_GEOM.vertices.push(new THREE.Vector3(DOOR_OFFSET + FRAME_DEPTH, 0, -ROOM_OFFSET + FRAME_DEPTH));
FRAME_GEOM.vertices.push(new THREE.Vector3(DOOR_OFFSET + FRAME_DEPTH, 0, -ROOM_OFFSET));
FRAME_GEOM.vertices.push(new THREE.Vector3(DOOR_OFFSET - FRAME_DEPTH, 0, -ROOM_OFFSET));


FRAME_GEOM.vertices.push(new THREE.Vector3(DOOR_OFFSET - FRAME_DEPTH, DOOR_HEIGHT - FRAME_DEPTH, -ROOM_OFFSET + FRAME_DEPTH));
FRAME_GEOM.vertices.push(new THREE.Vector3(DOOR_OFFSET + FRAME_DEPTH, DOOR_HEIGHT + FRAME_DEPTH, -ROOM_OFFSET + FRAME_DEPTH));
FRAME_GEOM.vertices.push(new THREE.Vector3(DOOR_OFFSET + FRAME_DEPTH, DOOR_HEIGHT + FRAME_DEPTH, -ROOM_OFFSET));
FRAME_GEOM.vertices.push(new THREE.Vector3(DOOR_OFFSET - FRAME_DEPTH, DOOR_HEIGHT - FRAME_DEPTH, -ROOM_OFFSET));

FRAME_GEOM.faces.push(new THREE.Face3(0,1,4));
FRAME_GEOM.faces.push(new THREE.Face3(1,5,4));
FRAME_GEOM.faces.push(new THREE.Face3(1,2,6));
FRAME_GEOM.faces.push(new THREE.Face3(6,5,1));
FRAME_GEOM.faces.push(new THREE.Face3(3,0,4));
FRAME_GEOM.faces.push(new THREE.Face3(4,7,3));


FRAME_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET - FRAME_DEPTH, DOOR_HEIGHT + FRAME_DEPTH, -ROOM_OFFSET + FRAME_DEPTH));
FRAME_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET + FRAME_DEPTH, DOOR_HEIGHT - FRAME_DEPTH, -ROOM_OFFSET + FRAME_DEPTH));
FRAME_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET + FRAME_DEPTH, DOOR_HEIGHT - FRAME_DEPTH, -ROOM_OFFSET));
FRAME_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET - FRAME_DEPTH, DOOR_HEIGHT + FRAME_DEPTH, -ROOM_OFFSET));

FRAME_GEOM.faces.push(new THREE.Face3(5,6,11));
FRAME_GEOM.faces.push(new THREE.Face3(11,8,5));
FRAME_GEOM.faces.push(new THREE.Face3(5,8,9));
FRAME_GEOM.faces.push(new THREE.Face3(9,4,5));
FRAME_GEOM.faces.push(new THREE.Face3(9,10,7));
FRAME_GEOM.faces.push(new THREE.Face3(7,4,9));

FRAME_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET - FRAME_DEPTH, 0, -ROOM_OFFSET + FRAME_DEPTH));
FRAME_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET + FRAME_DEPTH, 0, -ROOM_OFFSET + FRAME_DEPTH));
FRAME_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET + FRAME_DEPTH, 0, -ROOM_OFFSET));
FRAME_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET - FRAME_DEPTH, 0, -ROOM_OFFSET));

FRAME_GEOM.faces.push(new THREE.Face3(8,11,15));
FRAME_GEOM.faces.push(new THREE.Face3(15,12,8));
FRAME_GEOM.faces.push(new THREE.Face3(8,12,13));
FRAME_GEOM.faces.push(new THREE.Face3(13,9,8));
FRAME_GEOM.faces.push(new THREE.Face3(13,14,10));
FRAME_GEOM.faces.push(new THREE.Face3(10,8,13));


Array.prototype.clear = function() {
	while(length > 0)
		pop();
}


function Room(pcolor) {
	this.myColor = pcolor;
	this.paths = new Array(null, null, null, null);
	// this.materials = [new THREE.MeshBasicMaterial( {color: pcolor, transparent: true, blending: THREE.MultiplyBlending}), new THREE.MeshDepthMaterial()];
	//new THREE.MeshBasicMaterial({wireframe: true, color: 0xFF0000}),
	this.materials = [getNewMaterial(pcolor)];
	this.visited = false;
	this.geometry = null;
	this.object = null;
	this.copies = new Array();
	this.copylocs = new Array();
}

Room.prototype.clearCopies = function(scene) {
	while(this.copies.length > 0) {
		scene.remove(this.copies.pop());
	}
}

Room.prototype.placeCopies = function(scene) {
	for (var c = 0; c < this.copylocs.length; c++) {
		var mesh = this.object.clone();
		mesh.position = this.copylocs[c];
		this.copies.push(mesh);
		scene.add(mesh);
	}
}

Room.prototype.resetCounts = function() {
	this.copies.clear();
	this.copylocs.clear();
}

Room.prototype.placeBlock = function(scene, block) {
	var tmp = this.object;
	if (tmp != null) {
		this.clearCopies(scene);
	}
	this.object = block;
	this.object.position.set(0,0,0);
	this.object.scale.set(1,1,1);
	this.object.rotation.y = 0;
	this.placeCopies(scene);
	return tmp;
}

Room.prototype.buildGeometry = function() {
	this.geometry = new THREE.Geometry();
	this.geometry.vertices.push(new THREE.Vector3(-ROOM_OFFSET, 0,  ROOM_OFFSET));
	this.geometry.vertices.push(new THREE.Vector3(-ROOM_OFFSET, 0, -ROOM_OFFSET));
	this.geometry.vertices.push(new THREE.Vector3( ROOM_OFFSET, 0, -ROOM_OFFSET));
	this.geometry.vertices.push(new THREE.Vector3( ROOM_OFFSET, 0,  ROOM_OFFSET));
	this.geometry.vertices.push(new THREE.Vector3(-ROOM_OFFSET, ROOM_HEIGHT,  ROOM_OFFSET));
	this.geometry.vertices.push(new THREE.Vector3(-ROOM_OFFSET, ROOM_HEIGHT, -ROOM_OFFSET));
	this.geometry.vertices.push(new THREE.Vector3( ROOM_OFFSET, ROOM_HEIGHT, -ROOM_OFFSET));
	this.geometry.vertices.push(new THREE.Vector3( ROOM_OFFSET, ROOM_HEIGHT,  ROOM_OFFSET));
	var count = 8;

	this.geometry.faces.push(new THREE.Face3(1,0,2));
	this.geometry.faces.push(new THREE.Face3(3,2,0));
	this.geometry.faces.push(new THREE.Face3(4,5,6));
	this.geometry.faces.push(new THREE.Face3(6,7,4));

	if (this.paths[NORTH] == null) {
		this.geometry.faces.push(new THREE.Face3(5,1,6));
		this.geometry.faces.push(new THREE.Face3(2,6,1));
	} else {
		this.geometry.vertices.push(new THREE.Vector3(-DOOR_OFFSET, 0, -ROOM_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3(-DOOR_OFFSET, DOOR_HEIGHT, -ROOM_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3(-DOOR_OFFSET, ROOM_HEIGHT, -ROOM_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3( DOOR_OFFSET, ROOM_HEIGHT, -ROOM_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3( DOOR_OFFSET, DOOR_HEIGHT, -ROOM_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3( DOOR_OFFSET, 0, -ROOM_OFFSET));
		this.geometry.faces.push(new THREE.Face3(5,1,count+2));
		this.geometry.faces.push(new THREE.Face3(count, count+2, 1));
		this.geometry.faces.push(new THREE.Face3(count+2, count+1, count+3));
		this.geometry.faces.push(new THREE.Face3(count+4, count+3, count+1));
		this.geometry.faces.push(new THREE.Face3(count+3, count+5, 6));
		this.geometry.faces.push(new THREE.Face3(2, 6, count+5));
		count += 6;

	}

	if (this.paths[WEST] == null) {
		this.geometry.faces.push(new THREE.Face3(4,0,5));
		this.geometry.faces.push(new THREE.Face3(1,5,0));
	} else {
		this.geometry.vertices.push(new THREE.Vector3(-ROOM_OFFSET, 0,  DOOR_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3(-ROOM_OFFSET, DOOR_HEIGHT,  DOOR_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3(-ROOM_OFFSET, ROOM_HEIGHT,  DOOR_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3(-ROOM_OFFSET, ROOM_HEIGHT, -DOOR_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3(-ROOM_OFFSET, DOOR_HEIGHT, -DOOR_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3(-ROOM_OFFSET, 0, -DOOR_OFFSET));
		this.geometry.faces.push(new THREE.Face3(4,0,count+2));
		this.geometry.faces.push(new THREE.Face3(count, count+2, 0));
		this.geometry.faces.push(new THREE.Face3(count+2, count+1, count+3));
		this.geometry.faces.push(new THREE.Face3(count+4, count+3, count+1));
		this.geometry.faces.push(new THREE.Face3(count+3, count+5, 5));
		this.geometry.faces.push(new THREE.Face3(1, 5, count+5));
		count += 6;

	}

	if (this.paths[SOUTH] == null) {
		this.geometry.faces.push(new THREE.Face3(7,3,4));
		this.geometry.faces.push(new THREE.Face3(0,4,3));
	} else {
		this.geometry.vertices.push(new THREE.Vector3( DOOR_OFFSET, 0,  ROOM_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3( DOOR_OFFSET, DOOR_HEIGHT,  ROOM_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3( DOOR_OFFSET, ROOM_HEIGHT,  ROOM_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3(-DOOR_OFFSET, ROOM_HEIGHT,  ROOM_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3(-DOOR_OFFSET, DOOR_HEIGHT,  ROOM_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3(-DOOR_OFFSET, 0,  ROOM_OFFSET));
		this.geometry.faces.push(new THREE.Face3(7,3,count+2));
		this.geometry.faces.push(new THREE.Face3(count, count+2, 3));
		this.geometry.faces.push(new THREE.Face3(count+2, count+1, count+3));
		this.geometry.faces.push(new THREE.Face3(count+4, count+3, count+1));
		this.geometry.faces.push(new THREE.Face3(count+3, count+5, 4));
		this.geometry.faces.push(new THREE.Face3(0, 4, count+5));
		count += 6;
	}

	if (this.paths[EAST] == null) {
		this.geometry.faces.push(new THREE.Face3(6,2,7));
		this.geometry.faces.push(new THREE.Face3(3,7,2));
	} else {
		this.geometry.vertices.push(new THREE.Vector3( ROOM_OFFSET, 0, -DOOR_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3( ROOM_OFFSET, DOOR_HEIGHT, -DOOR_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3( ROOM_OFFSET, ROOM_HEIGHT, -DOOR_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3( ROOM_OFFSET, ROOM_HEIGHT,  DOOR_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3( ROOM_OFFSET, DOOR_HEIGHT,  DOOR_OFFSET));
		this.geometry.vertices.push(new THREE.Vector3( ROOM_OFFSET, 0,  DOOR_OFFSET));
		this.geometry.faces.push(new THREE.Face3(6,2,count+2));
		this.geometry.faces.push(new THREE.Face3(count, count+2, 2));
		this.geometry.faces.push(new THREE.Face3(count+2, count+1, count+3));
		this.geometry.faces.push(new THREE.Face3(count+4, count+3, count+1));
		this.geometry.faces.push(new THREE.Face3(count+3, count+5, 7));
		this.geometry.faces.push(new THREE.Face3(3, 7, count+5));
		count += 6;
	}
}

Room.prototype.visit = function() {
	this.visited = true;
}

Room.prototype.buildFirsthand = function(scene, angle) {
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
	directionalLight.position.set( 0, 4, 8 );

	
	directionalLight.castShadow = true;
	//this.castShadow = true;
	this.receiveShadow = true;
	scene.add( directionalLight );



	var mesh = THREE.SceneUtils.createMultiMaterialObject(this.geometry, this.materials);
	mesh.rotation.y = angle * Math.PI/2;
	scene.add(mesh);
	if (this.object != null) {
		this.object.position.set(0,0,0);
		this.object.rotation.y = 0;
		scene.add(this.object);
	}
	for (var c = 0; c < 4; c++) {
		var path = this.paths[c];
		if (path != null) {
			mesh = new THREE.Mesh(FRAME_GEOM, getDarkVariant(path.to_room.myColor));
			mesh.rotation.y = (angle + c) * Math.PI / 2;
			scene.add(mesh);
			path.to_room.buildSecondhand(scene, angle+2+c-path.to_door, (angle+c)%4);
		}
	}
}

Room.prototype.buildSecondhand = function(scene, angle, side) {
	scene.add( new THREE.AmbientLight(0x444444) );
	var mesh = new THREE.Mesh(this.geometry, this.materials[0]);
	mesh.rotation.y = angle * Math.PI/2;
	if (side%2 == 0) {
		mesh.position.z = (side-1)*ROOM_WIDTH;
	} else {
		mesh.position.x = (side-2)*ROOM_WIDTH;
	}
	scene.add(mesh);
	//draw object copy
	if (this.object != null) {
		mesh = this.object.clone();
		this.copies.push(mesh);
		if (side%2 == 0) {
			mesh.position.z = (side-1)*ROOM_WIDTH;
		} else {
			mesh.position.x = (side-2)*ROOM_WIDTH;
		}
		scene.add(mesh);
	}

	//push copyloc
	if (side%2 == 0) {
		this.copylocs.push(new THREE.Vector3(0,0,(side-1)*ROOM_WIDTH));
	} else {
		this.copylocs.push(new THREE.Vector3((side-2)*ROOM_WIDTH,0,0));
	}

	//draw doors and frames
	for (var c = 0; c < 4; c++) {
		if((6 + side - angle) % 4 != c) {	
			var path = this.paths[c];
			if (path != null) {
				mesh = path.to_room.makeDoor();
				mesh.rotation.y = (angle+c) * Math.PI/2;
				if (side%2 == 0) {
					mesh.position.z = (side-1)*ROOM_WIDTH;
				} else {
					mesh.position.x = (side-2)*ROOM_WIDTH;
				}
				scene.add(mesh);
				mesh = new THREE.Mesh(FRAME_GEOM, getDarkVariant(path.to_room.myColor));
				mesh.rotation.y = (angle + c) * Math.PI / 2;
				if (side%2 == 0) {
					mesh.position.z = (side-1)*ROOM_WIDTH;
				} else {
					mesh.position.x = (side-2)*ROOM_WIDTH;
				}
				scene.add(mesh);
			}
		}
	}
}

Room.prototype.makeDoor = function() {
	return new THREE.Mesh(DOOR_GEOM, this.materials[0]);
}

function getNewMaterial(pcolor) {
	return new THREE.ShaderMaterial(	
	{
		uniforms: {
			"mNear": { type: "f", value: 1.0 },
			"mFar" : { type: "f", value: 35.0 },
			"color": { type: "v3", value: new THREE.Vector3( ((pcolor & 0xFF0000) >> 16) / 255, ((pcolor & 0x00FF00) >> 8) / 255, (pcolor & 0x0000FF) / 255 ) },
			"opacity" : { type: "f", value: 1.0 }

		},

		vertexShader: [

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float mNear;",
			"uniform float mFar;",
			"uniform vec3 color;",
			"uniform float opacity;",

			"void main() {",

				"float depth = gl_FragCoord.z / gl_FragCoord.w;",
				"float f = 1.0 - smoothstep( mNear, mFar, depth );",
				"gl_FragColor = vec4( vec3(f) * color, opacity );",

			"}"

		].join("\n")

	});
}

function getDarkVariant(myColor) {
	var darkVar = .9;
	oldColor = new THREE.Vector3( ((myColor & 0xFF0000) >> 16) / 255, ((myColor & 0x00FF00) >> 8) / 255, (myColor & 0x0000FF) / 255 );
	oldColor.x = oldColor.x * darkVar;
	console.log("cX: " + oldColor.x);
	oldColor.y = oldColor.y * darkVar;
	console.log("cY: " + oldColor.y);
	oldColor.z = oldColor.z * darkVar;
	console.log("cZ: " + oldColor.z);
	var newColor = (((oldColor.x * 255) << 16) & 0xFF0000) | (((oldColor.y * 255) << 8) & 0x00FF00) | ((oldColor.z * 255) & 0x0000FF);
	console.log("newColor: " + newColor);
	return getNewMaterial(newColor);
}




