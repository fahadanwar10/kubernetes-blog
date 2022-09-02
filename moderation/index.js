const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) =>{
    console.log(`Event captured ${JSON.stringify(req.body)}`);
    const { type, data } = req.body;

    if(type=='CommentCreated'){
        const {id, comment, postId, status} = data;

        if(comment.toLowerCase().includes("orange")){
            data.status = "Rejected";
        } else {
            data.status = "Approved";
        }
        await axios.post('http://eventbus-srv:4005/events', {
            type: 'CommentModerated',
            data
        }).catch((err) => {
            console.log(err.message);
          });

    }
    res.status(200).send({data});
});

app.listen(7001, () =>{
    console.log('Listening on 7001');
})