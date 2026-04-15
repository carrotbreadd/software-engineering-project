import './PostGrid.css'
import IndividualPost from './IndividualPost'
import placeholder from '../assets/placeholder.avif'

interface Props {
    postList: string[]
}

function PostGrid({postList}: Props) {
    return <>
        <div className='post-grid'>
            {postList.map((post, index) => (
                <IndividualPost key={index} profile={placeholder}>{post}</IndividualPost>
            ))}
        </div>
    </>
}

export default PostGrid