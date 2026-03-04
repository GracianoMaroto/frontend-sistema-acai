<template>
  <q-page class="order-details" v-if="order">
    <div class="section-header">
      <div>
        <div class="badge">Detalhes</div>
        <div class="section-title">Pedido #{{ order.id.slice(0, 8) }}</div>
      </div>
    </div>

    <!-- RESUMO -->
    <q-card class="glass-card q-mt-lg">
      <q-card-section class="summary-section">
        <div class="summary-left">
          <div class="summary-client">
            {{ order.customer?.name || 'Sem cliente' }}
          </div>

          <div class="summary-meta">
            {{ order.saleChannel.name }} • {{ formatDate(order.createdAt) }}
          </div>
        </div>

        <div class="summary-right">
          <div class="summary-total">R$ {{ total.toFixed(2) }}</div>

          <div class="status-badge" :class="'status-' + order.orderStatus?.name">
            {{ order.orderStatus?.name }}
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- ITENS -->
    <q-card class="glass-card q-mt-md">
      <q-card-section>
        <div class="section-subtitle">Itens</div>

        <div v-for="item in order.items" :key="item.id" class="item-row">
          <div>
            {{ item.productVariant.name }}
            <span class="item-qty">x{{ item.quantity }}</span>
          </div>

          <div>R$ {{ (Number(item.unitPrice) * item.quantity).toFixed(2) }}</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- PAGAMENTOS -->
    <q-card class="glass-card q-mt-md">
      <q-card-section>
        <div class="section-subtitle">Payments</div>
        <!-- ADICIONAR PAGAMENTO -->
        <div class="add-payment-wrapper">
          <div class="add-payment-title">New Payment</div>

          <div class="add-payment-grid">
            <q-select
              v-model="newPaymentMethod"
              :options="paymentMethods"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              label="Payment method"
              outlined
              dense
            />

            <q-input
              v-model.number="newPaymentAmount"
              type="number"
              step="0.01"
              label="Amount"
              prefix="R$"
              outlined
              dense
            />

            <q-btn
              label="Add"
              icon="add"
              color="icon-roxo"
              unelevated
              no-caps
              @click="addPayment"
              :disable="!newPaymentMethod || newPaymentAmount <= 0"
            />
          </div>
        </div>
        <div v-for="payment in order.payments" :key="payment.id" class="payment-card">
          <div class="payment-left">
            <div class="payment-method">
              {{ payment.paymentMethod.name }}
            </div>

            <div class="payment-date">
              {{ formatDate(payment.createdAt) }}
            </div>
          </div>

          <div class="payment-right">
            <div class="payment-amount">R$ {{ Number(payment.amount).toFixed(2) }}</div>

            <q-btn
              icon="delete"
              flat
              round
              dense
              color="negative"
              @click="removePayment(payment.id)"
            />
          </div>
        </div>
        <q-linear-progress
          :value="paymentProgress"
          color="deep-purple"
          track-color="grey-3"
          size="10px"
          rounded
          class="q-mt-md"
        />
      </q-card-section>
    </q-card>

    <!-- AÇÕES -->
    <div class="actions-bar">
      <q-btn v-if="canStart" label="Iniciar" class="primary-btn" @click="startOrder" />

      <q-btn v-if="canFinalize" label="Finalizar" class="success-btn" @click="finalizeOrder" />

      <q-btn v-if="canCancel" label="Cancelar" class="danger-btn" @click="cancelOrder" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from 'stores/orders'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'

const route = useRoute()
const orderStore = useOrdersStore()

const order = ref(null)

const total = computed(() => {
  if (!order.value) return 0

  return order.value.items.reduce((sum, item) => {
    return sum + Number(item.unitPrice) * item.quantity
  }, 0)
})

const canStart = computed(() => order.value?.orderStatus.name === 'PENDING')
const canFinalize = computed(() => order.value?.orderStatus.name === 'IN_COURSE')
const canCancel = computed(() => order.value?.orderStatus.name !== 'CANCELED')
const newPaymentMethod = ref(null)
const newPaymentAmount = ref(0)
const paymentMethods = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const loadOrder = async () => {
  const { data } = await orderStore.fetchOrderById(route.params.id)
  order.value = data
}

const startOrder = async () => {
  await orderStore.startOrder(order.value.id)
  await loadOrder()
}
const loadPaymentMethods = async () => {
  const { data } = await api.get('/payment-methods')
  paymentMethods.value = data
}
const addPayment = async () => {
  try {
    await api.post(`/orders/${order.value.id}/payments`, {
      paymentMethodId: newPaymentMethod.value,
      amount: String(newPaymentAmount.value.toFixed(2)),
    })

    // reset
    newPaymentMethod.value = null
    newPaymentAmount.value = 0

    await loadOrder()
  } catch (err) {
    alert(err.response?.data?.message || 'Erro ao adicionar pagamento')
  }
}
const removePayment = async (paymentId) => {
  try {
    await api.delete(`/orders/${order.value.id}/payments/${paymentId}`)
    await loadOrder()
  } catch (err) {
    alert(err.response?.data?.message || 'Erro ao remover pagamento')
  }
}

const paymentProgress = computed(() => {
  const totalPaid = order.value.payments.reduce((sum, p) => sum + Number(p.amount), 0)

  return totalPaid / total.value
})

const finalizeOrder = async () => {
  await orderStore.finalizeOrder(order.value.id)
  await loadOrder()
}

const cancelOrder = async () => {
  await orderStore.cancelOrder(order.value.id)
  await loadOrder()
}

onMounted(async () => {
  await loadOrder()
  await loadPaymentMethods()
})
</script>
