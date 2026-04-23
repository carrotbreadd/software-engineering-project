"use client"

import './MakeComment.css'

function MakeComment() {
    return <>
        <div className='comment-bar'>
            <textarea placeholder='Type your comment here...' className='type-comment'></textarea>
            <button className='post-comment-button'>Post</button>
        </div>
    </>
}

export default MakeComment