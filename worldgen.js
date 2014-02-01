function generate_world(num_rooms, num_doors)
{
	var rooms = new Array();

	for(var i = 0; i < num_rooms; i ++) {
		rooms[i] = new Room(colors[i]);

	}

	var temp_room = room[0];

	for(i = 0; i < num_doors; i ++) {

		for(var j = 0; j < num_rooms; j ++) {
			temp_room.visited = true;

			//Which door this path will leave from
			var door_num = int(Math.random() * num_doors);
			while(temp_room.paths[door_num] != null) {
				door_num = int(Math.random() * num_doors);
			}

			//Which room this path will go to
			var to_room = int(Math.random() * num_rooms);
			while(rooms[to_room].visited) {
				to_room = int(Math.random() * num_rooms);
			}

			//Which door you will emerge from in your new room
			var to_door = int(Math.random() * num_doors);

			temp_room.paths[door_num] = new Path(to_room, to_door);

			temp_room = rooms[to_room];
		}

		while(temp_room.paths[door_num] == null) {
				door_num = int(Math.random() * num_doors);
		}

		temp_room.paths[door_num] = new Path(int(Math.random() * num_rooms), int(Math.random() * num_doors));

		reset_rooms_visited(rooms);
	}

	for(i = 0; i < rooms.length; i ++) {
		rooms[i].buildGeometry();
	}
}

function reset_rooms_visited(rooms)
{
	for(var i = 0; i < rooms.length; i ++) {
		rooms[i].visited = false;
	}
}

function gen_test_6_2()
{
	var rooms = new Array();

	for(var i = 0; i < 6; i ++) {
		rooms[i] = new Room(colors[i]);
	}

	rooms[0].paths[NORTH] = new Path(5, NORTH);
	rooms[0].paths[SOUTH] = new Path(3, NORTH);

	rooms[1].paths[NORTH] = new Path(4, NORTH);
	rooms[1].paths[SOUTH] = new Path(2, SOUTH);

	rooms[2].paths[NORTH] = new Path(4, NORTH);
	rooms[2].paths[SOUTH] = new Path(5, NORTH);

	rooms[3].paths[NORTH] = new Path(2, NORTH);
	rooms[3].paths[SOUTH] = new Path(0, NORTH);

	rooms[4].paths[NORTH] = new Path(1, NORTH);
	rooms[4].paths[SOUTH] = new Path(3, NORTH);

	rooms[5].paths[NORTH] = new Path(4, NORTH);
	rooms[5].paths[SOUTH] = new Path(3, SOUTH);
}