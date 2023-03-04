import React from "react";
import { Offline, Online } from "react-detect-offline";
import { debounce } from "lodash";
import { Result, Spin } from "antd";

import styles from "../App/App.module.scss";
import CardList from "../CardList/CardList";
import Error from "../Error/Error";
import ErrorNetwork from "../ErrorNetwork/ErrorNetwork";
import MovieApi from "../../_services/MovieApi";
import { GenresProvider } from "../_services_genres/index";
import SearchInput from "../SearchInput/SearchInput";
import Header from "../Header/Header";

export default class App extends React.Component {
  state = {
    active: "search",
    moviesSearch: [],
    moviesRated: [],
    currentPageSearch: 1,
    currentPageRated: 1,
    totalPagesSearch: 0,
    totalPagesRated: 0,
    error: false,
    labelSearch: null,
    genres: null,
    noResultforSearch: false,
  };
  movieApi = new MovieApi();

  // Функция для добавление массива в state
  addMoviesSearch = (res) => {
    const { movies, totalPages } = res;

    this.setState({
      moviesSearch: movies,
      loading: false,
      totalPagesSearch: totalPages,
      noResultforSearch: false,
    });
  };
  addMoviesRated = (res) => {
    const { movies, totalPages } = res;

    this.setState({
      moviesRated: movies,
      loading: false,
      totalPagesRated: totalPages,
      noResultforSearch: false,
    });
  };

  // Отображение ошибки
  onError = () => {
    this.setState({ error: true, loading: false });
  };
  //Запрос по поиску
  searchCard = debounce((searchWord, page) => {
    if (searchWord) {
      this.setState(() => {
        return { loading: true, labelSearch: searchWord };
      });
      this.movieApi
        .getResource(searchWord, page)
        .then((arr) =>
          arr
            ? this.addMoviesSearch(arr)
            : this.setState({
                moviesSearch: null,
                loading: false,
                noResultforSearch: true,
              })
        )
        .catch(this.onError);
    } else {
      this.cleanResult();
    }
  }, 1000);
  PutRating = (rate, id) => {
    this.movieApi.PostRating(rate, id);
    this.movieApi
      .getRatedMovies(this.state.currentPageRated)
      .then((arr) => this.addMoviesRated(arr));
  };
  // Пагинация
  setPage = (event) => {
    if (this.state.active === "search") {
      this.setState({ moviesSearch: [] });
      this.setState({ currentPageSearch: event });
      this.searchCard(this.state.labelSearch, event);
    }
    if (this.state.active === "rated") {
      this.setState({ moviesRated: [] });
      this.setState({ currentPageRated: event });
      this.movieApi.getRatedMovies(this.state.currentPageRated);
    }
  };
  // Удаление при пустом лэйбле
  cleanResult = () => {
    this.setState(() => {
      return { movies: null, labelSearch: null };
    });
  };
  setActive = (e) => {
    this.setState(() => {
      return { active: e };
    });
    if (e === "rated") {
      this.movieApi
        .getRatedMovies(this.state.currentPageRated)
        .then((arr) => this.addMoviesRated(arr));
    }
  };
  async componentDidMount() {
    this.movieApi.getAuthentication();

    const genres = await this.movieApi.getGenres();
    this.setState({ genres: genres });
  }

  render() {
    // Компаненты
    const {
      moviesSearch,
      moviesRated,
      currentPageSearch,
      totalPagesSearch,
      totalPagesRated,
      error,
      active,
    } = this.state;

    const errorMessage = error ? <Error /> : null;

    const content = (
      <CardList
        movies={active === "search" ? moviesSearch : moviesRated}
        rated={moviesRated}
        currentPage={currentPageSearch}
        setPage={this.setPage}
        totalPages={active === "search" ? totalPagesSearch : totalPagesRated}
        PutRating={this.PutRating}
      />
    );

    const noResult = this.state.noResultforSearch ? (
      <Result title="No result" />
    ) : null;

    //
    return (
      <div className={styles.wrapper}>
        <GenresProvider value={this.state.genres}>
          <Online>
            <Header active={active} setActive={this.setActive} />
            {active === "search" ? (
              <SearchInput
                searchCard={this.searchCard}
                currentPage={currentPageSearch}
                cleanResult={this.cleanResult}
              />
            ) : null}
            {noResult}
            {this.state.loading ? (
              <Spin
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></Spin>
            ) : null}
            {content}
            {errorMessage}{" "}
          </Online>
        </GenresProvider>
        <Offline>
          {" "}
          <ErrorNetwork />{" "}
        </Offline>
      </div>
    );
  }
}
