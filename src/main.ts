import { ANT_PREFIX } from '@/config/globalConfig';
import loadQiankun from '@/qiankun/loadQiankun';
import AntDV, { ConfigProvider } from 'ant-design-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { createApp } from 'vue';
import App from './App.vue';
import './index.less';
import router from './router';
import store from './store';

dayjs.locale('zh-cn');

ConfigProvider.config({
  prefixCls: ANT_PREFIX,
});
const app = createApp(App);
app.use(store);
app.use(AntDV);
app.use(router);
app.mount('#app');

// 加载qiankun
loadQiankun();
