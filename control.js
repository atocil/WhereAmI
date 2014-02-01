document.onkeydown = function(down) {

				switch (down.keyCode) {
	                case 87: // W
	                	wIsPressed = true;
	                break;

	                case 83: // S
	                	sIsPressed = true;
	                break;

	                case 65: // A
	                	aIsPressed = true;
	                break;

	                case 68: // D
	     				dIsPressed = true;
	                break;

	                case 69: //E
	                	attemptGrab();
	                break;

	                case 32: // Space
	                	spaceIsPressed = true;
	                break;

	                case 16: // lShift
	                	lShiftIsPressed = true;
	                break;

	                case 66:
	                	alert(mouseX);
	                break;
				}
			}

			document.onkeyup = function(up) {

				switch (up.keyCode) {
	                case 87: // W
	                	wIsPressed = false;
	                break;

	                case 83: // S
	                	sIsPressed = false;
	                break;

	                case 65: // A
	                	aIsPressed = false;
	                break;

	                case 68: // D
	     				dIsPressed = false;
	                break;

	                case 32: // Space
	                	spaceIsPressed = false;
	                break;
	                
	                case 16: // lShift
	                	lShiftIsPressed = false;
	                break;	                

	                case 66:
	                	alert(mouseX);
	                break;
				}
			}
			

			document.onmousemove = function(move) {
				mouseX = move.clientX;
				mouseY = move.clientY;
			}

			var mouseDown;
			document.onmousedown = function(click) {
				mouseDown = true;
			}

			document.onmouseup = function(release) {
				mouseDown = false;
			}