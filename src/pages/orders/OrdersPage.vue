<template>
  <q-page padding>
    <!-- TÍTULO + BOTÃO -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">Pedidos</div>

      <q-btn color="primary" icon="add" label="Novo Pedido" @click="goToNewOrder" />
    </div>

    <!-- TABELA -->
    <q-table
      :rows="orderStore.orders"
      :columns="columns"
      row-key="id"
      :grid="$q.screen.lt.md"
      flat
      bordered
      :loading="loading"
    >
      <template v-slot:item="props">
        <div class="col-12">
          <q-card bordered flat class="q-mb-sm">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold">
                Pedido #{{ props.row.id.slice(0, 8) }}
              </div>

              <div class="text-body2 q-mt-sm">💰 Total: R$ {{ formatPrice(props.row.total) }}</div>

              <div class="text-caption">📅 {{ formatDate(props.row.createdAt) }}</div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn flat icon="visibility" color="primary" />
              <q-btn flat icon="delete" color="negative" />
            </q-card-actions>
          </q-card>
        </div>
      </template>
      <template v-slot:body-cell-totalAmount="props">
        <q-td :props="props"> R$ {{ formatMoney(props.row.totalAmount) }} </q-td>
      </template>

      <template v-slot:body-cell-orderStatus="props">
        <q-td :props="props">
          <q-badge color="primary">
            {{ props.row.orderStatus?.name }}
          </q-badge>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from 'stores/orders'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const orderStore = useOrdersStore()
const router = useRouter()
const loading = ref(false)

const columns = [
  {
    name: 'orderDate',
    label: 'Data',
    field: 'orderDate',
    align: 'left',
    format: (val) => new Date(val).toLocaleDateString(),
    classes: $q.screen.lt.md ? 'hidden' : '',
  },
  {
    name: 'customer',
    label: 'Cliente',
    field: (row) => row.customer?.name || 'Sem cliente',
    align: 'left',
    classes: $q.screen.lt.md ? 'hidden' : '',
  },
  {
    name: 'saleChannel',
    label: 'Canal',
    field: (row) => row.saleChannel?.name,
    align: 'left',
    classes: $q.screen.lt.md ? 'hidden' : '',
  },
  {
    name: 'orderStatus',
    label: 'Status',
    field: (row) => row.orderStatus,
    align: 'center',
    classes: $q.screen.lt.md ? 'hidden' : '',
  },
  {
    name: 'totalAmount',
    label: 'Total',
    field: 'totalAmount',
    align: 'right',
    classes: $q.screen.lt.md ? 'hidden' : '',
  },
]

const formatMoney = (value) => {
  return Number(value).toFixed(2)
}

const goToNewOrder = () => {
  router.push('/orders/new')
}

onMounted(async () => {
  loading.value = true
  await orderStore.fetchOrders()
  loading.value = false
})
</script>
