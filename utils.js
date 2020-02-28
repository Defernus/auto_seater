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

var out_element = document.getElementById("out");

function print(msg)
{
    out_element.innerText = msg;
}