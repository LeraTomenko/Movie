export default class MoviaApi {
  _key = "d2b735b587102de8933ee3f24268d2b2";
  _token_id = null;

  _apiBase = new URL(`https://api.themoviedb.org/3/`);

  // Поиск по ключевому слову
  async getResource(searchWord, page) {
    const moviesSearch = new URL(`search/movie`, this._apiBase);
    moviesSearch.searchParams.append("api_key", this._key);
    moviesSearch.searchParams.append("language", "en-US");
    moviesSearch.searchParams.append("page", page);
    moviesSearch.searchParams.append("query", searchWord);

    try {
      const res = await fetch(`${moviesSearch.toString()}`);
      const result = await res.json();

      if (result.results.length) {
        return {
          movies: result.results.map((arr) => this.transformArrayMovies(arr)),
          totalPages: result.total_pages,
        };
      } else {
        return null;
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  async getRatedMovies(page = 1) {
    const movieRated = new URL(
      `guest_session/${this._token_id}/rated/movies`,
      this._apiBase
    );
    movieRated.searchParams.append("api_key", this._key);
    movieRated.searchParams.append("page", page);

    try {
      const res = await fetch(`${movieRated.toString()}`);
      const result = await res.json();

      if (result.results.length) {
        return {
          movies: result.results.map((arr) => this.transformArrayMovies(arr)),
          totalPages: result.total_pages,
        };
      } else {
        return null;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  // Получения массива жанров
  async getGenres() {
    const genres = new URL(`genre/movie/list`, this._apiBase);
    genres.searchParams.append("api_key", this._key);
    genres.searchParams.append("language", "en-US");
    try {
      const res = await fetch(`${genres.toString()}`);

      const result = await res.json();
      return result.genres;
    } catch (e) {
      throw new Error(e);
    }
  }
  // Гостевая сессия
  async getAuthentication() {
    // const guestSessions = new URL(`authentication/guest_session/new?`);
    // guestSessions.searchParams.append("api_key", this._key);
    try {
      const res = await fetch(
        `${this._apiBase}/authentication/guest_session/new?api_key=${this._key}`
      );
      // const res = await fetch(`${guestSessions.toString()}`);
      const result = await res.json();
      const token = result.guest_session_id;
      localStorage.getItem("token_id")
        ? localStorage.getItem("token_id")
        : localStorage.setItem("token_id", token);
      this._token_id = localStorage.getItem("token_id");
      return this._token_id;
    } catch (e) {
      throw new Error(e);
    }
  }
  //Отправка оценки
  async PostRating(rateNumb, id) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify({
        value: rateNumb,
      }),
    };
    try {
      fetch(
        `${this._apiBase}/movie/${id}/rating?api_key=${this._key}&guest_session_id=${this._token_id}`,
        requestOptions
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  // Формирования списка с запроса
  transformArrayMovies(arr) {
    return {
      key: arr.id ? arr.id : null,
      title: arr.title ? arr.title : null,
      img: arr.poster_path
        ? `https://www.themoviedb.org/t/p/w220_and_h330_face/${arr.poster_path}`
        : undefined,
      genre: arr.genre_ids ? arr.genre_ids : null,
      description: arr.overview ? arr.overview : null,
      date: arr.release_date ? arr.release_date : null,
      vote: arr.vote_average ? arr.vote_average : null,
      rating: arr.rating ? arr.rating : null,
    };
  }
}
