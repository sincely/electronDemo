"use strict";

const { app, ipcMain, Tray, Menu } = require("electron");
const path = require("path");
const FAV = path.join(__dirname, `../static/fav.ico`);

module.exports = function (mainWindow) {
  let tray = null;
  return {
    isShining: false,
    init: function () {
      // 设置托盘ico
      tray = new Tray(FAV);
      // 设置托盘右键菜单
      const contextMenu = Menu.buildFromTemplate([
        {
          label: "退出",
          click: () => {
            app.quit();
          },
        },
        { label: "Item1", type: "radio" },
        { label: "Item2", type: "radio" },
        { label: "Item3", type: "radio", checked: true },
        { label: "Item4", type: "radio" },
      ]);
      tray.setContextMenu(contextMenu);
      // 设置托盘tooltip
      tray.setToolTip("zhuxingmin");

      // 托盘闪烁
      ipcMain.on("trayShine", (event) => {
        this.trayShine(true);
      });

      // 托盘点击事件(目前只是将隐藏的window显示)
      tray.on("click", () => {
        // 显示窗口
        mainWindow.show();
        // 显示任务栏应用
        mainWindow.setSkipTaskbar(false);
        if (this.isShining) {
          this.trayShine(false);
          mainWindow.webContents.send("trayClick");
        }
      });
    },
    trayShine: function (trayShine) {
      this.trayShine = trayShine;
      mainWindow.flashFrame(trayShine);
    },
  };
};
