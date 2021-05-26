import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { login, logout, setUserInfo } from "actions/userAction";
import { Popover, message } from "antd";
import {
  SettingOutlined,
  MinusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Settings from "components/Settings";
import { LogoutConfirmModal, BalanceIsNotEnough } from "components/DefineModal";
import styles from "./index.styl";

const { ipcRenderer } = window.require("electron");

message.config({
  top: 100,
  maxCount: 1,
  duration: 2,
});

class Index extends Component {
  state = {
    windowBtns: [
      {
        name: "设置",
        type: "set",
        icon: <SettingOutlined />,
      },
      {
        name: "最小化",
        type: "min",
        icon: <MinusOutlined />,
      },
      // {
      //   name: "最大化",
      //   type: "max",
      //   icon: <FullscreenOutlined />,
      //   unicon: <FullscreenExitOutlined />,
      // },
      {
        name: "关闭",
        type: "close",
        icon: <CloseOutlined />,
      },
    ],
    // 最大化
    isMax: false,
    setVisible: false,
    personCardVisible: false,
    logoutVisible: false,
    blanceVisible: false,
    updateModalVisible: false,
  };

  componentDidMount() {
  }

  test = async () => {
    const notification = new Notification(`系统通知`, {
      body: `您的余额不足，请立即充值！`,
    });
    notification.onclick = () => {
      this.setState({ blanceVisible: true });
    };
  };

  onWindowBtnClick = (item) => {
    const { type } = item;

    switch (type) {
      case "min":
        ipcRenderer.send(type);
        break;
      case "max":
        this.setState({
          isMax: !this.state.isMax,
        });
        ipcRenderer.send(type);
        break;
      case "close":
        this.setState({
          logoutVisible: true,
        });
        break;
      case "set":
        this.setState({
          setVisible: true,
        });
        break;
      default:
        break;
    }
  };

  windowOpen = (type) => {
    switch (type) {
      case "modify":
        break;
      case "help":
        break;
      default:
        break;
    }
  };

  togglePersonModal = (visible) => {
    this.setState({
      personCardVisible: visible,
    });
  };

  // 关闭弹窗
  closeModal = (name) => {
    this.setState({
      [name]: false,
    });
  };

  // 退出登录
  logout = async () => {
    this.props.setUserInfo({});
    this.props.logout();
  };

  // 确认关闭客户端
  onConfirmLogout = async () => {
    this.closeModal("logoutVisible");
    ipcRenderer.send("close");
  };

  updateInfo = () => {
    this.setState({
      blanceVisible: true,
    });
    return "";
  };

  render() {
    const {
      windowBtns,
      isMax,
      setVisible,
      logoutVisible,
      blanceVisible,
    } = this.state;

    const { accountId, nickName } = this.props.userReducer.userInfo;

    const personCard = (
      <div className={styles.personCard}>
        <div className={styles.parts}>
          <div className={[styles.part, styles.part1].join(" ")}>
            <div className={styles.left}>
              <div className={[styles.userName, styles.flex].join(" ")}>
                <span className={styles.key}>用户名</span>：
                <span className={styles.value}>{nickName||'zhuxingmin'}</span>
              </div>
              <div className={[styles.userId, styles.flex].join(" ")}>
                <span className={styles.key}>用户ID</span>：
                <span className={styles.value}>{accountId || '9527'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.funs}>
          <div className={styles.fun} onClick={() => this.windowOpen(`modify`)}>
            <img
              className={styles.icon}
              src="https://cdn.code.znzmo.com/zhimo2.0_static/img/client/head/modify.png"
              alt=""
            />
            修改密码
          </div>
          <div className={styles.fun} onClick={this.logout}>
            <img
              className={styles.icon}
              src="https://cdn.code.znzmo.com/zhimo2.0_static/img/client/head/logout.png"
              alt=""
            />
            退出登录
          </div>
          <div className={styles.fun} onClick={() => this.windowOpen(`help`)}>
            <img
              className={styles.icon}
              src="https://cdn.code.znzmo.com/zhimo2.0_static/img/client/head/help.png"
              alt=""
            />
            帮助
          </div>
        </div>
      </div>
    );

    return (
      <Fragment>
        {/* 余额不足弹窗 */}
        <BalanceIsNotEnough
          visible={blanceVisible}
          close={() => this.closeModal("blanceVisible")}
          goPay={this.goPay}
        />
        {/* 退出弹窗 */}
        <LogoutConfirmModal
          visible={logoutVisible}
          close={() => this.closeModal("logoutVisible")}
          confirm={this.onConfirmLogout}
        />
        {/* 设置弹窗 */}
        <Settings
          visible={setVisible}
          close={() => this.closeModal("setVisible")}
        />

        <div className={styles.root}>
          <div className={styles.head}>
            <div className={styles.left}></div>
            <div className={styles.right}>
              <div className={styles.icons}>
                {windowBtns.map((item, index) => (
                  <div
                    className={styles.icon}
                    key={index}
                    onClick={() => this.onWindowBtnClick(item)}
                    title={item.name}
                  >
                    {item.type === "max" && isMax ? item.unicon : item.icon}
                  </div>
                ))}
              </div>
              <span className={styles.splitLine}></span>
              <div className={styles.logo}>
                <Popover
                  content={personCard}
                  overlayClassName={styles.personCardBox}
                >
                  <img
                    className={styles.logoImg}
                    src={
                      "https://thirdqq.qlogo.cn/g?b=oidb&k=ClvbbYen74Hia0s19qaQb3g&s=100&t=1555466874"
                    }
                    alt=""
                  />
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (reducer) => ({
  userReducer: reducer.userReducer,
});
const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(login()),
  logout: () => dispatch(logout()),
  setUserInfo: (data) => dispatch(setUserInfo(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
