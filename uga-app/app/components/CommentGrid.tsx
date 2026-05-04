import './CommentGrid.css'
import Comment from './Comment'

type CommentItem = {
    Id: string
    UserId: string
    Username: string
    ProfileImage: string
    Text: string
    CreatedAt: string
}

interface Props {
    commentList: CommentItem[];
}

function CommentGrid({commentList}: Props) {
    return <>
        <div className='comment-grid'>
                {
                    commentList.map((comment) => (
                    <Comment key={comment.Id} comment={comment}></Comment>
                ))
                }
        </div>
    </>
}

export default CommentGrid
