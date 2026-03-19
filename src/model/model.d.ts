export interface IUser {
    id: string,
    password: string,
    favoriteMoviesList: IMovie[]
}

export interface IMovie {
    id: number,
    poster_path: string,
    release_date: string,
    title: string,
    vote_average: number,
    vote_count: number
}

export interface IMovieDetail {
    id: number,
    backdrop_path: string,
    poster_path: string,
    budget: number,
    genres: string[],
    origin_country: string[],
    original_language: string,
    original_title: string,
    overview: string,
    production_companies: string[],
    production_countries: string[],
    release_date: string,
    revenue: number,
    runtime: number,
    spoken_languages: string[],
    tagline: string,
    title: string,
    vote_average: number,
    vote_count: number
}
