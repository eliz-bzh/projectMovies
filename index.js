const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const fetch = require('node-fetch');
const cookieSession = require('cookie-session');
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser')

let db;
(async () => {
  db = await import('./public/db/db.mjs');
})();

app.use(cookieSession({
  name: 'session',
  keys: ['privet Liz'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(bodyParser.json({ limit: '20mb' }));

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

hbs.registerHelper('getIdFromUrl', (str) => str.match(/\d+/g)[1]);

hbs.registerHelper('inc', (value) => parseInt(value) + 1);

//auth
app.get('/login', (req, res) => {
  res.render('login.hbs');
});

app.get('/registration', (req, res) => {
  res.render('registration.hbs');
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.post('/api/registration', async (req, res) => {
    const {
      username, password
    } = req.body;
    await db.createNewUser(username, password);
    res.send('ok');
  }
);

app.post('/api/login', async (req, res, next) => {
    const {
      username, password
    } = req.body;
    const user = await db.verifyUser(username, password);
    if (user) {
      //token
      req.session.user = user;
      res.send('ok');
      return;
    }
    res.sendStatus(403);
  }
);

app.use((req, res, next)=>{
  if(req.session.user) {
    next();
    return;
  }
  res.redirect('/login');
});

//films
app.get('/', (req, res)=>{
	res.render('index.hbs', {
		title: 'Netflix Belarus'
	})
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
	})
	.catch(err=>console.log(err));
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});