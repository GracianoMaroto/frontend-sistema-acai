const routes = [
  {
    path: '/auth/login',
    component: () => import('src/pages/auth/LoginPage.vue'),
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('src/pages/dashboard/DashboardPage.vue') },
      { path: 'dashboard', component: () => import('src/pages/dashboard/DashboardPage.vue') },
      { path: 'products', component: () => import('pages/products/ProductsPage.vue') },
      { path: 'stock', component: () => import('pages/stock/StockPage.vue') },
      { path: 'orders', component: () => import('pages/orders/OrdersPage.vue') },
      { path: 'customers', component: () => import('pages/customers/CustomersPage.vue') },
      {
        path: 'orders/new',
        component: () => import('pages/orders/CreateOrdersPage.vue'),
      },
      {
        path: '/orders/:id',
        component: () => import('pages/orders/OrderDetailsPage.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('src/utils/ErrorNotFound.vue'),
  },
]
export default routes
