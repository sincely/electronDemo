import React, { Component, Fragment as F } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "actions";
import CardBox from "components/CardBox";
import { SetCommandModal } from "components/DefineModal";
import { GITLAB } from "api";
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Table,
  Menu,
  Dropdown,
  message,
  Popover,
  Modal,
  Typography,
} from "antd";
import copy from "copy-to-clipboard";
import styles from "./index.styl";

const { Paragraph } = Typography;

const {
  ipcRenderer,
  shell,
  remote: { dialog },
} = window.require("electron");

class Index extends Component {
  state = {
    visible: false,
    loading: false,
    selectedRowKeys: [],
    files: [],
    localFilePath: [],
    activeProject: {
      packageJson: {},
    },
  };

  columns = [
    {
      title: "项目名称",
      dataIndex: "name",
      render: (txt, record) => {
        const { description, localPath } = record;
        return (
          <Popover title="" content={record.description || "暂无项目描述"}>
            {localPath ? (
              <a onClick={() => this.openFolder(localPath)}>{txt}</a>
            ) : (
              txt
            )}
          </Popover>
        );
      },
    },
    {
      title: "打包/发布",
      key: "operate",
      render: (txt, record) => {
        const { localPath = "" } = record;
        return [
          { type: "custom", label: "自定义命令" },
          { type: "set", label: "设置命令" },
        ].map((item) => (
          <Button
            key={item.label}
            onClick={() => this.projectOperation({ type: item.type }, record)}
            size="small"
          >
            {item.label}
          </Button>
        ));
      },
    },
    {
      title: "操作列表",
      key: "operations",
      render: (txt, record) => {
        const { scriptMap = {}, pid } = record;
        // if (pid) {
        //   scriptMap.kill = {
        //     type: "kill",
        //     name: "结束进程",
        //     pid,
        //   };
        // }
        let keys = scriptMap ? Object.keys(scriptMap) : [];
        let node = "";

        if (keys.length) {
          node = keys.map((key) => (
            <Button
              size="small"
              key={key}
              onClick={(e) =>
                this.projectOperation(
                  e,
                  {
                    type: scriptMap[key].kill
                      ? scriptMap[key].kill.type
                      : "exec",
                    script: key,
                    pid: scriptMap[key].kill ? scriptMap[key].kill.pid : "",
                  },
                  record
                )
              }
            >
              {scriptMap[key].name}
              <CloseOutlined
                onClick={(e) =>
                  this.projectOperation(
                    e,
                    { type: "delete", script: key },
                    record
                  )
                }
              />
            </Button>
          ));
        }
        return node;
      },
    },
  ];

  componentDidMount() {
    // 修数据专用
    // const {
    //   dataReducer:{
    //     projects=[]
    //   },
    //   setMyProjects
    // } = this.props
    // projects.forEach(item=>{
    //   if(item.localPath){
    //     item.localPath = item.localPath.replace("package.json","")
    //   }
    // })
    // setMyProjects(projects)
  }

  openFolder = (item) => {
    shell.showItemInFolder(item);
  };

  openFile = async () => {
    const {
      dataReducer: { projects = [] },
    } = this.props;
    const res = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    const { canceled, filePaths } = res;
    if (canceled) return;

    this.setState({ loading: true });

    // 获取所选目录下所有文件地址
    let results = await ipcRenderer.invoke("getFilePath", filePaths[0]);

    // 获取目录下一级文件夹名称 （不得劲，用户选择的目录层级不确定，不太好搞）
    // let results = await ipcRenderer.invoke("getAllFolder", filePaths[0]);

    // 过滤所有.git文件
    let configFiles = results.filter((result) =>
      result.endsWith(".git\\config")
    );
    let { error, data = [] } = await ipcRenderer.invoke(
      "getRemoteFromConfig",
      configFiles
    );
    if (error) {
      this.setState({ loading: false });
      return message.error(error);
    }
    if (!data.length) {
      this.setState({ loading: false });
      return message.info("未检测到到相关文件夹");
    }

    // 过滤所有项目下的package.json
    let localFilePath = [];
    results.forEach((result) => {
      let matched = new RegExp(
        "\\\\(" + data.join("|") + ")\\\\package.json$"
      ).test(result);
      if (matched) {
        let _result = result.split("\\"),
          name = _result[_result.length - 2],
          $result = result;
        localFilePath.push({
          localPath: $result.replace("package.json", ""),
          name,
        });
      }
    });

    let _files = projects.map((item) => item.name);

    // 与已有项目做个去重
    let files = Array.from(new Set([..._files, ...data]));

    this.setState(
      {
        files,
        localFilePath,
      },
      () => {
        this.mapLocalToRemote();
      }
    );
  };

  // 与远程gitlab仓库匹配项目名称
  mapLocalToRemote = async () => {
    const { files = [], localFilePath = [] } = this.state;
    if (!files.length) return message.info("没有获取到项目或项目已存在");
    this.setState({ loading: true });
    let responses = await Promise.all(
      files.map((item) => {
        return GITLAB.get("/projects", {
          per_page: 100,
          search: item,
        });
      })
    );

    // 以php-view为条件 会查出php-view / php-view-fe 两个项目
    let projects = [];
    responses.forEach((item) => {
      let data = item.data || [];
      for (let i = 0; i < data.length; i++) {
        for (let key in files) {
          let file = files[key];
          if (file === data[i].name) {
            projects = [...projects, data[i]];
          }
        }
      }
    });

    this.setState({ loading: false });
    localFilePath.forEach((item) => {
      for (let key in projects) {
        if (item.name === projects[key].name) {
          projects[key].localPath = item.localPath;
          return;
        }
      }
    });
    this.props.setMyProjects(projects);
    this.setState({ loading: false });
  };

  projectOperation = async (e, { type, script, pid }, record) => {
    const { ssh_url_to_repo = "", localPath } = record;
    const arr = ssh_url_to_repo.split("/"),
      name = arr[arr.length - 1].split(".")[0];

    switch (type) {
      case "pull":
        // 拉取项目
        this.sendMsg(ssh_url_to_repo, name);
        break;
      case "delete":
        // 删除命令
        this.deleteCommand(script, record);
        break;
      case "set":
        // 设置命令
        this.setCommands(record);
        break;
      case "custom":
        // 自定义命令
        this.customCommand(record);
        break;
      case "exec":
        // 执行所选命令
        this.execCommand(script, record);
        break;
      case "kill":
        // 结束子进程
        this.killPorcess(pid);
        break;
      default:
        break;
    }
  };

  deleteCommand = (script, record) => {
    const {
      dataReducer: { projects = [] },
      setMyProjects,
    } = this.props;
    const { id } = record;
    for (let key in projects) {
      let project = projects[key];
      if (project.id === id) {
        delete record.scriptMap[script];
        projects[key] = record;
        setMyProjects(projects);
        break;
      }
    }
  };

  customCommand = async (record) => {
    this.setState({
      activeProject: record,
    });
    this.toggleVisible("setCommandVisible");
  };

  killPorcess = async (pid) => {
    console.log(pid);
    const killed = await ipcRenderer.invoke("killPorcess", { pid });
    console.log(pid, killed);
  };

  execCommand = async (script, { localPath, id }) => {
    const {
      dataReducer: { projects },
      setMyProjects,
    } = this.props;
    const { type, msg, data } = await ipcRenderer.invoke("execCommand", {
      command: script,
      localPath,
    });
    message[type](msg);
    if (data) {
      for (let index in projects) {
        if (projects[index].id === id) {
          projects[index].pid = data;
          break;
        }
      }
      setMyProjects(projects);
    }
  };

  setCommands = async ({ localPath, id }) => {
    const {
      dataReducer: { projects = [] },
      setMyProjects,
    } = this.props;
    let { type, msg, data } = await ipcRenderer.invoke(
      "getScriptsFromPackageJson",
      `${localPath}\\package.json`
    );
    // message[type](msg);
    if (!data) {
      return;
    }
    data = JSON.parse(data);
    for (let key in projects) {
      if (projects[key].id === id) {
        projects[key].packageJson = data;
        this.setState({
          activeProject: projects[key],
        });
        break;
      }
    }
    setMyProjects(projects);
    this.toggleVisible();
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

  toggleVisible = (key = "visible") =>
    this.setState({ [key]: !this.state[key] });

  onParagraphChange = (value, script, id) => {
    const {
      dataReducer: { projects = [] },
      setMyProjects,
    } = this.props;
    for (let key in projects) {
      let item = projects[key];
      if (item.id === id) {
        item.scriptMap = item.scriptMap || {};
        item.scriptMap[script] = {
          name: value,
        };
        this.setState({
          activeProject: item,
        });
        break;
      }
    }
    setMyProjects(projects);
  };

  onOk = (value) => {
    const { activeProject } = this.state;
    this.toggleVisible("setCommandVisible");
  };

  render() {
    let {
      selectedRowKeys,
      loading,
      activeProject: { packageJson, id, scriptMap = {} },
      visible,
      setCommandVisible,
    } = this.state;
    scriptMap = scriptMap || {};
    const {
      dataReducer: { projects = [] },
    } = this.props;
    const { scripts = {} } = packageJson;
    return (
      <F>
        <Modal
          title="设置命令"
          visible={visible}
          onCancel={() => this.toggleVisible()}
          footer={null}
        >
          {scripts &&
            Object.keys(scripts).map((script) => (
              <div key={script}>
                <div className={styles.flexBetween}>
                  <div>
                    {script}：{scripts[script]}
                  </div>
                  <div>
                    <Paragraph
                      editable={{
                        onChange: (value) =>
                          this.onParagraphChange(value, script, id),
                      }}
                    >
                      {scriptMap[script]
                        ? scriptMap[script].name
                        : `yarn ${script}`}
                    </Paragraph>
                  </div>
                </div>
              </div>
            ))}
        </Modal>
        <SetCommandModal
          visible={setCommandVisible}
          onCancel={() => this.toggleVisible("setCommandVisible")}
          onOk={() => this.onOk()}
        />
        <CardBox
          cardProps={{
            title: "My Projects",
            extra: <Button onClick={this.openFile}>导入本地项目</Button>,
          }}
        >
          <div className={styles.root}>
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={projects}
              pagination={false}
              loading={loading}
              onChange={this.onTableChange}
              rowSelection={{
                selectedRowKeys,
                onChange: this.onRowSelectChange,
              }}
            ></Table>
          </div>
        </CardBox>
      </F>
    );
  }
}

const mapStateToProps = (reducer) => ({
  ...reducer,
});
const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ ...actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
