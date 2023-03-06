export default class MoviaApi {
  _key = "d2b735b587102de8933ee3f24268d2b2";

  // Поиск по ключевому слову
  async getResource(searchWord, page) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${this._key}&language=en-US&page=${page}&query="${searchWord}"`
      );
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
      throw new Error();
    }
  }
  async getRatedMovies(page = 1) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/guest_session/${localStorage.getItem(
          "token_id"
        )}/rated/movies?api_key=${this._key}&page=${page}`
      );

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
      throw new Error();
    }
  }

  // Получения массива жанров
  async getGenres() {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${this._key}&language=en-US`
      );

      const result = await res.json();
      return result.genres;
    } catch (e) {
      throw new Error();
    }
  }
  // Гостевая сессия
  async getAuthentication() {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this._key}`
      );
      const result = await res.json();
      const token = result.guest_session_id;
      localStorage.getItem("token_id")
        ? localStorage.getItem("token_id")
        : localStorage.setItem("token_id", token);
    } catch (e) {
      throw new Error();
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
        `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${
          this._key
        }&guest_session_id=${localStorage.getItem("token_id")}`,
        requestOptions
      );
    } catch (e) {
      throw new Error();
    }
  }
  //УДАЛЕНИЕ РЕЙТИНГА
  async Deleted() {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json;charset=utf-8" },
    };
    const res = await fetch(
      `https://api.themoviedb.org/3/guest_session/${localStorage.getItem(
        "token_id"
      )}/rated/movies?api_key=${this._key}`
    );
    const result = await res.json();
    const id = result.results.map((i) => i.id);

    const res2 = await fetch(
      `https://api.themoviedb.org/3/movie/${id.map((i) => i)}/rating?api_key=${
        this._key
      }&guest_session_id=${localStorage.getItem("token_id")}`,
      requestOptions
    );
    const ans = await res2.json();
    return ans;
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
