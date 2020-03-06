import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueRouter from 'vue-router';
import VueCookies from 'vue-cookies';
import store from './store/Store';
import App from './App';
import router from './router';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

// Set Vue global
window.Vue = Vue;

// Vue Devtools 設定
Vue.config.devtools = true;

// Vue Axios
axios.defaults.baseURL = process.env.VUE_APP_LOCAL_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;
// const token = localStorage.getItem('token')
// if(token) {
//   axios.defaults.headers.common['Authorization'] = token
// }
Vue.use(VueAxios, axios);

// Vue Cookies
Vue.use(VueCookies);

Vue.use(VueRouter);
Vue.router = router;

// new Vue(Vue.util.extend({ router,Store },App)).$mount('#app');
new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
