const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
      //console.log(response);
    if (response.statusCode <= 500) {
        //console.log(body);
      res.send(body);
    }
  });
});

app.delete('/api/members/:id', (req, res) => {
    const id = req.params.id;

//    console.log('req body for delete ---------' ,req.body);
    request.delete(
        'http://localhost:3000/members/'+ id,
        (error, response, body) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log(`statusCode: ${res.statusCode}`);
            console.log(body);
            res.send({}); // end the response
        }
    )
});
/*
app.put('/api/members/:id', function (req, res) {
    const item = todos.find(item => item.id === req.body.id);
    const index = todos.indexOf(item);
    todos[index] = req.body;
    saveTodos();
    res.json(req.body);
});
*/

app.put('/api/members/:id', (req, res) => {
    console.log('*****************************************');
    const id = req.params.id;
    request.put(
        'http://localhost:3000/members/' + id,
        {
            json:req.body
        },
        (error, response, body) => {
            if (error) {
                //console.error(error);
                return;
            }
            console.log(`statusCode: ${res.statusCode}`);
            res.send({}); // end the response
        }
    )
});

/*

app.post('http://localhost:3000/members', {
    first_name: 'Fred',
    last_name: 'Blair',
    job: 'freddyb34@gmail.com'
}).then(resp => {
    console.log(resp.data);
}).catch(error => {
    console.log(error);
});
*/

// TODO: Dropdown!
app.get('/api/teams', (req, res) => {
    request('http://localhost:3000/teams', (err, response, body) => {
        //console.log(response);
        if (response.statusCode <= 500) {
            //console.log(body);
            res.send(body);
        }
    });
});

// Submit Form!
app.post('/api/addMember', (req, res) => {
    console.log('adding members 2',req.body);
    request.post(
        'http://localhost:3000/members',
        {
            json:
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    jobTitle: req.body.jobTitle,
                    team: req.body.team,
                    status: req.body.status
                }

        },
        (error, response, body) => {
            if (error) {
                console.error(error);
                return;
            }

            console.log(`statusCode: ;${res.statusCode}`);
            console.log(body)
            res.send({}); // end the response
        }
    )
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
