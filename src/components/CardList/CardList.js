import React from "react";
import PropTypes from "prop-types";
import { Pagination } from "antd";

import MovieApi from "../../_services/MovieApi";
import style from "../../components/CardList/CardList.module.scss";
import Card from "../Card/Card";

export default class CardList extends React.Component {
  static defaultProps = {
    movies: null,
    currentPage: 1,
    setPage: () => {},
    totalPages: 0,
  };

  static propTypes = {
    movies: PropTypes.array,
    currentPage: PropTypes.number,
    setPage: PropTypes.func,
    totalPages: PropTypes.number,
  };
  state = {
    ratingMovies: [],
  };
  movieApi = new MovieApi();

  toStateRate(rate, id) {
    this.props.PutRating(rate, id);
    this.movieApi.getRate().then((res) => {
      this.setState({ ratingMovies: res });
    });
  }

  componentDidMount() {
    this.movieApi.getRate().then((res) => {
      this.setState({ ratingMovies: res });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.ratingMovies !== prevState.ratingMovies) {
      this.movieApi.getRate().then((res) => {
        this.setState({ ratingMovies: res });
      });
    }
  }

  render() {
    const { movies, currentPage, setPage, totalPages } = this.props;
    const pagination = movies ? (
      <Pagination
        defaultCurrent={currentPage}
        onChange={(event) => setPage(event)}
        total={totalPages}
      />
    ) : null;

    const cards = movies
      ? movies.map((item) => {
          let starValue;

          let checkRating = this.state.ratingMovies.find(
            (el) => el.key === item.key
          );
          checkRating ? (starValue = checkRating.rating) : null;

          return (
            <Card
              key={item.key}
              id={item.key}
              title={item.title}
              img={item.img}
              date={item.date}
              genre={item.genre}
              description={item.description}
              vote={item.vote}
              rating={item.rating}
              toStateRate={(rate, id) => this.toStateRate(rate, id)}
              starValue={starValue}
            />
          );
        })
      : null;

    return (
      <>
        <div className={style.wrapper}>{cards}</div>
        <div className={style.pagination}>{pagination}</div>
      </>
    );
  }
}
