const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const fetch = require('node-fetch');
const PORT = process.env.PORT || 3001;

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(path.join(__dirname, 'views/partials'))
hbs.registerHelper('getIdFromUrl', function(str){
    return str.match(/\d+/g)[1];
});

hbs.registerHelper('inc', function(value){
    return parseInt(value) + 1;
});

app.get('/', (req, res)=>{
	/*fetch('https://swapi.py4e.com/api/films/')
	.then((res)=> res.json())
	.then((data)=>*/res.render('index.hbs', {
		title: 'Netflix Belarus'
	})
	//.catch(err=>console.log(err));
});

app.get('/film/:id', (req, res)=>{
	const { id } = req.params;

	

	fetch(`https://swapi.py4e.com/api/films/${id}`)
	.then((res)=> res.json())
	.then((data)=>{

		let requests = data.characters.slice(0, 5).map(url => {
			let id = url.match(/\d+/g)[1];
			return fetch(`https://star--wars.herokuapp.com/people/${id}`);
		});

		Promise.all(requests)
		  .then(responses => Promise.all(responses.map(r => r.json())))
		  .then(users => {
		  	res.render('filmInfo.hbs', {
		  			data: data,
		  			characters: users
		  		})
		  });

		/*res.render('filmInfo.hbs', {
			data: data
		});*/
	})
	.catch(err=>console.log(err));
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});