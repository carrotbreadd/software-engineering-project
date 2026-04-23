"use client"

import './ForYou.css'
import PostGrid from './components/PostGrid'
import MakePost from './components/MakePost'
import TitleBar from './components/TitleBar'
import CommentSection from './components/CommentSection'
import {useEffect, useState} from "react"

type PostItem = {
  Text: string
  Username: string
  ProfileImage: string
}

const DefaultProfileImage = "/cpy1.png"

function ForYou() {

  const [postList, setPostList] = useState<PostItem[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [sessionMessage, setSessionMessage] = useState("")
  const [showComments, setShowComments] = useState(false)

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
          Text: PostItem.Text,
          Username: PostItem.Username,
          ProfileImage: PostItem.ProfileImage || DefaultProfileImage,
        }));

        setPostList(LoadedPosts);
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

    <PostGrid postList={postList} showComments={showComments} setShowComments={setShowComments} />

    {showComments ? <CommentSection showComments={showComments} setShowComments={setShowComments}></CommentSection> : <></>}
  </div>
)
}

export default ForYou
