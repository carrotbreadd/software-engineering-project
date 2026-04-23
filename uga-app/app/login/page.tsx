"use client";

import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

const ribbons = [
  {
    top: "-12%",
    left: "-22%",
    width: "150%",
    rotate: "-14deg",
    opacity: 0.16,
    duration: "90s",
    direction: "normal",
  },
  {
    top: "8%",
    left: "-22%",
    width: "150%",
    rotate: "-14deg",
    opacity: 0.2,
    duration: "82s",
    direction: "normal",
  },
  {
    top: "31%",
    left: "-22%",
    width: "150%",
    rotate: "-14deg",
    opacity: 0.24,
    duration: "74s",
    direction: "normal",
  },
  {
    top: "54%",
    left: "-22%",
    width: "150%",
    rotate: "-14deg",
    opacity: 0.24,
    duration: "78s",
    direction: "normal",
  },
  {
    top: "77%",
    left: "-22%",
    width: "150%",
    rotate: "-14deg",
    opacity: 0.2,
    duration: "86s",
    direction: "normal",
  },
  {
    top: "100%",
    left: "-22%",
    width: "150%",
    rotate: "-14deg",
    opacity: 0.16,
    duration: "92s",
    direction: "normal",
  },
];

function CheckEmailIsValid(Email: string) {
  return Email.includes("@") && Email.includes(".");
}

function GetInputClassName(IsValid: boolean, ShowError: boolean) {
  if (ShowError) {
    return "border-red-400/80 shadow-[0_0_0_1px_rgba(248,113,113,0.45),0_0_20px_rgba(248,113,113,0.18)]";
  }

  if (IsValid) {
    return "border-emerald-400/80 shadow-[0_0_0_1px_rgba(52,211,153,0.35),0_0_20px_rgba(52,211,153,0.14)]";
  }

  return "border-white/10 focus-within:border-white/20";
}

export default function LoginPage() {
  const router = useRouter();

  const [Email, GetEmail] = useState("");
  const [Password, GetPassword] = useState("");
  const [FormMessage, SetFormMessage] = useState("");
  const [FormMessageType, SetFormMessageType] = useState<"Error" | "Success" | "">("");
  const [ShowValidation, SetShowValidation] = useState(false);
  const [IsSubmitting, SetIsSubmitting] = useState(false);
  const [FormFlashClass, SetFormFlashClass] = useState("");

  const EmailIsValid = CheckEmailIsValid(Email.trim());
  const PasswordIsValid = Password.trim().length > 5;
  const FormIsValid = EmailIsValid && PasswordIsValid;
  const ShowEmailError = (ShowValidation || Email.length > 0) && !EmailIsValid;
  const ShowPasswordError = (ShowValidation || Password.length > 0) && !PasswordIsValid;

  function TriggerFormFlash(FlashClassName: string) {
    SetFormFlashClass(FlashClassName);

    window.setTimeout(() => {
      SetFormFlashClass("");
    }, 550);
  }

  async function HandleLogin(Event: React.FormEvent<HTMLFormElement>) {
    Event.preventDefault();

    SetShowValidation(true);

    if (!FormIsValid) {
      SetFormMessage("Please fix the red fields before signing in.");
      SetFormMessageType("Error");
      TriggerFormFlash("animate-[SoftErrorFlash_0.55s_ease]");
      return;
    }

    SetIsSubmitting(true);
    SetFormMessage("");
    SetFormMessageType("");

    try {
      const Response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email,
          Password,
        }),
      });

      const Data = await Response.json();
      console.log(Data);

      if (!Response.ok) {
        SetFormMessage(Data.Message || "Login failed");
        SetFormMessageType("Error");
        TriggerFormFlash("animate-[SoftErrorFlash_0.55s_ease]");
        return;
      }

      SetFormMessage("Login successful. Redirecting...");
      SetFormMessageType("Success");
      TriggerFormFlash("animate-[SoftSuccessFlash_0.55s_ease]");
      router.push("/");
    } catch (Error) {
      console.error(Error);
      SetFormMessage("Something went wrong. Please try again.");
      SetFormMessageType("Error");
      TriggerFormFlash("animate-[SoftErrorFlash_0.55s_ease]");
    } finally {
      SetIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4">
      <style jsx global>{`
        @keyframes SoftErrorFlash {
          0% {
            box-shadow: 0 0 0 0 rgba(248, 113, 113, 0);
          }
          50% {
            box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.55),
              0 0 32px rgba(248, 113, 113, 0.18);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(248, 113, 113, 0);
          }
        }

        @keyframes SoftSuccessFlash {
          0% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
          }
          50% {
            box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.45),
              0 0 32px rgba(52, 211, 153, 0.16);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,32,54,0.24),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.6),rgba(0,0,0,0.92))]" />

        {ribbons.map((ribbon, index) => (
          <div
            key={index}
            className="absolute h-36 overflow-hidden rounded-[999px] border border-white/6 shadow-[0_0_40px_rgba(0,0,0,0.45)]"
            style={{
              top: ribbon.top,
              left: ribbon.left,
              width: ribbon.width,
              transform: `rotate(${ribbon.rotate})`,
              opacity: ribbon.opacity,
            }}
          >
            {(() => {
              const ribbonTrackStyle = {
                "--ribbon-duration": ribbon.duration,
              } as CSSProperties;

              const ribbonTextureStyle = {
                backgroundImage: "url('/caba2.png')",
                backgroundPosition: "left center",
                backgroundSize: "auto 100%",
                backgroundRepeat: "repeat-x",
              } as CSSProperties;

              return (
                <div
                  className={`ribbon-track absolute inset-y-0 left-0 flex w-[200%] brightness-[0.9] contrast-[1.08] saturate-[1] ${
                    ribbon.direction === "reverse" ? "ribbon-track-reverse" : ""
                  }`}
                  style={ribbonTrackStyle}
                >
                  <div className="h-full w-1/2 shrink-0" style={ribbonTextureStyle} />
                  <div className="h-full w-1/2 shrink-0" style={ribbonTextureStyle} />
                </div>
              );
            })()}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0.96)_10%,rgba(0,0,0,0.72)_20%,rgba(0,0,0,0.2)_32%,rgba(0,0,0,0.12)_50%,rgba(0,0,0,0.2)_68%,rgba(0,0,0,0.72)_80%,rgba(0,0,0,0.96)_90%,rgba(0,0,0,1)_100%)]" />
            <div className="absolute inset-[1px] rounded-[999px] border border-white/8" />
          </div>
        ))}
      </div>

      <section className={`relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-[0_0_90px_rgba(20,120,255,0.08),0_0_140px_rgba(0,0,0,0.65)] backdrop-blur-md transition-all duration-300 ${FormFlashClass}`}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-[12%] top-[-14%] h-28 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute right-[-8%] top-[8%] h-32 w-32 rounded-full bg-amber-200/8 blur-3xl" />
          <div className="absolute left-[-10%] bottom-[14%] h-36 w-36 rounded-full bg-blue-400/8 blur-[90px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_40%)]" />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex rounded-full border border-white/10 bg-black/50 p-1">

            {/* ONLY FUNCTION ADDED */}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="rounded-full px-6 py-2 text-sm font-medium text-white/50"
            >
              Sign up
            </button>

          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white/80 transition hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* EVERYTHING BELOW IS EXACTLY YOUR ORIGINAL */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Sign in to continue to your account.
          </p>
        </div>

        <form className="space-y-4" onSubmit={HandleLogin}>
          <div>
            <div className={`rounded-xl border bg-white/5 transition-all duration-300 ${GetInputClassName(EmailIsValid, ShowEmailError)}`}>
              <input
                  type="email"
                  placeholder="Enter your email"
                  value={Email ?? ""}
                  onChange={(Event) => GetEmail(Event.target.value)}
                  className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              />
            </div>
            <p className={`mt-2 text-xs transition-colors duration-300 ${ShowEmailError ? "text-red-300" : EmailIsValid ? "text-emerald-300" : "text-white/35"}`}>
              Use a valid email address with an @ in it.
            </p>
          </div>
          <div>
            <div className={`rounded-xl border bg-white/5 transition-all duration-300 ${GetInputClassName(PasswordIsValid, ShowPasswordError)}`}>
              <input
                type="password"
                placeholder="Enter your password"
                value={Password ?? ""}
                onChange={(Event) => GetPassword(Event.target.value)}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              />
            </div>
            <p className={`mt-2 text-xs transition-colors duration-300 ${ShowPasswordError ? "text-red-300" : PasswordIsValid ? "text-emerald-300" : "text-white/35"}`}>
              Password must be longer than 5 characters.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm text-white/60">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Forgot password?
            </button>
          </div>

          {FormMessage ? (
            <p className={`text-sm ${FormMessageType === "Success" ? "text-emerald-300" : "text-red-300"}`}>
              {FormMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={IsSubmitting}
            className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {IsSubmitting ? "Signing In..." : "Sign in"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.2em] text-white/30">
            Or sign in with
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Google
          </button>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Apple
          </button>
        </div>
        <div className="mt-6 flex justify-center">
          <button
             type="button"
             onClick={() => router.push("/")}
             className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
             <img
              src="/cpy1.png"
              alt="For You"
              className="h-5 w-5"
             />
             For You Page
            </button>
          </div>

        <p className="mt-6 text-center text-xs text-white/35">
          By signing in, you agree to our Terms & Service.
        </p>
      </section>
    </main>
  );
}
