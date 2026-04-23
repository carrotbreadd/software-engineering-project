import PostText from './PostText'
import './IndividualPost.css'
import Image from 'next/image';

interface Props {
    children: string;
    profile: string;
    username: string;
}

function IndividualPost({children, profile, username}: Props) {
    const ProfileImage = profile || "/cpy1.png"

    return <>
        <div className='individual-post'>
            <div className='profile-picture-container'>
                <Image className='profile-picture' src={ProfileImage} alt={`${username} profile`} fill sizes="115px"/>
            </div>
            <PostText username={username}>{children}</PostText>
        </div>
    </>
}

export default IndividualPost
