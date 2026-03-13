import './MovieArchiveLogin.css';

import React, { useState, useEffect, useContext } from 'react';
import { StateContext } from '../../MovieArchiveApp';

export default function MovieArchiveLogin() {

    const userInfo = useContext(StateContext).userInfoProvider;
    const userLogin = useContext(StateContext).userLoginProvider;
    const userLogout = useContext(StateContext).userLogoutProvider;
    const userRegister = useContext(StateContext).userRegisterProvider;
    const userDeleteAccount = useContext(StateContext).userDeleteAccountProvider;

    const [userIdInput, setUserIdInput] = useState('');
    const [userPasswordInput, setUserPasswordInput] = useState('');
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    useEffect(() => {
        setIsPasswordHidden(true);
    }, [userInfo])

    function handleRegisterBtn() {
        
        const {result, message} = userRegister(userIdInput, userPasswordInput);
        if(!result) alert(message);
        else {
            setUserIdInput('');
            setUserPasswordInput('');
        }
    }

    function handleLoginBtn() {
        const {result, message} = userLogin(userIdInput, userPasswordInput);
        if(!result) alert(message);
        else {
            setUserIdInput('');
            setUserPasswordInput('');
        }
    }

    function handleDeleteAccountBtn() {
        const {message} = userDeleteAccount();
        alert(message);
    }

    return(
        <div className="login-container">
            {userInfo ? (
                    <div className='login-box'>
                        <p>Account Information</p>
                        <label>Email/ID</label>
                        <div className='login-info'>{userInfo.id}</div>
                        <label>Password</label>
                        <div onClick={() => setIsPasswordHidden(prev => !prev)} className={`login-info`}>{isPasswordHidden ? <i className="fa-solid fa-eye-slash"></i> : userInfo.password}</div>
                        <div className='login-button-box'>
                            <button onClick={handleDeleteAccountBtn}>Delete Account</button>
                            <button onClick={() => userLogout()}>Log out</button>
                        </div>
                    </div>
                ) : (
                    <div className='login-box'>
                        <p>Log In</p>
                        <label>Enter your Email</label>
                        <input value={userIdInput} onChange={(e) => setUserIdInput(e.target.value)} type="email"></input>
                        <label>Password</label>
                        <input value={userPasswordInput} onChange={(e) => setUserPasswordInput(e.target.value)}></input>
                        <div className='login-button-box'>
                            <button onClick={handleRegisterBtn}>Register</button>
                            <button onClick={handleLoginBtn}>Log in</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}