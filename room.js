NORTH = 0;
WEST  = 1;
SOUTH = 2;
EAST  = 3;

ROOM_HEIGHT = 10;
ROOM_WIDTH = 10;
ROOM_OFFSET = ROOM_WIDTH/2;
DOOR_WIDTH = 2;
DOOR_HEIGHT = 2*DOOR_WIDTH;
DOOR_OFFSET = DOOR_WIDTH/2;

function Room(pcolor) {
	this.paths = new Array(null, null, null, null);
	this.material = new THREE.MeshDepthMaterial({color: 0x00FF00})
	this.visited = false;
	this.geometry = null;
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

Room.prototype.buildFirsthand = function(scene) {
	scene.add(new THREE.Mesh(this.geometry, this.material));
}




