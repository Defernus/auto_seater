let friends_selectors;
let options;
let data;
let e_worker_select;
let w_id;
let w_i;

function onBodyLoad()
{
	friends_selectors = [];
	options = [];
	w_id = "";
	w_i = -1;

	document.getElementById('input_file').addEventListener('change', handleFileSelect, false);
}

function checkData(data)
{
	if(!data.workers || !data.workers.length)
	{
		throw "workers data is missed!";
	}
	for(let i = 0; i != data.workers.length; ++i)
	{
		if(!data.workers[i].value)
		{
			throw "value of " + i + " worker is missed!";
		}
		if(!data.workers[i].text)
		{
			throw "text of " + i + " worker is missed!";
		}
	}
}

function handleFileSelect(evt)
{
	reader = new FileReader();
	reader.readAsBinaryString(evt.target.files[0]);
	reader.onload = function(f)
	{
		data = JSON.parse(reader.result);
		checkData(data);

		if(!e_worker_select)
		{
			e_worker_select = createSelect("worker_select", data.workers, "selector_div");
			e_worker_select.onchange = onWorkerSelected;
		}

		updateSaveLink();
	}
}

function onWorkerSelected(e)
{
	w_id = e.srcElement.value;
	
	options = [];
	for(let i = 0; i != friends_selectors.length; ++i)
	{
		friends_selectors[i].parentNode.removeChild(friends_selectors[i]);
	}
	friends_selectors = [];

	if(w_id != "")	
	{
		for(let i = 0; i != data.workers.length; ++i)
		{
			if(data.workers[i].value == w_id)
			{
				w_i = i;
				break;
			}
		}
		options = [[]];

		for(let i = 0; i != data.workers.length; ++i)
		{
			if(data.workers[i].value != w_id)
			{		
				options[0].push(data.workers[i]);
			}
		}
		friends_selectors = [createSelect("friends_selector_0", options[0], "friends_selectors")];
		friends_selectors[0].onchange = onSelectorChanged;
		for(let i = 0; i < data.workers[w_i].friends.length; ++i)
		{
			friends_selectors[i].value = data.workers[w_i].friends[i];
			options.push([]);
			for(let j = 0; j != options[i].length; ++j)
			{
				if(options[i][j].value != data.workers[w_i].friends[i])
				{
					options[i+1].push(options[i][j]);
				}
			}
			friends_selectors.push(createSelect("friends_selector_" + (i+1), options[i+1], "friends_selectors"));
		}

	}
	updateSaveLink();
}

function onSelectorChanged(e)
{
	let sw_id = e.srcElement.value;

	let selector_i = Number(e.srcElement.id.slice(17));
	console.log(selector_i);

	for(let i = friends_selectors.length-1; i > selector_i; --i)
	{
		friends_selectors[i].parentNode.removeChild(friends_selectors[i]);
	}
	friends_selectors.length = selector_i+1;
	data.workers[w_i].friends.length = selector_i;

	console.log(sw_id);
	if(sw_id != "")
	{
		data.workers[w_i].friends.push(sw_id);
		options.push([]);
		for(let i = 0; i != options[selector_i].length; ++i)
		{
			if(options[selector_i][i].value != sw_id)
			{
				options[selector_i+1].push(options[selector_i][i]);
			}
		}
		friends_selectors.push(createSelect("friends_selector_" + (selector_i+1), options[selector_i+1], "friends_selectors"));
		friends_selectors[selector_i+1].onchange = onSelectorChanged;
	}
	updateSaveLink();
}

function updateSaveLink()
{
	let text = JSON.stringify(data);
	let file = new Blob([text], {type: 'application/JSON'});

	let url = window.URL.createObjectURL(file);

	document.getElementById('download_link').href = url;
}
