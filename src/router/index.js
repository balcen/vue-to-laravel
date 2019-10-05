import Vue from 'vue'
import ClientsComponent from '../components/ClientsComponent'
import ProductsComponent from '../components/ProductsComponent'
import OrdersComponent from '../components/OrdersComponent'
import InvoicesComponent from '../components/InvoicesComponent'
import IndexComponent from '../components/IndexComponent'
import UploadComponent from '../components/UploadComponent'
import RegisterComponent from '../components/RegisterComponent'
import LoginComponent from '../components/LoginComponent'
import DashboardComponent from '../components/DashboardComponent'
import store from '../store/Store'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Routes
const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'register',
      path: '/register',
      component: RegisterComponent
    },
    {
      name: 'login',
      path: '/login/:id',
      props(route) {
        return route.query || {}
      },
      component: LoginComponent
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      component: DashboardComponent,
      meta: {
        auth: true,
        requiresAuth: true
      }
    },
    {
      name: 'upload',
      path: '/upload',
      component: UploadComponent,
      meta: {
        auth: undefined
      }
    },
    {
      name: 'index',
      path: '/index',
      component: IndexComponent,
      redirect: '/index/clients',
      meta: {
        auth: undefined
      },
      children: [
        {
          name: 'clients',
          path: '/index/clients',
          component: ClientsComponent,
          meta: {
            auth: undefined
          }
        },
        {
          name: 'products',
          path: '/index/products',
          component: ProductsComponent,
          props: true,
          meta: {
            auth: undefined
          }
        },
        {
          name: 'orders',
          path: '/index/orders',
          component: OrdersComponent,
          meta: {
            auth: undefined
          }
        },
        {
          name: 'invoices',
          path: '/index/invoices',
          component: InvoicesComponent,
          meta: {
            auth: undefined
          }
        }
      ]
    },
    {path: '/', redirect: '/upload'}
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(store.getters.isLoggedIn) {
      next()
      return 
    }
    next({name: 'login', params: {id: 123}, query: {status: 'error', flashMessage: '請先登入'}})
  }else {
    next()
  }
})

export default router