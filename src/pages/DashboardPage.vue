<template>
  <q-page class="q-pa-lg">
    <div class="q-mb-xl">
      <div class="text-overline text-grey-7">Visão Geral</div>
      <div class="text-h4 text-weight-bold text-dark">Dashboard</div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="metric-label">Total de Produtos</div>
            <div class="metric-number">
              {{ metrics?.totalProducts || 0 }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="metric-label">Valor Total em Estoque</div>
            <div class="metric-number">R$ {{ formatPrice(metrics?.totalStockValue) }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="metric-label">Produto Mais Caro</div>
            <div class="text-body1 text-weight-medium metric-value">
              {{ metrics?.mostExpensive?.name || '-' }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="metric-label">Último Produto</div>
            <div class="text-body1 text-weight-medium metric-value">
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
// import { useAuthStore } from 'stores/auth'

// const authStore = useAuthStore()

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchMetrics()
})

const metrics = computed(() => productStore.metrics)

function formatPrice(value) {
  if (!value || isNaN(value)) return '0,00'
  return Number(value).toFixed(2).replace('.', ',')
}
</script>
