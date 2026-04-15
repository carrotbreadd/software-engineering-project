"use client"

import './MakePost.css'
import {useRef} from 'react'

interface Props {
    updateList: (data: string) => void
}

function MakePost({updateList}: Props) {

    const postInput = useRef<HTMLTextAreaElement>(null)

    const submitInput = () => {
        if (postInput.current && postInput.current.value) {
            const newValue = postInput.current.value
            updateList(newValue)
            postInput.current.value = ""
        }
    }

    return <>
        <div className='create-post-container'>
            <div className='title'>Create a post:</div>
            <div className='type-post-container'><textarea className='type-post' placeholder='Type your text here...' ref={postInput}></textarea></div>
            <div className='post-button-container'><button className='post-button' onClick={submitInput}>Post</button></div>
        </div>
    </>
}

export default MakePost