import './PostGrid.css'
import IndividualPost from './IndividualPost'

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
    postList: PostItem[]
    openComments: (postId: string) => void
    updatePost: (updatedPost: PostItem) => void
}

function PostGrid({postList, openComments, updatePost}: Props) {
    return <>
        <div className='post-grid'>
            {postList.map((post) => (
                <IndividualPost
                    key={postList.length - postList.indexOf(post)}
                    post={post}
                    openComments={openComments}
                    updatePost={updatePost}
                />
            ))}
        </div>
    </>
}

export default PostGrid
