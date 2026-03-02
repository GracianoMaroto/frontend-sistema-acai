import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useOrdersStore = defineStore('order', {
  state: () => ({
    orders: [],
    orderStatuses: [],
    paymentStatuses: [],
    deliveryStatuses: [],
    saleChannels: [],
  }),

  actions: {
    async fetchOrders() {
      const { data } = await api.get('/orders/all')
      this.orders = data
    },

    async fetchStatuses() {
      const [orderRes, paymentRes, deliveryRes] = await Promise.all([
        api.get('/order-status'),
        api.get('/payment-status'),
        api.get('/delivery-status'),
      ])

      this.orderStatuses = orderRes.data
      this.paymentStatuses = paymentRes.data
      this.deliveryStatuses = deliveryRes.data
    },

    async createOrder(payload) {
      await api.post('/orders', payload)
      await this.fetchOrders()
    },
  },
})
