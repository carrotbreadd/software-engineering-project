"use client"

import './CommentSection.css'
import CommentGrid from './CommentGrid'
import MakeComment from './MakeComment'

function CommentSection() {
    return <>
        <div className='comment-section-container'>
            <div className='heading'>
                <div></div>
                <div>Comments (2)</div>
                <button className='close-button'>X</button>
            </div>
            <CommentGrid></CommentGrid>
            <MakeComment></MakeComment>
        </div>
    </>
}

export default CommentSection