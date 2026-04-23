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
        <Image className='profile-picture' src={profile} alt='profile' ></Image>
        <CommentText>{children}</CommentText>
    </>
}

export default Comment