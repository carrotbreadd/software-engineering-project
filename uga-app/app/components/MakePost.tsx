"use client"

import './MakePost.css'
import {useRef} from 'react'
import Link from "next/link"

interface Props {
    updateList: (data: string) => void
    isLoggedIn: boolean
}

function MakePost({updateList, isLoggedIn}: Props) {

    const postInput = useRef<HTMLTextAreaElement>(null)

    const submitInput = () => {
        if (postInput.current && postInput.current.value) {
            const newValue = postInput.current.value
            updateList(newValue)
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
                                <img
                                    src="/cpy1.png"
                                    alt="post icon"
                                    className="post-icon"
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