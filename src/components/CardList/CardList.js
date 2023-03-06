import React from "react";
import PropTypes from "prop-types";
import { Pagination } from "antd";

import style from "../../components/CardList/CardList.module.scss";
import Card from "../Card/Card";

export default class CardList extends React.Component {
  static defaultProps = {
    movies: null,
    rated: null,
    currentPage: 1,
    setPage: () => {},
    totalPages: 0,
    PutRating: () => {},
  };

  static propTypes = {
    movies: PropTypes.array,
    rated: PropTypes.array,
    currentPage: PropTypes.number,
    setPage: PropTypes.func,
    totalPages: PropTypes.number,
    PutRating: PropTypes.func,
  };

  render() {
    const { movies, currentPage, setPage, totalPages, rated, PutRating } =
      this.props;
    const pagination =
      movies && movies.length ? (
        <Pagination
          defaultPageSize={1}
          showSizeChanger={false}
          current={currentPage}
          onChange={(event) => setPage(event)}
          total={totalPages}
        />
      ) : null;

    const cards = movies
      ? movies.map((item) => {
          let starValue;

          let checkRating = rated
            ? rated.find((el) => el.key === item.key)
            : null;
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
              PutRating={(rate, id) => PutRating(rate, id)}
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
