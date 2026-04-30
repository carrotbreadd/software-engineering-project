import './PostGrid.css'
import IndividualPost from './IndividualPost'

const DefaultProfileImage = "/cpy1.png"

type PostItem = {
    Text: string
    Username: string
    ProfileImage: string
}

interface Props {
    postList: PostItem[]
    showComments: boolean
    setShowComments: (showComments: boolean) => void
}

function PostGrid({postList, showComments, setShowComments}: Props) {
    return <>
        <div className='post-grid'>
            {postList.map((post, index) => (
                <IndividualPost showComments={showComments} setShowComments={setShowComments} key={postList.length - index} profile={post.ProfileImage || DefaultProfileImage} username={post.Username}>{post.Text}</IndividualPost>
            ))}
        </div>
    </>
}

export default PostGrid
