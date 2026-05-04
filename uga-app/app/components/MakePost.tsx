"use client"

import './MakePost.css'
import {useRef} from 'react'
import Link from "next/link"
import Image from "next/image"

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

const DefaultProfileImage = "/cpy1.png"

interface Props {
    updateList: (data: PostItem) => void
    isLoggedIn: boolean
}

function MakePost({updateList, isLoggedIn}: Props) {

    const postInput = useRef<HTMLTextAreaElement>(null)

    const submitInput = async () => {
        if (postInput.current && postInput.current.value) {
            const newValue = postInput.current.value

            const Response = await fetch("/api/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Text: newValue,
                }),
            })

            const Data = await Response.json()

            if (!Response.ok) {
                alert(Data.Message || "Post failed")
                return
            }

            updateList({
                Id: Data.Post.Id,
                UserId: Data.Post.UserId,
                Text: Data.Post.Text,
                Username: Data.Post.Username,
                ProfileImage: Data.Post.ProfileImage || DefaultProfileImage,
                CreatedAt: Data.Post.CreatedAt,
                LikeCount: Data.Post.LikeCount || 0,
                CommentCount: Data.Post.CommentCount || 0,
                IsLikedByCurrentUser: Data.Post.IsLikedByCurrentUser || false,
            })
            postInput.current.value = ""
        }
    }

    return (
        <>
            <div className='create-post-container'>

                {!isLoggedIn ? (
                    <>
                        <div className='title'>
                            Log in or sign up to create a post
                        </div>

                        <div className='post-button-container'>
                            <Link href="/login">
                                <button className='post-button'>Log In</button>
                            </Link>

                            <Link href="/signup">
                                <button className='post-button'>Sign Up</button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='title'>Create a post:</div>

                        <div className='type-post-container'>
                            <textarea
                                className='type-post'
                                placeholder='Type your text here...'
                                ref={postInput}
                            />
                        </div>

                        <div className='post-button-container'>
                            <button className='post-button' onClick={submitInput}>
                                <Image
                                    src="/cpy1.png"
                                    alt="post icon"
                                    className="post-icon"
                                    width={24}
                                    height={24}
                                />
                                Post
                            </button>
                        </div>
                    </>
                )}

            </div>
        </>
    )
}

export default MakePost
