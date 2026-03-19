import './MovieArchiveLogin.css';

import React, { useState, useEffect, useContext } from 'react';
import { StateContext } from '../../MovieArchiveApp';
import type { IUser } from '../../model/model';

export default function MovieArchiveLogin({ 
    userLogin, 
    userLogout, 
    userRegister, 
    userDeleteAccount 
}: {
    userLogin: (id: string, pw: string) => {result: boolean, message: string}, 
    userLogout: () => void, 
    userRegister: (id: string, pw: string) => {result: boolean, message: string}, 
    userDeleteAccount: () => {result: boolean, message: string}
}) {

    const userInfo: IUser | null = useContext(StateContext)!.userInfoProvider;
    const [userIdInput, setUserIdInput] = useState<string>('');
    const [userPasswordInput, setUserPasswordInput] = useState<string>('');
    const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);

    useEffect(() => {
        setIsPasswordHidden(true);
    }, [userInfo])

    function handleRegisterBtn(): void {
        
        const {result, message} = userRegister(userIdInput, userPasswordInput);
        if(!result) alert(message);
        else {
            setUserIdInput('');
            setUserPasswordInput('');
        }
    }

    function handleLoginBtn(): void {
        const {result, message} = userLogin(userIdInput, userPasswordInput);
        if(!result) alert(message);
        else {
            setUserIdInput('');
            setUserPasswordInput('');
        }
    }

    function handleDeleteAccountBtn(): void {
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