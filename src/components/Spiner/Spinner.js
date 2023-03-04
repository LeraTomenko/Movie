import React from "react";
import { Spin } from "antd";

function Spinner() {
  return (
    <Spin tip="Loading" size="large">
      {" "}
      <div className="content" />
    </Spin>
  );
}
export default Spinner;
