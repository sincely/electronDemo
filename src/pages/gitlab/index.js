import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userAction from "actions/userAction";
import * as dataAction from "actions/dataAction";
import FilterForm from "components/FilterForm";
import CardBox from "components/CardBox";
import { GITLAB } from "api";
import { Card, Table, Radio, Menu, Dropdown, message, Popover } from "antd";
import { openExternal } from "utils";
import copy from "copy-to-clipboard";
import moment from "moment";
import styles from "./index.styl";

const { ipcRenderer } = window.require("electron");

class Index extends Component {
  state = {
    selectedRowKeys: [],
    projects: [],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
    // 默认按最后操作时间倒序
    sorter: {
      order_by: "last_activity_at",
      sort: "desc",
    },
    filters: {},
    loading: false,
  };

  columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
    },
    {
      title: "项目名称",
      dataIndex: "name",
      render: (txt, record) => {
        return (
          <Popover title="" content={record.description || "暂无项目描述"}>
            {txt}
          </Popover>
        );
      },
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      sorter: true,
      render: (txt, record) => {
        return (
          <Popover
            title=""
            content={`最近活动时间：${moment(record.last_activity_at).format(
              "yyyy-MM-DD"
            )}`}
          >
            {moment(txt).format("yyyy-MM-DD")}
          </Popover>
        );
      },
    },
    {
      title: "仓库地址",
      key: "repo",
      render: (txt, record) => {
        return (
          <Radio.Group onChange={this.copyRepo}>
            <Radio.Button value={record.http_url_to_repo}>http</Radio.Button>
            <Radio.Button value={record.ssh_url_to_repo}>ssh</Radio.Button>
          </Radio.Group>
        );
      },
    },
    {
      title: "项目相关",
      key: "about",
      render: (txt, record) => {
        const menu = (
          <Menu>
            {Object.keys(record._links).map((link) => (
              <Menu.Item
                key={link}
                onClick={() => openExternal(record._links[link])}
                title={record._links[link]}
              >
                {link}
              </Menu.Item>
            ))}
          </Menu>
        );
        return (
          <Dropdown overlay={menu} placement="bottomLeft" arrow>
            <div>查看更多</div>
          </Dropdown>
        );
      },
    },
    {
      title: "项目操作",
      key: "operate",
      render: (txt, record) => {
        const menu = (
          <Menu>
            {[
              { type: "pull", label: "拉取项目" },
              // { type: "delete", label: "删除项目" },
            ].map((item) => (
              <Menu.Item
                key={item.type}
                onClick={() => this.projectOperation(item, record)}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        );
        return (
          <Dropdown overlay={menu} placement="bottomLeft" arrow>
            <div>操作列表</div>
          </Dropdown>
        );
      },
    },
  ];

  componentDidMount() {
    this.getProjects();
  }

  toggleLoading = () => this.setState({loading:!this.state.loading})

  getProjects = async () => {
    const {
      pagination: { current, pageSize },
      sorter = {},
      filters = {},
    } = this.state;
    this.toggleLoading()
    let { data, status, total } = await GITLAB.get("/projects", {
      page: current,
      per_page: pageSize,
      ...sorter,
      ...filters,
    });
    this.toggleLoading()
    if (status === 200) {
      // 回到当前内容部分顶部
      this.root && this.root.scrollIntoView(true);
      this.setState({
        projects: data,
        pagination: {
          ...this.state.pagination,
          total,
        },
      });
    } else {
      message.error("获取项目列表失败！");
    }
  };

  onTableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          ...pagination,
        },
        sorter:
          field && order
            ? {
                order_by: field,
                sort: order.replace("end", ""),
              }
            : this.state.sorter,
      },
      () => {
        this.getProjects();
      }
    );
  };

  copyRepo = (e) => {
    copy(e.target.value);
    message.success("已成功复制到剪贴板！");
  };

  projectOperation = async ({ type }, record) => {
    const { ssh_url_to_repo = "" } = record;
    const arr = ssh_url_to_repo.split("/"),
      name = arr[arr.length - 1].split(".")[0];

    switch (type) {
      case "pull":
        this.sendMsg(ssh_url_to_repo, name);
        break;
      case "delete":
        break;
      default:
        break;
    }
  };

  sendMsg = async (ssh_url_to_repo, name) => {
    let { type, msg } = await ipcRenderer.invoke("gitPull", [
      "D:\\testcode",
      ssh_url_to_repo,
      name,
    ]);
    message[type](msg);
  };

  onRowSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };

  setFormValues = (values) => {
    this.setState(
      {
        filters: values,
        pagination: {
          ...this.state.pagination,
          current:1
        }
      },
      () => {
        this.getProjects();
      }
    );
  };

  render() {
    const { projects, selectedRowKeys, pagination, loading } = this.state;
    return (
      <CardBox cardProps={{ title: "Gitlab Projects" }}>
        <div className={styles.root} ref={(node) => (this.root = node)}>
          <FilterForm setFormValues={this.setFormValues} />
          <Table
            rowKey="id"
            columns={this.columns}
            dataSource={projects}
            pagination={pagination}
            loading={loading}
            onChange={this.onTableChange}
            rowSelection={{
              selectedRowKeys,
              onChange: this.onRowSelectChange,
            }}
          ></Table>
        </div>
      </CardBox>
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
