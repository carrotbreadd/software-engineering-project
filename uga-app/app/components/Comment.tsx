"use client"

import './Comment.css'
import Image, {StaticImageData} from 'next/image'
import CommentText from './CommentText'

interface Props {
    children: string;
    profile: StaticImageData;
}

function Comment({children, profile}: Props) {
    return <>
        <div className='individual-comment'>
            <Image className='comment-profile-picture' src={profile} alt='profile' ></Image>
            <CommentText>{children}</CommentText>
        </div>
    </>
}

export default Comment