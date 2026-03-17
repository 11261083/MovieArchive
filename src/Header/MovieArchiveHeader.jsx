import './MovieArchiveHeader.css';

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from '../MovieArchiveApp';

export default function MovieArchiveHeader() {

    const navigate = useNavigate();

    const userInfo = useContext(StateContext).userInfoProvider;

    const [searchInputText, setSearchInputText] = useState("");

    function handleSearchInputChange(e) {
        setSearchInputText(e.target.value);
    }

    function handleSearchBtn() {
        if(!searchInputText) return;
        navigate(`/home/search?q=${searchInputText}`);
    }

    function handleInputFieldEnterKeyUp(e) {
        if(e.key === "Enter") {
            handleSearchBtn();
        }
    }

    return(
        <div className='header-container'>
            <button onClick={() => {navigate("/home/recent")}} className='home-page-btn'><i className="fa-solid fa-film"></i> Movie Archive</button>
            <div className='search-field'>
                <input value={searchInputText} onChange={handleSearchInputChange} onKeyUp={handleInputFieldEnterKeyUp} className='search-input'></input>
                <button onClick={handleSearchBtn} className='search-btn'><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <button onClick={() => {navigate("/home/favorite")}} className='favorite-page-btn'><i className="fa-regular fa-bookmark"></i>Favorites</button>
            <button onClick={() => {navigate("/login")}} className='login-page-btn'>{userInfo ? `${userInfo.id.split("@")[0]}` : "Log In"}</button>
        </div>
    );
}