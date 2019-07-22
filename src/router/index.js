import ClientsComponent from '../components/ClientsComponent'
import ProductsComponent from '../components/ProductsComponent'
import OrdersComponent from '../components/OrdersComponent'
import InvoicesComponent from '../components/InvoicesComponent'
import IndexComponent from '../components/IndexComponent'
import UploadComponent from '../components/UploadComponent'

export default [
	{
		name: 'upload',
		path: '/upload',
		component: UploadComponent,
		meta: {
			requiresAuth: true
		}
	},
	{
		name: 'index',
		path: '/index',
		component: IndexComponent,
		meta: {
			requiresAuth: true
		},
		children: [
			{
				name: 'clients',
				path: '/index/clients',
				component: ClientsComponent,
				meta: {
					requiresAuth: true
				}
			},
			{
				name: 'products',
				path: '/index/products',
				component: ProductsComponent,
				meta: {
					requiresAuth: true
				}
			},
			{
				name: 'orders',
				path: '/index/orders',
				component: OrdersComponent,
				meta: {
					requiresAuth: true
				}
			},
			{
				name: 'invoices',
				path: '/index/invoices',
				component: InvoicesComponent,
				meta: {
					requiresAuth: true
				}
			}
		]
	},
	{path: '/', redirect: '/upload'}
]


