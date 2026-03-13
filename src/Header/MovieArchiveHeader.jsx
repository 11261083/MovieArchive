import './MovieArchiveHeader.css';

import React, { useState, useContext } from 'react';
import { StateContext } from '../MovieArchiveApp';

export default function MovieArchiveHeader({ bodyPageNavigate }) {

    const userInfo = useContext(StateContext).userInfoProvider;

    const [searchInputText, setSearchInputText] = useState("");

    function handleHomePageBtn() {
        bodyPageNavigate("home");
    }

    function handleFavoritesPageBtn() {
        if(userInfo) {
            bodyPageNavigate("home?favorite");
        }
        else {
            bodyPageNavigate("login");
        }
    }

    function handleSearchInputChange(e) {
        setSearchInputText(e.target.value);
    }

    function handleSearchBtn() {
        if(!searchInputText) return;
        bodyPageNavigate(`home?search=${searchInputText}`);
    }

    function handleInputFieldEnterKeyUp(e) {
        if(e.key === "Enter") {
            handleSearchBtn();
        }
    }

    return(
        <div className='header-container'>
            <button onClick={handleHomePageBtn} className='home-page-btn'><i className="fa-solid fa-film"></i> Movie Archive</button>
            <div className='search-field'>
                <input value={searchInputText} onChange={handleSearchInputChange} onKeyUp={handleInputFieldEnterKeyUp} className='search-input'></input>
                <button onClick={handleSearchBtn} className='search-btn'><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <button onClick={handleFavoritesPageBtn} className='favorite-page-btn'><i className="fa-regular fa-bookmark"></i>Favorites</button>
            <button onClick={() => bodyPageNavigate("login")} className='login-page-btn'>{userInfo ? `${userInfo.id.split("@")[0]}` : "Log In"}</button>
        </div>
    );
}