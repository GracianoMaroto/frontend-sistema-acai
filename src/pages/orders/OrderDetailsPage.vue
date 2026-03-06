<template>
  <q-page class="order-details" v-if="order">
    <div class="section-header">
      <div>
        <div class="user-name">Detalhes</div>
        <div class="section-title">Pedido #{{ order.id.slice(0, 8) }}</div>
      </div>
    </div>

    <q-card class="glass-card q-mt-lg">
      <q-card-section class="summary-section">
        <div class="summary-left">
          <div class="summary-client">
            {{ order.customer?.name || 'Sem cliente' }}
          </div>

          <div class="summary-meta">
            {{ order.saleChannel.name }}
            <br />
            {{ formatDate(order.createdAt) }}
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

    <q-card class="glass-card q-mt-md">
      <q-card-section>
        <div class="section-subtitle">Payments</div>
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
              label="Adicionar Pagamento"
              icon="add"
              class="primary-btn"
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

    <div class="actions-bar">
      <q-btn v-if="canStart" label="Iniciar" class="primary-btn" @click="startOrder" />

      <q-btn v-if="canFinalize" label="Finalizar" class="finalizar-btn" @click="finalizeOrder" />

      <q-btn v-if="canCancel" label="Cancelar" class="cancelar-btn" @click="cancelOrder" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from 'stores/orders'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { notifyError, notifySuccess } from 'src/utils/notify'
import { confirmDialog } from 'src/utils/confirm'

const route = useRoute()
const orderStore = useOrdersStore()

const order = ref(null)

const total = computed(() => {
  if (!order.value) return 0

  return order.value.items.reduce((sum, item) => {
    return sum + Number(item.unitPrice) * item.quantity
  }, 0)
})

const canStart = computed(() => order.value?.orderStatus.name === 'Pendente')
const canFinalize = computed(() => order.value?.orderStatus.name === 'Em_Curso')
const canCancel = computed(() => order.value?.orderStatus.name !== 'Cancelado')
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
  const confirmed = await confirmDialog(
    'Iniciar pedido',
    'Tem certeza que deseja iniciar este pedido?',
  )
  if (!confirmed) return
  try {
    await orderStore.startOrder(order.value.id)
    await loadOrder()
    notifySuccess('Pedido iniciado com sucesso')
  } catch (error) {
    console.log(error)
    notifyError('Houve um problema ao iniciar este pedido')
  }
}
const loadPaymentMethods = async () => {
  const { data } = await api.get('/payment-methods')
  paymentMethods.value = data
}
const addPayment = async () => {
  const confirmed = await confirmDialog(
    'Adicionar pagamento',
    'Tem certeza que deseja adicionar este pagamento?',
  )
  if (!confirmed) return
  try {
    await api.post(`/orders/${order.value.id}/payments`, {
      paymentMethodId: newPaymentMethod.value,
      amount: String(newPaymentAmount.value.toFixed(2)),
    })

    newPaymentMethod.value = null
    newPaymentAmount.value = 0

    await loadOrder()
    notifySuccess('Pagamento adicionado com sucesso')
  } catch (error) {
    console.log(error)
    notifyError('Houve um problema ao adicionar este pagamento')
  }
}
const removePayment = async (paymentId) => {
  const confirmed = await confirmDialog(
    'Remover pagamento',
    'Tem certeza que deseja remover este pagamento?',
  )
  if (!confirmed) return
  try {
    await api.delete(`/orders/${order.value.id}/payments/${paymentId}`)
    await loadOrder()
    notifySuccess('Pagamento removido com sucesso')
  } catch (error) {
    console.log(error)
    notifyError('Houve um problema ao remover este pagamento')
  }
}

const paymentProgress = computed(() => {
  const totalPaid = order.value.payments.reduce((sum, p) => sum + Number(p.amount), 0)

  return totalPaid / total.value
})

const finalizeOrder = async () => {
  const confirmed = await confirmDialog(
    'Finalizar pedido',
    'Tem certeza que deseja finalizar este pedido?',
  )
  if (!confirmed) return
  try {
    await orderStore.finalizeOrder(order.value.id)
    await loadOrder()
    notifySuccess('Pedido finalizado com sucesso')
  } catch (error) {
    console.log(error)
    notifyError('Houve um problema ao finalizar este pedido')
  }
}

const cancelOrder = async () => {
  const confirmed = await confirmDialog(
    'Cancelar pedido',
    'Tem certeza que deseja cancelar este pedido?',
  )
  if (!confirmed) return
  try {
    await orderStore.cancelOrder(order.value.id)
    await loadOrder()
    notifySuccess('Pedido cancelado com sucesso')
  } catch (error) {
    console.log(error)
    notifyError('Houve um problema ao cancelar este pedido')
  }
}

onMounted(async () => {
  await loadOrder()
  await loadPaymentMethods()
})
</script>
