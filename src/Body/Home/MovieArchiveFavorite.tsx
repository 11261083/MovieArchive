import { useContext, useEffect, useState } from 'react';
import HomeCardsGrid from './HomeCardsGrid';
import { StateContext } from '../../MovieArchiveApp';
import { useNavigate } from 'react-router';

export default function MovieArchiveFavorite() {

    const navigate = useNavigate();

    const userInfo = useContext(StateContext).userInfoProvider;

    const [favoriteMovieList, setFavoriteMovieList] = useState([]);

    useEffect(() => {
        if(userInfo) setFavoriteMovieList(userInfo.favoriteMoviesList);
        else navigate("/login");
    }, [userInfo])

    return(
        <HomeCardsGrid movieList={favoriteMovieList} />
    );
}