"use client"

import './PostText.css'

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
    children: string
    post: PostItem
    openComments: (postId: string) => void
    updatePost: (updatedPost: PostItem) => void
}

function PostText({children, post, openComments, updatePost}: Props) {
    const toggleLike = async () => {
        const Response = await fetch("/api/post", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Action: "toggleLike",
                PostId: post.Id,
            }),
        })

        const Data = await Response.json()

        if (!Response.ok) {
            alert(Data.Message || "Could not update like")
            return
        }

        updatePost(Data.Post)
    }

    return <>
    <div className='post-container'>
        <div className='username-container'>
            @{post.Username}
        </div>
        <div className='top-container'>
            <div className='text-container'>
                {children}
            </div>
            <div className='button-container'>
                <button className={post.IsLikedByCurrentUser ? "liked" : "not-liked"} onClick={toggleLike}>
                    {"❤"} {post.LikeCount}
                </button>
            </div>
        </div>
        <div className='bottom-container'>
            <button className='comment-button' onClick={() => openComments(post.Id)}>View Comments ({post.CommentCount})</button>
        </div>
    </div>
    </>
}

export default PostText
