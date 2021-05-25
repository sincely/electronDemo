import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { login } from "actions/userAction";
import { Button, Modal, Input, message } from "antd";
import styles from "./index.styl";

const { TextArea } = Input;

class Index extends Component {
  state = {
    value: "",
  };

  static defaultProps = {
    visible: false,
  };

  onInputChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  submit = async () => {
    message.info(`提交成功！`);
  };

  afterClose = () => this.setState({ value: "" });

  render() {
    const { value = "" } = this.state;
    const { visible } = this.props;
    return (
      <Modal
        title="意见反馈"
        visible={visible}
        centered
        footer={
          <Button
            type="primary"
            disabled={value.length === 0}
            onClick={this.submit}
          >
            提交
          </Button>
        }
        width="4rem"
        wrapClassName={styles.setModal}
        okText={"提交"}
        destroyOnClose={true}
        afterClose={this.afterClose}
        onCancel={this.props.close}
      >
        <div className={styles.body}>
          <TextArea
            className={styles.input}
            placeholder={`每一条意见都会认真查看哦~`}
            onChange={this.onInputChange}
            maxLength={300}
            value={value}
          />
        </div>
      </Modal>
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
