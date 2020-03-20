	function createElement(tag, id, parent_id)
{
	let p = document.getElementById(parent_id);
	if(!p)
	{
		throw "parent element doesn't exist!";
	}
	if(document.getElementById(id))
	{
		throw "this id is alredy exist!";
	}
	let e = document.createElement(tag);
	e.id = id;
	p.appendChild(e);
	return e;
}

function createSelect(id, options, parent_id)
{
	let e = createElement("select", id, parent_id);

	{
		let o = document.createElement("option");
		o.value = "";
		o.text = "Не выбран";
		e.add(o);
	}

	for(let i = 0; i != options.length; ++i)
	{
		let o = document.createElement("option");
		o.value = options[i].value;
		o.text = options[i].text;
		e.add(o);
	}
	
	return e;
}
