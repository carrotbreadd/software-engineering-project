import PostText from './PostText'
import './IndividualPost.css'
import Image, { StaticImageData } from 'next/image';

interface Props {
    children: string;
    profile: StaticImageData;
}

function IndividualPost({children, profile}: Props) {
    return <>
        <div className='individual-post'>
            <Image className='profile-picture' src={profile} alt="profile"/>
            <PostText>{children}</PostText>
        </div>
    </>
}

export default IndividualPost