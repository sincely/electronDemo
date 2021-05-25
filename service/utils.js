"use strict";

const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const log = require("electron-log");

const PIDS = []

const Utils = {
  killPorcess: function({pid}){
    return new Promise((resolve, reject)=>{
      resolve(process.kill(pid, 'SIGTERM'))
    })
  },
  // 执行命令
  execCommand: function({command, localPath}){
    return new Promise((resolve, reject)=>{
      const child = execFile(
        path.join(__dirname, "/commands/exec.bat"),
        [localPath, command],
        { encoding: "utf8" },
        (error, stdout, stderr) => {
          if (error) {
            reject({ type: "error", msg: error});
          } else {
            resolve({ type: "success", msg: "操作成功", data: child.pid});
          }
        }
      );
    })
  },
  // 递归获取目录下文件地址
  getFilePath: function (jsonPath) {
    let jsonFiles = [];
    function findJsonFile(_path) {
      let files = fs.readdirSync(_path);
      files.forEach(function (item, index) {
        if (!["node_modules"].includes(item)) {
          let fPath = path.join(_path, item);
          let stat = fs.statSync(fPath);

          // 文件夹
          if (stat.isDirectory()) {
            findJsonFile(fPath);
          }
          // 文件
          if (stat.isFile() && stat.size > 0) {
            jsonFiles.push(fPath);
          }
        }
      });
    }
    findJsonFile(jsonPath);
    return jsonFiles;
  },
  getRemoteFromConfig: function (configFiles = []) {
    return new Promise((resolve, reject) => {
      try {
        const projectRepository = [];
        configFiles.forEach((configFile) => {
          const data = fs.readFileSync(configFile).toString();
          const a = data.match(/[git|http].+\.git/) || [];
          const b = a[0] || "";
          const c = b.split("/");
          const name = c[c.length - 1].split(".")[0];
          projectRepository.push(name);
        });
        resolve({
          type:'success',
          data:projectRepository
        });
      } catch (e) {
        reject({
          type:'error',
          error: e
        });
      }
    });
  },
  // 获取package.json中的script命令
  getScriptsFromPackageJson: function (localPath){
    return new Promise(async (resolve, reject)=>{
      const {type, data} = await this.readFile(localPath)
      if(type==='success'){
        resolve({
          type: "success",
            msg: "操作成功！",
            data,
        })
      }else{
        reject({
          type: "error",
            msg: "操作失败！",
        })
      }
    })
  },
  // 获取该目录下所有文件夹的集合
  getAllFolder: function (jsonPath) {
    let folders = [];
    function findJsonFile(_path) {
      let files = fs.readdirSync(_path);
      files.forEach(function (item) {
        let fPath = path.join(_path, item);
        let stat = fs.statSync(fPath);
        // 文件夹
        if (stat.isDirectory()) {
          jsonFiles.push(item);
        }
      });
    }
    findJsonFile(jsonPath);
    return folders;
  },
  // 获取应用各模块版本信息
  getVersions: function () {
    return process.versions;
  },
  readFile: function (filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          reject({
            type: "error",
            msg: err,
          });
        } else {
          resolve({
            type: "success",
            msg: "操作成功！",
            data,
          });
        }
      });
    });
  },
  writeFile: function (filePath, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, (err, data) => {
        if (err) {
          reject({
            type: "error",
            msg: err,
          });
        } else {
          resolve({
            type: "success",
            msg: "操作成功！",
            data,
          });
        }
      });
    });
  },
  gitPull: async function (args = []) {
    /**
     * args[0]  存放路径
     * args[1]  项目地址
     * args[2]  项目文件夹名称
     * */
    return new Promise((resolve, reject) => {
      if (args.length !== 3) {
        reject({ type: "success", msg: "参数错误" });
      }
      execFile(
        path.join(__dirname, "/commands/pull.bat"),
        args,
        { encoding: "utf8" },
        (error, stdout, stderr) => {
          /**
           * execFile方法的输出
           * error  错误
           *
           * 可执行文件的输出
           * stdout 标准输出
           * stderr 标准错误
           */
          if (error) {
            reject({ type: "error", msg: error });
          } else {
            resolve({ type: "success", msg: "操作成功", data: stdout });
          }
        }
      );
    });
  },
};

module.exports = Utils;
