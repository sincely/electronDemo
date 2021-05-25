import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { login } from "actions/userAction";
// import { setSetting } from "actions/dataAction";
import { Switch, Modal, message } from "antd";
import styles from "./index.styl";

const {
  ipcRenderer,
  remote: { dialog },
} = window.require("electron");

class Index extends Component {
  state = {
    setOptions: {},
  };

  static defaultProps = {
    visible: false,
  };

  componentDidMount() {}

  // 保存设置
  saveSet = async () => {
    const { setOptions } = this.state;
    message.info("保存成功！");
    ipcRenderer.send("toggleAutoStart", { openAtLogin: setOptions.autoStart });
  };

  updateDownloadPath = async () => {
    dialog.showOpenDialog(
      {
        properties: ["openDirectory"],
      },
      (filePaths) => {
        if (filePaths.length === 0) return;
        this.setState({
          setOptions: {
            ...this.state.setOptions,
            downloadPath: filePaths[0],
          },
        });
      }
    );
  };

  closeModal = (name) => this.setState({ [name]: false });

  // 开关切换
  onSwitchChange = (checked, type) => {
    this.setState({
      setOptions: {
        ...this.state.setOptions,
        [type]: checked,
      },
    });
  };

  render() {
    const { setOptions } = this.state;
    const { visible } = this.props;
    return (
      <Fragment>
        <Modal
          title="设置"
          visible={visible}
          centered
          // footer={null}
          wrapClassName={styles.setModal}
          maskStyle={{
            backgroundColor: "transparent",
          }}
          bodyStyle={{}}
          onOk={this.saveSet}
          onCancel={this.props.close}
        >
          <div className={styles.setContent}>
            <div className={styles.body}>
              <div className={styles.settings}>
                <div className={styles.setting}>
                  <div className={styles.label}>应用所在目录</div>
                  <div className={[styles.content, styles.group].join(" ")}>
                    <div className={styles.value}>
                      {setOptions.downloadPath}
                    </div>
                    <div
                      className={styles.btn}
                      onClick={this.updateDownloadPath}
                    >
                      打开
                    </div>
                  </div>
                </div>
                <div className={styles.setting}>
                  <div className={styles.label}>启动设置</div>
                  <div className={[styles.content, styles.group].join(" ")}>
                    <div className={styles.value}>开机自动运行</div>
                    <div className={styles.switch}>
                      <Switch
                        onChange={(e) => this.onSwitchChange(e, "autoStart")}
                        checked={setOptions.autoStart}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (reducer) => ({
  userReducer: reducer.userReducer,
  dataReducer: reducer.dataReducer,
});
const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(login()),
  // setSetting: (data) => dispatch(setSetting(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
