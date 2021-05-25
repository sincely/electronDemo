import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userAction from "actions/userAction";
import * as dataAction from "actions/dataAction";

import styles from "./index.styl";

class Index extends Component {
  render() {
    return (
      <div className={styles.root}>
        HELLO WORLD
      </div>
    );
  }
}

const mapStateToProps = (reducer) => ({
  userReducer: reducer.userReducer,
  dataReducer: reducer.dataReducer,
});
const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ ...userAction, dataAction }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
