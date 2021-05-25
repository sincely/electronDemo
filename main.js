"use strict";

const { app, BrowserWindow, ipcMain, shell, Tray, Menu } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const log = require("electron-log");
const dev = require('electron-is-dev')

// 实例相关
const AppInstance = require("./service/instance.js");
// 自动更新
const AutoUpdate = require("./service/autoupdate.js");
// 进程交互
const Listeners = require("./service/listeners");
// 系统托盘
const TraySet = require("./service/tray.js");

log.transports.console.level = false;
log.transports.console.level = "silly";

// const dev = process.argv[process.argv.length - 1] === "dev";

// 异常处理 类型unhandledRejection错误 报错信息没有格式，需做处理
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

// 初始化app相关配置和监听
AppInstance.init();

let mainWindow;

function createWindow() {
  //创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 675,
    autoHideMenuBar: true,
    titleBarStyle: false,
    resizable: true,
    frame: false,
    transparent: true,
    backgroundColor: "none",
    show: false,
    hasShadow: false,
    modal: true,
    webPreferences: {
      // devTools: !!dev,
      nodeIntegration: true,
    },
  });

  dev && mainWindow.webContents.openDevTools();

  const config = dev
    ? "http://localhost:3000/"
    : url.format({
        pathname: path.join(__dirname, "./build/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(config);

  // 避免首次加载白屏
  mainWindow.on("ready-to-show", function () {
    mainWindow.show();
  });

  // 关闭window时触发下列事件.
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  // 初始化更新配置
  AutoUpdate(mainWindow).init();

  // 初始化监听事件
  Listeners(mainWindow).init();

  // 设置托盘
  TraySet(mainWindow).init();
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});
