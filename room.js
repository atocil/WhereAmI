NORTH = 0;
WEST  = 1;
SOUTH = 2;
EAST  = 3;

ROOM_HEIGHT = 10;
ROOM_WIDTH = 10;
ROOM_OFFSET = ROOM_WIDTH/2;
ROOM_TOLERANCE = .2;	//How close to the wall you can get
DOOR_WIDTH = 2;
DOOR_HEIGHT = 2*DOOR_WIDTH;
DOOR_OFFSET = DOOR_WIDTH/2;

DOOR_GEOM = new THREE.Geometry();
DOOR_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET, 0, -ROOM_OFFSET));
DOOR_GEOM.vertices.push(new THREE.Vector3( DOOR_OFFSET, 0, -ROOM_OFFSET));
DOOR_GEOM.vertices.push(new THREE.Vector3( DOOR_OFFSET, DOOR_HEIGHT, -ROOM_OFFSET));
DOOR_GEOM.vertices.push(new THREE.Vector3(-DOOR_OFFSET, DOOR_HEIGHT, -ROOM_OFFSET));
DOOR_GEOM.faces.push(new THREE.Face3(0,1,2));
DOOR_GEOM.faces.push(new THREE.Face3(2,3,0));

function Room(pcolor) {
	this.paths = new Array(null, null, null, null);
	// this.materials = [new THREE.MeshBasicMaterial( {color: pcolor, transparent: true, blending: THREE.MultiplyBlending}), new THREE.MeshDepthMaterial()];
	this.materials = [new THREE.ShaderMaterial(	
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

	})];
	this.visited = false;
	this.geometry = null;
	this.object = null;
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
		this.object.position.x = 0;
		this.object.position.z = 0;
		scene.add(this.object);
	}
	for (var c = 0; c < 4; c++) {
		var path = this.paths[c];
		if (path != null)
			path.to_room.buildSecondhand(scene, angle+2+c-path.to_door, (angle+c)%4);
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
	if (this.object != null) {
		if (side%2 == 0) {
			this.object.position.z = (side-1)*ROOM_WIDTH;
		} else {
			this.object.position.x = (side-2)*ROOM_WIDTH;
		}
		scene.add(this.object);
	}

	for (var c = 0; c < 4; c++) {
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
		}
	}
}

Room.prototype.makeDoor = function() {
	return new THREE.Mesh(DOOR_GEOM, this.materials[0]);
}




