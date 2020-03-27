const FRIENDS_MAX = 3;
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
		if(data.workers[i].value == 'undefined')
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

		updateColors();
		updateSaveLink();
	}
}

function updateColors()
{
	let e = document.getElementById("worker_select");
	for(let i = 1; i < e.options.length; ++i)
	{
		e.options[i].style = "";
		if(i != 0 && data.workers[e.options[i].value].friends.length > 0)
		{
			e.options[i].style = "color:blue";
			continue;
		}
		
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

	let el = document.getElementById("enemie_selector");
	if(el)
	{
		el.parentNode.removeChild(el);
	}

	if(w_id !== "")
	{
		w_id = Number(w_id);
		updateColors();
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
			if(options.length < i+2)
			{
				options.push([]);
			}
			else
			{
				options[i+1] = []
			}
			for(let j = 0; j != options[i].length; ++j)
			{
				if(options[i][j].value != data.workers[w_i].friends[i])
				{
					options[i+1].push(options[i][j]);
				}
			}
			if(i >= (FRIENDS_MAX-1))
			{
				el = createSelect("enemie_selector", options[FRIENDS_MAX], "enemies_selector");
				el.onchange = onEnemieSelectChange;
				if(data.workers[w_i].enemies.length>0)
				{
					el.value = data.workers[w_i].enemies[0];
				}
				break;
			}
			let fr = createSelect("friends_selector_" + (i+1), options[i+1], "friends_selectors");
			friends_selectors.push(fr);
			fr.onchange = onSelectorChanged;
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
	data.workers[w_i].enemies = [];

	console.log(sw_id);
	let el = document.getElementById("enemie_selector");
	if(el)
	{
		el.parentNode.removeChild(el);
	}
	if(sw_id !== "")
	{
		sw_id = Number(sw_id);
		data.workers[w_i].friends.push(sw_id);
		updateColors();
		if(options.length < selector_i+2)
		{
			options.push([]);
		}
		else
		{
			options[selector_i+1] = []
		}
		for(let i = 0; i != options[selector_i].length; ++i)
		{
			if(options[selector_i][i].value != sw_id)
			{
				options[selector_i+1].push(options[selector_i][i]);
			}
		}
		if((selector_i+1) < FRIENDS_MAX)
		{
			friends_selectors.push(createSelect("friends_selector_" + (selector_i+1), options[selector_i+1], "friends_selectors"));
			friends_selectors[selector_i+1].onchange = onSelectorChanged;
			
		}
		else
		{
			el = createSelect("enemie_selector", options[selector_i+1], "enemies_selector");
			el.onchange = onEnemieSelectChange;
		}
	}
	updateSaveLink();
}

function onEnemieSelectChange(e)
{
	data.workers[w_i].enemies = [];
	if(e.srcElement.value !== "")
	{
		data.workers[w_i].enemies = [Number(e.srcElement.value)];

	}
	updateColors();
	updateSaveLink();
}

function updateSaveLink()
{
	let convertDict = {'а': 'u0430', 'б': 'u0431', 'в': 'u0432', 'г': 'u0433', 'д': 'u0434', 'е': 'u0435', 'ё': 'u0451', 'ж': 'u0436', 'з': 'u0437', 'и': 'u0438', 'й': 'u0439', 'к': 'u043a', 'л': 'u043b', 'м': 'u043c', 'н': 'u043d', 'о': 'u043e', 'п': 'u043f', 'р': 'u0440', 'с': 'u0441', 'т': 'u0442', 'у': 'u0443', 'ф': 'u0444', 'х': 'u0445', 'ц': 'u0446', 'ч': 'u0447', 'ш': 'u0448', 'щ': 'u0449', 'ъ': 'u044a', 'ы': 'u044b', 'ь': 'u044c', 'э': 'u044d', 'ю': 'u044e', 'я': 'u044f', 'А': 'u0410', 'Б': 'u0411', 'В': 'u0412', 'Г': 'u0413', 'Д': 'u0414', 'Е': 'u0415', 'Ё': 'u0401', 'Ж': 'u0416', 'З': 'u0417', 'И': 'u0418', 'Й': 'u0419', 'К': 'u041a', 'Л': 'u041b', 'М': 'u041c', 'Н': 'u041d', 'О': 'u041e', 'П': 'u041f', 'Р': 'u0420', 'С': 'u0421', 'Т': 'u0422', 'У': 'u0423', 'Ф': 'u0424', 'Х': 'u0425', 'Ц': 'u0426', 'Ч': 'u0427', 'Ш': 'u0428', 'Щ': 'u0429', 'Ъ': 'u042a', 'Ы': 'u042b', 'Ь': 'u042c', 'Э': 'u042d', 'Ю': 'u042e', 'Я': 'u042f'}
	let text = JSON.stringify(data);
	let result = ""
	for (let i = 0;i<text.length;i++)
	{
		if (text[i] in convertDict)
		{
			result +=  "\\" + convertDict[text[i]];
		}
		else
		{
			result += text[i];
		}
	}
	let file = new Blob([result], {type: 'application/json',encode: 'utf8'});

	let url = window.URL.createObjectURL(file);

	let a = document.getElementById('download_link');
	a.href = url;
	a.download = (new Date()).toString().slice(8, 21)+".json"
}
