import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useOrdersStore = defineStore('order', {
  state: () => ({
    orders: [],
    saleChannels: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOrders() {
      this.loading = true
      this.error = null

      try {
        const { data } = await api.get('/orders')
        this.orders = data
      } catch (error) {
        console.error(error)
        this.error = 'Erro ao buscar pedidos'
      } finally {
        this.loading = false
      }
    },
    async fetchSaleChannels() {
      try {
        const { data } = await api.get('/sale-channels')
        this.saleChannels = data
      } catch (error) {
        console.error(error)
      }
    },

    async fetchOrderById(id) {
      return await api.get(`/orders/${id}`)
    },

    async createOrder(payload) {
      if (!payload.saleChannelId || payload.items.length === 0) {
        throw new Error('Pedido inválido')
      }

      await api.post('/orders', payload)
      await this.fetchOrders()
    },

    async startOrder(id) {
      await api.patch(`/orders/${id}/start`)
      await this.fetchOrders()
    },

    async finalizeOrder(id) {
      await api.patch(`/orders/${id}/finalize`)
      await this.fetchOrders()
    },

    async cancelOrder(id) {
      await api.patch(`/orders/${id}/cancel`)
      await this.fetchOrders()
    },
  },
})
