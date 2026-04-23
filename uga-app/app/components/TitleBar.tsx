"use client"

import './TitleBar.css'
import Image from "next/image"
import logo from '../assets/logo.webp'
import { useRouter } from "next/navigation"

type TitleBarProps = {
    isLoggedIn: boolean
    onLogout: () => void
}

function TitleBar({ isLoggedIn, onLogout }: TitleBarProps) {
    const router = useRouter()

    const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })

    onLogout()
    router.push("/login")
    }

    return (
        <div className='bar-container'>
            <div className='left-container' />

            <div className='title-container'>
                Capybara Twitter
            </div>

            <div className='right-container'>
                {isLoggedIn && (
                    <button className='logout-button' onClick={handleLogout}>
                        Log out
                    </button>
                )}

                <div className='image-container'>
                    <Image className='logo' src={logo} alt='logo' />
                </div>
            </div>
        </div>
    )
}

export default TitleBar