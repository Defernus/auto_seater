let next_id = 0;

const office_w = 4;
const office_cells = 6;
const office_l = office_cells*2;
const office_size = office_w*office_l;
const workers_number = office_size;

class Worker
{
	constructor()
	{
		this.id = next_id++;
		this.friends = [];
		this.enemies = [];

		let free_workers = [...Array(office_size).keys()]
		free_workers.splice(this.id, 1);

		for(let i = 0; i != 3; ++i)
		{
			this.friends.push(free_workers.splice(Math.floor(Math.random()*free_workers.length), 1)[0]);
		}
		
		for(let i = 0; i != 2; ++i)
		{
			this.enemies.push(free_workers.splice(Math.floor(Math.random()*free_workers.length), 1)[0]);
		}
	}

	getHappiness(workers_seats, seat)
	{
		let ret = 1;
		for(let i = 0; i != this.friends.length; ++i)
		{
			let ff = 1-(getLengthToSeat(seat, workers_seats[this.friends[i]])-1)/8;
			ff *= ff;
			ff = 1-ff;

			for(let j = 0; j != i; ++j)
			{
				ff*=ff;
			}
			ret *= 1-ff;
		}
		for(let i = 0; i != this.enemies.length; ++i)
		{
			let ff = (getEnLengthToSeat(seat, workers_seats[this.enemies[i]])-1)/8;
			ret *= ff*ff;
		}
		return ret;
	}
}

function loadFromJSON(src)
{
	let rav = JSON.parse(src);
	let data = rav.workers;
	let pairs = rav.pairs;
	if(data.length > office_size)
	{
		console.error("wrong array length (must be less than " + (office_size+1) + ")");
	}
	for(let i = 0; i != data.length; ++i)
	{
		if(isNaN(data[i].value) || data[i].friends == null || data[i].friends.length == null || data[i].enemies == null || data[i].enemies.length == null)
		{
			console.error("at " + i + " wrong format!");
			return;
		}
	}
	for(let i = 0; i != office_size; ++i)
	{
		if(i < data.length)
		{
			workers[i].name = data[i].text;
			workers[i].id = Number(data[i].value);
			workers[i].friends = data[i].friends;
			workers[i].enemies = data[i].enemies;
		}
		else
		{
			workers[i].name = "none";
			workers[i].id = i;
			workers[i].friends = [];
			workers[i].enemies = [];
		}
	}
	for(let i = 0; i != pairs.length; ++i)
	{
		workers[pairs[i][0]].enemies.push(pairs[i][1]);
		workers[pairs[i][1]].enemies.push(pairs[i][0]);
	}
}

let workers = [];

for(let i = 0; i != office_size; ++i)
{
	workers.push(new Worker());
}

class Office
{
	constructor()
	{

	}

	calcHappiness()
	{
		//this.happiness = workers[0].getHappiness(this.seats_by_ids, this.seats_by_ids[0]);
		
		this.happiness = 0;

		let min_h = 1;

		for(let i = 0; i != workers.length; ++i)
		{
			let h = workers[i].getHappiness(this.seats_by_ids, this.seats_by_ids[i]);
			this.happiness += h;
			if(h < min_h)
			{
				min_h = h;
			}
		}

		this.happiness /= office_size;
		this.happiness += min_h*office_size;
		//this.happiness /= 2;*/
	}

	gen(seats)
	{
		this.ids_by_seats = [...seats];
		this.seats_by_ids = new Array(office_size);

		for(let i = 0; i != this.ids_by_seats.length; ++i)
		{
			this.seats_by_ids[this.ids_by_seats[i]] = i;
		}

		this.calcHappiness();

		return this;
	}

	check()
	{
		for(let i = 0; i != office_size; ++i)
		{
			if(this.ids_by_seats[this.seats_by_ids[i]] != i)
			{
				throw "id and seat isn`t match!!";
				return false;
			}
		}
		return true;
	}

	getFactor()
	{
		if(!this.happiness)
		{
			this.calcHappiness();
		}
		return this.happiness;
	}

	mutate(f)
	{
		for(let i = 0; i < office_size; ++i)
		{
			if(Math.random() < f)
			{
				let ii = Math.floor(Math.random()*(office_size-1));
				if(ii >= i)++i;
				let a = this.ids_by_seats[ii];
				this.ids_by_seats[ii] = this.ids_by_seats[i];
				this.ids_by_seats[i] = a;


				a = this.seats_by_ids[this.ids_by_seats[ii]];
				this.seats_by_ids[this.ids_by_seats[ii]] = this.seats_by_ids[this.ids_by_seats[i]];
				this.seats_by_ids[this.ids_by_seats[i]] = a;
			}
		}
		this.calcHappiness();
		return this;
	}

	clone()
	{
		let ret = new Office();
		ret.seats_by_ids = [...this.seats_by_ids];
		ret.ids_by_seats = [...this.ids_by_seats];
		ret.calcHappiness();

		return ret;
	}
}
