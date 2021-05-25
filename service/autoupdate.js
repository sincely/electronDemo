"use strict";

const { ipcMain } = require("electron");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

const updateUrl = "http://fezz.ceshi.che300.com/c3-electron";

const message = {
  error: "检查更新出错",
  checking: "正在检查更新……",
  updateAva: "检测到新版本，正在下载……",
  updateNotAva: "现在使用的就是最新版本，不用更新",
};

module.exports = function(mainWindow) {
    return {
        init: function() {
          autoUpdater.setFeedURL(updateUrl);
      
          autoUpdater.on("error", (error) => {
            log.info(error);
            this.sendUpdateMessage("error", message.error);
          });
      
          autoUpdater.on("checking-for-update", () => {
            this.sendUpdateMessage("checking-for-update", message.checking);
          });
      
          autoUpdater.on("update-available", (info) => {
            log.info(info);
            this.sendUpdateMessage("update-available", message.updateAva);
          });
      
          autoUpdater.on("update-not-available", (info) => {
            log.info(info);
            this.sendUpdateMessage("update-not-available", message.updateNotAva);
          });
      
          // 更新下载进度事件
          autoUpdater.on("download-progress", (progressObj) => {
            log.info(progressObj);
            mainWindow.webContents.send("downloadProgress", progressObj);
          });
      
          autoUpdater.on("update-downloaded", function (
            event,
            releaseNotes,
            releaseName,
            releaseDate,
            updateUrl,
            quitAndUpdate
          ) {
            ipcMain.on("isUpdateNow", (e, arg) => {
              autoUpdater.quitAndInstall();
            });
      
            // 询问是否立即更新
            mainWindow.webContents.send("isUpdateNow");
          });
      
          ipcMain.on("checkForUpdate", () => {
            //执行自动更新检查
            autoUpdater.checkForUpdates();
            // autoUpdater.checkForUpdatesAndNotify();
          });
        },
        sendUpdateMessage: function(type, text) {
          mainWindow.webContents.send("message", { text, type });
        }
      };
};
