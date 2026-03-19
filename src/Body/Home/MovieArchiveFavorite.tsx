import './MovieArchiveHome.css';

import { useContext, useEffect, useState } from 'react';
import HomeCardsGrid from './HomeCardsGrid';
import { StateContext } from '../../MovieArchiveApp';
import { useNavigate } from 'react-router';
import type { IMovie, IUser } from '../../model/model';

export default function MovieArchiveFavorite() {

    const navigate = useNavigate();

    const userInfo: IUser | null = useContext(StateContext)!.userInfoProvider;

    const [favoriteMovieList, setFavoriteMovieList] = useState<IMovie[]>([]);

    useEffect(() => {
        if(userInfo) setFavoriteMovieList(userInfo.favoriteMoviesList);
        else navigate("/login");
    }, [userInfo])

    return(
        <div className="home-container">
            <div className='home-list-title'>Favorite Movies</div>
            <HomeCardsGrid movieList={favoriteMovieList} />
        </div>
    );
}