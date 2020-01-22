const _ = require('lodash');
const express = require('express');
const cors = require('cors');

const port = 3002;
const bodyParser = require('body-parser');

const app = express();

const loginData = [];
const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(bodyParser.json());


app.options('/sign-up', cors(corsOptions));

app.post('/sign-up', cors(corsOptions), (request, response) => {
  if (!_.find(loginData, { email: request.body.email })) {
    loginData.push(request.body);
    response.send('we registred you successfully');
  } else {
    response.status(400).send('email is alredy taken');
  }
});

const server = app.listen(port, error => {
  if (error) return console.log(`Error: ${error}`);
  console.log(`Server listening on port ${server.address().port}`);
});
