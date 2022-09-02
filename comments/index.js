const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser')

const app = express();
app.use(cors());

app.use(bodyParser.json());

const comments = {};

const error = { message:"" };

app.get('/posts/comments',(req, res) =>{
    if(!req.query.postId){
        error.message = "Please pass along a postId";
        res.status(400).send(error);
    } else {
        res.send(comments[req.query.postId]|| []);
    }
   
});

app.post('/posts/comments', async (req, res) =>{
    
    const commentId = randomBytes(4).toString('hex');
    const { comment } = req.body;

    if(!req.query.postId){
        error.message = "Please pass along a postId";
        res.status(400).send(error);
    }
    const commentsById = comments[req.query.postId] || [];
    commentsById.push({ id: commentId, comment});
    comments[req.query.postId] = commentsById;

    await axios.post('http://eventbus-srv:4005/events', {
        type: 'CommentCreated',
        data: { 
            id: commentId, 
            comment,
            postId: req.query.postId,
            status: 'Pending'
        }
    }).catch((err) => {
        console.log(err.message);
      });

    res.status(201).send(comments[req.query.postId]);
});

app.post('/events', async(req, res) => {
    console.log(`Event captured ${JSON.stringify(req.body)}`);
    const { type, data } = req.body;
    if(type === 'CommentModerated') {
        const {id, postId, status} = data;
        const commentsById = comments[postId] || [];

        const comment = commentsById.find(comment=> {
            return comment.id === id;
        });
        comment.status = status;
        await axios.post('http://eventbus-srv:4005/events', {
            type: 'CommentUpdated',
            data: { 
                id, 
                comment,
                postId,
                status
            }
        }).catch((err) => {
            console.log(err.message);
          });
    } 
    res.status(201).send("OK");
});

app.listen(5001, () =>{
    console.log('Listening on 5001');
})