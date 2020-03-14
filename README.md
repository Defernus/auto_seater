# auto_seater

## Simple implementation of genetic alghoritms to solve problem of employee seating arrangement
input file format
```JSON
{
	{//first worker
		id = "worker id";
		friends = ["ids", "of", "worker`s", "friends"];	//array of workers that must seat closer
		enemies = [];					//array of workers that must seat as far as possible
	}


//...
//another 47 workers
//...
}
```
