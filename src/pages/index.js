import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as userAction from "actions/userAction";
import * as dataAction from "actions/dataAction";

/*
 * common components
 */
import CHeader from "components/Header";
import Aside from "components/Aside";

/*
 * other components
 */
import { UnfinishedModal } from "components/DefineModal";

/*
 * page components
 */
import Login from "./login";
import Android from "./demo";
import Host from "./host";
import Gitlab from "./gitlab";
import Welcome from "./welcome";
import Mine from "./mine";

import styles from "./index.styl";
import { message, Layout } from "antd";

const { Header, Content, Sider } = Layout;

// const { ipcRenderer } = window.require("electron");

message.config({
  top: 100,
  maxCount: 3,
  duration: 2,
});

class Index extends Component {
  state = {
    unfinishedModalVisible: false,
    updateModalVisible: false,
  };

  // 关闭弹窗
  closeModal = (name) => this.setState({ [name]: false });

  render() {
    const { unfinishedModalVisible } = this.state;

    return (
      <Layout>
        {/* 研发中 */}
        <UnfinishedModal
          visible={unfinishedModalVisible}
          close={() => this.closeModal("unfinishedModalVisible")}
        />
        {/* 更新弹窗 */}
        {/* <UpdateModal
                    visible={updateModalVisible}
                    close={() => this.closeModal('updateModalVisible')}
                /> */}

        {this.props.userReducer.uuId ? (
          <Router>
            <div className={styles.html}>
              <div className={styles.aside}>
                <Sider className={styles.sider}>
                  <Aside />
                </Sider>
              </div>
              <div className={styles.body}>
                <div className={styles.header}>
                  <Header>
                    <CHeader />
                  </Header>
                </div>
                <Content className={styles.content}>
                  <Switch>
                    <Route path="/mine" exact render={() => <Mine />} />
                    <Route path="/gitlab" exact render={() => <Gitlab />} />
                    <Route path="/host" exact render={() => <Host />} />
                    <Route path="/task" exact render={() => <Android />} />
                    <Route path="/" render={() => <Welcome />} />
                  </Switch>
                </Content>
              </div>
            </div>
          </Router>
        ) : (
          <Login />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (reducer) => ({
  userReducer: reducer.userReducer,
  dataReducer: reducer.dataReducer,
});
const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ ...userAction, ...dataAction }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
