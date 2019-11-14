import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import store from './store/Store'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
// import VueMaterial from 'vue-material'
import VueFlashMessage from 'vue-flash-message'
import router from './router'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

// Set Vue global
window.Vue = Vue;

// Vue Devtools 設定
Vue.config.devtools = true;

// Vue Axios
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.baseURL = process.env.VUE_APP_LOCAL_URL || process.env.URL;
const token = localStorage.getItem('token')
if(token) {
  axios.defaults.headers.common['Authorization'] = token
}
Vue.use(VueAxios, axios);

Vue.use(VueRouter);
Vue.router = router;
// Vue.use(VueAuth, auth);
// Vue.use(require('@websanova/vue-auth'), {
//   auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
//   http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
//   router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
// });

// Vue-material
// Vue.use(VueMaterial);

// Vue-Flash-Message
Vue.use(VueFlashMessage, {
  messageOptions: {
    timeout: 300000,
  }
});

// new Vue(Vue.util.extend({ router,Store },App)).$mount('#app');
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
