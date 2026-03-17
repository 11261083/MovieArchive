import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import './index.css'
import App from './MovieArchiveApp.jsx'
import { ScrollToTop } from './ScrollToTop.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ScrollToTop />
        <App />
    </BrowserRouter>,
)
