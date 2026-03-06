<template>
  <q-page class="orders-page">
    <div class="user-name">Gestão</div>
    <div class="row items-center justify-between q-mb-lg">
      <div class="section-title">Pedidos</div>
      <q-btn
        label="Pedido"
        icon="add"
        unelevated
        no-caps
        size="md"
        class="primary-btn"
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

const goToNewOrder = () => {
  router.push('/orders/new')
}

const goToDetails = (id) => {
  router.push(`/orders/${id}`)
}
onMounted(async () => {
  await orderStore.fetchOrders()
  console.log(orderStore.orders)
})
</script>
