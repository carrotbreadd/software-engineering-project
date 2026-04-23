"use client"

import './ForYou.css'
import PostGrid from './components/PostGrid'
import MakePost from './components/MakePost'
import TitleBar from './components/TitleBar'
import {useEffect, useState} from "react"

function ForYou() {

  const [postList, setPostList] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [sessionMessage, setSessionMessage] = useState("")

  useEffect(() => {
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
    } catch (error) {
      setIsLoggedIn(false);
      setSessionMessage("Could not check session.");
    }
  }

  CheckSession();

  const handleFocus = () => {
    CheckSession();
  };

  window.addEventListener("focus", handleFocus);

  return () => {
    window.removeEventListener("focus", handleFocus);
  };
}, []);
  const addToList = (newPost: string) => {
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

    <PostGrid postList={postList} />
  </div>
)
}

export default ForYou