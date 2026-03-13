import React, { useState, useEffect } from 'react';

import Cookies from 'js-cookie';

export default function useUserAuth() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const lastLoggedUser = JSON.parse(Cookies.get('movieArchiveUser') ? Cookies.get('movieArchiveUser') : null);
        if(lastLoggedUser) {
            const savedUser = JSON.parse(localStorage.getItem(lastLoggedUser.id));
            if(savedUser) {
                if(savedUser.password === lastLoggedUser.password) {
                    setUser(savedUser);
                }
            }
        }
    }, []);

    useEffect(() => {
        if(user) {
            localStorage.setItem(user.id, JSON.stringify(user));
            Cookies.set('movieArchiveUser', JSON.stringify({"id": user.id, "password": user.password}), { expires: 7 });
        }
    }, [user]);

    function userLogin(id, pw) {
        const savedUser = JSON.parse(localStorage.getItem(id));
        if(savedUser) {
            if(savedUser.password !== pw) {
                return { result: false, message: "Wrong Password!" };
            }
            else {
                setUser(savedUser);
                return { result: true, message: "Login Successful!" };
            }
        }
        return { result: false, message: "Your ID is not registered!" };
    }

    function userLogout() {
        Cookies.remove('movieArchiveUser');
        setUser(null);
    }

    function userRegister(id, pw) {

        if(user) return { result:false, message: "User already Logged In" };

        if(!validateEmail(id)) return { result: false, message: "Enter a valid Email!" };
        
        if(localStorage.getItem(id)) return { result: false, message: "Your ID is already registered!" };

        if(pw) {
            setUser({id: id, password: pw, favoriteMoviesList: []});
        }
        else {
            return { result: false, message: "Type a valid ID and Password!" };
        }
    }

    function userAddFavoriteMovieToList(movie) {
        if(!user) return { result: false, message: "User doesn't exist!" };

        if(user.favoriteMoviesList.some((item) => movie.id === item.id)) return { result: false, message: "Movie already in Favorites List!" }

        const newMovieItem = {
            "id": movie.id,
            "poster_path": movie.poster_path,
            "release_date": movie.release_date,
            "title": movie.title,
            "vote_average": movie.vote_average,
            "vote_count": movie.vote_count
        }
        const newList = [...user.favoriteMoviesList, newMovieItem];
        setUser(prev => ({...prev, favoriteMoviesList: newList}));
        return { result: true, message: "Added movie to Favorites List successfully" };
    }

    function userRemoveFavoriteMovieFromList(id) {
        if(!user) return { result: false, message: "User doesn't exist!" };

        if(!user.favoriteMoviesList.some((item) => id === item.id)) return { result: false, message: "Movie was not found in Favorites List!" }

        const newList = [...user.favoriteMoviesList].filter((item) => item.id !== id);
        setUser(prev => ({...prev, favoriteMoviesList: newList}));
        return { result: true, message: "Removed movie from Favorites List successfully" };
    }

    function userDeleteAccount(id) {
        localStorage.removeItem(id);
        if(!localStorage.getItem(id)) {
            userLogout();
            return { result: true, message: "User Deleted Successfully!" }
        }
        else return {result: false, message: "Failed Deleting User!"}
    }

    return {
        userInfo: user,
        userLogin,
        userLogout,
        userRegister,
        userAddFavoriteMovieToList,
        userRemoveFavoriteMovieFromList,
        userDeleteAccount
    };
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}