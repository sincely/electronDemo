# electron app

#### 软件架构
采用Electron+React框架<br>
更新组件为Electron-builder


#### 安装教程

1. `yarn`

#### 使用说明

1. 运行Electron前需要启动react:
    `yarn start`
2. 然后再执行Electron启动命令:`yarn estart`
3. 打包命令:
    1. `yarn build`
    1. `yarn package-win`

#### 参与贡献

1. 自动更新实现文档: https://segmentfault.com/a/1190000012904543
2. 协议唤起Electron应用文档:https://www.jianshu.com/p/d880c0ca0911
3. 系统通知文档:http://electronjs.org/docs/tutorial/notifications

#### webpack
1. 为配置antd暗黑主题（该主题需要antd@4.x），`getStyleLoaders`方法中判断，`less-loader`时添加对应`options`，同时由于`less`和`less-loader`为最新版本，因此`options`下需要添加一层`lessOptions`，详见`webpack.config.js 125行`
2. 打包要求：`electron-updater@4.1.2` `electron-builder@21.2.0 `

#### 其他
1. `windows powershell`中执行`get-StartApps`命令查看设置的appid
2. `/home/webserver/static/fezz.che300.com/c3-electron` 更新包远程地址