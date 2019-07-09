import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
Vue.config.devtools = true;

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueAxios from 'vue-axios'
import axios from 'axios'
Vue.use(VueAxios, axios)

// Vue-material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

Vue.use(VueMaterial)

import ClientsComponent from './components/ClientsComponent'
import ProductsComponent from './components/ProductsComponent'
import OrdersComponent from './components/OrdersComponent'
import InvoicesComponent from './components/InvoicesComponent'
import IndexComponent from './components/IndexComponent'
import UploadComponent from './components/UploadComponent'

const routes = [
  {
    name: 'upload',
    path: '/upload',
    component: UploadComponent
  },
  {
    name: 'index',
    path: '/index',
    component: IndexComponent,
    children: [
        {
        name: 'clients',
        path: '/index/clients',
        component: ClientsComponent

        },
        {
        name: 'products',
        path: '/index/products',
        component: ProductsComponent
        },
        {
        name: 'orders',
        path: '/index/orders',
        component: OrdersComponent
        },
        {
        name: 'invoices',
        path: '/index/invoices',
        component: InvoicesComponent
        }
    ]
  }
]

const router = new VueRouter({ mode: 'history', routes: routes })

new Vue(Vue.util.extend({router},App)).$mount('#app')
