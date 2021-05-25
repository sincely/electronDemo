import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userAction from "actions/userAction";
import * as dataAction from "actions/dataAction";

import { Button, message, List, Divider } from "antd";
import { LoadingModal } from "components/DefineModal";
import styles from "./index.styl";

const {
  shell,
  ipcRenderer,
  remote: { dialog },
} = window.require("electron");

message.config({
  duration: 2,
});

class Index extends Component {
  state = {
    filePaths: [],
    files: [],
  };

  componentDidMount() {}

  openFolder = (item) => {
    shell.showItemInFolder(`${item}`);
  };

  openFile = async () => {
    const res = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    console.log(res);
    const { canceled, filePaths } = res;
    if (canceled) return;
    this.setState({
      filePaths,
    });
    let result = await ipcRenderer.invoke("getFilePath", filePaths[0]);
    this.setState({
      files: result,
    });

    let result1 = await ipcRenderer.invoke("getVersions");
    console.log(result1);
  };

  render() {
    const { files, filePaths, visible } = this.state;

    return (
      <div className={styles.root}>
        <LoadingModal visible={visible}></LoadingModal>

        <Button type="primary" onClick={this.openFile}>
          选择文件
        </Button>

        <Divider orientation="left">分割线</Divider>
        <List
          size="small"
          header={<div>{`选中目录：${filePaths.join(",")}` || "Head"}</div>}
          footer={<div>End</div>}
          bordered
          dataSource={files}
          renderItem={(item) => (
            <List.Item onClick={() => this.openFolder(item)}>{item}</List.Item>
          )}
        />
        <Divider orientation="left">分割线</Divider>
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
