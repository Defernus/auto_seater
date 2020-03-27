function getCell(i)
{
	return Math.floor(i/8);
}

function getNb(i)
{
	return Math.floor(i/2)*2 + 1-(i%2);
}

function getSquareNs(i)
{
	let n_couple = getNb(Math.floor(i/2))*2;
	return [getNb(i), n_couple+i%2, n_couple+(i+1)%2];
}

function getCellNs(i)
{
	let n_square = getNb(Math.floor(i/4))*4;
	let row = getNb(Math.floor(i/2))%2;

    	let a = (n_square%8 == 0)?[n_square+1, n_square+0]:[n_square, n_square+1];
	let b = (n_square%8 == 0)?[n_square+3, n_square+2]:[n_square+2, n_square+3];

	return getSquareNs(i).concat(row == 1?a.concat(b):b.concat(a));
}

function getLengthToSeat(a, b)
{
	for(i = 0; i != 4; ++i)
	{
		if(Math.floor(a>>i) == Math.floor(b>>i))return i;
	}
	return 3+Math.abs(getCell(a)-getCell(b));
}
function getEnLengthToSeat(a, b)
{
	let a_lr = a%2;
	let a_couple = Math.floor(a/2)%2;
	let a_square = Math.floor(a/4)%2;
	let a_cell = Math.floor(a/8);

	let b_lr = b%2;
	let b_couple = Math.floor(b/2)%2;
	let b_square = Math.floor(b/4)%2;
	let b_cell = Math.floor(b/8);

	if(Math.abs(a_cell-b_cell) == 1 && ((a_couple == 1 && b_couple == 0 && a_cell < b_cell) || (a_couple == 0 && b_couple == 1 && a_cell > b_cell)))
	{
		if(a_square == b_square)
		{
			return 2;
		}
		else if((a_square == 0 && b_square == 1 && a_lr == 1 && b_lr == 0) || (a_square == 1 && b_square == 0 && a_lr == 0 && b_lr == 1))
		{
			return 3;
		}
	}
	else if(a_cell == b_cell && a_couple == b_couple && (a_square == 0 && a_lr == 1 && b_square == 1 && b_lr == 0))
	{
		return 1;
	}

	for(i = 0; i != 4; ++i)
	{
		if(Math.floor(a>>i) == Math.floor(b>>i))return i;
	}
	return 3+Math.abs(getCell(a)-getCell(b));
}

function arraySub(a, b)
{
	let ret = [];
	for(let i = 0; i != a.length; ++i)
	{
		let is_unique = true;
		for(let j = 0; j != b.length; ++j)
		{
			if(a[i] == b[j])
			{
				is_unique = false;
				break;
			}
		}
		if(is_unique)
		{
			ret.push(a[i]);
		}
	}
	return ret;
}

function frgb(r, g, b)
{
	return "rgb("   + Math.floor(r*255) + "," + Math.floor(g*255) + "," + Math.floor(b*255) + ")";
}
