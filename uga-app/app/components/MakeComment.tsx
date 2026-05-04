"use client"

import './MakeComment.css'
import {useRef} from 'react'

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
    updateList: (comment: CommentItem, updatedPost: PostItem) => void
    isLoggedIn: boolean
}

function MakeComment({postId, updateList, isLoggedIn}: Props) {
    const postComment = useRef<HTMLTextAreaElement>(null)

    const submitComment = async () => {
        if (postComment.current && postComment.current.value) {
            const newComment = postComment.current.value.trim()

            if (!newComment) {
                return
            }

            const Response = await fetch("/api/post", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Action: "addComment",
                    PostId: postId,
                    Text: newComment,
                }),
            })

            const Data = await Response.json()

            if (!Response.ok) {
                alert(Data.Message || "Could not post comment")
                return
            }

            updateList(Data.Comment, Data.Post)
            postComment.current.value = ""
        }
    }

    return <>
        <div className='comment-bar'>
            <textarea
                ref={postComment}
                placeholder={isLoggedIn ? 'Type your comment here...' : 'Log in to write a comment...'}
                className='type-comment'
                disabled={!isLoggedIn}
            ></textarea>
            <button className='post-comment-button' onClick={submitComment} disabled={!isLoggedIn}>Post</button>
        </div>
    </>
}

export default MakeComment
