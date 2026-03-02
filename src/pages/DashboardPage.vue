<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Dashboard</div>
    <div class="text-h5 q-mb-md">Bem-vindo, {{ authStore.user?.name }}</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption">Total de Produtos</div>
            <div class="text-h6">
              {{ metrics?.totalProducts || 0 }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption">Valor Total em Estoque</div>
            <div class="text-h6">R$ {{ formatPrice(metrics?.totalStockValue) }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption">Produto Mais Caro</div>
            <div class="text-h6">
              {{ metrics?.mostExpensive?.name || '-' }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption">Último Produto</div>
            <div class="text-h6">
              {{ metrics?.latestProduct?.name || '-' }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useProductStore } from 'src/stores/products'
import { useAuthStore } from 'stores/auth'

const authStore = useAuthStore()

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchMetrics()
})

const metrics = computed(() => productStore.metrics)

function formatPrice(value) {
  if (!value) return '0.00'
  return Number(value).toFixed(2)
}
</script>
