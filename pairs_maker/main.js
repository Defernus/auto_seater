let data;
let pair_elements;

function onBodyLoad()
{
	pair_elements = [];

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
	if(data.pairs !== undefined)
	{
		for(let i = 0; i != data.pairs.length; ++i)
		{
			if(data.pairs[i][0] == data.pairs[i][1])
			{
				throw "wrong pair at position " + i;
			}
		}
	}
}

function handleFileSelect(evt)
{
	let reader = new FileReader();
	reader.readAsBinaryString(evt.target.files[0]);
	reader.onload = function(f)
	{
		data = JSON.parse(reader.result);
		checkData(data);

		if(!data.pairs)
		{
			data.pairs = [];
		}
		
		pair_elements = [];

		for(let i = 0; i != data.pairs.length; ++i)
		{
			pair_elements.push(createElement("div", "pair_"+i, "pairs_div"));

			let options = data.workers;
			let le = createSelect("left_"+i, options, "pair_"+i);

			le.onchange = onLeftChange;
			le.value = data.pairs[i][0];

			options  = [];
			for(let j = 0; j != data.workers.length; ++j)
			{
				if(le.value !== data.workers[j].value)
				{
					options.push(data.workers[j]);
				}
			}
			let re = createSelect("right_"+i, options, "pair_"+i);
			re.onchange = onRightChange;
			re.value = data.pairs[i][1];
		}

		pair_elements.push(createElement("div", "pair_"+data.pairs.length, "pairs_div"));

		let options = data.workers;
		let le = createSelect("left_"+data.pairs.length, options, "pair_"+data.pairs.length);

		le.onchange = onLeftChange;

		updateSaveLink();
	}
}

function onLeftChange(evt)
{
	let el = evt.srcElement;
	el_i = Number(el.id.slice(5));
	
	let options = [];


	let r_el = document.getElementById("right_"+el_i);
	if(r_el)
	{
		r_el.parentNode.removeChild(r_el);
	}

	if(el.value !== "")
	{
		for(let i = 0; i != data.workers.length; ++i)
		{
			if(el.value !== data.workers[i].value)
			{
				options.push(data.workers[i]);
			}
		}
		r_el = createSelect("right_"+el_i, options, "pair_"+el_i);
		r_el.onchange = onRightChange;
	}
}

function onRightChange(evt)
{
	let el = evt.srcElement;
	el_i = Number(el.id.slice(6));
	let l_el = document.getElementById("left_"+el_i);
	
	if(el.value !== "")
	{
		data.pairs.push([l_el.value, el.value]);
		
		let options = data.workers;
 		pair_elements.push(createElement("div", "pair_"+(el_i+1), "pairs_div"));
		let le = createSelect("left_"+(el_i+1), options, "pair_"+(el_i+1));

		le.onchange = onLeftChange;
	}
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

	document.getElementById('download_link').href = url;
}
