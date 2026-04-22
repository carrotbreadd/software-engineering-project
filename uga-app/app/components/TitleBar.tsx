import './TitleBar.css'
import Image from "next/image"
import logo from '../assets/logo.webp'

function TitleBar() {
    return <>
        <div className='bar-container'>
            <div className='left-container'></div>
            <div className='title-container'>Capybara Twitter</div>
            <div className='image-container'><Image className='logo' src={logo} alt='image' /></div>
        </div>
    </>
}

export default TitleBar