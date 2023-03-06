import React from "react";
import PropTypes from "prop-types";
import cnBind from "classnames/bind";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { Tag, Rate, Spin } from "antd";

import MovieApi from "../../_services/MovieApi";
import imgForPoster from "../../assets/img/poster.jpg";
import { GenresConsumer } from "../_services_genres/index";

import styles from "./Card.module.scss";
const cx = cnBind.bind(styles);

export default class Card extends React.Component {
  state = {
    imgLoad: false,
    stars: 0,
  };
  static defaultProps = {
    img: imgForPoster,
    title: null,
    date: "0000-00-00",
    description: null,
    genre: null,
    vote: 0,
    rating: 0,
    toStateRate: () => {},
    starValue: 0,
  };

  static propTypes = {
    img: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
    genre: PropTypes.array,
    vote: PropTypes.number,
    rating: PropTypes.number,
    toStateRate: PropTypes.func,
    starValue: PropTypes.number,
  };
  movieApi = new MovieApi();

  // Форматирование даты
  convertData = (date) => {
    return format(new Date(date), "MMMM dd, yyyy", {
      locale: enGB,
    });
  };

  // Уменьшение текста
  __cutDescription(text) {
    return `${text.replace(/^(.{150}[^\s]*).*/, "$1")}...`;
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState(() => {
        return { loading: !this.state.loading };
      });
    }
  }

  setStars(rate, id) {
    this.setState({ stars: rate });
    this.props.PutRating(rate, id);
  }

  render() {
    const { id, img, title, date, genre, description, vote, starValue } =
      this.props;

    if (!this.state.imgLoad) {
      let image = new Image();
      image.src = img;
      image.onload = () => {
        this.setState((state) => {
          return { imgLoad: !state.imgLoad };
        });
      };
    }
    const showImg = this.state.imgLoad ? (
      <img src={img} alt={title} />
    ) : (
      <Spin className={styles.spinner} />
    );

    const colorRate = cx({
      info__headerRate: true,
      bad: vote < 3,
      normal: vote >= 3 && vote < 5,
      good: vote >= 5 && vote < 7,
      wonderful: vote >= 7,
    });

    return (
      <GenresConsumer>
        {(genres) => {
          {
            return (
              <>
                {
                  <div className={styles.cardWrapper}>
                    <div className={styles.card}>
                      <div className={styles.img_wrapper}> {showImg}</div>
                      <div className={styles.info}>
                        <div className={styles.info__top}>
                          <div className={styles.info__header}>
                            <h1 className={styles.info__headerTitle}>
                              {title}
                            </h1>
                            <div className={colorRate}>
                              <span>{vote ? vote.toFixed(1) : null}</span>
                            </div>
                          </div>
                          <div className={styles.info__date}>
                            {this.convertData(date)}
                          </div>
                          <div className={styles.info__genre}>
                            {genre.map((i) => {
                              const nameGenres = genres.find((item) => {
                                if (item.id === i) {
                                  return item.name;
                                }
                              });

                              return <Tag key={i}> {nameGenres.name}</Tag>;
                            })}
                          </div>
                        </div>

                        <div className={styles.info__description}>
                          {description
                            ? this.__cutDescription(description)
                            : null}
                        </div>

                        <div className={styles.info__rate}>
                          <Rate
                            allowHalf
                            count={10}
                            value={starValue || this.state.stars}
                            onChange={(rate) => this.setStars(rate, id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </>
            );
          }
        }}
      </GenresConsumer>
    );
  }
}
