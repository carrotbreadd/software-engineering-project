"use client"

import './ForYou.css'
import PostGrid from './components/PostGrid'
import MakePost from './components/MakePost'
import TitleBar from './components/TitleBar'
import {useEffect, useState} from "react"

function ForYou() {

  const [postList, setPostList] = useState<string[]>([])
  const [SessionMessage, SetSessionMessage] = useState("")

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
          console.log("No valid session:", Data);
          SetSessionMessage(Data.Message || "You are not logged in.");
          return;
        }

        console.log("Session check result:", Data);
        SetSessionMessage(`Logged in as ${Data.User?.Username ?? "User"}`);
      } catch (error) {
        console.log("Session check failed:", error);
        SetSessionMessage("Could not check session.");
      }
    }

    CheckSession();
  }, []);

  const addToList = (newPost: string) => {
    setPostList(postList => [newPost, ...postList])
  }

  return <>
    <TitleBar></TitleBar>
    <div>
      {SessionMessage ? <p>{SessionMessage}</p> : null}
      <MakePost updateList={addToList}></MakePost>
      <PostGrid postList={postList}></PostGrid>
    </div>
  </>
}

export default ForYou
