const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get('/posts',(req, res) =>{
    if(req.query.postId != null){
        const resp = posts[req.query.postId] || [];
        res.status(200).send(resp);
    } else {
        res.send(posts);
    }
   
});

app.post('/events', (req, res) => {
    console.log(`Event captured ${JSON.stringify(req.body)}`);

    const { type, data } = req.body;

    if( type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = {id, title, comments:[]};
    } else if(type === 'CommentCreated') {
        const {id, comment, postId, status} = data;

        const post = posts[postId];
        post.comments.push({id, comment, status});
    } else if(type === 'CommentUpdated') {
        const {id, comment, postId, status} = data;

        const post = posts[postId];
        const oldComment = post.comments.find(temp=> { 
            return temp.id === id 
        });
        oldComment.status = status;
        oldComment.comment = comment.comment;
       
    }
    res.status(201).send("OK");
});

app.listen(6001, () =>{
    console.log('Listening on 6001');
})