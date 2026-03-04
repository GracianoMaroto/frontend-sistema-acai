<template>
  <q-page class="row">
    <!-- COLUNA PRODUTOS -->
    <div class="col-12 col-md-8 q-pa-md">
      <!-- CANAL -->
      <q-select
        v-model="order.customerId"
        :options="customerOptions"
        label="Cliente"
        option-label="name"
        option-value="id"
        emit-value
        map-options
        outlined
        class="q-mb-md"
      />
      <q-select
        v-model="order.saleChannelId"
        :options="saleChannelOptions"
        label="Canal de Venda"
        option-label="name"
        option-value="id"
        emit-value
        map-options
        outlined
        class="q-mb-md"
      />

      <div v-if="order.saleChannelId">
        <q-card
          v-for="variant in productVariants"
          :key="variant.id"
          class="q-mb-sm"
          clickable
          @click="addItem(variant)"
        >
          <q-card-section>
            <div class="text-subtitle1">
              {{ variant.name }}
            </div>

            <div class="text-caption">
              R$ {{ Number(variant.price).toFixed(2) }} • Estoque: {{ variant.stockQuantity }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- COLUNA CARRINHO -->
    <div class="col-12 col-md-4 bg-grey-2 q-pa-md">
      <div class="text-h6 q-mb-md">Carrinho</div>

      <div v-if="order.items.length === 0">Nenhum item adicionado</div>

      <div v-for="item in order.items" :key="item.productVariantId" class="q-mb-sm">
        <div class="row items-center justify-between">
          <div>
            {{ getVariantName(item.productVariantId) }}
          </div>

          <div class="row items-center">
            <q-btn dense flat icon="remove" @click="decrease(item)" />
            <span class="q-mx-sm">{{ item.quantity }}</span>
            <q-btn dense flat icon="add" @click="increase(item)" />
          </div>
        </div>
      </div>

      <q-separator class="q-my-md" />
      <div class="text-right text-subtitle1 q-mb-md">Total: R$ {{ total.toFixed(2) }}</div>
      <q-select
        v-model="selectedPaymentMethod"
        :options="paymentMethods"
        label="Forma de Pagamento"
        option-label="name"
        option-value="id"
        emit-value
        map-options
        outlined
        class="q-mb-sm"
      />

      <q-input
        v-model.number="paymentAmount"
        label="Valor Pago"
        type="number"
        step="0.01"
        min="0"
      />

      <q-btn
        color="icon-roxo"
        label="Finalizar Pedido"
        class="full-width"
        :disable="!canFinalize || submitting"
        :loading="submitting"
        @click="submitOrder"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from 'stores/orders'
import { useProductStore } from 'stores/products'
import { useRouter } from 'vue-router'
// import { useQuasar } from 'quasar'
import { watch } from 'vue'
import { api } from 'src/boot/axios'

const router = useRouter()
// const $q = useQuasar()

const orderStore = useOrdersStore()
const productStore = useProductStore()
const submitting = ref(false)
const channelPrices = ref([])
const selectedPaymentMethod = ref(null)
const paymentAmount = ref(0)
const paymentMethods = ref([])
const customerOptions = ref([])

const order = ref({
  saleChannelId: null,
  customerId: null,
  items: [],
})

const productVariants = computed(() => {
  return channelPrices.value.map((price) => ({
    ...price.productVariant,
    price: price.price,
  }))
})
const saleChannelOptions = computed(() => orderStore.saleChannels)
const canFinalize = computed(() => {
  if (!order.value.saleChannelId) return false
  if (!order.value.items.length) return false

  if (selectedPaymentMethod.value && paymentAmount.value > total.value) {
    return false
  }

  return true
})

const addItem = (variant) => {
  const existing = order.value.items.find((i) => i.productVariantId === variant.id)

  if (existing) {
    if (existing.quantity >= variant.stockQuantity) {
      window.alert('Estoque máximo atingido')
      // $q.notify({
      //   type: 'warning',
      //   message: 'Estoque máximo atingido',
      // })
      return
    }

    existing.quantity++
  } else {
    if (variant.stockQuantity <= 0) {
      window.alert('Produto sem estoque')
      // $q.notify({
      //   type: 'warning',
      //   message: 'Produto sem estoque',
      // })
      return
    }

    order.value.items.push({
      productVariantId: variant.id,
      quantity: 1,
    })
  }
}

const increase = (item) => {
  const variant = productVariants.value.find((v) => v.id === item.productVariantId)

  if (!variant) return

  if (item.quantity >= variant.stockQuantity) {
    window.alert('Estoque máximo atingido')
    // $q.notify({
    //   type: 'warning',
    //   message: 'Estoque máximo atingido',
    // })
    return
  }

  item.quantity++
}

const decrease = (item) => {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    order.value.items = order.value.items.filter(
      (i) => i.productVariantId !== item.productVariantId,
    )
  }
}

const getVariantName = (id) => {
  const variant = productVariants.value.find((v) => v.id === id)
  return variant?.name || ''
}
const total = computed(() => {
  return order.value.items.reduce((sum, item) => {
    const variant = productVariants.value.find((v) => v.id === item.productVariantId)

    if (!variant) return sum

    return sum + Number(variant.price) * item.quantity
  }, 0)
})

const submitOrder = async () => {
  try {
    submitting.value = true

    const payload = {
      saleChannelId: order.value.saleChannelId,
      customerId: order.value.customerId || undefined,
      items: order.value.items.map((i) => ({
        productVariantId: i.productVariantId,
        quantity: Number(i.quantity),
      })),
      payments:
        selectedPaymentMethod.value && paymentAmount.value > 0
          ? [
              {
                paymentMethodId: selectedPaymentMethod.value,
                amount: String(Number(paymentAmount.value).toFixed(2)),
              },
            ]
          : undefined,
    }

    await orderStore.createOrder(payload)

    window.alert('Pedido criado com sucesso!')

    // 🔥 resetar formulário
    order.value = {
      saleChannelId: null,
      customerId: null,
      items: [],
    }

    selectedPaymentMethod.value = null
    paymentAmount.value = 0

    router.push('/orders')
  } catch (error) {
    window.alert(error.response?.data?.message || 'Erro ao criar pedido')
  } finally {
    submitting.value = false
  }
}

watch(
  () => order.value.saleChannelId,
  async (newChannel) => {
    if (!newChannel) return

    channelPrices.value = await productStore.fetchPricesByChannel(newChannel)
  },
)
onMounted(async () => {
  await productStore.fetchProducts()
  await orderStore.fetchSaleChannels()
  const { dataPayments } = await api.get('/payment-methods')
  paymentMethods.value = dataPayments
  // const { dataCustomers } = await api.get('/customers')
  // customerOptions.value = dataCustomers
})
</script>
