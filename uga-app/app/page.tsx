"use client"

import './ForYou.css'
import PostGrid from './components/PostGrid'
import MakePost from './components/MakePost'
import TitleBar from './components/TitleBar'
import CommentSection from './components/CommentSection'
import {useEffect, useState} from "react"

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

const DefaultProfileImage = "/cpy1.png"

function ForYou() {

  const [postList, setPostList] = useState<PostItem[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [sessionMessage, setSessionMessage] = useState("")
  const [selectedPostId, setSelectedPostId] = useState("")

  useEffect(() => {
    async function LoadPosts() {
      try {
        const Response = await fetch("/api/post");
        const Data = await Response.json();

        if (!Response.ok) {
          console.log(Data.Message || "Could not load posts.");
          return;
        }

        const LoadedPosts = Data.Posts.map((PostItem: PostItem) => ({
          Id: PostItem.Id,
          UserId: PostItem.UserId,
          Text: PostItem.Text,
          Username: PostItem.Username,
          ProfileImage: PostItem.ProfileImage || DefaultProfileImage,
          CreatedAt: PostItem.CreatedAt,
          LikeCount: PostItem.LikeCount || 0,
          CommentCount: PostItem.CommentCount || 0,
          IsLikedByCurrentUser: PostItem.IsLikedByCurrentUser || false,
        }))

        setPostList(LoadedPosts)
      } catch (error) {
        console.log("Load posts failed:", error);
      }
    }

    async function CheckSession() {
      try {
        const Response = await fetch("/api/sessionCheck");
        const ResponseType = Response.headers.get("content-type") || "";

        if (!ResponseType.includes("application/json")) {
          throw new Error("Session check did not return JSON.");
        }

        const Data = await Response.json();

        if (!Response.ok) {
          setIsLoggedIn(false);
          setSessionMessage(Data.Message || "You are not logged in.");
          return;
        }

        setIsLoggedIn(true);
        setSessionMessage(`Logged in as ${Data.User?.Username ?? "User"}`);
      } catch {
        setIsLoggedIn(false);
        setSessionMessage("Could not check session.");
      }
    }

    CheckSession();
    LoadPosts();

    const PostInterval = window.setInterval(() => {
      LoadPosts();
    }, 2000);

    const handleFocus = () => {
      CheckSession();
      LoadPosts();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearInterval(PostInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const addToList = (newPost: PostItem) => {
    setPostList(prev => [newPost, ...prev])
  }

  const updatePostInList = (updatedPost: PostItem) => {
    setPostList(prev =>
      prev.map(post => post.Id === updatedPost.Id ? updatedPost : post)
    )
  }

  const selectedPost = postList.find(post => post.Id === selectedPostId)

  return (
  <div className="foryou-container">
    <TitleBar
      isLoggedIn={!!isLoggedIn}
      onLogout={() => setIsLoggedIn(false)}
    />

    {isLoggedIn === null ? (
      <p>Loading session...</p>
    ) : (
      <p>{sessionMessage}</p>
    )}

    <MakePost
      updateList={addToList}
      isLoggedIn={!!isLoggedIn}
    />

    <PostGrid
      postList={postList}
      openComments={setSelectedPostId}
      updatePost={updatePostInList}
    />

    {selectedPost ? (
      <CommentSection
        postId={selectedPost.Id}
        commentCount={selectedPost.CommentCount}
        isLoggedIn={!!isLoggedIn}
        closeComments={() => setSelectedPostId("")}
        updatePost={updatePostInList}
      />
    ) : <></>}
  </div>
)
}

export default ForYou
