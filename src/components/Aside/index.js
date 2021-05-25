import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ProgressModal } from "components/DefineModal";
import { login } from "actions/userAction";
import Feedback from "../Feedback";
import { Popover, Modal, Menu } from "antd";
import {
  AndroidOutlined,
  // AppleOutlined,
  MenuUnfoldOutlined,
  GithubOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { openExternal } from "utils";
import styles from "./index.styl";
const { ipcRenderer } = window.require("electron");

class Index extends Component {
  state = {
    // 内容页左侧菜单
    menus: [
      {
        title: "Mine",
        icon: <UserOutlined />,
        pathName: "/mine",
      },
      {
        title: "Gitlab",
        icon: <GithubOutlined />,
        pathName: "/gitlab",
      },
      {
        title: "Little Tool",
        icon: <AndroidOutlined />,
        subMenus: [
          {
            title: "HOST配置",
            pathName: "/host",
          },
        ],
      },
    ],
    // 工具
    tools: [
      {
        name: "意见反馈",
        type: "modal",
      },
      {
        name: "检查更新",
        type: "checkupdate",
      },
    ],
    activeMenu: "",
    feedBackVisible: false,
    message: {},
    progressModalVisible: false,
  };

  componentDidMount() {
    this.setState({
      activeMenu: sessionStorage.getItem("activeMenu"),
    });

    // 监听检查更新事件
    ipcRenderer.on("message", (event, data) => {
      this.setState({
        message: data,
      });
    });

    // 监听下载进度
    ipcRenderer.on("downloadProgress", (event, data) => {
      console.log("downloadProgress: ", data);
      this.setState({
        downloadProgress: data,
      });
    });

    // 监听是否可以开始更新
    ipcRenderer.on("isUpdateNow", (event, data) => {
      this.showConfirmUpdateModal();
    });
  }

  showConfirmUpdateModal = () => {
    Modal.confirm({
      title: "更新提示",
      content: "立即重启以完成更新",
      onOk: () => {
        ipcRenderer.send("isUpdateNow");
      },
    });
  };

  switchPage = (pathname = "/", menuName) => {
    this.setState(
      {
        activeMenu: menuName,
      },
      () => {
        sessionStorage.setItem("activeMenu", menuName);
      }
    );
    this.props.history.push({
      pathname,
    });
  };

  // 显示意见反馈弹窗
  showAdviceModal = () => {
    this.setState({
      feedBackVisible: true,
    });
  };

  // 点击工具内容
  onToolItemClick = (item) => {
    const { type = "", url = "" } = item;
    switch (type) {
      case "modal":
        this.showAdviceModal();
        break;
      case "checkupdate":
        // 发送检查更新的请求
        ipcRenderer.send("checkForUpdate");
        // 显示更新弹窗
        // let bytesPerSecond = 0,
        //   percent = 0,
        //   total = 78945610,
        //   transferred = 0;

        // setInterval(() => {
        //   bytesPerSecond += 100000;
        //   transferred += 100000;
        //   percent = (transferred / total) * 100;

        //   this.setState({
        //     downloadData: {
        //       bytesPerSecond,
        //       percent,
        //       total,
        //       transferred,
        //     },
        //   });
        // }, 500);
        // this.showUpdateModal();
        break;
      default:
        openExternal(url);
        break;
    }
  };

  showUpdateModal = () => {
    this.toggleVisible("progressModalVisible");
  };

  toggleVisible = (key) => this.setState({ [key]: !this.state[key] });

  render() {
    const {
      menus,
      activeMenu,
      tools,
      feedBackVisible,
      progressModalVisible,
      downloadData = {},
    } = this.state;
    return (
      <Fragment>
        {/* 意见反馈 */}
        <Feedback
          visible={feedBackVisible}
          close={() => this.setState({ feedBackVisible: false })}
        />

        {
          // 检查更新弹窗
        }
        <ProgressModal data={downloadData} visible={progressModalVisible} />

        <div className={styles.root}>
          <div className={styles.top}>
            <div className={styles.logoBox}>
              <div className={styles.logo}>
                <img
                  className={styles.logoImg}
                  src="https://thirdqq.qlogo.cn/g?b=oidb&k=ClvbbYen74Hia0s19qaQb3g&s=100&t=1555466874"
                  alt=""
                />
                <div>朱兴敏</div>
              </div>
            </div>
            <div className={styles.asideMenus}>
              <Menu
                // defaultSelectedKeys={["1"]}
                selectedKeys={[activeMenu]}
                mode="vertical"
              >
                {menus.map((menu, index) => {
                  return menu.subMenus ? (
                    <Menu.SubMenu
                      key={menu.title}
                      icon={menu.icon}
                      title={menu.title}
                    >
                      {menu.subMenus &&
                        menu.subMenus.map((subMenu, j) => (
                          <Menu.Item
                            key={subMenu.title}
                            onClick={() =>
                              this.switchPage(subMenu.pathName, subMenu.title)
                            }
                          >
                            {subMenu.title}
                          </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                  ) : (
                    <Menu.Item
                      key={menu.title}
                      onClick={() => this.switchPage(menu.pathName, menu.title)}
                      icon={menu.icon}
                    >
                      {menu.title}
                    </Menu.Item>
                  );
                })}
              </Menu>
            </div>
          </div>
          <div className={styles.tools}>
            <Popover
              title=""
              content={
                <div className={styles.toolMenuBox}>
                  <div className={styles.toolMenu}>
                    {tools.map((item, index) => (
                      <div
                        key={index}
                        className={styles.toolItem}
                        onClick={() => this.onToolItemClick(item)}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              }
              placement="top"
              overlayClassName={styles.overlay}
            >
              <div className={styles.tool}>
                <MenuUnfoldOutlined className={styles.toolIcon} />
                系统工具
              </div>
            </Popover>
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
