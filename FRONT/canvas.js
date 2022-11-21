const white = "#ffffff";
const black = "#000000";

const rows = 20;
const columns = 20;
const cell_size = 25;

const c = document.querySelector('canvas');
const c_i = document.querySelector('#cell-index');
const ctx = c.getContext('2d');

let mouse = { x: undefined, y: undefined, isDrawing: false, isErasing: false };
let grid;

class Grid {

	constructor(row_count, column_count, cell_size) {

		this.row_count = row_count;
		this.column_count = column_count;
		this.cell_size = cell_size;

		this.cells = [];

		for (let x = 0; x < this.row_count; x++) {
			let row = [];
			for (let y = 0; y < this.column_count; y++) {
				row.push(new Cell(x, y, cell_size))
			}
			this.cells.push(row);
		}
	}

	update(mouse, ctx) {
		for (let x = 0; x < this.row_count; x++) {
			for (let y = 0; y < this.column_count; y++) {
				let c = this.cells[x][y];

				if ((c.x <= mouse.x) && (mouse.x < c.x + c.size) &&
					(c.y <= mouse.y) && (mouse.y < c.y + c.size)) {
					c.onHover();

					if (mouse.isDrawing) {
						c.onClick(black);
					} else if (mouse.isErasing) {
						c.onClick(white);
					}
				}
				else c.onUnhover();

				c.draw(ctx)
			}
		}
	}

	export() {
		let arr = [];
		for (let x = 0; x < this.row_count; x++) {
			for (let y = 0; y < this.column_count; y++) {
				if (this.cells[x][y].color == white) {
					arr.push(0);
				}
				else {
					arr.push(1);
				}
			}
		}
		return arr;
	}

	import(data) {
		for (let x = 0; x < this.row_count; x++) {
			for (let y = 0; y < this.column_count; y++) {
				this.cells[x][y].color = data[x * this.row_count + y] ? black : white
			}
		}
	}

	clear() {
		for (let x = 0; x < this.row_count; x++) {
			for (let y = 0; y < this.column_count; y++) {
				this.cells[x][y].color = white;
			}
		}
	}
}


class Cell {

	constructor(x_index, y_index, size) {
		this.padding = 1;
		this.size = size;
		this.x = x_index * this.size;
		this.y = y_index * this.size;
		this.color = white; // default is white
		this.isHovered = false;
	}

	onHover() { this.isHovered = true; }
	onUnhover() { this.isHovered = false; }
	onClick(color) { this.color = color; }

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x + this.padding,
			this.y + this.padding,
			this.size - this.padding * 2,
			this.size - this.padding * 2);

		if (this.isHovered) {
			ctx.strokeStyle = "#00f";
			ctx.strokeRect(this.x, this.y, this.size, this.size);
		}
	}

}




/// MOUSE INPUTS
c.addEventListener("mousemove", (e) => {
	// mouse_coordinate - element_position_offset - border_width
	mouse.x = e.clientX - c.offsetLeft - 20;
	mouse.y = e.clientY - c.offsetTop - 20;
});
c.addEventListener("mousedown", (e) => {

	if (e.button == 0) { //left
		mouse.isDrawing = true
	} else if (e.button == 2) { //right
		mouse.isErasing = true
	}
});
c.addEventListener("mouseup", (e) => {

	if (e.button == 0) { //left
		mouse.isDrawing = false
	} else if (e.button == 2) { //right
		mouse.isErasing = false
	}
});


function init() {
	grid = new Grid(rows, columns, cell_size);
	animate();
}

// animation loop
function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, rows * cell_size, columns * cell_size);
	grid.update(mouse, ctx)
}

//hide right click menu to erase
document.getElementById('canvas').addEventListener('contextmenu', function (ev) {
	ev.preventDefault();
	return false;
}, false);
//start
init();