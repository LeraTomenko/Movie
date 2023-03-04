import React from "react";
import PropTypes from "prop-types";

import style from "../SearchInput/SearchInput.module.scss";

export default class SearchInput extends React.Component {
  static defaultProps = {
    searchCard: () => {},
    cleanResult: () => {},
    currentPage: 1,
  };

  static propTypes = {
    searchCard: PropTypes.func,
    cleanResult: PropTypes.func,
    currentPage: PropTypes.number,
  };
  state = {
    label: "",
  };

  //Изменения в инпуте
  OnLabelChange = (e) => {
    if (e.length !== 0) {
      this.setState(() => {
        return { label: e };
      });
    } else {
      this.setState(() => {
        return { label: "" };
      });
      this.props.cleanResult();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.label !== prevState.label) {
      this.props.searchCard(this.state.label, this.props.currentPage);
    }
  }

  render() {
    return (
      <div className={style.search}>
        <form>
          {" "}
          <input
            onChange={(event) => this.OnLabelChange(event.target.value)}
            placeholder="Type to search..."
            className={style.search__input}
            value={this.state.label}
          ></input>
        </form>
      </div>
    );
  }
}
