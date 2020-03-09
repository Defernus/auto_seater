let population_size = 32;
let breeding_factor = 16;

let mutation_factor = 0.1;

class Population
{
	constructor(ind)
	{
		this.inds = [];
		this.best_i = 0;

		for(let i = 0; i != population_size; ++i)
		{
			this.inds.push(ind.clone().mutate(mutation_factor));
			if(this.inds[this.best_i].getFactor() < this.inds[this.inds.length-1].getFactor())
			{
				this.best_i = this.inds.length-1;
			}
		}
	}

	itterate()
	{
		let ni = [];
		let new_inds = [];
		let worst_ind_i = 0;
		for(let i = 0; i != population_size; ++i)
		{
			for(let j = 0; j != breeding_factor; ++j)
			{
				ni.push(this.inds[i].clone().mutate(mutation_factor));
				if(new_inds.length < population_size)
				{
					new_inds.push(ni[ni.length-1]);
					if(new_inds[new_inds.length-1].getFactor() < new_inds[worst_ind_i].getFactor())
					{
						worst_ind_i = new_inds.length-1;
					}
					
					if(new_inds[new_inds.length-1].getFactor() > new_inds[this.best_i].getFactor())
					{
						this.best_i = new_inds.length-1;
					}
				}
				else if(new_inds[worst_ind_i].getFactor() < ni[ni.length-1].getFactor())
				{
					new_inds[worst_ind_i] = ni[ni.length-1];

					if(new_inds[worst_ind_i].getFactor() > new_inds[this.best_i].getFactor())
					{
						this.best_i = best_i;
					}

					
					for(let k = 0; k != population_size; ++k)
					{
						if(k == worst_ind_i)continue; 
						if(new_inds[worst_ind_i].getFactor() > new_inds[k].getFactor())
						{
							worst_ind_i = k;
						}
					}
				}
			}
		}

		inds = new_inds;
	}

	getBest()
	{
		return this.inds[this.best_i];
	}
}
