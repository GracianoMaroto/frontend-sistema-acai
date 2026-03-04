<template>
  <q-page class="orders-page">
    <div class="section-header">
      <div>
        <div class="badge">Gestão</div>
        <div class="section-title">Pedidos</div>
      </div>

      <q-btn
        label="New Order"
        icon="add"
        color="positive"
        unelevated
        no-caps
        size="md"
        class="new-order-btn"
        @click="goToNewOrder"
      />
    </div>

    <div class="q-mt-lg">
      <q-card
        v-for="order in orderStore.orders"
        :key="order.id"
        class="glass-card q-mb-md order-card"
      >
        <q-card-section>
          <div class="row justify-between items-start">
            <div>
              <div class="order-id">Pedido #{{ order.id.slice(0, 8) }}</div>

              <div class="order-customer">👤 {{ order.customer?.name || 'Sem cliente' }}</div>

              <div class="order-meta">
                📅 {{ new Date(order.createdAt).toLocaleDateString() }} •
                {{ order.saleChannel?.name }}
              </div>
            </div>

            <div class="text-right">
              <div class="order-total">R$ {{ Number(order.totalAmount).toFixed(2) }}</div>

              <div class="status-badge" :class="'status-' + order.orderStatus?.name">
                {{ order.orderStatus?.name }}
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat icon="visibility" color="black" @click="goToDetails(order.id)" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from 'stores/orders'

const orderStore = useOrdersStore()
const router = useRouter()

// const columns = [
//   {
//     name: 'orderDate',
//     label: 'Data',
//     field: 'orderDate',
//     align: 'left',
//     format: (val) => new Date(val).toLocaleDateString(),
//   },
//   {
//     name: 'customer',
//     label: 'Cliente',
//     field: (row) => row.customer?.name || 'Sem cliente',
//     align: 'left',
//   },
//   {
//     name: 'saleChannel',
//     label: 'Canal',
//     field: (row) => row.saleChannel?.name,
//     align: 'left',
//   },
//   {
//     name: 'orderStatus',
//     label: 'Status',
//     field: (row) => row.orderStatus,
//     align: 'center',
//   },
//   {
//     name: 'totalAmount',
//     label: 'Total',
//     field: 'totalAmount',
//     align: 'right',
//   },
//   {
//     name: 'actions',
//     label: 'Ações',
//     field: 'actions',
//     align: 'center',
//   },
// ]

// const confirmOpen = ref(false)
// const selectedOrderId = ref(null)

// async function confirmAction() {
//   try {
//     await orderStore.startOrder(selectedOrderId.value)
//     window.alert('Pedido iniciado com sucesso')
//     confirmOpen.value = false
//     selectedOrderId.value = null
//     // $q.notify({
//     //   type: 'positive',
//     //   message: 'Pedido iniciado com sucesso',
//     // })
//     // await orderStore.fetchOrders()
//   } catch (error) {
//     console.log(error)
//     window.alert('Erro ao iniciar pedido')
//     // Notify.create({
//     //   type: 'negative',
//     //   message: 'Erro ao iniciar pedido',
//     // })
//   }
// }

// const formatMoney = (value) => {
//   return Number(value).toFixed(2)
// }

const goToNewOrder = () => {
  router.push('/orders/new')
}

// const getStatusColor = (status) => {
//   switch (status) {
//     case 'PENDING':
//       return 'grey'
//     case 'IN_COURSE':
//       return 'primary'
//     case 'FINALIZED':
//       return 'positive'
//     case 'CANCELED':
//       return 'negative'
//     default:
//       return 'grey'
//   }
// }

const goToDetails = (id) => {
  router.push(`/orders/${id}`)
}
onMounted(async () => {
  await orderStore.fetchOrders()
  console.log(orderStore.orders)
})
</script>
