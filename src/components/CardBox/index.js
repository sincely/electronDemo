import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { login } from "actions/userAction";
import { LeftOutlined } from "@ant-design/icons";
import { Card } from "antd";
// import styles from "./index.styl";

// const {
//   ipcRenderer,
//   remote: { dialog },
// } = window.require("electron");

const CardBox = (props) => {
  const { children, cardProps={} } = props;
  const { title='' } = cardProps

  const goBack = () => {
    props.history.goBack()
  }
  return (
    <Card
      style={{minHeight:"100%"}}
      {...cardProps}
      title={
        <div>
          <LeftOutlined onClick={goBack} /> {title}
        </div>
      }
    >
      {children}
    </Card>
  );
};

CardBox.propTypes = {
  cardProps: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

const mapStateToProps = (reducer) => ({
  userReducer: reducer.userReducer,
  dataReducer: reducer.dataReducer,
});
const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(login()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CardBox)
);
