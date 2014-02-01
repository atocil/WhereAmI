function generate_world(num_rooms, num_doors)
{
	var rooms = new Array();

	for(var i = 0; i < num_rooms; i ++) {
		rooms[i] = new Room(colors[i]);
	}

	var temp_room = rooms[0];

	for(i = 0; i < num_doors; i ++) {

		var rooms_left = rooms.slice(0);
		rooms_left.splice(rooms_left.indexOf(temp_room), 1);
		while(rooms_left.length > 0) {
			console.log("length: " + rooms_left.length);
			//Which door this path will leave from
			var doors = new Array();
			for (var c = 0; c < 4; c++) {
				if (temp_room.paths[c] == null)
					doors.push(c)
			}
			if (doors.length == 0) {
				alert("NO MORE DOORS?!?!?!");
			}
			door_num = Math.floor(Math.random() * doors.length);

			//Which room this path will go to
			if (rooms_left.length == 0) {
				alert("NO MORE ROOMS?!?!?!");
			}
			var to_room = rooms_left.splice(Math.floor(Math.random() * rooms_left.length), 1)[0];

			//Which door you will emerge from in your new room
			var to_door = Math.floor(Math.random() * num_doors);

			temp_room.paths[door_num] = new Path(to_room, to_door);

			temp_room = to_room;
		}

		var doors2 = new Array();
		for (var c = 0; c < 4; c++) {
			if (temp_room.paths[c] == null)
				doors2.push(c)
		}
		if (doors2.length == 0)
			alert("WTF DOORS?!");
		door_num = Math.floor(Math.random() * doors2.length);

		temp_room.paths[door_num] = new Path(rooms[Math.floor(Math.random() * num_rooms)], Math.floor(Math.random() * num_doors));

	}

	for(i = 0; i < rooms.length; i ++) {
		rooms[i].buildGeometry();
	}

	assignObjects(rooms);

	return rooms;
}

function reset_rooms_visited(rooms)
{
	for(var i = 0; i < rooms.length; i ++) {
		rooms[i].visited = false;
	}
}

function gen_1()
{
	var rooms = new Array();

	for(var i = 0; i < 2; i ++) {
		rooms[i] = new Room(colors[i]);
	}

	rooms[0].paths[NORTH] = new Path(rooms[1], SOUTH);
	rooms[1].paths[SOUTH] = new Path(rooms[0], NORTH);

	rooms[0].object = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), rooms[1].materials[0]);
	rooms[1].object = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), rooms[0].materials[0]);

	for(i = 0; i < rooms.length; i ++) {
		rooms[i].buildGeometry();
	}

	return rooms;
}

function gen_2()
{
	var rooms = new Array();

	for(var i = 0; i < 4; i ++) {
		rooms[i] = new Room(colors[i]);
	}

	rooms[0].paths[NORTH] = new Path(rooms[1], SOUTH);
	rooms[0].paths[EAST] = new Path(rooms[3], WEST);

	rooms[1].paths[SOUTH] = new Path(rooms[0], NORTH);
	rooms[1].paths[EAST] = new Path(rooms[2], WEST);

	rooms[2].paths[WEST] = new Path(rooms[1], EAST);
	rooms[2].paths[SOUTH] = new Path(rooms[3], NORTH);

	rooms[3].paths[NORTH] = new Path(rooms[2], SOUTH);
	rooms[3].paths[WEST] = new Path(rooms[0], EAST);

	assignObjects(rooms);

	for(i = 0; i < rooms.length; i ++) {
		rooms[i].buildGeometry();
	}

	return rooms;
}

function gen_3()
{
	var rooms = new Array();

	for(var i = 0; i < 3; i ++) {
		rooms[i] = new Room(colors[i]);
	}

	rooms[0].paths[NORTH] = new Path(rooms[1], SOUTH);

	rooms[1].paths[NORTH] = new Path(rooms[2], SOUTH);
	rooms[1].paths[SOUTH] = new Path(rooms[0], NORTH);

	rooms[2].paths[NORTH] = new Path(rooms[2], NORTH);
	rooms[2].paths[EAST] = new Path(rooms[0], WEST);
	rooms[2].paths[SOUTH] = new Path(rooms[2], NORTH);

	rooms[0].object = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), rooms[1].materials[0]);
	rooms[1].object = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), rooms[2].materials[0]);
	rooms[2].object = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), rooms[0].materials[0]);

	for(i = 0; i < rooms.length; i ++) {
		rooms[i].buildGeometry();
	}

	return rooms;
}

function assignObjects(rooms)
{
	var cubeGeom = new THREE.CubeGeometry(1, 1, 1);
	for(var i = 0; i < rooms.length; i ++) {
		var color_num = Math.floor(Math.random() * rooms.length);
		while(rooms[color_num].visited) {
			color_num = Math.floor(Math.random() * rooms.length);
		}

		rooms[color_num].visited = true;
		rooms[i].object = new THREE.Mesh(cubeGeom, rooms[color_num].materials[0]);
	}
}