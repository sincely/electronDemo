import React, { Component, Fragment } from "react";
import { Modal, Progress, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { UpdateInfo } from "static/update";
import styles from "./index.styl";

const { TextArea } = Input

// 未开发完成
export class UnfinishedModal extends Component {
  static defaultProps = {
    visible: false,
  };

  render() {
    const { visible } = this.props;
    return (
      <Fragment>
        <Modal
          visible={visible}
          centered
          closable={false}
          footer={null}
          wrapClassName={styles.Modal}
          maskStyle={{
            backgroundColor: "transparent",
          }}
          width={`3.2rem`}
        >
          <div className={styles.head}>
            <img
              className={styles.close}
              onClick={this.props.close}
              src="https://cdn.code.znzmo.com/zhimo2.0_static/img/client/head/close.png"
              alt=""
            />
          </div>
          <div className={styles.body}>
            <img
              src="https://cdn.code.znzmo.com/zhimo2.0_static/img/client/common/unfinished.png?v"
              alt=""
            />
          </div>
          <div className={styles.foot}>
            <div
              className={[styles.confirm, styles.btn].join(" ")}
              onClick={this.props.close}
            >
              朕知道了
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

// 登出确认
export class LogoutConfirmModal extends Component {

  static defaultProps = {
    visible: false,
  };

  render() {
    const { visible } = this.props;
    return (
      <Fragment>
        <Modal
          visible={visible}
          centered
          closable={false}
          footer={null}
          wrapClassName={styles.Modal}
          maskStyle={{
            backgroundColor: "transparent",
          }}
          width={`3.4rem`}
        >
          <div className={styles.head}>
            <img
              className={styles.close}
              onClick={this.props.close}
              src="https://cdn.code.znzmo.com/zhimo2.0_static/img/client/head/close.png"
              alt=""
            />
          </div>
          <div className={styles.body}>
            <div className={styles.title}>确定关闭窗口吗？</div>
            <div className={styles.sub}>客户端将被最小化在右下角托盘哦~</div>
          </div>
          <div className={styles.foot}>
            <div
              className={[styles.confirm, styles.btn].join(" ")}
              onClick={this.props.confirm}
            >
              确定
            </div>
            <div
              className={[styles.cancel, styles.btn].join(" ")}
              onClick={this.props.close}
            >
              取消
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

// 确认
export class ConfirmModal extends Component {
  static defaultProps = {
    visible: false,
    txt: "确认进行该操作吗？",
  };

  render() {
    const { visible, txt } = this.props;
    return (
      <Fragment>
        <Modal
          visible={visible}
          centered
          closable={false}
          footer={null}
          wrapClassName={styles.Modal}
          maskStyle={{
            backgroundColor: "transparent",
          }}
          {...this.props.attrs}
        >
          <div className={styles.head}>
            <img
              className={styles.close}
              onClick={this.props.close}
              src="https://cdn.code.znzmo.com/zhimo2.0_static/img/client/head/close.png"
              alt=""
            />
          </div>
          <div className={styles.body}>
            <div className={styles.title}>{txt}</div>
          </div>
          <div className={styles.foot}>
            <div
              className={[styles.confirm, styles.btn].join(" ")}
              onClick={this.props.confirm}
            >
              确定
            </div>
            <div
              className={[styles.cancel, styles.btn].join(" ")}
              onClick={this.props.close}
            >
              取消
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

// 余额不足
export class BalanceIsNotEnough extends Component {

  static defaultProps = {
    visible: false,
  };

  render() {
    const { visible } = this.props;
    return (
      <Fragment>
        <Modal
          visible={visible}
          centered
          closable={false}
          footer={null}
          wrapClassName={styles.Modal}
          maskStyle={{
            backgroundColor: "transparent",
          }}
          bodyStyle={{}}
          width={`3.2rem`}
        >
          <div className={styles.balanceContent}>
            <div className={styles.head}>
              <img
                className={styles.close}
                onClick={this.props.close}
                src="https://cdn.code.znzmo.com/zhimo2.0_static/img/client/head/close.png"
                alt=""
              />
            </div>
            <div className={styles.body}>
              <div className={styles.icon}>
                <img
                  src="https://cdn.code.znzmo.com/zhimo2.0_static/img/client/common/balance.png"
                  alt=""
                />
              </div>
              <div className={styles.title}>余额不足啦，快去加点油吧~</div>
            </div>
            <div className={styles.foot}>
              <div
                className={[styles.pay, styles.btn].join(" ")}
                onClick={this.props.goPay}
              >
                去充值
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

// 更新日志
export class UpdateModal extends Component {
  state = {
    version: "1.0.0",
    detail: [],
  };

  static defaultProps = {
    visible: false,
  };

  componentDidMount() {
    let info = UpdateInfo[0];
    let { version, detail } = info;
    this.setState({
      version,
      detail,
    });
  }

  mapTypeToTitle = (type) => {
    const map = {
      bug: "BUG修复",
      feature: "新增功能",
      tip: "其它",
    };
    return map[type];
  };

  render() {
    const { version = "1.0.0", detail = [] } = this.state;
    const { visible } = this.props;
    return (
      <Fragment>
        <Modal
          visible={visible}
          centered
          closable={false}
          footer={null}
          wrapClassName={styles.Modal}
          maskStyle={{
            backgroundColor: "transparent",
          }}
          bodyStyle={{}}
          // width={`2.8rem`}
        >
          <div className={styles.content}>
            <div className={styles.head}>
              <img
                className={styles.close}
                onClick={this.props.close}
                src="https://cdn.code.znzmo.com/zhimo2.0_static/img/client/head/close.png"
                alt=""
              />
            </div>
            <div className={styles.body}>
              {/* <div className={styles.title}>当前客户端已是最新版本</div> */}
              <div className={styles.updateBox}>
                <div className={styles.updateTitle}>
                  已更新到最新版本 {version}
                </div>
                <h3>更新内容</h3>
                <div className={styles.wrap}>
                  {detail.map((item, index) => (
                    <div className={styles.detailBox} key={index}>
                      <div className={styles.detailTitle}>
                        {this.mapTypeToTitle(item.type)}
                      </div>
                      <ol>
                        {item.list.map((e, i) => (
                          <li className={styles.listItem} key={i}>
                            {e}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.foot}>
              <div
                className={[styles.confirm, styles.btn].join(" ")}
                onClick={this.props.close}
              >
                知道啦
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

// 同步数据
export class LoadingModal extends Component {
  static defaultProps = {
    visible: false,
  };

  render() {
    const { visible } = this.props;
    return (
      <Fragment>
        <Modal
          visible={visible}
          centered
          closable={false}
          footer={null}
          wrapClassName={styles.loadingModal}
          maskStyle={
            {
              // backgroundColor: 'transparent'
            }
          }
          bodyStyle={{}}
          {...this.props.attrs}
        >
          <div className={styles.loadingContent}>
            {this.props.children ? (
              this.props.children
            ) : (
              <Fragment>
                <LoadingOutlined className={styles.loadingIcon} />
                <p className={styles.tip}>正在同步断网数据 。。。</p>
              </Fragment>
            )}
          </div>
        </Modal>
      </Fragment>
    );
  }
}

// 更新进度
export class ProgressModal extends Component {
  static defaultProps = {
    data: {
      bytesPerSecond: 0,
      percent: 0,
      total: 0,
      transferred: 0,
      delta: 0,
    },
  };

  toFixed = (num, len = 1) => {
    return num ? num.toFixed(len) : num;
  };

  byteToMb = (num) => {
    return num / 1024 / 1024;
  };
  render() {
    const {
      visible,
      data: { bytesPerSecond, percent, total, transferred },
    } = this.props;
    return (
      <Modal
        visible={visible}
        centered
        closable={false}
        footer={null}
        wrapClassName={styles.progressModal}
      >
        <div className={styles.downloadInfo}>
          <Progress
            type="dashboard"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            percent={this.toFixed(percent)}
            gapDegree={30}
          />
          <div className={styles.speed}>{this.toFixed(this.byteToMb(bytesPerSecond))}MB/秒</div>
          <div className={styles.progress}>
            {this.toFixed(this.byteToMb(transferred))}MB /{" "}
            {this.toFixed(this.byteToMb(total))}MB
          </div>
        </div>
      </Modal>
    );
  }
}

// 设置脚本命令
export class SetCommandModal extends Component {
  state = {
    value: ''
  }

  static defaultProps = {
  };

  onOk = () => {
    this.props.onOk(this.state.value)
  }

  onChange = e => {
    this.setState({value: e.target.value})
  }

  render() {
    const {
      visible,
      onCancel,
    } = this.props;
    return (
      <Modal
        title="自定义命令"
        visible={visible}
        centered
        closable={false}
        onCancel={onCancel}
        onOk={this.onOk}
        wrapClassName={styles.commandModal}
      >
        <TextArea onChange={this.onChange}></TextArea>
      </Modal>
    );
  }
}
