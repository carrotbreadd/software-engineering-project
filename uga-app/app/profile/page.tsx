"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const accessoryItems = [
  { id: "original", name: "Capy", src: "/cpy1.png" },
  { id: "caba1_Hi", name: "Hi Capy", src: "/caba2.png" },
  { id: "caba_bluehat", name: "Capy Blue Hat", src: "/capy_closed_eyes_hat.png" },
  { id: "capy_redhat", name: "Capy Red Hat", src: "/capy_closed_eyes_redhat.png" },
  { id: "capy_orange", name: "Capy Orange", src: "/capy_closed_eyes_orange.png" },
  { id: "caba_redhat_Butt", name: "Butt Capy Red Hat", src: "/caba3.png" },
  { id: "capy_bluehat_Butt", name: "Butt Capy Blue Hat", src: "/capy_hat_vec.png" },
];

type UserInfo = {
  username: string;
  email: string;
  profileImage: string;
  id?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/sessionCheck", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!data.User) {
        router.push("/login");
        return;
      }

      setUser({
        username: data.User.Username,
        email: data.User.Email,
        profileImage: data.User.profileImage ?? "/cpy1.png",
        id: data.User.Id,
      });
    }

    fetchUser();
  }, [router]);

  if (!user) {
    return <p style={{ color: "white" }}>Loading...</p>;
  }

  const handleEquip = async (item: typeof accessoryItems[0]) => {
    if (!user) return;

    const oldPfp = user.profileImage;

    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      return {
        ...prevUser,
        profileImage: item.src,
      };
    });

    const res = await fetch("/api/user/updatePfp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPfp: item.src,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setUser((prevUser) => {
        if (!prevUser) return prevUser;

        return {
          ...prevUser,
          profileImage: oldPfp,
        };
      });

      alert(data.message ?? "Failed to update PFP");
      return;
    }

    const checkRes = await fetch("/api/sessionCheck", {
      cache: "no-store",
    });

    const checkData = await checkRes.json();

    if (checkData.User) {
      setUser({
        username: checkData.User.Username,
        email: checkData.User.Email,
        profileImage: checkData.User.profileImage ?? item.src,
        id: checkData.User.Id,
      });
    }
  };

  return (
    <div style={{ backgroundColor: "#c29c7a", minHeight: "100vh", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <button
          style={{
            backgroundColor: "#df894a",
            border: "none",
            padding: "12px 18px",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => router.push("/")}
        >
          Back to FYP
        </button>

        <Image
          src={user.profileImage}
          alt="Profile"
          width={100}
          height={100}
          style={{
            borderRadius: "50%",
            border: "2px solid #d9b99b",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginBottom: "50px",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          My Profile
        </h1>

        <div style={{ backgroundColor: "#fcd5a0", padding: "12px", borderRadius: "5px" }}>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>Username:</label>
          <input
            type="text"
            value={user.username}
            readOnly
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "5px",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </div>

        <div style={{ backgroundColor: "#fcd5a0", padding: "12px", borderRadius: "5px" }}>
          <label style={{ fontWeight: "bold", fontSize: "16px" }}>Email:</label>
          <input
            type="email"
            value={user.email}
            readOnly
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "5px",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </div>
      </div>

      <h1
        style={{
          textAlign: "center",
          fontSize: "28px",
          color: "white",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Accessory PFPs
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        {accessoryItems.map((item) => {
          const equipped = user.profileImage === item.src;

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: "#fcd5a0",
                padding: "25px",
                borderRadius: "10px",
                width: "200px",
                textAlign: "center",
                opacity: equipped ? 0.6 : 1,
              }}
            >
              <Image
                src={item.src}
                alt={item.name}
                width={140}
                height={140}
                style={{
                  borderRadius: "50%",
                  border: "2px solid #d9b99b",
                }}
              />

              <p style={{ fontWeight: "bold", fontSize: "16px" }}>{item.name}</p>

              <button
                style={{
                  backgroundColor: equipped ? "#aaa" : "#df894a",
                  color: "white",
                  border: "none",
                  padding: "12px 18px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => handleEquip(item)}
              >
                {equipped ? "Using" : "Use"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}