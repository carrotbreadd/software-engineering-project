"use client"

import './CommentSection.css'
import CommentGrid from './CommentGrid'
import MakeComment from './MakeComment'
import {useEffect, useState} from "react"

type CommentItem = {
    Id: string
    UserId: string
    Username: string
    ProfileImage: string
    Text: string
    CreatedAt: string
}

type PostItem = {
    Id: string
    UserId: string
    Text: string
    Username: string
    ProfileImage: string
    CreatedAt: string
    LikeCount: number
    CommentCount: number
    IsLikedByCurrentUser: boolean
}

interface Props {
    postId: string
    commentCount: number
    isLoggedIn: boolean
    closeComments: () => void
    updatePost: (updatedPost: PostItem) => void
}

function CommentSection({postId, commentCount, isLoggedIn, closeComments, updatePost}: Props) {
    const [commentList, setCommentList] = useState<CommentItem[]>([])
    const [localCommentCount, setLocalCommentCount] = useState(commentCount)

    useEffect(() => {
        async function loadComments() {
            try {
                const Response = await fetch(`/api/post?postId=${postId}&includeComments=true`)
                const Data = await Response.json()

                if (!Response.ok) {
                    alert(Data.Message || "Could not load comments")
                    return
                }

                setCommentList(Data.Comments || [])
                setLocalCommentCount(Data.Post.CommentCount || 0)
                updatePost(Data.Post)
            } catch (error) {
                console.log("Load comments failed:", error)
            }
        }

        loadComments()
    }, [postId, updatePost])

    const addCommentToList = (newComment: CommentItem, updatedPost: PostItem) => {
        setCommentList(prev => [newComment, ...prev])
        setLocalCommentCount(updatedPost.CommentCount || 0)
        updatePost(updatedPost)
    }

    return <>
        <div className='comment-section-container'>
            <div className='heading'>
                <div></div>
                <div>Comments ({localCommentCount})</div>
                <button className='close-button' onClick={closeComments}>X</button>
            </div>
            <CommentGrid commentList={commentList}></CommentGrid>
            <MakeComment
                postId={postId}
                isLoggedIn={isLoggedIn}
                updateList={addCommentToList}
            ></MakeComment>
        </div>
    </>
}

export default CommentSection
