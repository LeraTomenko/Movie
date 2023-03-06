import React from "react";
import { Tabs } from "antd";
import PropTypes from "prop-types";

import style from "../../components/Header/Header.module.scss";

export default class Header extends React.Component {
  static defaultProps = {
    active: "search",
    setActive: () => {},
  };
  static defaultProp = {
    active: PropTypes.string,
    setActive: PropTypes.func,
  };
  arr = [
    { label: "Search", key: "search" },
    { label: "Rated", key: "rated" },
  ];
  render() {
    const { setActive, active } = this.props;
    return (
      <div className={style.header}>
        <Tabs
          // destroyInactiveTabPane={true}
          items={this.arr}
          mode="horizontal"
          onChange={(e) => setActive(e)}
          selectedkeys={active}
        />
      </div>
    );
  }
}
