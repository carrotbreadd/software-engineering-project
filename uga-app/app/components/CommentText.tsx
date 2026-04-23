"use client"

import './CommentText.css'

interface Props {
    children: string;
}

function CommentText({children}: Props) {
    return <>
    <div className='individual-comment-container'>
        {children}
    </div>
    </>
}

export default CommentText