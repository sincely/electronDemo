"use strict";

const { app, BrowserWindow, ipcMain, shell, Tray, Menu } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const log = require("electron-log");

//唤醒客户端方式: zhuxingmin://?a=1&b=2&c=3
const exeName = path.basename(process.execPath);
const gotTheLock = app.requestSingleInstanceLock();
const args = [];
const PROTOCOL = "zhuxingmin";

const AppInstance = {
  init: function () {
    // 设置应用id
    app.setAppUserModelId("org.develar.zhuxingmin");
    // app.setAppUserModelId(process.execPath) 一般以路径作为id

    // 禁止多开
    !gotTheLock && app.quit();

    if (!app.isPackaged) {
      args.push(path.resolve(process.argv[1]));
    }
    args.push("--");

    this.handleArgv();

    // 设置自定义协议
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args);

    this.setLoginItemSettings(true);

    this.startListenArgs();
  },

  // 监听并处理以命令行运行时所带的参数
  startListenArgs: function () {
    app.on("second-instance", (event, argv) => {
      if (process.platform === "win32") {
        // Windows的参数需要处理
        this.handleArgv(argv);
      }
      //   if (mainWindow) {
      //     if (mainWindow.isMinimized()) mainWindow.restore();
      //     mainWindow.focus();
      //   }
    });

    // macOS
    app.on("open-url", (event, urlStr) => {
      this.handleUrl(urlStr);
    });
  },

  // 设置开机启动
  setLoginItemSettings: function (openAtLogin) {
    if (app.isPackaged) {
      app.setLoginItemSettings({
        openAtLogin,
        openAsHidden: false,
        path: process.execPath,
        args: ["--processStart", exeName],
      });
    } else {
      app.setLoginItemSettings({
        openAtLogin,
        path: process.execPath,
      });
    }
  },

  handleArgv: function () {
    const argv = process.argv;
    const prefix = `${PROTOCOL}:`;
    const offset = app.isPackaged ? 1 : 2;
    const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix));
    if (url) this.handleUrl(url);
  },

  handleUrl: function (urlStr = "") {
    // 取值
    // const urlObj = new URL(urlStr);
    // const { searchParams } = urlObj;
    // let value = searchParams.get("key");

    let paramArr = urlStr.split("?")[1].split("&");
    const params = {};
    paramArr.forEach((item) => {
      if (item) {
        const [key, value] = item.split("=");
        params[key] = value;
      }
    });
    log.info("params: ", params);
  },
};

module.exports = AppInstance;
