const routes = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'orders', component: () => import('pages/orders/OrdersPage.vue') },
      { path: 'products', component: () => import('pages/products/ProductsPage.vue') },
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
    component: () => import('pages/ErrorNotFound.vue'),
  },
]
export default routes
