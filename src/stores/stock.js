import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useStockStore = defineStore('stock', {
  state: () => ({
    movements: [],
    loading: false,
  }),

  actions: {
    async fetchMovements() {
      this.loading = true

      try {
        const { data } = await api.get('/stock/stock-movements')

        this.movements = data
      } finally {
        this.loading = false
      }
    },

    async getMovementsByVariant(variantId) {
      const { data } = await api.get(`/stock/variant/${variantId}`)
      return data
    },

    async createMovement(payload) {
      await api.post('/stock/stock-movements', payload)

      await this.fetchMovements()
    },
  },
})
