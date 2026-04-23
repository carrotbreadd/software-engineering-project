"use client"

import './CommentSection.css'
import CommentGrid from './CommentGrid'
import MakeComment from './MakeComment'
import {useState} from "react"

interface Props {
    showComments: boolean
    setShowComments: (showComments: boolean) => void
}

function CommentSection({showComments, setShowComments}: Props) {
    const [commentList, setCommentList] = useState<string[]>([])

    const addCommentToList = (newComment: string) => {
        setCommentList(prev => [newComment, ...prev])
    }

    return <>
        <div className='comment-section-container'>
            <div className='heading'>
                <div></div>
                <div>Comments (2)</div>
                <button className='close-button' onClick={() => setShowComments(!showComments)}>X</button>
            </div>
            <CommentGrid commentList={commentList}></CommentGrid>
            <MakeComment updateList={addCommentToList}></MakeComment>
        </div>
    </>
}

export default CommentSection