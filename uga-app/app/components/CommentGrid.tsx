import './CommentGrid.css'
import Comment from './Comment'
import placeholder from '../assets/placeholder.avif'

/*
interface Props {
    commentList: string[];
}
    */

function CommentGrid(/*{commentList}: Props*/) {
    return <>
        <div className='comment-grid'>
            {
                /*commentList.map((comment, index) => (
                    <Comment key={index} profile={placeholder}>{comment}</Comment>
                ))
                    */
                <Comment profile={placeholder}>yo</Comment>
            }
        </div>
    </>
}

export default CommentGrid