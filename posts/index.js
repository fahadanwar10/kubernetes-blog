const express = require('express');
const cors = require('cors');
const axios = require('axios');

const { randomBytes } = require('crypto');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post('/posts/create', async (req, res) =>{
    
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    await axios.post('http://eventbus-srv:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    }).catch((err) => {
        console.log(err.message);
      });
    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log(`Event captured ${JSON.stringify(req.body)}`);
    res.status(201).send("OK");
});

app.listen(4000, () =>{
    console.log('v3');
    console.log('Listening on 4000');
});