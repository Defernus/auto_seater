let next_id = 0;

const office_w = 4;
const office_cells = 6;
const office_l = office_cells*2;
const office_size = office_w*office_l;
const workers_number = office_size;
console.log("test");
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
			this.friends.push(free_workers.splice(Math.floor(Math.random()*free_workers.length), 1));
		}
		
		for(let i = 0; i != 2; ++i)
		{
			this.enemies.push(free_workers.splice(Math.floor(Math.random()*free_workers.length), 1));
		}
	}

	getHappiness(workers_seats, seat)
	{
		let ret = 1;
		for(let i = 0; i != this.friends.length; ++i)
		{
			let ff = (getLengthToSeat(seat, workers_seats[this.friends[i].id])-1)/8;
			for(let j = 0; j != i; ++j)
			{
				ff*=ff;
			}
			ret*= 1-ff;
		}
		return ret;
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
		this.happiness = 0;

		for(let i = 0; i != workers.length; ++i)
		{
			this.happiness += workers[i].getHappiness(this.seats_by_ids, this.seats_by_ids[workers[i].id]);
		}

		this.happiness /= office_size;
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
				if(ii >= i)++i;//
				let a = this.seats_by_ids[ii];
				this.seats_by_ids[ii] = this.seats_by_ids[i];
				this.seats_by_ids[i] = a;
				a = this.ids_by_seats[ii];
				this.ids_by_seats[ii] = this.ids_by_seats[i];
				this.ids_by_seats[i] = a;
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
