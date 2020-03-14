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
			let ff = (getLengthToSeat(seat, workers_seats[this.friends[i]])-1)/8;
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

		let min_h = 0;

		for(let i = 0; i != workers.length; ++i)
		{
			let h = workers[i].getHappiness(this.seats_by_ids, this.seats_by_ids[workers[i].id]);
			this.happiness += h;
			if(h < min_h)
			{
				min_h = h;
			}
		}

		this.happiness /= office_size;
		this.happiness += min_h;
		//this.happiness /= 2;
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
