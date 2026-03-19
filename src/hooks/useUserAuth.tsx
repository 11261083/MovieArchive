import React, { useState, useEffect } from 'react';
import type { IUser, IMovie, IMovieDetail } from "../model/model"

export default function useUserAuth() {

    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const cookieData: string = localStorage.getItem('movieArchiveUser') ?? "";
        if(cookieData) {
            const lastLoggedUser: {id: string, password: string} = JSON.parse(cookieData);
            const localStorageData: string = localStorage.getItem(lastLoggedUser.id) ?? "";
            if(localStorageData) {
                const savedUser: IUser = JSON.parse(localStorageData);
                if(savedUser.password === lastLoggedUser.password) {
                    setUser(savedUser);
                }
            }
        }
    }, []);

    useEffect(() => {
        if(user) {
            localStorage.setItem(user.id, JSON.stringify(user));
            localStorage.setItem('movieArchiveUser', JSON.stringify({"id": user.id, "password": user.password}));
        }
    }, [user]);

    function userLogin(id: string, pw: string): {result: boolean, message: string} {
        const userStorageData: string = localStorage.getItem(id) ?? "";
        if(userStorageData) {
            const savedUser: IUser = JSON.parse(userStorageData);
            if(savedUser.password !== pw) {
                return { result: false, message: "Wrong Password!" };
            }
            else {
                setUser(savedUser);
                return { result: true, message: "Login Successful!" };
            }
        }
        return { result: false, message: "Login failed!" };
    }

    function userLogout(): void {
        localStorage.removeItem('movieArchiveUser');
        setUser(null);
    }

    function userRegister(id: string, pw: string): {result: boolean, message: string} {

        if(user) return { result: false, message: "User already Logged In" };

        if(!validateEmail(id)) return { result: false, message: "Enter a valid Email!" };
        
        if(localStorage.getItem(id)) return { result: false, message: "Type a valid ID and Password!" };

        if(pw) {
            setUser({id: id, password: pw, favoriteMoviesList: []});
            return { result: true, message: "Register Success!" };
        }
        else {
            return { result: false, message: "Type a valid ID and Password!" };
        }
    }

    function userAddFavoriteMovieToList(movie: IMovieDetail): {result: boolean, message: string} {
        if(!user) return { result: false, message: "User doesn't exist!" };

        if(user.favoriteMoviesList.some((item: IMovie) => movie.id === item.id)) return { result: false, message: "Movie already in Favorites List!" }

        const newMovieItem: IMovie = {
            id: movie.id,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            title: movie.title,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count
        }

        setUser((prev) => {
            return {...prev!, favoriteMoviesList: [...prev!.favoriteMoviesList, newMovieItem]};
        });
        return { result: true, message: "Added movie to Favorites List successfully" };
    }

    function userRemoveFavoriteMovieFromList(movieId: number): {result: boolean, message: string} {
        if(!user) return { result: false, message: "User doesn't exist!" };

        if(!user.favoriteMoviesList.some((item: IMovie) => movieId === item.id)) return { result: false, message: "Movie was not found in Favorites List!" };

        const newList: IMovie[] = [...user.favoriteMoviesList].filter((item) => item.id !== movieId);
        setUser(prev => ({...prev!, favoriteMoviesList: newList}));
        return { result: true, message: "Removed movie from Favorites List successfully" };
    }

    function userDeleteAccount(): {result: boolean, message: string} {

        if(!user) return { result: false, message: "User doesn't exist!" };

        localStorage.removeItem(user.id);
        if(!localStorage.getItem(user.id)) {
            userLogout();
            return { result: true, message: "User Deleted Successfully!" };
        }
        else return {result: false, message: "Failed Deleting User!"};
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

function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}