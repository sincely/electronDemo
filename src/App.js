import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import configureStore from "./store/ConfigureStore";
import App from "./pages";
import { ConfigProvider } from "antd";
import moment from "moment";
import zhCN from "antd/es/locale-provider/zh_CN";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

const { persistor, store } = configureStore();
const onBeforeLift = () => { };

class Index extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<PersistGate
					loading={null}
					onBeforeLift={onBeforeLift}
					persistor={persistor}
				>
					<ConfigProvider locale={zhCN}>
						<App />
					</ConfigProvider>
				</PersistGate>
			</Provider>
		);
	}
}

export default Index;
