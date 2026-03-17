import './MovieArchiveFooter.css'

export default function MovieArchiveFooter() {

    return(
        <div className="footer-container">
            <button onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'});}} className='footer-go-to-top-btn'><i className="fa-solid fa-angle-up"></i>Send to top</button>
            <p></p>
        </div>
    );
}