import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    timeout: 10000,
    headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWMzYTVlMGNkMWE0NTNlYzQxZGQ1NDgzOGZlMTk3OSIsIm5iZiI6MTc3MjcxNzExOC41MjcsInN1YiI6IjY5YTk4NDNlNmM4Nzg3YjJmZjczZGYxOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ce6Juh_TTnrNmacJgpd6y5p8W5XmX07X4bH0afyoooA'
    }
});

export default axiosConfig;