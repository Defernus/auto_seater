//vars
let population;

let canvas;
let ctx;

let w;
let h;

let seat_size;
//----

function onLoad()
{
	population = new Population((new Office()).gen([...Array(office_size).keys()]));

	console.log("onLoad()");
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	w = canvas.width;
	h = canvas.height;

	seat_size = w/(office_cells*3);
}

function redraw()
{
	ctx.fillStyle = "#dddddd";
	ctx.fillRect(0, 0, w, h);

	let best_office = population.getBest();

	for(let i = 0; i != office_size; ++i)
	{
		ctx.fillStyle = "#ffffff";
		let x = 3*getCell(i) + 2*(Math.floor(i/2)%2);
		let y = i%2 + (Math.floor(i/4)%2)*2;

		ctx.fillRect(seat_size * (x+.05), seat_size * (y+.05), seat_size*.9, seat_size*.9);

		ctx.fillStyle = "#000000";
		
		ctx.font = Math.floor(seat_size*.7)+"px arial";
		let text = ""+best_office.ids_by_seats[i];
		ctx.fillText(text, (x+.15 + (text.length>1?0:.2))*seat_size, (y+.75)*seat_size);
		
		ctx.fillStyle = "#990000";
		ctx.font = "8px arial";
		ctx.fillText(i, (x+.1)*seat_size, (y+.9)*seat_size);
	}

	ctx.fillStyle = "#000000";
	for(let i = 0; i != office_cells+1; ++i)
	{
		ctx.fillRect((3*i-.05)*seat_size, 0, seat_size*.1, seat_size*4);
		ctx.fillRect((3*i-1)*seat_size, seat_size*1.95, seat_size*2, seat_size*.1);
	}
}
