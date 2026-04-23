"use client"

import './CommentSection.css'
import CommentGrid from './CommentGrid'
import MakeComment from './MakeComment'

function CommentSection() {
    return <>
        <div><button>X</button></div>
        <CommentGrid></CommentGrid>
        <MakeComment></MakeComment>
    </>
}

export default CommentSection