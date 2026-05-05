"use client"

import './CommentText.css'

interface Props {
    children: string
    username: string
}

function CommentText({children, username}: Props) {
    return <>
    <div className='individual-comment-container'>
        <strong>@{username}</strong> | {children}
    </div>
    </>
}

export default CommentText
