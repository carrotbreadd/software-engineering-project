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
}

function PostGrid({postList}: Props) {
    return <>
        <div className='post-grid'>
            {postList.map((post, index) => (
                <IndividualPost key={index} profile={post.ProfileImage || DefaultProfileImage} username={post.Username}>{post.Text}</IndividualPost>
            ))}
        </div>
    </>
}

export default PostGrid
