import React from "react";

export default ({comments}) => {

    const getComment = (comment) =>{

        return comment.status==='Approved' ? "Comment: "+comment.comment
            :
            (
                comment.status==='Rejected' ? 'This comment is moderated'
                :
                'This comment is pending moderation'
            );
            
    }
    const renderedComments = comments.map(comment =>{
        return <li key={comment.id}>{getComment(comment)}</li>
    })
    return <div>{renderedComments}</div>
}