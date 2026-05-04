import PostText from './PostText'
import './IndividualPost.css'
import Image from 'next/image';

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
    post: PostItem
    openComments: (postId: string) => void
    updatePost: (updatedPost: PostItem) => void
}

function IndividualPost({post, openComments, updatePost}: Props) {
    const ProfileImage = post.ProfileImage || "/cpy1.png"

    return <>
        <div className='individual-post'>
            <div className='profile-picture-container'>
                <Image className='profile-picture' src={ProfileImage} alt={`${post.Username} profile`} fill sizes="115px"/>
            </div>
            <PostText
                post={post}
                openComments={openComments}
                updatePost={updatePost}
            >
                {post.Text}
            </PostText>
        </div>
    </>
}

export default IndividualPost
