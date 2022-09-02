const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const event = req.body;
    console.log(`got event ${JSON.stringify(event)}`);

    axios.post('http://posts-clusterip-srv:4000/events', event).catch((err) => {
        console.log(err.message);
      });
    axios.post('http://comments-clusterip-srv:5001/events', event).catch((err) => {
        console.log(err.message);
      });
    axios.post('http://query-clusterip-srv:6001/events', event).catch((err) => {
        console.log(err.message);
      });

    axios.post('http://moderation-clusterip-srv:7001/events', event).catch((err) => {
        console.log(err.message);
      });

    res.send({status:'OK'});
});

app.listen(4005, () => {
    console.log('Listening on 4005');
});