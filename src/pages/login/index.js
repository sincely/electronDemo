import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Checkbox, Button, message } from 'antd'
import { QqOutlined, WechatOutlined } from "@ant-design/icons";

import { login, savePassword } from 'actions/userAction'
import styles from './index.styl'

const { ipcRenderer } = window.require("electron")

class Index extends PureComponent {
    
    state = {
        placeholder: '',
        resultCertificate: '',
        rememberPassword: false,
        username: '',
        password: ''
    }

    async componentDidMount() {
        if (this.props.userReducer.password) {
            this.setState({
                rememberPassword: true,
                username: this.props.userReducer.username,
                password: this.props.userReducer.password
            })
        }
        ipcRenderer.on('reply', async (e, data) => {
            message.success('登录成功')
            this.props.login(`${Date.now()}`)
        })
    }

    windowClose = () => {
        ipcRenderer.send('close')
    }

    onChange = (e) => {
        this.setState({
            rememberPassword: e.target.checked
        })
    }

    onInputChange = (key, value) => {
        this.setState({ 
            [key]: value
         });
    }

    onFocus = () => {
        this.setState({
            placeholder: '手机号/朱兴敏ID'
        })
    }

    onBlur = () => {
        this.setState({
            placeholder: ''
        })
    }

    forgetPassword = (e) => {
        e.preventDefault()
        // shell.openExternal('https://www.znzmo.com/forgetPassword.html')
    }

    goRegister = () => {
        // shell.openExternal('https://www.znzmo.com/register.html')
    }

    userLogin = async () => {

        const { username, password, rememberPassword } = this.state
        if (!username || !password) {
            message.error("账号密码不能为空")
            return 
        }
        // const res = await Http.post('/api/render/login/loginByKey', {userAccount: username, password})
        if (rememberPassword) {
            this.props.savePassword({
                username,
                password
            })
        }

        this.props.login(`${Date.now()}`)
    }

    qqLogin = () => {
        const resultCertificate = this.getRandomCode()
        this.setState({
            resultCertificate
        })
        // ipcRenderer.send('qqLogin', {url: `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101324337&redirect_uri=http%3a%2f%2fwww.znzmo.com%2fapi%2frender%2flogin%2floginByThird%3fclient_name%3dQqClient%26type%3d1%26resultCertificate%3d${resultCertificate}&scope=get_user_info`});
    }

    wxLogin = () => {
        const resultCertificate = this.getRandomCode()
        this.setState({
            resultCertificate
        })
        // ipcRenderer.send('qqLogin', {url: `https://open.weixin.qq.com/connect/qrconnect?appid=wxf2f6172dc4f664d9&redirect_uri=http%3a%2f%2fwww.znzmo.com%2fapi%2frender%2flogin%2floginByThird%3Fclient_name%3DWeiXinClient%26type%3d0%26resultCertificate%3d${resultCertificate}&response_type=code&scope=snsapi_login#wechat_redirect`});
    }


    getRandomCode = () => {
        var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var nums = "";
        for (var i = 0; i < 32; i++) {
            var r = parseInt(Math.random() * 61);
            nums += data[r];
        }
        return nums;
    }
 
    render() {
        const {
            placeholder,
            rememberPassword,
            username,
            password
        } = this.state
        return (
            <div className={styles.root}>
                <div className={styles.drag}></div>
                <div className={styles.loginContainer}>
                    <h1>朱兴敏</h1>
                    <div className={styles.group}>      
                        <input className={styles.loginInput} type="text" value={username} required onFocus={this.onFocus} onBlur={this.onBlur} placeholder={placeholder} onChange={(e)=>this.onInputChange('username', e.target.value)}/>
                        <span className={styles.highlight}></span>
                        <span className={styles.bar}></span>
                        <label>账号</label>
                    </div>
                    <div className={styles.group}>      
                        <input className={styles.loginInput} type="password" value={password} required onChange={(e)=>this.onInputChange('password', e.target.value)}/>
                        <span className={styles.highlight}></span>
                        <span className={styles.bar}></span>
                        <label>密码</label>
                    </div>
                    <div className={styles.operation}>
                        <Checkbox onChange={this.onChange} checked={rememberPassword}><span className={styles.text}>记住密码</span></Checkbox>
                        <span className={styles.text} onClick={this.forgetPassword}>忘记密码</span>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button className={styles.button} onClick={this.goRegister}>注册</Button>
                        <Button className={styles.button} type="primary" onClick={this.userLogin}>登录</Button>
                    </div>
                    <div className={styles.threeTitle}>第三方登录</div>
                    <div className={styles.threeLoginContainer}>
                        <QqOutlined onClick={this.qqLogin} title="QQ登录" />
                        <WechatOutlined onClick={this.wxLogin} title="微信登录" />
                    </div>
                </div>
                <svg className={`${styles.close} icon`} onClick={this.windowClose} t="1568885369645" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1199" width="10" height="10"><path d="M571.558972 487.027956l385.493596-385.1523c23.321879-23.321879 23.321879-60.978181 0-84.186295a59.328585 59.328585 0 0 0-84.129412 0L487.315795 402.841661 101.651551 17.518713a59.328585 59.328585 0 0 0-84.07253 0c-23.321879 23.321879-23.321879 60.978181 0 84.129412l385.493596 385.1523-385.493596 385.322948a59.328585 59.328585 0 0 0 42.093148 101.478615c15.244545 0 30.375325-5.688263 42.036265-17.349202l385.607361-385.209183 385.664243 385.322948c11.604057 11.66094 26.734837 17.406085 41.979383 17.406085a59.328585 59.328585 0 0 0 42.093147-101.535498L571.558972 487.027956z" fill="#ffffff" p-id="1200"></path></svg>
            </div>
        )
    }
}

const mapStateToProps = (reducer) => ({
    userReducer: reducer.userReducer
})
const mapDispatchToProps = (dispatch) => ({
    login: (data) => dispatch(login(data)),
    savePassword: (data) => dispatch(savePassword(data))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index)
