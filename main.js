class Worker
{
    constructor()
    {

    }

    copy(w)
    {
        this.id = w.id;
        this.seat = w.seat;
        this.seats_pr = [...w.seats_pr];
        this.pr_seats = [...w.pr_seats];
        this.wt = w.wt;
        this.friends = [...w.friends];
    }

    gen(seat)
    {
        this.id = -1;
        this.seat = seat;
        let cell_nbs = getCellNs(seat);
        
        this.seats_pr = new Array(office_size).fill(-1);

        let priority = office_size-1;
        this.pr_seats = new Array(office_size);
        this.seats_pr[seat] = priority--;
        for(let i = 0; i != cell_nbs.length; ++i)
        {
            this.seats_pr[cell_nbs[i]] = priority--;
        }
        let this_cell = getCell(seat);
        priority = 1;
        for(let i = 1;(this_cell-i > -1) || (this_cell+i < office_cells);++i)
        {
            if(this_cell-i > -1)
            {
                for(let j = 0; j != 8; ++j)
                {
                    this.seats_pr[(this_cell-i)*8 + j] = this.seats_pr[this_cell*8+j]-priority*8;
                }
                ++priority;
            }
            if(this_cell+i < office_cells)
            {
                for(let j = 0; j != 8; ++j)
                {
                    this.seats_pr[(this_cell+i)*8 + j] = this.seats_pr[this_cell*8+j]-priority*8;
                }
                ++priority;
            }
        }

        for(let i = 0; i != this.seats_pr.length; ++i)
        {
            this.pr_seats[this.seats_pr[i]] = i;
        }

        this.wt = Math.floor(Math.random()*365);
    }

    updateFriends()
    {
        this.friends = [];
        {
            let cn = [...getCellNs(this.seat)];
            for(let i = 0; i != 3; ++i)
            {
                let r = Math.random();
                let f = Math.floor(r*r*cn.length);

                let fs = cn.splice(f, 1)[0];
                this.friends.push(seats[fs].id);
            }
        }

    }
}

function addWorker(w)
{
    if(workers.length == 0)
    {
        workers[0] = w;
        return 0;
    }

    let start=0, end=workers.length-1; 
    
    while (start<=end){
        let mid = Math.floor((start + end)/2);
        if(workers.length == mid)
        {
            workers.push(w);
            return mid;
        }
        if(mid == 0)
        {
            if(workers[0].wt > w.wt)
            {
                workers.splice(0, 0, w); 
                return 0;
            }
            else
            {
                workers.push(w);
                return 1;
            }
        }
        else if (workers[mid].wt >= w.wt && workers[mid-1].wt <= w.wt)
        {
            workers.splice(mid, 0, w); 
            return mid;
        }
        else if (workers[mid].wt < w.wt)
        {
             start = mid + 1; 
        }
        else
        {
             end = mid - 1; 
        }
    }
    
    workers.push(w);
    return workers.length-1;
} 

function calcWorkerHappiness(w, arr = workers)
{
    let ret = w.seats_pr[w.seat]/(office_size-1);
    ret *= ret;
    
    for(let i = 0; i != w.friends.length; ++i)
    {
        let ff = (getLengthToSeat(w.seat, arr[w.friends[i]].seat)-1)/8;

        for(let j = 0; j != i; ++j)
        {
            ff*=ff;
        }

        ret*= 1-ff;
    }
    ret /= 0.985;
    

    return ret;
}

function calcOfficeHappiness(arr_s = seats, arr_w = workers)
{
    let ret = 0;
    let min_happiness = 1;
    let min_h_seat = 0;

    for(let i = 0; i != arr_s.length; ++i)
    {
        let h = calcWorkerHappiness(arr_s[i], arr_w);
        ret += h;
        if(min_happiness > h)
        {
            min_happiness = h;
            min_h_seat = i;
        }
    }

    //return (ret/office_size + min_happiness)/2;
    return ret/office_size * min_happiness;
}

var trace_seat = true;
function traceChange()
{
    let b = document.getElementById("trace");
    if(b.value == "trace worker")
    {
        trace_seat = false;
        b.value = "trace seat";
    }
    else
    {
        trace_seat = true;
        b.value = "trace worker";
    }
}

function swapWorkers(a, b, arr = seats)
{
    if(a == "undefined" || b == "undefined")
    {
        console.error(a, b);
    }

    if(a == b) return false;
    

    let s = a.seat;
    arr[a.seat] = b;
    arr[b.seat] = a;
    a.seat = b.seat;
    b.seat = s;

    return true;
}

function shuffleWorkers(arr = seats, factor = 1.)
{
    let s = [...Array(arr.length).keys()];
    while(s.length != 0)
    {
        let i = s.splice(Math.floor(Math.random()*s.length), 1)[0];
        let couple = Math.random()<.5*factor?(i+1)%2:i%2;
        let row = Math.random() < .25*factor?(1+Math.floor((i%8)/2))%2:Math.floor(i/2)%2;
        let square = Math.random() < .125*factor?(1+Math.floor((i%8)/4))%2:Math.floor(i/4)%2;
        let cell = Math.floor(i/8);
        if(Math.random()<.0625*factor)
        {
            if(cell == 0)
            {
                ++cell;
            }
            else if(cell == office_cells-1)
            {
                --cell;
            }
            else
            {
                cell += Math.random()?1:-1;
            }
        }
        let j = couple+row*2+square*4+cell*8;
        let si = s.indexOf(j);
        if(si!=-1)
        {
            s.splice(si, 1);
            swapWorkers(arr[i], arr[j], arr);
        }
    }
}

function redraw()
{
    ctx.fillStyle = "#dddddd";
    ctx.fillRect(0, 0, w, h);

    let selected_seat = -1;

    if(select != -1)
    {
        selected_seat = trace_seat?select:workers[select].seat;
    }

    for(let i = 0; i != office_size; ++i)
    {
        ctx.fillStyle = "#ffffff";
        if(selected_seat > -1)
        {
            if(i == selected_seat)
            {
                ctx.fillStyle = "#ff0000";
            }
            else if(i == workers[seats[selected_seat].friends[0]].seat)
            {
                ctx.fillStyle = "#00ff00";
            }
            else if(i == workers[seats[selected_seat].friends[1]].seat)
            {
                ctx.fillStyle = "#00cc00";
            }
            else if(i == workers[seats[selected_seat].friends[2]].seat)
            {
                ctx.fillStyle = "#007700";
            }
        }

        let x = 3*getCell(i) + 2*(Math.floor(i/2)%2);
        let y = i%2 + (Math.floor(i/4)%2)*2;

        ctx.fillRect(seat_size * (x+.05), seat_size * (y+.05), seat_size*.9, seat_size*.9);
        
        ctx.fillStyle = "#000000";
        if(selected_seat != -1)
        {
            ctx.font = Math.floor(seat_size*.7)+"px arial";
            let text = ""+seats[selected_seat].seats_pr[i];
            ctx.fillText(text, (x+.15 + (text.length>1?0:.2))*seat_size, (y+.75)*seat_size);
        }
        else if(seats[i])
        {
            ctx.font = Math.floor(seat_size*.7)+"px arial";
            let text = ""+seats[i].id;
            ctx.fillText(text, (x+.15 + (text.length>1?0:.2))*seat_size, (y+.75)*seat_size);
        }
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

function reseat()
{
    for(let i = 0; i != workers.length; ++i)
    {
        workers[i].seat = -1;
        workers[i].ps = [...workers[i].pr_seats];
    }
    
    seats = new Array(office_size);
    
    let free_workers = [...workers];
    
    while(free_workers.length != 0)
    {
        let w = free_workers[0];
        let seat = w.ps[w.ps.length-1];
    
        if(!seats[seat])
        {
            seats[seat] = free_workers.splice(0, 1)[0];
        }
        else if(seats[seat].seats_pr[seat] < w.seats_pr[seat])
        {
            free_workers.push(seats[seat]);
            seats[seat] = free_workers.splice(0, 1)[0];
        }
        else
        {
            --w.ps.length;
        }
    }
    
    for(let i = 0; i != seats.length; ++i)
    {
        seats[i].seat = i;
        delete seats[i].ps;
    }

    print(calcOfficeHappiness());
    requestAnimationFrame(redraw);
}

class Ind
{
    constructor(s)
    {
        this.seats = new Array(office_size);
        this.workers = new Array(workers_number);

        for(let i = 0; i != s.length; ++i)
        {
            this.seats[i] = new Worker();
            this.seats[i].copy(s[i]);
            this.workers[this.seats[i].id] = this.seats[i];
        }
    }
}

var BREEDING_FACTOR = 128;
var POPULATION_SIZE = 16;
var SHUFFLE_FACTOR = 0.2;

var inds;

function drawBest()
{
    if(!inds)
    {
        return;
    }

    let mi = 0;

    for(let i = 1; i != inds.length; ++i)
    {
        if(inds[mi].happiness < inds[i].happiness)
        {
            mi = i;
        }
    }

    seats = inds[mi].seats;
    workers = inds[mi].workers;

    requestAnimationFrame(redraw);
    print(calcOfficeHappiness());
}

function reseatH()
{
    inds = [];
    let min_h_i = 0;

    for(let i = 0; i != POPULATION_SIZE*BREEDING_FACTOR; ++i)
    {
        let ind = new Ind(seats);

        shuffleWorkers(ind.seats, SHUFFLE_FACTOR);
        
        ind.happiness = calcOfficeHappiness(ind.seats, ind.workers);
        if(inds.length < POPULATION_SIZE)
        {
            inds.push(ind);
            if(inds[min_h_i].happiness > inds[inds.length-1].happiness)
            {
                min_h_i = inds.length-1;
            }
        }
        else if(inds[min_h_i].happiness < ind.happiness)
        {
            inds[min_h_i] = ind;
            min_h_i = 0;
            for(let j = 1; j != POPULATION_SIZE; ++j)
            {
                if(inds[j].happiness < inds[min_h_i])
                {
                    min_h_i = j;
                }
            }
        }
    }

    drawBest();
}

var iit_times = 0;
var is_itt_in_progress = false;

function abortItts()
{
    itt_times = 0;
}

function ittButton()
{
    if(is_itt_in_progress)return;
    let n = document.getElementById("itt_times").value;
    if(Math.floor(n) != n)
    {
        print("value should be integer");
        return;
    }
    if(n < 1)
    {
        print("value should be grater then '0'");
        return;
    }
    is_itt_in_progress = true;
    document.getElementById("abort_button").style.display = "";
    itt_times = n;

    requestAnimationFrame(itterate);
}

function itterate()
{
    if(!inds)
    {
        reseatH();
    }
    if(itt_times <= 0)
    {
        document.getElementById("abort_button").style.display = "none";
        is_itt_in_progress = false;
        return;
    }
    
    let population = [];

    for(let i = 0; i != POPULATION_SIZE; ++i)
    {
        for(let j = 0; j != BREEDING_FACTOR; ++j)
        {
            let ind = new Ind(inds[i].seats);
            shuffleWorkers(ind.seats, SHUFFLE_FACTOR);

            ind.happiness = calcOfficeHappiness(ind.seats, ind.workers);
            population.push(ind);
        }
    }
    
    inds = [];

    for(let i = 0; i != POPULATION_SIZE; ++i)
    {
        mhi = 0;
        for(let j = 1; j != population.length; ++j)
        {
            if(population[mhi].happiness < population[j].happiness)
            {
                mhi = j;
            }
        }
        inds.push(population.splice(mhi, 1)[0]);
    }

    drawBest();

    document.getElementById("itt_times").value = --itt_times;
    requestAnimationFrame(itterate);
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.onclick = function(e)
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

        select = cell*8 + sq * 4 + row * 2 + oy%2;

        if(!trace_seat)
        {
            select = seats[select].id;
        }
    }
    else
    {
        select = -1;
    }
    requestAnimationFrame(redraw);
}

var w = canvas.width;
var h = canvas.height;
const office_w = 4;
const office_cells = 6;
const office_l = office_cells*2;
const office_size = office_w*office_l;
const workers_number = office_size;

var cell_size = w/office_cells;
var seat_size = cell_size/3;

var event;


var seats = [];
var workers = [];

var select = -1;


for(let i = 0; i != office_w*office_l; ++i)
{
    let w = new Worker();
    w.gen(i);
    seats[i] = w;
    addWorker(w);
}

for(let i = 0; i != workers.length; ++i)
{
    workers[i].id = i;
}

for(let i = 0; i != workers.length; ++i)
{
    workers[i].updateFriends();
}
shuffleWorkers();
print(calcOfficeHappiness());

redraw();