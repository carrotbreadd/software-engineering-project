import './TitleBar.css'
import logo from '../assets/logo.webp'

function TitleBar() {
    return <>
        <div className='bar-container'>
            <div className='left-container'></div>
            <div className='title-container'>Capybara Twitter</div>
            <div className='image-container'><img className='logo' src={logo}></img></div>
        </div>
    </>
}

export default TitleBar