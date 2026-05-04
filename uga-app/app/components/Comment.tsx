"use client"

import './Comment.css'
import Image from 'next/image'
import CommentText from './CommentText'

type CommentItem = {
    Id: string
    UserId: string
    Username: string
    ProfileImage: string
    Text: string
    CreatedAt: string
}

interface Props {
    comment: CommentItem
}

function Comment({comment}: Props) {
    const ProfileImage = comment.ProfileImage || "/cpy1.png"

    return <>
        <div className='individual-comment'>
            <Image className='comment-profile-picture' src={ProfileImage} alt={`${comment.Username} profile`} width={48} height={48}></Image>
            <CommentText username={comment.Username}>{comment.Text}</CommentText>
        </div>
    </>
}

export default Comment
