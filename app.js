var app = require('express')();
var bodyParser = require('body-parser');
var _ = require('underscore');
var PORT = process.env.PORT || 3000;
var personId = 2;
var people = [
	{
		name: 'elson',
		team: 'red',
		description: 'is cool',
		id: 1
	}
];

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('for fun api root');
});

app.get('/people', function (req, res) {
	var queryParams = req.query;
	var filteredPeople = people;
	
	if(queryParams.hasOwnProperty('description') && queryParams.description.length > 0) {
		filteredPeople = _.filter(filteredPeople, function (item) {
			return item.description.toLowerCase().indexOf(queryParams.description.toLowerCase()) >= 0
		});
	}
	
	if(queryParams.hasOwnProperty('name') && queryParams.name.length > 0) {
		filteredPeople = _.filter(filteredPeople, function (item) {
			return item.name.toLowerCase().indexOf(queryParams.name.toLowerCase()) >= 0
		});
	}
	
	if(queryParams.hasOwnProperty('team') && queryParams.team.length > 0) {
		filteredPeople = _.filter(filteredPeople, function (item) {
			return item.team.toLowerCase().indexOf(queryParams.team.toLowerCase()) >= 0
		});
	}
	
	res.send(JSON.stringify(filteredPeople));
});

app.get('/person/:id', function (req, res) {
	var personId = parseInt(req.params.id);
	var person = _.findWhere(people, {
		id: personId
	});

	if (person) {
		res.json(person);
	} else {
		res.status(404).send();
	}
});


app.post('/person', function (req, res) {
	var body = _.pick(req.body, 'name', 'team', 'description');
	body.name = body.name.trim();
	body.team = body.team.trim();
	body.description = body.description.trim();
	if (!_.isString(body.name), body.name.length === 0, !_.isString(body.team), !_.isString(body.description)) {
		return res.status(400).send();
	}
	body.id = personId++;

	people.push(body);
	res.json(body);
});

app.delete('people', function (req, res) {
	people = {};
	res.status(200).json({
		success: "all items have been deleted"
	});
});

app.delete('/person/:id', function (req, res) {
	var personId = parseInt(req.params.id);
	var person = _.findWhere(people, {
		id: personId
	});

	if (!person) {
		return res.status(400).json({
			error: "no person with id found"
		});
	}

	people = _.without(people, person);
	return res.status(200).json(person);
});

app.put('/person/:id', function (req, res) {
	var personId = parseInt(req.params.id);
	var person = _.findWhere(people, {
		id: personId
	});
	var body = req.body;
	var validAttr = {};

	if (!person) {
		res.status(404).send();
	}

	if (body.hasOwnProperty('name') && _.isString(body.name)) {
		validAttr.name = body.name;
	}

	if (body.hasOwnProperty('team') && _.isString(body.team)) {
		validAttr.team = body.team;
	}

	if (body.hasOwnProperty('description') && _.isString(body.description)) {
		validAttr.description = body.description;
	}

	_.extend(person,validAttr );
	res.status(200).json(person);
})

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});