import React , {useState, useEffect} from "react";
import axios from 'axios';
import CreateComment from "./createComment";
import CommentList from "./commentList";

export default () =>{
    const [posts, setPosts] = useState({});

    const getPosts = async() =>{
        const res = await axios.get('http://posts.com/posts');
        setPosts(res.data);
    };

    useEffect(()=>{
        getPosts();
    }, []);

    const renderedPosts = Object.values(posts).map(post =>{
        return <div className="card" style={{width:'30%', marginBottom:'20px'}} key={post.id}>
            <div className="card-body">
                <h3>{post.title}</h3>
                <CommentList comments={post.comments}/>
                <CreateComment postId={post.id}/>
            </div>
        </div>
    });
    return <div className="d-flex flex-row flex-wrap justify-content-between">{renderedPosts}</div>
}