import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    methods: [],
  }),

  actions: {
    async fetchPaymentMethods() {
      const { data } = await api.get('/payment-methods')
      this.methods = data
    },
  },
})
