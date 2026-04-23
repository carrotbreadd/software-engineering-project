"use client"

import './ForYou.css'
import PostGrid from './components/PostGrid'
import MakePost from './components/MakePost'
import TitleBar from './components/TitleBar'
import CommentSection from './components/CommentSection'
import {useState} from "react"

function ForYou() {

  const [postList, setPostList] = useState<string[]>([])

  const addToList = (newPost: string) => {
    setPostList(postList => [newPost, ...postList])
  }

  return <>
    <TitleBar></TitleBar>
    <div>
      <MakePost updateList={addToList}></MakePost>
      <PostGrid postList={postList}></PostGrid>
    </div>
    <CommentSection></CommentSection>
    
  </>
}

export default ForYou