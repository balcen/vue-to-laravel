import Vue from 'vue';
import VueRouter from 'vue-router';
import ClientsComponent from '../components/TableClients';
import ProductsComponent from '../components/TableProducts';
import OrdersComponent from '../components/TableOrders';
import InvoicesComponent from '../components/TableInvoices';
import IndexComponent from '../components/TableIndex';
import UploadComponent from '../components/UploadComponent';
import RegisterComponent from '../components/RegisterComponent';
import LoginComponent from '../components/LoginComponent';
import DashboardComponent from '../components/DashboardComponent';
import store from '../store/Store';

Vue.use(VueRouter);

// Routes
const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'register',
      path: '/register',
      component: RegisterComponent,
    },
    {
      name: 'login',
      path: '/login',
      props(route) {
        return route.query || {};
      },
      component: LoginComponent,
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      component: DashboardComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      name: 'upload',
      path: '/upload',
      component: UploadComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      name: 'index',
      path: '/index',
      component: IndexComponent,
      redirect: '/index/clients',
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          name: 'clients',
          path: '/index/clients',
          component: ClientsComponent,
          props: true,
        },
        {
          name: 'products',
          path: '/index/products',
          component: ProductsComponent,
          props: true,
        },
        {
          name: 'orders',
          path: '/index/orders',
          component: OrdersComponent,
          props: true,
        },
        {
          name: 'invoices',
          path: '/index/invoices',
          component: InvoicesComponent,
          props: true,
        },
      ],
    },
    { name: 'root', path: '/', redirect: '/login' },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters['auth/isLoggedIn']) {
      next();
      return;
    }
    next({ name: 'login' });
    store.commit('pushMessage', { type: 'error', content: '請先登入再繼續操作' });
  } else {
    next();
  }
});

export default router;
