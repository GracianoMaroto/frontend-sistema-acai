<template>
  <q-page class="orders-page">
    <div class="q-mb-lg">
      <div class="user-name">Visão Geral</div>
      <div class="section-title">Dashboard</div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-2">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="metric-label">Faturamento do Mês</div>
            <div class="metric-number">R$ {{ formatPrice(metrics?.revenueMonth) }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-2">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="metric-label">Lucro do Mês</div>
            <div class="metric-number">R$ {{ formatPrice(metrics?.profitMonth) }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-2">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="metric-label">Pedidos no Mês</div>
            <div class="metric-number">
              {{ metrics?.totalOrders || 0 }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-2">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="metric-label">Ticket Médio</div>
            <div class="metric-number">R$ {{ formatPrice(metrics?.averageTicket) }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-2">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="metric-label">Produto Mais Vendido</div>
            <div class="metric-number text-subtitle1">
              {{ metrics?.topProduct?.product?.name || 'Sem vendas ainda' }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-2">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="metric-label">Cliente Top</div>
            <div class="metric-number text-subtitle1">
              {{ metrics?.topCustomer?.name || 'Sem clientes ainda' }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <apexchart type="line" height="300" :options="chartOptions" :series="chartSeries" />
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useProductStore } from 'src/stores/products'
import VueApexCharts from 'vue3-apexcharts'

defineOptions({
  components: {
    apexchart: VueApexCharts,
  },
})
const productStore = useProductStore()

const metrics = computed(() => productStore.metrics)

function formatPrice(value) {
  if (!value || isNaN(value)) return '0,00'
  return Number(value).toFixed(2).replace('.', ',')
}

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  grid: {
    borderColor: '#eee',
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  markers: {
    size: 4,
  },
  xaxis: {
    categories:
      metrics.value?.salesLast30Days?.map((v) =>
        new Date(v.orderDate).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        }),
      ) || [],
  },
  yaxis: {
    labels: {
      formatter: (value) => `R$ ${value}`,
    },
  },
  tooltip: {
    y: {
      formatter: (value) => `R$ ${value}`,
    },
  },
}))
const chartSeries = computed(() => [
  {
    name: 'Vendas',
    data: metrics.value?.salesLast30Days?.map((v) => Number(v.totalAmount)) || [],
  },
])

onMounted(async () => {
  await productStore.fetchMetrics()
})
</script>
