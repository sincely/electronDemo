"use strict";

const { app, BrowserWindow, ipcMain, shell, Tray, Menu } = require("electron");
const path = require("path");
const { setLoginItemSettings } = require("./instance.js");
const Utils = require("./utils.js");

module.exports = function(mainWindow){
    return {
        init: function() {
          // 关闭开机启动
          ipcMain.on("toggleAutoStart", (event, data) => {
            setLoginItemSettings(data.openAtLogin);
          });
      
          // 登录
          ipcMain.on("qqLogin", (event, data) => {
            const loginWindow = new BrowserWindow({
              width: 750,
              height: 550,
              resizable: false,
              minimizable: false,
              maximizable: false,
              webPreferences: {
                devTools: true,
                nodeIntegration: true,
                preload: path.resolve(path.join(process.cwd(), "source/preload.js")),
              },
            });
      
            loginWindow.setMenu(null);
      
            loginWindow.loadURL(data.url);
      
            loginWindow.webContents.on("new-window", (e, url) => {
              e.preventDefault();
              shell.openExternal(url);
            });
      
            loginWindow.webContents.on("did-finish-load", (e, status, url) => {
              const { history } = e.sender;
              if (
                history[history.length - 1].indexOf("loginByThird") &&
                history[history.length - 1].indexOf("graph.qq.com") == -1 &&
                history[history.length - 1].indexOf("open.weixin.qq.com") == -1
              ) {
                event.reply("reply", e.sender.history);
                loginWindow.close();
              }
            });
          });
      
          // 最小化
          ipcMain.on("min", (e) => mainWindow.minimize());
      
          // 最大化
          ipcMain.on("max", (e) => {
            // if (mainWindow.isMaximized()) {
            //     mainWindow.unmaximize()
            // } else {
            //     mainWindow.maximize()
            // }
            // 无边框情况下  mainWindow.isMaximized()始终返回false
            if (mainWindow.max) {
              mainWindow.unmaximize();
              mainWindow.max = false;
            } else {
              mainWindow.maximize();
              mainWindow.max = true;
            }
          });
      
          // 关闭
          ipcMain.on("close", (event) => {
            event.preventDefault();
            mainWindow.hide();
            mainWindow.setSkipTaskbar(true);
            // 关闭默认转到托盘
            // mainWindow.close()
          });
      
          // 工具类型的方法 直接暴露给渲染进程使用
          Object.keys(Utils).forEach((funName) => {
            ipcMain.handle(funName, (event, ...args) => {
              return Utils[funName](...args);
            });
          });
        },
      };
};
