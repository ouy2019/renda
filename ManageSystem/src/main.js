import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import Axios from "axios";
//import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
 import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import 'babel-polyfill';
import './utils/http.js';
window.axios=Axios;
Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = Axios;
//官网前端访问地址
Vue.prototype.$frontUrl = 'http://192.168.1.66:65531/'

// 后台管理系统 地址
Axios.defaults.baseURL='http://192.168.1.66:65530/websiteM/';
// Axios.defaults.baseURL='http://127.0.0.1:9754/';

axios.interceptors.request.use((config) => {
	config.headers.token = localStorage.getItem('token');;
	return config;
});

axios.interceptors.response.use((config) => {
	
	
	if( config.data.code > 450 &&  config.data.code<460 ){
		if(config.data.code == 455){ //无权访问
			ElementUI.Message({
			  message: config.data.msg,
			  type: 'error'
			});
			return config;
		}
		ElementUI.Message({
			  message: config.data.msg,
			  type: 'error'
			});
	    window.localStorage.clear();
		router.push("/login");
	}
	return config;
});

router.beforeEach((to,from,next)=>{
	if(to.path == "/login"){
		return next();
	}
	const token = window.localStorage.getItem("token");
	if(token==null || token == undefined){
		return next('/login');
	}
	next();
});
// Vue.prototype.url='http://192.168.1.152:9754/';
//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | vue-manage-system`;
//     const token = localStorage.getItem('token');
// 	const name = localStorage.getItem('ms_username');
//     if (!token && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         name === 'admin' ? next() : next('/403');
//     } else {
//             next();
//     }
// });
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

// 设置键盘码

Vue.config.keyCodes.x = 88 
