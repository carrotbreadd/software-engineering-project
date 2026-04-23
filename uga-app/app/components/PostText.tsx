"use client"

import './PostText.css'
import {useState} from "react"

interface Props {
    children: string;
    username: string;
    showComments: boolean;
    setShowComments: (showComments: boolean) => void;
}

function PostText({children, username, showComments, setShowComments}: Props) {
    const [isLiked, setIsLiked] = useState(false)

    return <>
    <div className='post-container'>
        <div className='username-container'>
            @{username}
        </div>
        <div className='top-container'>
            <div className='text-container'>
                {children}
            </div>
            <div className='button-container'>
                <button className={isLiked ? "liked" : "not-liked"} onClick={() => setIsLiked(!isLiked)}>
                    ❤️
                </button>
            </div>
        </div>
        <div className='bottom-container'>
            <button className='comment-button' onClick={() => setShowComments(!showComments)}>View Comments (2)</button>
        </div>
    </div>
    </>
}

export default PostText
