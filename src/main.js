import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
Vue.config.productionTip = false

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import ClientsComponent from './components/ClientsComponent'
import ProductsComponent from './components/ProductsComponent'
import OrdersComponent from './components/OrdersComponent'
import BillsComponent from './components/BillsComponent'
import IndexComponent from './components/IndexComponent'
import UploadComponent from './components/UploadComponent'

const routes = [
  {
    name: 'clients',
    path: '/clients',
    component: ClientsComponent

  },
  {
    name: 'products',
    path: '/products',
    component: ProductsComponent
  },
  {
    name: 'orders',
    path: '/orders',
    component: OrdersComponent
  },
  {
    name: 'bills',
    path: '/bills',
    component: BillsComponent
  },
  {
    name: 'upload',
    path: '/upload',
    component: UploadComponent
  },
  {
    name: 'index',
    path: '/index',
    component: IndexComponent
  }
]

const router = new VueRouter({ mode: 'history', routes: routes });

new Vue({
  render: h => h(App),
}).$mount('#app')
