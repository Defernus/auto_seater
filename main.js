//vars
let e_happiness;
let e_itterations;

let e_button_switch_selection;
let e_button_itterate;

let itterations;

let is_itteration_loop;

let selection;
let is_worker_selected;

let population;

let canvas;
let ctx;

let w;
let h;

let seat_size;
//---- 

function onLoad()
{
	selection = -1;
	is_worker_selected = false;

	is_itteration_loop = false;
	itterations = 0;

	e_happiness = document.getElementById("happiness");
	e_itterations = document.getElementById("itterations");

	e_button_itterate = document.getElementById("button_itterate");
	e_button_switch_selection = document.getElementById("button_switch_selection");

	population = new Population((new Office()).gen([...Array(office_size).keys()]));

	console.log("onLoad()");
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	canvas.onclick = onclickCanvas;

	w = canvas.width;
	h = canvas.height;

	seat_size = w/(office_cells*3);

	document.getElementById('input_data').addEventListener('change', handleFileSelect, false);

	requestAnimationFrame(redraw);
}

function redraw()
{
	ctx.fillStyle = "#dddddd";
	ctx.fillRect(0, 0, w, h);

	let best_office = population.getBest();

	e_happiness.innerHTML = best_office.getFactor();
	
	let selected_seat = selection;
	let selected_id = selection;
	if(selection != -1)
	{
		if(is_worker_selected)
		{
			selected_seat = best_office.seats_by_ids[selection];
		}
		else
		{
			selected_id = best_office.ids_by_seats[selection];	
		}
	}

	for(let i = 0; i != office_size; ++i)
	{
		ctx.fillStyle = "#ffffff";
		if(selected_seat != -1)
		{
			if(selected_seat == i)
			{
				ctx.fillStyle = "#9999ff";
			}
			else
			{
				let fr = workers[selected_id].friends;
				let is_color_peaked = false;
				for(let j = 0; j != fr.length; ++j)
				{
					if(fr[j] == i)
					{
						ctx.fillStyle = frgb(0, .25+j*.75/fr.length, 0);
						is_color_peaked = true;
						break;
					}
				}
				let en = workers[selected_id].enemies;
				for(let j = 0; j != en.length && !is_color_peaked; ++j)
				{
					if(en[j] == i)
					{
						ctx.fillStyle = frgb(.25+j*.75/en.length, 0,  0);
						break;
					}
				}
			}
		}
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

function onclickSwitchSelection()
{
	if(is_worker_selected)
	{
		is_worker_selected = false;
		selection = population.getBest().ids_by_seats[selection];
		e_button_switch_selection.innerHTML = "select seats";
	}
	else
	{
		is_worker_selected = true;
		selection = population.getBest().seats_by_ids[selection];
		e_button_switch_selection.innerHTML = "select workers";
	}

}

function onclickShuffle()
{
	let best = population.getBest(); best.mutate(1);
	population = new Population(best);
	requestAnimationFrame(redraw);
}

function handleFileSelect(evt)
{
	reader = new FileReader();
	reader.readAsBinaryString(evt.target.files[0]);
	reader.onload = function(f)
	{
		let data = JSON.parse(reader.result);

		if(data.length != office_size)
		{
			console.error("wrong array length (must be " + office_size + ")");
		}
		for(let i = 0; i != office_size; ++i)
		{
			if(data[i].id == null || data[i].friends == null || data[i].friends.length == null || data[i].enemies == null || data[i].enemies.length == null)
			{
				console.error("at " + i + " wrong format!");
				return;
			}
		}
		for(let i = 0; i != office_size; ++i)
		{
			workers[i].id = data[i].id;
			workers[i].friends = data[i].friends;
			workers[i].enemies = data[i].enemies;
		}

		population = new Population((new Office()).gen([...Array(office_size).keys()]).mutate(1));
		itterations = 0;
		e_itterations.innerHTML = itterations;
		requestAnimationFrame(redraw);
	}
}


function onclickStep()
{
	population.itterate();
	e_itterations.innerHTML = ++itterations;
	requestAnimationFrame(redraw);
}

function onclickItterate()
{
	if(is_itteration_loop)
	{
		is_itteration_loop = false;
		e_button_itterate.value = "itterate";
	}
	else
	{
		is_itteration_loop = true;
		e_button_itterate.value = "abort";
		requestAnimationFrame(startItterations);
	}
}

function startItterations()
{
	if(!is_itteration_loop)
	{
		return;
	}
	population.itterate();
	e_itterations.innerHTML = ++itterations;
	redraw();
	requestAnimationFrame(startItterations);
}

function onclickCanvas(e)
{
	let button = e.button;
	let mx = e.clientX-canvas.offsetLeft;
	let my = e.clientY-canvas.offsetTop;
		
	let ox = Math.floor(mx/seat_size);
	let oy = Math.floor(my/seat_size);
	
	if(oy < 4 && (ox%3) != 1)
	{
		let cell = Math.floor(ox/3);
		let sq = Math.floor(oy/2);
		let row = (ox%3) == 0?0:1;
	
		selection = cell*8 + sq * 4 + row * 2 + oy%2;

		if(is_worker_selected)
		{
			selection = population.getBest().ids_by_seats[selection];
		}
	}
	else
	{
		selection = -1;
	}
	requestAnimationFrame(redraw);
}
