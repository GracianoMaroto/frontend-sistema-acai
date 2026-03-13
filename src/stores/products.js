import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useAuthStore } from './auth'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    metrics: null,
    error: null,
  }),
  getters: {
    activeProducts: (state) => {
      return state.products.filter((p) => p.active)
    },
    allVariants: (state) => {
      return state.products.flatMap((p) =>
        p.variants.map((v) => ({
          ...v,
          product: p,
        })),
      )
    },
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        const { data } = await api.get('/products', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })

        this.products = data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar produtos'
      } finally {
        this.loading = false
      }
    },

    async fetchPricesByChannel(channelId) {
      const { data } = await api.get(`/product-prices/by-channel/${channelId}`)
      return data
    },

    async createProduct(payload) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        await api.post('/products', payload, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })

        await this.fetchProducts()
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar produto'
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id, payload) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        await api.patch(`/products/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })

        await this.fetchProducts()
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao atualizar produto'
      } finally {
        this.loading = false
      }
    },

    async fetchMetrics() {
      this.loading = true
      try {
        const authStore = useAuthStore()

        const { data } = await api.get('/products/metrics', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })

        this.metrics = data
      } catch (error) {
        console.log(error)
        this.error = 'Erro ao buscar métricas'
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        await api.delete(`/products/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })

        await this.fetchProducts()
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao excluir produto'
      } finally {
        this.loading = false
      }
    },
  },
})
