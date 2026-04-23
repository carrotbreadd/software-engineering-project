"use client"

import './MakeComment.css'
import {useRef} from 'react'

interface Props {
    updateList: (comment: string) => void
}

function MakeComment({updateList}: Props) {
    const postComment = useRef<HTMLTextAreaElement>(null)

    const submitComment = () => {
        if (postComment.current && postComment.current.value) {
            const newComment = postComment.current.value
            updateList(newComment)
            postComment.current.value = ""
        }
    }

    return <>
        <div className='comment-bar'>
            <textarea ref={postComment} placeholder='Type your comment here...' className='type-comment'></textarea>
            <button className='post-comment-button' onClick={submitComment}>Post</button>
        </div>
    </>
}

export default MakeComment