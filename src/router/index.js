import ClientsComponent from '../components/ClientsComponent'
import ProductsComponent from '../components/ProductsComponent'
import OrdersComponent from '../components/OrdersComponent'
import InvoicesComponent from '../components/InvoicesComponent'
import IndexComponent from '../components/IndexComponent'
import UploadComponent from '../components/UploadComponent'
import RegisterComponent from '../components/RegisterComponent'
import LoginComponent from '../components/LoginComponent'
import { O_TRUNC } from 'constants';

export default [
  {
    name: 'register',
    path: '/register',
    component: RegisterComponent
  },
  {
    name: 'login',
    path: '/login',
    component: LoginComponent
  },
	{
		name: 'upload',
		path: '/upload',
		component: UploadComponent,
		meta: {
			auth: false
		}
	},
	{
		name: 'index',
		path: '/index',
    component: IndexComponent,
    redirect: '/index/clients',
		meta: {
			auth: false
		},
		children: [
			{
				name: 'clients',
				path: '/index/clients',
				component: ClientsComponent,
				meta: {
					auth: false
				}
			},
			{
				name: 'products',
				path: '/index/products',
        component: ProductsComponent,
        props: true,
				meta: {
					auth: false
				}
			},
			{
				name: 'orders',
				path: '/index/orders',
				component: OrdersComponent,
				meta: {
					auth: false
				}
			},
			{
				name: 'invoices',
				path: '/index/invoices',
				component: InvoicesComponent,
				meta: {
					auth: false
				}
			}
		]
	},
	{path: '/', redirect: '/upload'}
]


