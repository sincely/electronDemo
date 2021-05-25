import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, Input, Card, message, Typography } from "antd";
import { withRouter } from "react-router-dom";
import {
  PlayCircleOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import { setHostFile } from "actions/dataAction";
import CardBox from "components/CardBox";
import { HOST_PATH } from "config/path";
import styles from "./index.styl";

const { TextArea } = Input;
const { Paragraph } = Typography;
const { ipcRenderer } = window.require("electron");

class Index extends Component {
  state = {
    // files: [],
    activeIndex: 0,
    operations: [
      {
        type: "edit",
        title: "编辑",
        icon: <EditOutlined />,
      },
      {
        type: "copy",
        title: "复制",
        icon: <CopyOutlined />,
      },
      {
        type: "delete",
        title: "删除",
        icon: <DeleteOutlined />,
      },
      {
        type: "apply",
        title: "应用",
        icon: <PlayCircleOutlined />,
      },
    ],
  };

  componentDidMount() {
    this.getHostFile();
  }

  getHostFile = async () => {
    const { hostFile = [] } = this.props;

    if (hostFile.length) {
      return;
    }
    let { type, msg, data } = await ipcRenderer.invoke("readFile", HOST_PATH);
    message[type](msg);
    if (data) {
      this.props.setHostFile([
        ...hostFile,
        {
          data,
          active: true,
        },
      ]);
    }
  };

  operate = (type, item = {}, index) => {
    const { hostFile = [], setHostFile } = this.props;
    const { data = "" } = item;
    switch (type) {
      case "edit":
        this.setState({
          activeIndex: index,
        });
        this.toggleVisible();
        break;
      case "copy":
        setHostFile([
          ...hostFile,
          {
            data,
          },
        ])
        break;
      case "delete":
        setHostFile([
          ...hostFile.filter((file, fileIndex) => fileIndex !== index)
        ])
        break;
      case "apply":
        this.setState(
          {
            activeIndex: index,
          },
          () => {
            this.apply(data);
          }
        );
        break;
      default:
        break;
    }
  };

  apply = async (data) => {
    const { hostFile=[], setHostFile } = this.props
    const { activeIndex } = this.state;
    let { type, msg } = await ipcRenderer.invoke("writeFile", HOST_PATH, data);
    message[type](msg);

    setHostFile(hostFile.map((file, index) => ({
      ...file,
      active: activeIndex === index,
    })))
  };

  toggleVisible = (name = "visible") =>
    this.setState({ [name]: !this.state[name] });

  onCancel = () => this.toggleVisible();

  onOk = () => {
    this.toggleVisible();
  };

  onFileChange = (e) => {
    const { activeIndex } = this.state;
    const { hostFile=[], setHostFile } = this.props
    setHostFile(hostFile.map((file, index) => ({
      ...file,
      data: activeIndex === index ? e.target.value : file.data,
    })))
  };

  onParagraphChange = (value, index) => {
    const { hostFile=[], setHostFile } = this.props
    for(let key in hostFile){
      if(key == index){
        hostFile[key].title = value
        break
      }
    }
    setHostFile(hostFile)
  }

  render() {
    const { visible, activeIndex, operations } = this.state;
    const { hostFile } = this.props;
    return (
      <div className={styles.root}>
        <CardBox cardProps={{ title: "host文件配置" }}>
          <div className={styles.files}>
            {hostFile.map((item, index) => (
              <Card
                className={styles.file}
                key={index}
                size="small"
                title={
                  index ? (
                    <Paragraph
                      editable={{
                        onChange: (value) =>
                          this.onParagraphChange(value,index),
                      }}
                    >
                      {item.title ? item.title : `副本${index + 1}`}
                    </Paragraph>
                  ) : (
                    `源文件`
                  )
                }
                extra={""}
              >
                <div className={styles.operations}>
                  {operations.map((operation) => {
                    return index === 0 &&
                      ["edit", "delete"].includes(operation.type) ? (
                      ""
                    ) : (
                      <Button
                        className={[
                          styles.operation,
                          item.active ? styles.active : "",
                        ].join(" ")}
                        type={
                          item.active && operation.type === "apply"
                            ? "primary"
                            : "default"
                        }
                        key={operation.type}
                        title={operation.title}
                        size="small"
                        onClick={() =>
                          this.operate(operation.type, item, index)
                        }
                        disabled={
                          item.active &&
                          ["edit", "delete"].includes(operation.type)
                        }
                      >
                        {item.active && operation.type === "apply" ? (
                          <div>
                            <PauseCircleOutlined />{" "}
                            <span>{operation.title}中</span>
                          </div>
                        ) : (
                          <div>
                            {operation.icon} <span>{operation.title}</span>
                          </div>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </CardBox>
        <Modal
          title="编辑副本"
          visible={visible}
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <TextArea
            autoSize={{ minRows: 2, maxRows: 15 }}
            value={hostFile.length ? hostFile[activeIndex].data : ""}
            onChange={this.onFileChange}
          ></TextArea>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (reducer) => {
  const {
    dataReducer: { hostFile = [] },
  } = reducer;
  return {
    hostFile,
  };
};
const mapDispatchToProps = (dispatch) => ({
  setHostFile: (data) => dispatch(setHostFile(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
